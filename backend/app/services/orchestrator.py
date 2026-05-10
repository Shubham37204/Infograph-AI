from app.services.parser import parse_resume
from app.services.llm_service import analyze_resume
from app.models.schemas import SlideDeckResponse


def run(pdf_bytes: bytes) -> SlideDeckResponse:
    parsed = parse_resume(pdf_bytes)
    slide_data = analyze_resume(parsed["raw_text"])
    return SlideDeckResponse(**slide_data)

