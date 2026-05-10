import json
from groq import Groq
from app.config import GROQ_API_KEY, GROQ_MODEL

_client = Groq(api_key=GROQ_API_KEY)

PROMPT = """\
You are an expert resume analyst writing for a hiring recruiter.

Analyze the resume and return ONLY valid JSON. No markdown. No explanation. No code fences.

STRICT RULES:
- summary: mention years of experience + top 2 skills + one standout fact. Never generic.
- skills: group bullets as "Languages: x, y", "Frameworks: x, y", "Tools: x, y". Add "Cloud/DevOps: x" if present.
- experience: each bullet MUST follow → "Company · Role: [strong verb] [what] → [result or impact]". Min 3 bullets.
- strengths: specific to THIS candidate only. Never write "strong communication skills" alone.
- recommendations: actionable and specific. NEVER repeat the body text. Min 2 bullets.
- ats_score: score the resume out of 100 for ATS compatibility. Body = "ATS Score: XX/100". Bullets must be:
    1. "✅ Matched: keyword1, keyword2, keyword3" (keywords found)
    2. "❌ Missing: keyword1, keyword2, keyword3" (important missing keywords)
    3. "⚡ Fix: specific action to improve ATS score"
- bullets: min 3, max 5 per slide. Never repeat body text in bullets.
- All bullets must start with a capital letter.

Required JSON structure:
{
  "candidate_name": "Full Name",
  "slides": [
    {
      "type": "summary",
      "title": "Professional Summary",
      "body": "1-2 sentences: years of experience, top skills, standout fact",
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
      "type": "strengths",
      "title": "Key Strengths",
      "body": "What makes this specific candidate stand out to a recruiter",
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
        "✅ Matched: keyword1, keyword2, keyword3",
        "❌ Missing: keyword1, keyword2, keyword3",
        "⚡ Fix: specific action to improve ATS score immediately"
      ]
    }
  ]
}

Resume:
"""


def analyze_resume(resume_text: str) -> dict:
    response = _client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": PROMPT + resume_text}],
        temperature=0.3,
        response_format={"type": "json_object"},
    )
    raw = response.choices[0].message.content.strip()
    return json.loads(raw)
