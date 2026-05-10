from app.services.parser import parse_resume
from app.services.llm_service import analyze_resume
from app.services.imagen import generate_skills_chart
from app.models.schemas import SlideDeckResponse


def run(pdf_bytes: bytes) -> SlideDeckResponse:
    parsed   = parse_resume(pdf_bytes)
    deck_data = analyze_resume(parsed["raw_text"])

    # attach skills chart to skills slide
    for slide in deck_data.get("slides", []):
        if slide.get("type") == "skills":
            chart_b64 = generate_skills_chart(slide.get("bullets", []))
            if chart_b64:
                slide["chart_image"] = chart_b64
            break

    return SlideDeckResponse(**deck_data)

