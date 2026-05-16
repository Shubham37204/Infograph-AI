# Infograph-AI: Editorial Presentation Engine

> **Transforming high-density professional documents into editorial-grade presentations.**

Infograph-AI is an AI-powered workspace designed for engineers, recruiters, and professionals who need to turn static PDF resumes into dynamic, data-driven infographic decks. Built with a focus on high information density, structural clarity, and a premium "human-designed" aesthetic.

---

## Table of Contents

- [Overview](#overview)
- [✨ Key Features](#-key-features)
- [📋 System Requirements](#-system-requirements)
- [🛠️ Technology Stack](#%EF%B8%8F-technology-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Deployment](#-deployment)
- [🔌 API Documentation](#-api-documentation)
- [📐 Architecture](#-architecture)
- [🧪 Testing & Verification](#-testing--verification)
- [🔧 Troubleshooting](#-troubleshooting)
- [📝 License](#-license)

---

## Overview

Infograph-AI automates the transformation of resume PDFs into professionally-designed presentation slides. The system:

1. **Parses** resume PDFs to extract structured data
2. **Analyzes** content using AI to identify key insights and narratives
3. **Generates** five specialized slide formats with intelligent layout mapping
4. **Exports** high-fidelity PDFs ready for sharing or presentation

### Who Should Use This?

- **Recruiters**: Quickly create engaging candidate profiles
- **Engineers**: Build impressive portfolio presentations from resumes
- **Professionals**: Generate conference talk slides or portfolio decks
- **Teams**: Automate bulk resume processing workflows

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Deep Resume Analysis** | Advanced parsing logic identifies professional narratives, skill clusters, and career timelines |
| **5 Slide Formats** | Snapshot, Skills, Timeline, Experience, and ATS Insights layouts with intelligent mapping |
| **Professional UI** | Zinc & Graphite palette inspired by Linear and GitHub with structural clarity |
| **Local History** | Client-side persistence powered by Zustand and LocalStorage for instant access |
| **PDF Export** | High-fidelity export capabilities for sharing and offline presentations |
| **Secure Auth** | User management via Clerk with protected routes and workspace isolation |
| **Rate Limited API** | Protected endpoints with configurable rate limiting (10 requests/minute default) |
| **Structured Logging** | Comprehensive request logging and performance metrics for debugging |

---

## 📋 System Requirements

### Minimum Requirements
- **Node.js**: 20 or higher
- **Python**: 3.11 or higher
- **RAM**: 2GB minimum (4GB+ recommended for concurrent processing)
- **Disk**: 500MB free space

### Required Services/Accounts
- **Clerk Account**: Free tier available at [clerk.com](https://clerk.com/)
- **Groq API Key**: Free tier available at [console.groq.com](https://console.groq.com/)

---

## 🛠️ Technology Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) with App Router & React 19 |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) + LocalStorage |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [Lucide Icons](https://lucide.dev/) |
| **Data Fetching** | [TanStack React Query](https://tanstack.com/query/latest) (v5) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Auth** | [Clerk](https://clerk.com/) |
| **Export** | html2canvas + jsPDF for PDF generation |

### Backend
| Layer | Technology |
|-------|-----------|
| **Framework** | [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+) |
| **LLM Provider** | [Groq API](https://groq.com/) (llama-3.3-70b-versatile) |
| **PDF Processing** | PyPDF2 + custom parsing logic |
| **Charts** | Matplotlib for skills visualization |
| **Logging** | Structlog with JSON output |
| **Rate Limiting** | Slowapi (10 reqs/min default) |
| **CORS** | FastAPI middleware (localhost:3000 by default) |
| **API Versioning** | v1 endpoints + backward compatibility |

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
# Clone the repository
git clone <repository-url>
cd infograph-ai

# Create environment files
touch backend/.env frontend/.env.local
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional (defaults provided)
GROQ_MODEL=llama-3.3-70b-versatile
ENVIRONMENT=development
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:3000"]
MAX_UPLOAD_MB=5
MAX_RESUME_PAGES=20
RATE_LIMIT=10/minute
```

**Frontend (`frontend/.env.local`):**
```env
# Clerk Auth (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Start Development Servers

**Terminal 1 - Backend (from `backend/` directory):**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Terminal 2 - Frontend (from `frontend/` directory):**
```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 16.2.6
  - Local:        http://localhost:3000
```

### 5. Verify Installation

1. Open [http://localhost:3000](http://localhost:3000)
2. Sign up with Clerk
3. Navigate to `/upload` 
4. Upload a sample resume PDF
5. Verify the pipeline stages complete (Parsing → Analysis → Generation)
6. Check the dashboard workspace

---

## 📦 Deployment

### Docker Compose (Recommended for Development)

```bash
# From project root
docker-compose up --build
```

This starts:
- Backend on `http://localhost:8000`
- Frontend on `http://localhost:3000`

**Environment variables for Docker:**
```bash
# In docker-compose.yml or via .env file
GROQ_API_KEY=your_key
ENVIRONMENT=production
```

### Production Deployment

#### Backend (FastAPI)
```bash
# Using Gunicorn + Uvicorn workers
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Or using Uvicorn directly with multiple workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend (Next.js)
```bash
npm run build
npm run start
```

#### Recommended Hosting
- **Backend**: Railway, Render, or AWS EC2
- **Frontend**: Vercel (recommended), Netlify, or AWS S3 + CloudFront
- **Database**: PostgreSQL on AWS RDS or Supabase (ready for migration)

---

## 🔌 API Documentation

### Base URL
- Development: `http://localhost:8000`
- Production: `{your-domain}`

### Health Check

**Endpoint:**
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "environment": "development"
}
```

### Pipeline Endpoint

**Endpoint:**
```
POST /api/v1/pipeline/process
```

**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/pipeline/process \
  -F "pdf_file=@resume.pdf"
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pdf_file` | File | Yes | PDF resume file (max 5MB) |

**Response (200 OK):**
```json
{
  "candidate_name": "John Doe",
  "professional_summary": "Software engineer with 5+ years experience...",
  "slides": [
    {
      "type": "snapshot",
      "title": "Professional Overview",
      "bullets": ["Experienced in full-stack development", ...],
      "layout": "editorial"
    },
    {
      "type": "skills",
      "title": "Core Competencies",
      "bullets": ["Python", "JavaScript", "AWS", ...],
      "chart_image": "data:image/png;base64,..."
    }
  ],
  "processing_time_ms": 3200,
  "model_used": "llama-3.3-70b-versatile"
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `400` | `INVALID_FILE` | File is not a valid PDF |
| `413` | `FILE_TOO_LARGE` | File exceeds 5MB limit |
| `429` | `RATE_LIMIT_EXCEEDED` | Too many requests (10/min) |
| `500` | `PROCESSING_ERROR` | LLM analysis failed |

### Backward Compatibility

Endpoints are available at both:
- `/api/v1/pipeline/process` (recommended)
- `/api/pipeline/process` (legacy)

---

## 📐 Architecture

### System Design

```
┌─────────────────────────────────────────────────┐
│              Frontend (Next.js)                  │
│  Clerk Auth → Dashboard → Upload → Workspace   │
└────────────────┬────────────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────────────┐
│           API Gateway (FastAPI)                 │
│  Rate Limiting → CORS → Request Logging        │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌─────────┐ ┌─────────┐ ┌──────────┐
│ Parser  │ │   LLM   │ │ Charts   │
│(PyPDF2) │ │(Groq)   │ │(Matplotlib)
└─────────┘ └─────────┘ └──────────┘

LocalStorage → Zustand (Frontend State)
```

### Request Flow

1. **User uploads PDF** → Frontend validation
2. **API call** → `/api/v1/pipeline/process` with file
3. **Rate limit check** → (10 reqs/min)
4. **PDF parsing** → Extract text and metadata
5. **LLM analysis** → Groq API processes resume
6. **Enrichment** → Generate skills charts
7. **Response** → Slide deck with all assets
8. **Frontend renders** → Zustand stores data
9. **LocalStorage** → Persists for history

### File Structure

```
infograph-ai/
├── backend/
│   ├── app/
│   │   ├── config.py           # Settings & env validation
│   │   ├── exceptions.py       # Custom error handling
│   │   ├── logging.py          # Structlog setup
│   │   ├── models/
│   │   │   └── schemas.py      # Pydantic data models
│   │   ├── routes/
│   │   │   └── pipeline.py     # API endpoints
│   │   └── services/
│   │       ├── parser.py       # PDF extraction
│   │       ├── llm_service.py  # Groq integration
│   │       ├── imagen.py       # Chart generation
│   │       └── orchestrator.py # Pipeline coordination
│   ├── main.py                 # App entry point
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── (auth)/             # Auth pages (Clerk)
│   │   ├── (dashboard)/        # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── upload/
│   │   │   └── history/
│   │   └── api/
│   │       └── pipeline/route.ts  # API proxy
│   ├── components/
│   │   ├── layout/
│   │   ├── slides/
│   │   ├── ui/
│   │   └── upload/
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   ├── types.ts            # TypeScript types
│   │   ├── queries/
│   │   └── stores/             # Zustand stores
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

### Design Philosophy

**Product-First Aesthetic**
- Zinc & Graphite color palette inspired by Linear and GitHub
- Minimal glassmorphism, no excessive neon gradients
- Structural borders and consistent spacing
- High-density typography for information display

**Performance & Restraint**
- Lightweight animations for responsive interaction
- Focus on core task: data-driven productivity
- Optimized for fast PDF processing (typical: 3-5 seconds)

**Persistence Model**
- **LocalStorage**: Zero-latency workspace and history access
- **Architecture-Ready**: Can migrate to PostgreSQL/Supabase
- **Hybrid Approach**: Client-side state + potential backend DB

---

## 🧪 Testing & Verification

See [TESTING_GUIDE.txt](TESTING_GUIDE.txt) for comprehensive feature testing checklist.

### Quick Verification Steps

```bash
# 1. Backend health check
curl http://localhost:8000/health

# 2. Upload and process test
curl -X POST http://localhost:8000/api/v1/pipeline/process \
  -F "pdf_file=@test_resume.pdf"

# 3. Frontend navigation
# - Visit http://localhost:3000
# - Sign in with test account
# - Upload PDF from /upload page
# - Verify slide generation in workspace
# - Check /history for persistence
```

### Key Test Scenarios

1. **Authentication**: Sign in/out, protected routes
2. **Upload Workflow**: Drag-drop, file validation, processing stages
3. **Pipeline**: PDF parsing, LLM analysis, chart generation
4. **Persistence**: LocalStorage history, page refresh
5. **Error Handling**: Invalid PDF, large files, network errors
6. **Rate Limiting**: Multiple rapid requests
7. **Export**: PDF generation and download

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: `GROQ_API_KEY not found`**
```bash
# Solution: Set environment variable
export GROQ_API_KEY=your_api_key  # Linux/Mac
set GROQ_API_KEY=your_api_key     # Windows
```

**Problem: `CORS error: localhost:3000 blocked`**
```bash
# Update backend/.env
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

**Problem: `Port 8000 already in use`**
```bash
# Use a different port
uvicorn app.main:app --port 8001 --reload
```

**Problem: `ModuleNotFoundError: No module named 'app'`**
```bash
# Make sure you're in the backend directory
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Issues

**Problem: `Cannot find module '@clerk/nextjs'`**
```bash
cd frontend
npm install
npm run dev
```

**Problem: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set`**
```bash
# Verify frontend/.env.local contains
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Restart dev server after adding env vars
npm run dev
```

**Problem: `Backend URL connection refused`**
```bash
# Verify backend is running on correct port
curl http://localhost:8000/health

# Update frontend/.env.local if using different port
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
```

### General Issues

**Problem: `PDF upload returns 413 (File Too Large)`**
- Default max: 5MB
- Solution: Increase `MAX_UPLOAD_MB` in `backend/.env`

**Problem: `Rate limit exceeded (429)`**
- Default: 10 requests/minute
- Solution: Wait 60 seconds or adjust `RATE_LIMIT` in `backend/.env`

**Problem: `Pipeline takes >10 seconds`**
- Check Groq API status and quota
- Verify network connectivity
- Check backend logs for errors

**Docker Issues:**
```bash
# Rebuild containers
docker-compose down
docker-compose up --build

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 📝 License

Infograph-AI is a professional project workspace. All rights reserved.

---

**Questions or Issues?** Check the [Troubleshooting](#-troubleshooting) section or review [TESTING_GUIDE.txt](TESTING_GUIDE.txt) for detailed feature verification.
