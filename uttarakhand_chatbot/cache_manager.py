"""
JSON-file caching system for the Uttarakhand chatbot.

Provides a :class:`CacheManager` that stores query responses as individual
JSON files (keyed by the MD5 hash of the normalised query) inside the
configured cache directory.  Entries carry an ISO-8601 ``cached_at``
timestamp and are automatically invalidated once they exceed the
configured TTL.
"""

import hashlib
import json
import logging
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

from config import CACHE_DIR, CACHE_TTL_HOURS

logger = logging.getLogger(__name__)


class CacheManager:
    """Disk-backed, TTL-aware JSON cache for chatbot query responses.

    Each cached response is stored as a separate ``.json`` file whose name
    is the MD5 hex digest of the normalised query string.

    Attributes:
        cache_dir: Directory where cache files are stored.
        ttl:       Maximum age of a cache entry before it is considered
                   expired.
    """

    def __init__(self) -> None:
        """Initialise the cache manager.

        Creates the cache directory if it does not already exist.
        """
        self.cache_dir: Path = CACHE_DIR
        self.ttl: timedelta = timedelta(hours=CACHE_TTL_HOURS)

        try:
            self.cache_dir.mkdir(parents=True, exist_ok=True)
            logger.info(
                "CacheManager initialised – dir=%s, ttl=%s hours",
                self.cache_dir,
                CACHE_TTL_HOURS,
            )
        except OSError as exc:
            logger.error("Failed to create cache directory %s: %s", self.cache_dir, exc)

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _hash_query(self, query: str) -> str:
        """Return a deterministic MD5 hex digest for *query*.

        The query is first normalised: stripped of leading/trailing
        whitespace, lower-cased, and interior whitespace runs are
        collapsed to single spaces.

        Args:
            query: The raw query string.

        Returns:
            A 32-character hexadecimal MD5 digest.
        """
        normalised = " ".join(query.strip().lower().split())
        return hashlib.md5(normalised.encode("utf-8")).hexdigest()

    def _cache_path(self, query: str) -> Path:
        """Return the filesystem path for the cache file of *query*."""
        return self.cache_dir / f"{self._hash_query(query)}.json"

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get(self, query: str) -> Optional[dict]:
        """Retrieve a cached response for *query*, if it exists and is fresh.

        Args:
            query: The search / chat query to look up.

        Returns:
            The cached response ``dict`` (without the ``cached_at`` meta
            field) if the entry exists and has not exceeded the TTL,
            otherwise ``None``.
        """
        path = self._cache_path(query)

        if not path.exists():
            logger.debug("Cache miss (no file): %s", query)
            return None

        try:
            with open(path, "r", encoding="utf-8") as fh:
                cached: dict = json.load(fh)
        except (OSError, json.JSONDecodeError) as exc:
            logger.warning("Failed to read cache file %s: %s", path, exc)
            return None

        # Validate TTL
        cached_at_str = cached.get("cached_at")
        if not cached_at_str:
            logger.warning("Cache entry missing 'cached_at': %s", path)
            return None

        try:
            cached_at = datetime.fromisoformat(cached_at_str)
        except (ValueError, TypeError) as exc:
            logger.warning("Invalid 'cached_at' in cache file %s: %s", path, exc)
            return None

        age = datetime.now(timezone.utc) - cached_at
        if age > self.ttl:
            logger.info("Cache expired (age=%s): %s", age, query)
            return None

        logger.info("Cache hit (age=%s): %s", age, query)
        return cached.get("data")

    def set(self, query: str, response: dict) -> None:
        """Store *response* in the cache under *query*.

        The entry is written as a JSON file containing the response data
        and a ``cached_at`` ISO-8601 UTC timestamp.

        Args:
            query:    The query string to use as the cache key.
            response: The response dictionary to cache.
        """
        path = self._cache_path(query)

        entry = {
            "query": query,
            "cached_at": datetime.now(timezone.utc).isoformat(),
            "data": response,
        }

        try:
            self.cache_dir.mkdir(parents=True, exist_ok=True)
            with open(path, "w", encoding="utf-8") as fh:
                json.dump(entry, fh, indent=2, ensure_ascii=False)
            logger.info("Cached response for query: %s", query)
        except OSError as exc:
            logger.error("Failed to write cache file %s: %s", path, exc)

    def invalidate(self, query: str) -> None:
        """Delete the cached entry for *query*, if it exists.

        Args:
            query: The query whose cache entry should be removed.
        """
        path = self._cache_path(query)

        if not path.exists():
            logger.debug("Nothing to invalidate (no file): %s", query)
            return

        try:
            path.unlink()
            logger.info("Invalidated cache for query: %s", query)
        except OSError as exc:
            logger.error("Failed to delete cache file %s: %s", path, exc)

    def clear_expired(self) -> int:
        """Remove all expired cache files from the cache directory.

        Returns:
            The number of cache files that were deleted.
        """
        deleted = 0
        now = datetime.now(timezone.utc)

        try:
            json_files = list(self.cache_dir.glob("*.json"))
        except OSError as exc:
            logger.error("Failed to list cache directory %s: %s", self.cache_dir, exc)
            return 0

        for path in json_files:
            try:
                with open(path, "r", encoding="utf-8") as fh:
                    cached = json.load(fh)

                cached_at_str = cached.get("cached_at")
                if not cached_at_str:
                    logger.debug("Skipping file without 'cached_at': %s", path.name)
                    continue

                cached_at = datetime.fromisoformat(cached_at_str)
                age = now - cached_at

                if age > self.ttl:
                    path.unlink()
                    deleted += 1
                    logger.debug("Deleted expired cache file: %s (age=%s)", path.name, age)

            except (OSError, json.JSONDecodeError, ValueError) as exc:
                logger.warning("Error processing cache file %s: %s", path.name, exc)
                continue

        logger.info("Cleared %d expired cache file(s)", deleted)
        return deleted
