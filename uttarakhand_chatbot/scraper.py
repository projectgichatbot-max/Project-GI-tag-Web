"""
Web scraping pipeline for Uttarakhand chatbot knowledge acquisition.

Provides functions to search the web via DuckDuckGo, fetch and extract
page content using trafilatura with BeautifulSoup fallback, clean the
extracted text, and persist structured entries into a local JSON
knowledge base file.
"""

import json
import logging
import random
import re
import unicodedata
from datetime import datetime, timezone
from typing import Optional

import requests
import trafilatura
from bs4 import BeautifulSoup

from config import (
    DATA_DIR,
    KNOWLEDGE_BASE_FILE,
    MAX_CONTENT_LENGTH,
    MAX_SCRAPE_URLS,
    SCRAPER_TIMEOUT,
    SCRAPER_USER_AGENTS,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# 1. Web search
# ---------------------------------------------------------------------------

def search_web(query: str) -> list[str]:
    """Search DuckDuckGo HTML and return up to *MAX_SCRAPE_URLS* result URLs.

    Posts form data to ``https://html.duckduckgo.com/html/`` and parses the
    response HTML with BeautifulSoup.  Advertisement / tracking links are
    filtered out.

    Args:
        query: The search query string.

    Returns:
        A list of cleaned result URLs (may be empty on failure).
    """
    search_url = "https://html.duckduckgo.com/html/"
    headers = {
        "User-Agent": random.choice(SCRAPER_USER_AGENTS),
        "Accept": "text/html",
    }

    try:
        logger.info("Searching DuckDuckGo for: %s", query)
        response = requests.post(
            search_url,
            data={"q": query},
            headers=headers,
            timeout=SCRAPER_TIMEOUT,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        logger.error("DuckDuckGo search request failed: %s", exc)
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    anchors = soup.select(".result__a")

    urls: list[str] = []
    for anchor in anchors:
        href = anchor.get("href", "")
        if not href:
            continue

        # DuckDuckGo wraps links in a redirect; extract the actual URL
        if "duckduckgo.com" in href and "uddg=" in href:
            from urllib.parse import parse_qs, urlparse

            parsed = urlparse(href)
            target = parse_qs(parsed.query).get("uddg", [None])[0]
            if target:
                href = target

        # Filter out ad / tracking links
        ad_indicators = (
            "ad_domain",
            "duckduckgo.com/y.js",
            "duckduckgo.com/l/",
            "google.com/aclk",
            "bing.com/aclk",
        )
        if any(indicator in href for indicator in ad_indicators):
            logger.debug("Skipping ad link: %s", href)
            continue

        if href.startswith("http"):
            urls.append(href)

        if len(urls) >= MAX_SCRAPE_URLS:
            break

    logger.info("Found %d result URL(s) for query: %s", len(urls), query)
    return urls


# ---------------------------------------------------------------------------
# 2. Page fetching
# ---------------------------------------------------------------------------

def fetch_page(url: str) -> Optional[str]:
    """Download the HTML content of *url*.

    A random User-Agent header is chosen from :pydata:`SCRAPER_USER_AGENTS`
    for every request.

    Args:
        url: The fully-qualified URL to fetch.

    Returns:
        The response body as a string, or ``None`` on any network / HTTP
        error.
    """
    headers = {
        "User-Agent": random.choice(SCRAPER_USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        logger.info("Fetching page: %s", url)
        response = requests.get(url, headers=headers, timeout=SCRAPER_TIMEOUT)
        response.raise_for_status()
        return response.text
    except requests.RequestException as exc:
        logger.error("Failed to fetch %s: %s", url, exc)
        return None


# ---------------------------------------------------------------------------
# 3. Content extraction
# ---------------------------------------------------------------------------

def extract_content(html: str, url: str = "") -> str:
    """Extract the main textual content from an HTML document.

    Uses **trafilatura** as the primary extraction engine.  Falls back to
    BeautifulSoup if trafilatura returns nothing useful.

    Args:
        html: Raw HTML string.
        url:  (Optional) Source URL, used only for logging.

    Returns:
        Extracted plain-text content (may be empty).
    """
    # Primary: trafilatura
    try:
        content = trafilatura.extract(html, include_comments=False, include_tables=True)
        if content and len(content.strip()) > 50:
            logger.debug("Trafilatura extracted %d chars from %s", len(content), url or "HTML")
            return content.strip()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Trafilatura extraction error for %s: %s", url, exc)

    # Fallback: BeautifulSoup with structured list and table extraction
    logger.debug("Falling back to BeautifulSoup for %s", url or "HTML")
    soup = BeautifulSoup(html, "html.parser")

    # Remove script / style noise
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript"]):
        tag.decompose()

    parts: list[str] = []
    # Find paragraphs, lists, and tables in document order
    for el in soup.find_all(["p", "ul", "ol", "table"]):
        if el.name == "p":
            text = el.get_text(strip=True)
            if text:
                parts.append(text)
        elif el.name == "ul":
            lis = [li.get_text(strip=True) for li in el.find_all("li", recursive=False)]
            lis = [f"• {li}" for li in lis if li]
            if lis:
                parts.append("\n".join(lis))
        elif el.name == "ol":
            lis = [li.get_text(strip=True) for li in el.find_all("li", recursive=False)]
            lis = [f"{idx}. {li}" for idx, li in enumerate(lis, 1) if li]
            if lis:
                parts.append("\n".join(lis))
        elif el.name == "table":
            rows = []
            for tr in el.find_all("tr"):
                cells = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                cells = [c for c in cells if c]
                if cells:
                    rows.append(" | ".join(cells))
            if rows:
                parts.append("\n".join(rows))

    combined = "\n\n".join(parts)
    logger.debug("BeautifulSoup extracted %d chars from %s", len(combined), url or "HTML")
    return combined



# ---------------------------------------------------------------------------
# 4. Text cleaning
# ---------------------------------------------------------------------------

def clean_text(text: str) -> str:
    """Normalise and truncate extracted text.

    * Normalises Unicode to NFC form.
    * Strips residual HTML tags.
    * Collapses runs of whitespace into single spaces.
    * Truncates the result to :pydata:`MAX_CONTENT_LENGTH` characters.

    Args:
        text: Raw extracted text.

    Returns:
        Cleaned text string.
    """
    if not text:
        return ""

    # Unicode normalisation
    text = unicodedata.normalize("NFC", text)

    # Strip any leftover HTML tags
    text = re.sub(r"<[^>]+>", " ", text)

    # Remove HTML entities
    text = re.sub(r"&[a-zA-Z]+;", " ", text)
    text = re.sub(r"&#?\w+;", " ", text)

    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()

    # Truncate
    if len(text) > MAX_CONTENT_LENGTH:
        text = text[:MAX_CONTENT_LENGTH].rsplit(" ", 1)[0] + "…"
        logger.debug("Text truncated to %d characters", len(text))

    return text


# ---------------------------------------------------------------------------
# 5. Persistence
# ---------------------------------------------------------------------------

def save_scraped_data(data: dict) -> None:
    """Append a structured entry to the JSON knowledge base file.

    Creates the data directory and knowledge-base file if they do not yet
    exist.

    Args:
        data: A dictionary representing the knowledge entry.
    """
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)

        entries: list[dict] = []
        if KNOWLEDGE_BASE_FILE.exists():
            with open(KNOWLEDGE_BASE_FILE, "r", encoding="utf-8") as fh:
                existing = json.load(fh)
                if isinstance(existing, list):
                    entries = existing

        entries.append(data)

        with open(KNOWLEDGE_BASE_FILE, "w", encoding="utf-8") as fh:
            json.dump(entries, fh, indent=2, ensure_ascii=False)

        logger.info(
            "Saved entry '%s' to knowledge base (%d total entries)",
            data.get("name", "unknown"),
            len(entries),
        )
    except (OSError, json.JSONDecodeError) as exc:
        logger.error("Failed to save scraped data: %s", exc)


# ---------------------------------------------------------------------------
# 6. Orchestrator
# ---------------------------------------------------------------------------

def scrape_and_store(
    query: str,
    tag: str,
    subject: str,
) -> Optional[dict]:
    """Run the full scrape-and-store pipeline for a single topic.

    1. Build a search query: ``"{subject} {tag} Uttarakhand"``.
    2. Search the web for relevant URLs.
    3. Fetch each page, extract and clean content.
    4. Persist the first successful result to the knowledge base.

    Args:
        query:   Original user query (used for logging context).
        tag:     Category tag (e.g. ``"temple"``, ``"trek"``).
        subject: Specific subject to research (e.g. ``"Kedarnath"``).

    Returns:
        A structured entry ``dict`` on success, or ``None`` if every
        URL attempt failed.
    """
    search_query = f"{subject} {tag} Uttarakhand"
    logger.info("Starting scrape pipeline – search_query='%s'", search_query)

    urls = search_web(search_query)
    if not urls:
        logger.warning("No URLs found for query: %s", search_query)
        return None

    for url in urls:
        html = fetch_page(url)
        if html is None:
            continue

        raw_content = extract_content(html, url=url)
        if not raw_content:
            logger.debug("No content extracted from %s", url)
            continue

        content = clean_text(raw_content)
        if not content:
            logger.debug("Content empty after cleaning for %s", url)
            continue

        entry: dict = {
            "name": subject,
            "tag": tag,
            "description": content,
            "source": "web_scrape",
            "source_url": url,
            "search_query": search_query,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        save_scraped_data(entry)
        logger.info(
            "Successfully scraped and stored entry for '%s' from %s",
            subject,
            url,
        )
        return entry

    logger.warning("All URL attempts failed for query: %s", search_query)
    return None
