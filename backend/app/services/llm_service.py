import json
from groq import Groq

from app.config import GROQ_API_KEY, GROQ_MODEL

_client = Groq(api_key=GROQ_API_KEY)

PROMPT = """\
You are a resume analyst.

Analyze the resume and return ONLY valid JSON.

No markdown.
No explanation.
No code fences.
No extra text.

Required structure:

{
  "candidate_name": "Full Name",
  "slides": [
    {
      "type": "summary",
      "title": "Professional Summary",
      "body": "2-3 sentence overview of the candidate",
      "bullets": ["key point 1", "key point 2"]
    },
    {
      "type": "skills",
      "title": "Core Skills",
      "body": "Technical and soft skills overview",
      "bullets": ["Skill 1", "Skill 2"]
    },
    {
      "type": "experience",
      "title": "Experience Highlights",
      "body": "Summary of professional experience",
      "bullets": ["Company · Role: achievement"]
    },
    {
      "type": "strengths",
      "title": "Key Strengths",
      "body": "Candidate strengths",
      "bullets": ["Strength 1", "Strength 2"]
    },
    {
      "type": "recommendations",
      "title": "Recommendations",
      "body": "Suggested improvements",
      "bullets": ["Recommendation 1"]
    }
  ]
}

Resume:
"""


def analyze_resume(resume_text: str) -> dict:
    response = _client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "user",
                "content": PROMPT + resume_text,
            }
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content.strip()

    return json.loads(raw)
