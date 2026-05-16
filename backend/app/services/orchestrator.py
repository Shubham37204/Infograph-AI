"""
Pipeline orchestrator — coordinates parsing, LLM analysis, and chart generation.

Async so it doesn't block the FastAPI event loop.
Simple and direct — no job abstraction layer.
"""

import time

from app.logging import get_logger
from app.models.schemas import SlideDeckResponse
from app.services.imagen import generate_skills_chart
from app.services.llm_service import analyze_resume
from app.services.parser import parse_resume

log = get_logger("orchestrator")


async def run(pdf_bytes: bytes) -> SlideDeckResponse:
    """
    Full pipeline: parse PDF → LLM analysis → enrich with charts → response.
    """
    start = time.perf_counter()

    # Step 1: Parse PDF
    parsed = parse_resume(pdf_bytes)
    log.info("step_complete", step="parse", chars=parsed["char_count"])

    # Step 2: LLM analysis (async — doesn't block event loop)
    deck_data = await analyze_resume(parsed["raw_text"])
    log.info("step_complete", step="llm_analysis")

    # Step 3: Generate skills chart for the skills slide
    for slide in deck_data.get("slides", []):
        if slide.get("type") == "skills" and slide.get("bullets"):
            chart_b64 = generate_skills_chart(slide["bullets"])
            if chart_b64:
                slide["chart_image"] = chart_b64
                log.info("step_complete", step="skills_chart")

    elapsed = time.perf_counter() - start
    log.info(
        "pipeline_complete",
        candidate=deck_data.get("candidate_name", "unknown"),
        total_latency_s=round(elapsed, 2),
    )

    return SlideDeckResponse(**deck_data)
