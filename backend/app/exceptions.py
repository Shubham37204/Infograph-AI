"""
Application-level exceptions with structured error responses.

Each exception maps to a specific HTTP status code and produces
consistent JSON error bodies for the frontend to consume.
"""

from fastapi import Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Base exception — all custom errors inherit from this."""

    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class PDFParsingError(AppError):
    """Raised when PDF extraction fails (corrupt, encrypted, empty)."""

    def __init__(self, message: str = "Failed to parse PDF"):
        super().__init__(message, status_code=422)


class LLMError(AppError):
    """Raised when the LLM call fails or returns invalid data."""

    def __init__(self, message: str = "AI analysis failed"):
        super().__init__(message, status_code=502)


async def app_error_handler(_request: Request, exc: AppError) -> JSONResponse:
    """Global handler — catches all AppError subclasses."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )
