# Infograph-AI

Infograph-AI turns resume PDFs into polished, recruiter-ready presentation decks. It parses a resume, analyzes the candidate profile with an LLM, renders structured slide layouts, and exports the result as a PDF.

The product is built as a full-stack AI workspace with a Next.js frontend, FastAPI backend, Clerk authentication, Groq-powered resume analysis, and local client-side history with automatic inactivity cleanup.

## Features

- Resume PDF upload with validation and processing states
- AI-generated slide deck with snapshot, skills, experience, timeline, recommendations, and ATS score views
- Professional dashboard for reviewing generated decks
- PDF export using `html2canvas` and `jsPDF`
- Protected dashboard routes with Clerk authentication
- Local history powered by Zustand and `localStorage`
- Automatic history cleanup after 3 hours of user inactivity
- FastAPI backend with request logging, rate limiting, CORS, and typed responses

## Tech Stack

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand
- TanStack Query
- Clerk
- Framer Motion
- Radix UI
- Lucide React
- jsPDF and html2canvas

### Backend

- FastAPI
- Python 3.11+
- Groq API
- Pydantic and pydantic-settings
- PyPDF2
- Matplotlib
- SlowAPI
- Structlog

## Architecture

```text
Resume PDF
   |
   v
Next.js upload flow
   |
   v
FastAPI /api/v1/pipeline
   |
   +--> PDF parsing
   +--> LLM resume analysis
   +--> slide schema validation
   +--> optional chart generation
   |
   v
Typed slide deck response
   |
   v
Dashboard renderer + PDF export
```

## Project Structure

```text
infograph-ai/
  backend/
    app/
      models/          Pydantic schemas
      routes/          FastAPI route handlers
      services/        parser, LLM, chart, and orchestration logic
      config.py        environment configuration
      exceptions.py    application error types
      logging.py       structured logging setup
    main.py            FastAPI application entrypoint
    requirements.txt   Python dependencies

  frontend/
    app/               Next.js routes and layouts
    components/        UI, layout, upload, and slide components
    lib/
      queries/         TanStack Query hooks
      stores/          Zustand stores
      api.ts           upload API client
      export-pdf.ts    PDF export helper
      types.ts         shared frontend types

  docker-compose.yml
  README.md
```

## Requirements

- Node.js 20+
- Python 3.11+
- A Clerk application
- A Groq API key

## Environment Variables

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
ENVIRONMENT=development
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:3000"]
MAX_UPLOAD_MB=5
MAX_RESUME_PAGES=20
MAX_RESUME_CHARS=8000
LLM_MAX_RETRIES=2
RATE_LIMIT=10/minute
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Do not commit real API keys or Clerk secrets.

## Local Development

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

On macOS or Linux, activate the virtual environment with:

```bash
source venv/bin/activate
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Docker Development

```bash
docker-compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Health check: `http://localhost:8000/health`

## API

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "environment": "development"
}
```

### Generate Resume Deck

```http
POST /api/v1/pipeline
```

Multipart form data:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | PDF file | Yes | Resume PDF to analyze |

Example:

```bash
curl -X POST http://localhost:8000/api/v1/pipeline \
  -F "file=@resume.pdf"
```

The frontend uses its Next.js proxy route at `/api/pipeline`, which forwards the request to the backend.

## History Retention

Generated decks are stored in browser `localStorage` for fast access. The history store clears saved decks after 3 hours of user inactivity so uploaded resume-derived data does not remain in the dashboard indefinitely.

The retention window is configured in:

```text
frontend/lib/stores/history-store.ts
```

## Quality Checks

Frontend:

```bash
cd frontend
npm.cmd run lint
npm.cmd exec tsc -- --noEmit
```

Backend:

```bash
cd backend
python -m compileall app main.py
```

Use the checks above alongside a manual upload flow to verify authentication, PDF processing, dashboard rendering, history cleanup, and PDF export.

## Deployment Notes

- Deploy the frontend to Vercel, Netlify, or another Next.js-compatible host.
- Deploy the backend to Render, Railway, Fly.io, AWS, or any container-capable platform.
- Set production CORS origins explicitly.
- Store secrets in the hosting provider's environment manager.
- Use HTTPS in production for both frontend and backend.

## Repository Metadata

Suggested GitHub About description:

```text
AI-powered resume-to-presentation workspace that converts PDF resumes into recruiter-ready slide decks with ATS insights and PDF export.
```

Suggested topics:

```text
nextjs, react, typescript, tailwindcss, fastapi, python, ai, groq, clerk, resume-parser, pdf, presentation, ats, zustand
```

## License

All rights reserved unless a license file is added.
