from enum import Enum
from pydantic import BaseModel

class SlideType(str, Enum):
    summary = "summary"
    skills = "skills"
    experience = "experience"
    strengths = "strengths"
    recommendations = "recommendations"


class Slide(BaseModel):
    type: SlideType
    title: str
    body: str
    bullets: list[str] = []

class SlideDeckResponse(BaseModel):
    candidate_name: str
    slides: list[Slide]

class ParsedTextResponse(BaseModel):
    candidate_name: str
    raw_text: str
    char_count: int

class ErrorResponse(BaseModel):
    detail: str


# It defines:
# what backend returns
# what frontend expects
# what AI will later generate