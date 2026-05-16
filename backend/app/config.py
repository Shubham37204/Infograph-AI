"""
Application settings — single source of truth for all configuration.

Uses pydantic-settings to validate environment variables at startup.
Fails fast with clear error messages if required vars are missing.
"""

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── AI Provider ──────────────────────────────
    GROQ_API_KEY: str = Field(..., description="Groq API key")
    GROQ_MODEL: str = Field(
        default="llama-3.3-70b-versatile",
        description="Model identifier for Groq",
    )

    # ── Server ───────────────────────────────────
    ENVIRONMENT: str = Field(default="development")
    LOG_LEVEL: str = Field(default="INFO")
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:3000"],
        description="Allowed CORS origins",
    )

    # ── Limits ───────────────────────────────────
    MAX_UPLOAD_MB: int = Field(default=5)
    MAX_RESUME_PAGES: int = Field(default=20)
    MAX_RESUME_CHARS: int = Field(
        default=8000,
        description="Truncate resume text beyond this limit",
    )
    LLM_MAX_RETRIES: int = Field(default=2)

    # ── Rate Limiting ────────────────────────────
    RATE_LIMIT: str = Field(
        default="10/minute",
        description="Rate limit string for slowapi",
    )

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
