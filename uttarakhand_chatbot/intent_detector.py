"""
intent_detector.py — NLP and Fuzzy Matching Intent Detection for Uttarakhand GI Tags
"""

from __future__ import annotations

import json
import logging
import re
from pathlib import Path
from typing import Optional

from rapidfuzz import fuzz

logger = logging.getLogger(__name__)

# Load the master dataset
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "master_gi_dataset.json"

try:
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        GI_PRODUCTS = json.load(f)
except Exception as e:
    logger.error("Failed to load master GI dataset: %s", e)
    GI_PRODUCTS = []


class IntentDetector:
    """Detects intent and matches queries against the master GI tags dataset."""

    def __init__(self) -> None:
        logger.info("IntentDetector initialized with %d products.", len(GI_PRODUCTS))

    def clean_filler_words(self, query: str) -> str:
        """Removes common filler phrases and punctuation for better matching."""
        query = query.lower().strip()
        # Remove punctuation
        query = re.sub(r"[^\w\s]", "", query)
        
        filler_prefixes = [
            "tell me about ", "what is ", "what are ", "information about ",
            "info about ", "details about ", "details of ", "describe ",
            "give details of ", "tell me of ", "show me ", "give me information on ",
            "can you tell me about ", "how about ", "tell about ", "info on ",
            "information on ", "details on ", "query about ", "query for ",
            # Recipe prefixes (including typos like recepie, recipie, etc.)
            "recipe of ", "recipe for ", "recepie of ", "recepie for ", 
            "recipie of ", "recipie for ", "recepe of ", "recepe for ",
            "recipi of ", "recipi for ", "how to use ", "how to cook ",
            "steps to prepare ", "steps to make ", "ingredients of ",
            "traditional recipe of ", "how can ", "food made using ",
            "food made with ", "dishes using ", "dishes made with ",
            "how is ", "how are ", "how do you ", "how to ", "how can i ",
            "steps to "
        ]
        
        # Sort prefixes by length descending to match longest first
        filler_prefixes.sort(key=len, reverse=True)
        
        for prefix in filler_prefixes:
            if query.startswith(prefix):
                query = query[len(prefix):].strip()
                break
                
        # Remove suffixes
        query = re.sub(r"\s+be\s+used\s+in\s+cooking$", "", query)
        query = re.sub(r"\s+used\s+in\s+cooking$", "", query)
        query = re.sub(r"\s+in\s+cooking$", "", query)
        query = re.sub(r"\s+made$", "", query)
        query = re.sub(r"\s+prepared$", "", query)
        
        # Remove trailing polite words
        query = re.sub(r"\s+please$", "", query)
        query = re.sub(r"\s+thanks$", "", query)
        return query.strip()

    def preprocess_query(self, query: str) -> list[str]:
        """Simplified preprocessing returning lowercased alphanumeric tokens."""
        cleaned = self.clean_filler_words(query)
        return cleaned.split()

    def _get_match_candidates(self, name: str) -> list[str]:
        """Generates list of matching candidates for a product name to handle prefixes/suffixes."""
        name = name.lower()
        candidates = [name]
        
        # 1. Cleaned name without "uttarakhand " prefix
        if name.startswith("uttarakhand "):
            no_prefix = name[len("uttarakhand "):].strip()
            candidates.append(no_prefix)
            
        # 2. Extract contents inside parentheses and name without parentheses
        parentheses_contents = re.findall(r"\((.*?)\)", name)
        for content in parentheses_contents:
            candidates.append(content.strip())
            
        # Name without parentheses
        name_no_parentheses = re.sub(r"\(.*?\)", "", name).strip()
        name_no_parentheses = re.sub(r"\s+", " ", name_no_parentheses)
        candidates.append(name_no_parentheses)
        
        # Name without "uttarakhand " and without parentheses
        if name_no_parentheses.startswith("uttarakhand "):
            no_prefix_no_paren = name_no_parentheses[len("uttarakhand "):].strip()
            candidates.append(no_prefix_no_paren)
            
        # 3. Add explicit hardcoded manual overrides / common variations
        if "tejpat" in name:
            candidates.extend(["tejpatta", "tejpat", "tej patta", "tej pata", "tejpata"])
        if "ringaal" in name or "ringal" in name:
            candidates.extend(["ringal craft", "ringal", "ringaal"])
        if "bal mithai" in name or "bal mitai" in name:
            candidates.extend(["bal mitai", "bal mithai"])
        if "munsyari" in name or "munsiyari" in name:
            candidates.extend(["munsiyari rajma", "munsyari rajma", "munsiyari", "mungsiyari rajma"])
        if "bichhu" in name or "bichu" in name:
            candidates.extend(["bichhu buti", "bichu buti", "nettle fabric"])
        if "lakhori" in name:
            candidates.extend(["lakhori mirchi", "lakhori"])
        if "berinag" in name:
            candidates.extend(["berinag tea", "berinag"])
        if "chiura" in name or "chyura" in name:
            candidates.extend(["chiura", "chyura", "chiura oil", "chyura oil"])
        if "tamta" in name:
            candidates.extend(["copper products", "tamta craft", "tamta"])
        if "pichhoda" in name or "pichora" in name:
            candidates.extend(["pichhoda", "pichora", "rangwali pichora"])
        if "mombatti" in name or "candle" in name:
            candidates.extend(["candle", "nainital mombatti", "mombatti"])
        if "likhai" in name:
            candidates.extend(["likhai", "wood carving"])
            
        return list(set(candidates))

    def detect_intent(self, query: str) -> tuple[str, float, Optional[dict]]:
        """Classifies the query intent: LIST_GI_TAGS, TAG_DETAILS, RECIPE_QUERY, or UNKNOWN.
        
        Returns:
            A tuple of (intent_name, confidence_score, matched_record).
        """
        query_lower = query.lower().strip()
        
        # Check for LIST_GI_TAGS
        list_keywords = [
            "list all", "show all", "give names", "what are the gi",
            "list of", "list gi", "show gi", "get gi", "all gi",
            "list the gi", "names of gi", "what are gi", "give all gi"
        ]
        if any(kw in query_lower for kw in list_keywords) or query_lower in ["list", "gi tags", "gi tags list", "show list"]:
            logger.info("Intent detected: LIST_GI_TAGS")
            return "LIST_GI_TAGS", 100.0, None
            
        # Check for TAG_DETAILS using fuzzy matching
        cleaned_query = self.clean_filler_words(query_lower)
        if not cleaned_query:
            return "UNKNOWN", 0.0, None
            
        best_match_name = None
        best_score = 0.0
        matched_record = None
        
        for record in GI_PRODUCTS:
            candidates = self._get_match_candidates(record["name"])
            for candidate in candidates:
                # 1. Standard ratio on cleaned query
                score_ratio = fuzz.ratio(cleaned_query, candidate)
                score_sort = fuzz.token_sort_ratio(cleaned_query, candidate)
                
                # 2. Partial ratios on full query to catch prefix typos
                score_partial = fuzz.partial_ratio(query_lower, candidate)
                score_partial_sort = fuzz.partial_token_sort_ratio(query_lower, candidate)
                
                score = max(score_ratio, score_sort, score_partial, score_partial_sort)
                
                if score > best_score:
                    best_score = score
                    best_match_name = record["name"]
                    matched_record = record
                
        # Similarity threshold: 80+
        if best_score >= 80.0:
            # Check if query contains recipe-related keywords
            recipe_keywords = [
                "recipe", "recepie", "recipie", "recepe", "recipi", "recipes", "recepies",
                "cook", "prepare", "ingredients", 
                "how to make", "how to cook", "steps", "dish", "food",
                "how to use", "used in cooking", "use in cooking"
            ]
            if any(kw in query_lower for kw in recipe_keywords):
                logger.info("Intent detected: RECIPE_QUERY | Matched: %s | Score: %.2f", best_match_name, best_score)
                return "RECIPE_QUERY", best_score, matched_record
            else:
                logger.info("Intent detected: TAG_DETAILS | Matched: %s | Score: %.2f", best_match_name, best_score)
                return "TAG_DETAILS", best_score, matched_record
            
        logger.info("No matching GI Tag found. Best score: %.2f for matched: %s", best_score, best_match_name)
        return "UNKNOWN", best_score, None

    def analyze_query(self, query: str) -> dict[str, object]:
        """Main entry point returning a structured dictionary of intent analysis."""
        intent, score, record = self.detect_intent(query)
        
        is_relevant = (intent != "UNKNOWN")
        tag = record["category"] if record else (intent if intent == "LIST_GI_TAGS" else None)
        subject = record["name"] if record else ""
        processed_tokens = self.preprocess_query(query)
        
        return {
            "original_query": query,
            "processed_tokens": processed_tokens,
            "tag": tag,
            "is_relevant": is_relevant,
            "subject": subject,
            "intent": intent,
            "matched_record": record,
            "score": score
        }
