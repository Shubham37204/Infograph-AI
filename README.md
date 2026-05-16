# Infograph-AI: Editorial Presentation Engine

![Infograph-AI Landing](frontend/public/images/preview.png)

> **Transforming high-density professional documents into editorial-grade presentations.**

Infograph-AI is a utilitarian workspace designed for engineers, recruiters, and professionals who need to turn static PDF resumes into dynamic, data-driven infographic decks. Built with a focus on high information density, structural clarity, and a premium "human-designed" aesthetic.

---

## ✨ Key Features

- **Deep Resume Analysis**: Advanced parsing logic that identifies professional narratives, skill clusters, and career timelines.
- **Automated Editorial Layouts**: Intelligent mapping of data into one of five specialized slide formats (Snapshot, Skills, Timeline, Experience, and ATS Insights).
- **Professional Persistence**: Local-first history management powered by Zustand and LocalStorage.
- **Export-Ready**: High-fidelity PDF export capabilities for sharing and offline use.
- **Modern Auth**: Secure user management via Clerk with protected dashboard and workspace routes.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: [Clerk](https://clerk.com/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Orchestration**: Structured logging and pipeline management.
- **Parsing**: Dedicated PDF extraction services.
- **AI Integration**: Orchestrated LLM services for professional data normalization.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- Python 3.11+
- Clerk Account (for Auth)

### 2. Environment Setup

**Frontend (`/frontend/.env.local`):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
BACKEND_URL=http://localhost:8000
```

**Backend (`/backend/.env`):**
```env
GEMINI_API_KEY=your_api_key_here
LOG_LEVEL=info
ENVIRONMENT=development
```

### 3. Installation & Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 📐 Architecture & Design Philosophy

### The "Product-First" Aesthetic
Infograph-AI avoids common AI SaaS tropes (neon gradients, excessive glassmorphism). Instead, it follows a **Zinc & Graphite** palette inspired by tools like Linear and GitHub. We prioritize structural borders, consistent spacing, and high-density typography.

### Performance & Restraint
Visual effects and animations are intentionally kept lightweight. This ensures the workspace remains responsive and focused on the core task: **data-driven productivity.**

### Persistence Model
The application uses a hybrid persistence model. Initial generations and workspace states are handled via `localStorage` for zero-latency interactions, while the architecture is ready for a PostgreSQL/Supabase migration as the user base scales.

---

## 📄 License
Infograph-AI is a professional project workspace. All rights reserved.

---

Built with ⚡ by [Your Name/Team Name]
