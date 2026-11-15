import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import FRONTEND_URL, UPLOAD_DIR
from app.core.database import close_mongo_connection, connect_to_mongo
from app.routers import analytics, auth, debug, documents, expenses, payments, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="AMS API",
    description="Apartment Management System API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AMS API is running"}

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(expenses.router)
app.include_router(payments.router)
app.include_router(documents.router)
app.include_router(analytics.router)
app.include_router(debug.router)
