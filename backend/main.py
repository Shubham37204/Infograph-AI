"""
Application entry point — FastAPI app with middleware, error handlers,
health check, and API versioning.
"""

import time
import uuid

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config import settings
from app.exceptions import AppError, app_error_handler
from app.logging import setup_logging
from app.routes.pipeline import router

# ── Bootstrap logging ────────────────────────────
setup_logging()
log = structlog.get_logger("main")

# ── Rate limiter ─────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=[settings.RATE_LIMIT])

# ── App ──────────────────────────────────────────
app = FastAPI(
    title="infograph-ai",
    description="AI-powered resume analysis and infographic generation",
    version="1.0.0",
)
app.state.limiter = limiter

# ── Error handlers ───────────────────────────────
app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# ── Request logging middleware ───────────────────
@app.middleware("http")
async def request_logging(request: Request, call_next):
    request_id = str(uuid.uuid4())[:8]
    structlog.contextvars.bind_contextvars(request_id=request_id)
    start = time.perf_counter()

    response = await call_next(request)

    elapsed = time.perf_counter() - start
    log.info(
        "request",
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        latency_s=round(elapsed, 3),
    )
    structlog.contextvars.unbind_contextvars("request_id")
    return response


# ── Health check ─────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "environment": settings.ENVIRONMENT}


# ── API v1 ───────────────────────────────────────
app.include_router(router, prefix="/api/v1")

# Backward compatibility: also mount at /api for existing frontend
app.include_router(router, prefix="/api")
