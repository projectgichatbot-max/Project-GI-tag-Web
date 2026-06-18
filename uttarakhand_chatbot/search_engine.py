"""
search_engine.py
~~~~~~~~~~~~~~~~

Semantic search over a local JSON knowledge base using TF-IDF vectorization
and cosine similarity scoring.

The module provides a ``SearchEngine`` class that loads structured documents
from a JSON file, builds a TF-IDF index, and exposes a ``search`` method for
ranked retrieval with optional tag-based filtering.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from config import KNOWLEDGE_BASE_FILE, MAX_SEARCH_RESULTS, SIMILARITY_THRESHOLD

logger = logging.getLogger(__name__)


class SearchEngine:
    """TF-IDF–based semantic search engine backed by a JSON knowledge base.

    Attributes:
        vectorizer: Fitted ``TfidfVectorizer`` instance.
        documents: In-memory list of knowledge-base documents.
        tfidf_matrix: Sparse TF-IDF matrix built from ``documents``.
    """

    # ------------------------------------------------------------------
    # Initialisation
    # ------------------------------------------------------------------

    def __init__(self) -> None:
        """Initialise the search engine.

        Creates an empty vectorizer, document list, and ``None`` TF-IDF
        matrix.  Call :meth:`build_index` (or :meth:`refresh_index`) to
        populate the index before searching.
        """
        self.vectorizer: TfidfVectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
        )
        self.documents: list[dict[str, Any]] = []
        self.tfidf_matrix: Any | None = None  # sparse matrix or None

        logger.info("SearchEngine initialised.")

    # ------------------------------------------------------------------
    # Knowledge-base I/O
    # ------------------------------------------------------------------

    def load_knowledge_base(self) -> list[dict[str, Any]]:
        """Read and parse the JSON knowledge-base file.

        Returns:
            A list of document dicts on success, or an empty list if the
            file is missing, unreadable, or contains invalid JSON.
        """
        kb_path: Path = KNOWLEDGE_BASE_FILE

        if not kb_path.exists():
            logger.warning("Knowledge-base file not found: %s", kb_path)
            return []

        try:
            raw_text: str = kb_path.read_text(encoding="utf-8")
            data: list[dict[str, Any]] = json.loads(raw_text)

            if not isinstance(data, list):
                logger.warning(
                    "Knowledge-base root is not a JSON array – got %s.",
                    type(data).__name__,
                )
                return []

            logger.info(
                "Loaded %d document(s) from %s.", len(data), kb_path
            )
            return data

        except json.JSONDecodeError as exc:
            logger.warning("Invalid JSON in knowledge base: %s", exc)
            return []
        except OSError as exc:
            logger.warning("Could not read knowledge-base file: %s", exc)
            return []

    def _save_knowledge_base(self) -> None:
        """Write the current documents list back to the JSON file (pretty-printed).

        Raises are caught and logged so that callers are not interrupted by
        transient I/O errors.
        """
        kb_path: Path = KNOWLEDGE_BASE_FILE

        try:
            kb_path.parent.mkdir(parents=True, exist_ok=True)
            kb_path.write_text(
                json.dumps(self.documents, indent=2, ensure_ascii=False),
                encoding="utf-8",
            )
            logger.info(
                "Saved %d document(s) to %s.", len(self.documents), kb_path
            )
        except OSError as exc:
            logger.error("Failed to save knowledge base: %s", exc)

    # ------------------------------------------------------------------
    # Index management
    # ------------------------------------------------------------------

    def build_index(self) -> None:
        """Build (or rebuild) the TF-IDF index from the in-memory documents.

        Each document's ``name``, ``tag``, and ``description`` fields are
        concatenated into a single text corpus entry.  The vectorizer is
        then fitted on the full corpus.
        """
        self.documents = self.load_knowledge_base()

        if not self.documents:
            logger.warning("No documents to index – TF-IDF matrix is empty.")
            self.tfidf_matrix = None
            return

        corpus: list[str] = [
            self._document_to_text(doc) for doc in self.documents
        ]

        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        logger.info(
            "TF-IDF index built: %d documents, %d features.",
            self.tfidf_matrix.shape[0],
            self.tfidf_matrix.shape[1],
        )

    def refresh_index(self) -> None:
        """Reload the knowledge base from disk and rebuild the index."""
        logger.info("Refreshing search index …")
        self.build_index()

    # ------------------------------------------------------------------
    # Search
    # ------------------------------------------------------------------

    def search(
        self,
        query: str,
        tag: str | None = None,
        top_k: int | None = None,
    ) -> list[dict[str, Any]]:
        """Search the knowledge base for documents matching *query*.

        Args:
            query: Free-text search query.
            tag: If provided, only documents whose ``tag`` field matches
                 (case-insensitive) are considered.
            top_k: Maximum number of results to return.  Defaults to
                   :data:`config.MAX_SEARCH_RESULTS`.

        Returns:
            A list of result dicts sorted by descending similarity score.
            Each dict contains the original document fields plus a ``score``
            key.  Returns an empty list when the index is empty or no
            results exceed :data:`config.SIMILARITY_THRESHOLD`.
        """
        if top_k is None:
            top_k = MAX_SEARCH_RESULTS

        if self.tfidf_matrix is None or not self.documents:
            logger.warning("Search called but the index is empty.")
            return []

        if not query or not query.strip():
            logger.warning("Empty query received – returning no results.")
            return []

        try:
            query_vector = self.vectorizer.transform([query])
        except Exception as exc:  # noqa: BLE001
            logger.error("Failed to vectorise query: %s", exc)
            return []

        similarities: np.ndarray = cosine_similarity(
            query_vector, self.tfidf_matrix
        ).flatten()

        # Build scored candidates ------------------------------------------------
        scored: list[dict[str, Any]] = []
        for idx, score in enumerate(similarities):
            if score < SIMILARITY_THRESHOLD:
                continue

            doc = self.documents[idx]

            # Optional tag filter (case-insensitive)
            if tag is not None:
                doc_tag: str = str(doc.get("tag", ""))
                if doc_tag.lower() != tag.lower():
                    continue

            result: dict[str, Any] = {**doc, "score": round(float(score), 4)}
            scored.append(result)

        # Sort descending by score and trim to top_k ----------------------------
        scored.sort(key=lambda r: r["score"], reverse=True)
        results = scored[:top_k]

        logger.info(
            "Query '%s' → %d result(s) (tag=%s, top_k=%d).",
            query,
            len(results),
            tag,
            top_k,
        )
        return results

    # ------------------------------------------------------------------
    # Document management
    # ------------------------------------------------------------------

    def add_document(self, doc: dict[str, Any]) -> None:
        """Append a new document, persist to disk, and rebuild the index.

        Args:
            doc: A document dict (should contain at least ``name``, ``tag``,
                 ``description``, ``source``, and ``created_at`` keys).
        """
        self.documents.append(doc)
        self._save_knowledge_base()
        self.build_index()
        logger.info("Document added and index rebuilt: %s", doc.get("name"))

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _document_to_text(doc: dict[str, Any]) -> str:
        """Combine a document's key fields into a single searchable string.

        Fields concatenated: ``name``, ``tag``, ``description``.
        """
        parts: list[str] = [
            str(doc.get("name", "")),
            str(doc.get("tag", "")),
            str(doc.get("description", "")),
        ]
        return " ".join(parts)
