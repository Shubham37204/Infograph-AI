"""
Pipeline route — handles resume upload, validation, and orchestration.

Validates file type and size BEFORE reading the full body.
Generates a request ID for traceability.
"""

import uuid

import structlog
from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import settings
from app.models.schemas import ErrorResponse, SlideDeckResponse
from app.services.orchestrator import run

router = APIRouter()


@router.post(
    "/pipeline",
    response_model=SlideDeckResponse,
    responses={422: {"model": ErrorResponse}},
    summary="Analyze a resume PDF and generate a slide deck",
)
async def run_pipeline(file: UploadFile = File(...)):
    # Bind request ID for structured logging
    request_id = str(uuid.uuid4())[:8]
    structlog.contextvars.bind_contextvars(request_id=request_id)

    # Validate MIME type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=422, detail="Only PDF files accepted")

    # Check Content-Length header if available (fast-fail before reading)
    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
    if file.size and file.size > max_bytes:
        raise HTTPException(
            status_code=422,
            detail=f"PDF exceeds {settings.MAX_UPLOAD_MB}MB limit",
        )

    pdf_bytes = await file.read()

    # Double-check actual size (Content-Length can be spoofed)
    if len(pdf_bytes) > max_bytes:
        raise HTTPException(
            status_code=422,
            detail=f"PDF exceeds {settings.MAX_UPLOAD_MB}MB limit",
        )

    return await run(pdf_bytes)
