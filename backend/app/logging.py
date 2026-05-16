"""
Structured logging configuration using structlog.

Provides JSON-formatted logs in production and pretty-printed
colored logs in development. All log entries include timestamp,
log level, and any bound context (request_id, model, etc.).
"""

import logging

import structlog

from app.config import settings


def setup_logging() -> None:
    """Call once at application startup."""

    shared_processors: list[structlog.types.Processor] = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
    ]

    if settings.ENVIRONMENT == "production":
        renderer: structlog.types.Processor = structlog.processors.JSONRenderer()
    else:
        renderer = structlog.dev.ConsoleRenderer()

    structlog.configure(
        processors=[
            *shared_processors,
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    formatter = structlog.stdlib.ProcessorFormatter(
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            renderer,
        ],
    )

    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(str(settings.LOG_LEVEL).upper())

def get_logger(name: str | None = None) -> structlog.stdlib.BoundLogger:
    """Get a named logger with structlog bindings."""
    return structlog.get_logger(name)
