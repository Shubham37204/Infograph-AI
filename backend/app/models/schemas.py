from enum import Enum
from pydantic import BaseModel


class SlideType(str, Enum):
    summary         = "summary"
    skills          = "skills"
    experience      = "experience"
    strengths       = "strengths"
    recommendations = "recommendations"
    ats_score       = "ats_score"


class Slide(BaseModel):
    type: SlideType
    title: str
    body: str
    bullets: list[str] = []
    chart_image: str | None = None  


class SlideDeckResponse(BaseModel):
    candidate_name: str
    slides: list[Slide]


class ParsedTextResponse(BaseModel):
    candidate_name: str
    raw_text: str
    char_count: int


class ErrorResponse(BaseModel):
    detail: str