from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import SlideDeckResponse, ErrorResponse
from app.services.orchestrator import run

router = APIRouter()

@router.post(
    "/pipeline",
    response_model=SlideDeckResponse,
    responses={422: {"model": ErrorResponse}},
)
async def run_pipeline(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=422, detail="Only PDF files accepted")

    pdf_bytes = await file.read()

    if len(pdf_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=422, detail="PDF exceeds 5MB limit")

    return run(pdf_bytes)


# This is properly written API-layer architecture.
# Responsibilities:
# request validation
# upload handling
# error handling
# orchestration call