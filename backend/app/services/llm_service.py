"""
LLM service — async Groq client with Pydantic validation and retry.

Design decisions:
- AsyncGroq so we don't block the FastAPI event loop.
- Pydantic validation of LLM output catches malformed JSON before it
  reaches the frontend.
- Simple retry (max 2) — if the LLM returns bad JSON, we try again.
  No complex retry frameworks.
- Input length guard — truncate oversized resumes to stay within
  context window limits.
"""

import json
import time

from groq import AsyncGroq
from pydantic import ValidationError

from app.config import settings
from app.exceptions import LLMError
from app.logging import get_logger
from app.models.schemas import SlideDeckResponse

log = get_logger("llm_service")

_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

PROMPT = """\
You are an expert resume analyst writing for a hiring recruiter.

Analyze the resume and return ONLY valid JSON. No markdown. No explanation. No code fences.

STRICT RULES:
- snapshot.body: MUST be the candidate's full name exactly as it appears in the resume.
- snapshot.bullets: must follow "Label: Value" format. 5 bullets only.
- skills: group bullets as "Languages: x, y", "Frameworks: x, y", "Tools: x, y". Add "Cloud/DevOps: x" if present.
- experience: each bullet → "Company · Role: [strong verb] [what] → [result or impact]". Min 3 bullets.
- timeline: each bullet → "YEAR → Company · Role: one-line achievement". Chronological, newest first.
- strengths: specific to THIS candidate. Extract from resume evidence. No generic statements.
- recommendations: actionable and specific. NEVER repeat body text. Min 2 bullets.
- ats_score: Body = "ATS Score: XX/100 — one line verdict". Bullets: matched, missing, one fix. Do not use emoji or decorative symbols in labels.
- All bullets: min 3, max 5. Never repeat body text.

Required JSON structure:
{
  "candidate_name": "Full Name",
  "slides": [
    {
      "type": "snapshot",
      "title": "Recruiter Snapshot",
      "body": "[candidate full name — REQUIRED]",
      "bullets": [
        "Experience: X years / X months in [domain]",
        "Stack: [Primary tech e.g. Frontend + AI/ML]",
        "Education: [Institution, Degree, GPA if present]",
        "Best Fit: [Role1 / Role2 / Role3]",
        "Strength: [One standout quality backed by resume]"
      ]
    },
    {
      "type": "summary",
      "title": "Professional Summary",
      "body": "1-2 sentences: experience, top skills, standout fact",
      "bullets": [
        "X years experience in [domain]",
        "Proficient in [top skill 1] and [top skill 2]",
        "Standout: [unique fact from resume]"
      ]
    },
    {
      "type": "skills",
      "title": "Core Skills",
      "body": "Grouped technical stack overview",
      "bullets": [
        "Languages: Python, JavaScript, TypeScript",
        "Frameworks: FastAPI, React, Next.js",
        "Tools: Docker, Git, Kubernetes",
        "Cloud/DevOps: GCP, CI/CD, Helm"
      ]
    },
    {
      "type": "experience",
      "title": "Experience Highlights",
      "body": "1 sentence summarising total experience and key roles",
      "bullets": [
        "Company · Role: Built X using Y → Z outcome",
        "Company · Role: Led X initiative → improved Y by Z%",
        "Company · Role: Delivered X → resulted in Y"
      ]
    },
    {
      "type": "timeline",
      "title": "Career Timeline",
      "body": "Chronological career progression",
      "bullets": [
        "2024 → Company · Role: key achievement",
        "2023 → Project / Role: key achievement",
        "2022 → Education / Activity: key milestone"
      ]
    },
    {
      "type": "strengths",
      "title": "Key Strengths",
      "body": "What makes this specific candidate stand out",
      "bullets": [
        "Specific strength 1 backed by resume evidence",
        "Specific strength 2 backed by resume evidence",
        "Specific strength 3 backed by resume evidence"
      ]
    },
    {
      "type": "recommendations",
      "title": "Recommendations",
      "body": "Concrete next steps to strengthen this candidate profile",
      "bullets": [
        "Add quantified metrics to [specific experience] bullet",
        "Include [specific missing skill] to strengthen profile for [role type]",
        "Highlight [specific project or cert] more prominently"
      ]
    },
    {
      "type": "ats_score",
      "title": "ATS Compatibility Score",
      "body": "ATS Score: XX/100 — [one line verdict]",
      "bullets": [
        "Matched: keyword1, keyword2, keyword3",
        "Missing: keyword1, keyword2, keyword3",
        "Fix: specific action to improve ATS score immediately"
      ]
    }
  ]
}

Resume:
"""


def _truncate(text: str, max_chars: int) -> str:
    """Truncate resume text to stay within context limits."""
    if len(text) <= max_chars:
        return text
    log.warning("resume_truncated", original_len=len(text), max_chars=max_chars)
    return text[:max_chars] + "\n\n[... truncated for analysis]"


async def analyze_resume(resume_text: str) -> dict:
    """
    Send resume text to Groq LLM, validate output, retry on failure.

    Returns a dict matching SlideDeckResponse schema.
    Raises LLMError if all retries are exhausted.
    """
    truncated = _truncate(resume_text, settings.MAX_RESUME_CHARS)
    last_error: str = ""

    for attempt in range(1, settings.LLM_MAX_RETRIES + 1):
        start = time.perf_counter()
        try:
            response = await _client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[{"role": "user", "content": PROMPT + truncated}],
                temperature=0.3,
                response_format={"type": "json_object"},
            )

            raw = response.choices[0].message.content.strip()
            elapsed = time.perf_counter() - start

            # Parse JSON
            data = json.loads(raw)

            # Validate against Pydantic schema
            SlideDeckResponse(**data)

            log.info(
                "llm_success",
                attempt=attempt,
                latency_s=round(elapsed, 2),
                model=settings.GROQ_MODEL,
                response_chars=len(raw),
            )
            return data

        except json.JSONDecodeError as e:
            elapsed = time.perf_counter() - start
            last_error = f"Invalid JSON from LLM: {e}"
            log.warning(
                "llm_json_error",
                attempt=attempt,
                latency_s=round(elapsed, 2),
                error=str(e),
            )

        except ValidationError as e:
            elapsed = time.perf_counter() - start
            last_error = f"Schema validation failed: {e.error_count()} errors"
            log.warning(
                "llm_validation_error",
                attempt=attempt,
                latency_s=round(elapsed, 2),
                error_count=e.error_count(),
            )

        except Exception as e:
            elapsed = time.perf_counter() - start
            last_error = f"LLM call failed: {e}"
            log.error(
                "llm_call_error",
                attempt=attempt,
                latency_s=round(elapsed, 2),
                error=str(e),
            )

    raise LLMError(f"AI analysis failed after {settings.LLM_MAX_RETRIES} attempts: {last_error}")
