"""
main.py — FastAPI Application for Uttarakhand Chatbot

This module is the entry point for the Uttarakhand chatbot service.
It exposes a REST API with the following endpoints:

    POST /chat   — Accept a user query and return a chatbot response.
    GET  /health — Health check endpoint.
    GET  /tags   — List all supported tags.

Architecture flow:
    1. Receive user query.
    2. Check cache for a previous response.
    3. Detect intent and tag via NLP.
    4. If not Uttarakhand-related → reject with standard message.
    5. Search local knowledge base using TF-IDF similarity.
    6. If found → generate a dynamic response.
    7. If not found → scrape the web, store data, then generate response.
    8. Cache the response for future queries.

Run with:
    cd uttarakhand_chatbot
    python main.py
"""

from __future__ import annotations

import logging
import sys
from contextlib import asynccontextmanager
from typing import Optional

import nltk
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import (
    CORS_ORIGINS,
    FASTAPI_HOST,
    FASTAPI_PORT,
    LOG_DIR,
    LOG_FILE,
    LOG_FORMAT,
    LOG_DATE_FORMAT,
    SUPPORTED_TAGS,
    GI_TAGS_LIST,
)
from intent_detector import IntentDetector
from search_engine import SearchEngine
from response_generator import ResponseGenerator
from cache_manager import CacheManager
from scraper import scrape_and_store

# ─────────────────────────────────────────────
# Logging Configuration
# ─────────────────────────────────────────────
LOG_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format=LOG_FORMAT,
    datefmt=LOG_DATE_FORMAT,
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────
class ChatRequest(BaseModel):
    """Request body for the /chat endpoint."""
    query: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="The user's question about Uttarakhand.",
        examples=["Tell me about Kafuli", "What temples are in Uttarakhand?"],
    )


class ChatResponse(BaseModel):
    """Response body for the /chat endpoint."""
    response: str = Field(
        ...,
        description="The chatbot's answer to the user's query.",
    )
    tag: Optional[str] = Field(
        default=None,
        description="The detected category tag (e.g., food, temple, tourism).",
    )
    source: str = Field(
        default="knowledge_base",
        description="Where the answer came from: 'cache', 'knowledge_base', or 'web_scrape'.",
    )
    source_url: Optional[str] = Field(
        default=None,
        description="The source URL if the answer was scraped from the web or has a known link.",
    )


class HealthResponse(BaseModel):
    """Response body for the /health endpoint."""
    status: str = "ok"
    service: str = "uttarakhand-chatbot"
    knowledge_base_size: int = 0


class TagsResponse(BaseModel):
    """Response body for the /tags endpoint."""
    tags: list[str]
    count: int


# ─────────────────────────────────────────────
# Global component instances (initialised at startup)
# ─────────────────────────────────────────────
intent_detector: IntentDetector | None = None
search_engine: SearchEngine | None = None
response_generator: ResponseGenerator | None = None
cache_manager: CacheManager | None = None


# ─────────────────────────────────────────────
# Application Lifespan
# ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown lifecycle for the FastAPI application.

    On startup:
        - Download required NLTK data packages.
        - Initialise intent detector, search engine, response generator, cache manager.
        - Build the TF-IDF search index from the knowledge base.

    On shutdown:
        - Clean up expired cache entries.
    """
    global intent_detector, search_engine, response_generator, cache_manager

    logger.info("=" * 60)
    logger.info("Uttarakhand Chatbot — Starting up")
    logger.info("=" * 60)

    # ── Download NLTK data ──────────────────────────────
    nltk_packages = [
        "punkt",
        "punkt_tab",
        "averaged_perceptron_tagger",
        "averaged_perceptron_tagger_eng",
        "wordnet",
        "stopwords",
    ]
    for pkg in nltk_packages:
        try:
            nltk.download(pkg, quiet=True)
            logger.info("NLTK package '%s' ready.", pkg)
        except Exception as exc:
            logger.warning("Failed to download NLTK package '%s': %s", pkg, exc)

    # ── Initialise components ───────────────────────────
    logger.info("Initialising IntentDetector...")
    intent_detector = IntentDetector()

    logger.info("Initialising SearchEngine and building index...")
    search_engine = SearchEngine()
    search_engine.build_index()
    logger.info(
        "Search index built with %d documents.", len(search_engine.documents)
    )

    logger.info("Initialising ResponseGenerator...")
    response_generator = ResponseGenerator()

    logger.info("Initialising CacheManager...")
    cache_manager = CacheManager()

    logger.info("=" * 60)
    logger.info(
        "Uttarakhand Chatbot — Ready on http://%s:%d", FASTAPI_HOST, FASTAPI_PORT
    )
    logger.info("=" * 60)

    yield  # ← Application is running

    # ── Shutdown ────────────────────────────────────────
    logger.info("Shutting down: clearing expired cache entries...")
    if cache_manager:
        removed = cache_manager.clear_expired()
        logger.info("Removed %d expired cache entries.", removed)
    logger.info("Uttarakhand Chatbot — Shut down complete.")


# ─────────────────────────────────────────────
# FastAPI Application
# ─────────────────────────────────────────────
app = FastAPI(
    title="Uttarakhand Chatbot API",
    description=(
        "An independent chatbot service that answers questions about "
        "Uttarakhand — its food, festivals, tourism, wildlife, culture, "
        "history, and more. Powered by NLP intent detection and TF-IDF "
        "semantic search with live web scraping fallback."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS Middleware ─────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────
@app.post("/chat", response_model=ChatResponse, summary="Chat with the Uttarakhand bot")
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Main chat endpoint.

    Accepts a user query and returns an informative response about
    Uttarakhand GI Tags. If the query is not related to a valid Uttarakhand GI Tag,
    a rejection message is returned.
    """
    query = request.query.strip()
    logger.info("--- Incoming query: '%s'", query)

    # ── 1. Cache lookup ─────────────────────────────────
    cached = cache_manager.get(query)
    if cached is not None:
        logger.info("Cache HIT for query: '%s'", query)
        return ChatResponse(
            response=cached.get("response", ""),
            tag=cached.get("tag"),
            source="cache",
            source_url=cached.get("source_url"),
        )
    logger.info("Cache MISS for query: '%s'", query)

    # ── 2. Intent detection ─────────────────────────────
    analysis = intent_detector.analyze_query(query)
    tag: str | None = analysis["tag"]
    is_relevant: bool = analysis["is_relevant"]
    subject: str = analysis["subject"]
    intent: str = str(analysis.get("intent", "UNKNOWN"))
    matched_record = analysis.get("matched_record")
    score = analysis.get("score", 0.0)

    logger.info(
        "Intent analysis: tag=%s, relevant=%s, subject='%s', intent=%s, score=%.2f",
        tag, is_relevant, subject, intent, score
    )

    # ── 3. Relevance check ──────────────────────────────
    if not is_relevant or intent == "UNKNOWN":
        logger.info("Query rejected as not related to Uttarakhand GI Tags.")
        rejection_text = "Not a valid Uttarakhand GI Tag query."
        
        logger.info(
            "Query: '%s' | Intent: UNKNOWN | Tag: None | Retrieved docs: [] | Source: rejection",
            query
        )
        return ChatResponse(
            response=rejection_text,
            tag=None,
            source="knowledge_base",
        )

    # ── 4. Routing ──────────────────────────────────────
    if intent == "LIST_GI_TAGS":
        from intent_detector import GI_PRODUCTS
        names = [item["name"] for item in GI_PRODUCTS if item["name"] != "Bal Mithai"]
        response_text = "GI Tags of Uttarakhand\n\n"
        response_text += "\n".join(f"{idx}. {name}" for idx, name in enumerate(names, 1))
        
        logger.info(
            "Query: '%s' | Intent: LIST_GI_TAGS | Tag: None | Retrieved docs: all 27 GI tags | Source: master_dataset",
            query
        )
        
        # Cache the result
        cache_data = {
            "response": response_text,
            "tag": "LIST_GI_TAGS",
            "source_url": None,
        }
        cache_manager.set(query, cache_data)
        
        return ChatResponse(
            response=response_text,
            tag="LIST_GI_TAGS",
            source="knowledge_base",
        )

    elif intent == "TAG_DETAILS" and matched_record:
        response_text = response_generator.format_details(matched_record)
        
        logger.info(
            "Query: '%s' | Intent: TAG_DETAILS | Tag: %s | Match: %s | Score: %.2f | Source: master_dataset",
            query, matched_record.get("category"), matched_record.get("name"), score
        )
        
        # Cache the result
        cache_data = {
            "response": response_text,
            "tag": matched_record.get("category"),
            "source_url": None,
        }
        cache_manager.set(query, cache_data)
        
        return ChatResponse(
            response=response_text,
            tag=matched_record.get("category"),
            source="knowledge_base",
        )

    elif intent == "RECIPE_QUERY" and matched_record:
        category = matched_record.get("category", "")
        allowed_categories = ["Food Product", "Agricultural Product", "Spice Product", "Herbal Product"]
        
        if category not in allowed_categories:
            response_text = "Recipes are only available for food-related GI products."
        else:
            response_text = response_generator.format_recipe(matched_record)
            
        logger.info(
            "Query: '%s' | Intent: RECIPE_QUERY | Tag: %s | Match: %s | Score: %.2f | Source: master_dataset",
            query, category, matched_record.get("name"), score
        )
        
        # Cache the result
        cache_data = {
            "response": response_text,
            "tag": category,
            "source_url": None,
        }
        cache_manager.set(query, cache_data)
        
        return ChatResponse(
            response=response_text,
            tag=category,
            source="knowledge_base",
        )

    # Fallback rejection
    logger.info("Fallback rejection executed.")
    return ChatResponse(
        response="Not a valid Uttarakhand GI Tag query.",
        tag=None,
        source="knowledge_base",
    )



@app.get("/health", response_model=HealthResponse, summary="Health check")
async def health() -> HealthResponse:
    """Return service health status and knowledge base size."""
    kb_size = len(search_engine.documents) if search_engine else 0
    return HealthResponse(
        status="ok",
        service="uttarakhand-chatbot",
        knowledge_base_size=kb_size,
    )


@app.get("/tags", response_model=TagsResponse, summary="List supported tags")
async def tags() -> TagsResponse:
    """Return all supported category tags."""
    return TagsResponse(
        tags=SUPPORTED_TAGS,
        count=len(SUPPORTED_TAGS),
    )


# ─────────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=FASTAPI_HOST,
        port=FASTAPI_PORT,
        reload=False,
        log_level="info",
    )
