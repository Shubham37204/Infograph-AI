from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.pipeline import router

app = FastAPI(title="infograph-ai")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
