import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import ALLOWED_ORIGINS, UPLOAD_DIR, validate_settings
from app.core.database import close_mongo_connection, connect_to_mongo
from app.routers import approvals, apartments, auth, eb, memberships, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    validate_settings()
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="Kootukudil API",
    description="Kootukudil apartment management API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Kootukudil API is running"}

app.include_router(auth.router)
app.include_router(apartments.router)
app.include_router(approvals.router)
app.include_router(eb.router)
app.include_router(memberships.router)
app.include_router(users.router)
