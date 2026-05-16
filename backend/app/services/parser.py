"""
PDF parser — extraction, cleaning, and basic validation.

Handles corrupt PDFs gracefully with structured errors.
Enforces page count and text length limits to keep
downstream LLM costs predictable.
"""

import re
import time

import fitz  # PyMuPDF

from app.config import settings
from app.exceptions import PDFParsingError
from app.logging import get_logger

log = get_logger("parser")


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text from all pages, joining with newlines."""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as e:
        raise PDFParsingError(f"Cannot open PDF: {e}") from e

    if doc.page_count == 0:
        doc.close()
        raise PDFParsingError("PDF has no pages")

    if doc.page_count > settings.MAX_RESUME_PAGES:
        doc.close()
        raise PDFParsingError(
            f"PDF has {doc.page_count} pages (max {settings.MAX_RESUME_PAGES})"
        )

    pages = [page.get_text() for page in doc]
    doc.close()
    return "\n".join(pages)


def clean_text(raw: str) -> str:
    """Normalize whitespace and trim."""
    text = re.sub(r"\n{3,}", "\n\n", raw)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def guess_candidate_name(text: str) -> str:
    """Best-effort name extraction from the first non-empty line."""
    for line in text.strip().splitlines():
        stripped = line.strip()
        if stripped:
            return stripped
    return "Unknown"


def parse_resume(pdf_bytes: bytes) -> dict:
    """
    Full parsing pipeline: extract → clean → validate → return.

    Raises PDFParsingError if the PDF is corrupt, empty, or too large.
    """
    start = time.perf_counter()

    raw = extract_text_from_pdf(pdf_bytes)
    clean = clean_text(raw)

    if len(clean) < 50:
        raise PDFParsingError("PDF contains too little text to analyze")

    # Truncate very long resumes
    if len(clean) > settings.MAX_RESUME_CHARS:
        log.warning(
            "resume_text_truncated",
            original_len=len(clean),
            max_chars=settings.MAX_RESUME_CHARS,
        )
        clean = clean[: settings.MAX_RESUME_CHARS]

    elapsed = time.perf_counter() - start
    log.info(
        "pdf_parsed",
        chars=len(clean),
        latency_s=round(elapsed, 3),
    )

    return {
        "candidate_name": guess_candidate_name(clean),
        "raw_text": clean,
        "char_count": len(clean),
    }
