import json
from groq import Groq
from app.config import GROQ_API_KEY, GROQ_MODEL

_client = Groq(api_key=GROQ_API_KEY)

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
- ats_score: Body = "ATS Score: XX/100 — one line verdict". Bullets: matched, missing, one fix.
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