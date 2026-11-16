import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("MONGODB_DB_NAME", "kootukudil")

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# CORS Configuration
ALLOWED_ORIGINS = [
	origin.strip()
	for origin in os.getenv("CORS_ORIGINS", "http://localhost:3001").split(",")
	if origin.strip()
]

# File Upload Configuration
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def validate_settings() -> None:
	if not MONGODB_URL:
		raise RuntimeError("MONGODB_URL must be configured")
	if not SECRET_KEY or len(SECRET_KEY.encode("utf-8")) < 32:
		raise RuntimeError("JWT_SECRET_KEY must contain at least 32 bytes")
	if ACCESS_TOKEN_EXPIRE_MINUTES < 1:
		raise RuntimeError("JWT_ACCESS_TOKEN_EXPIRE_MINUTES must be positive")
	if not ALLOWED_ORIGINS:
		raise RuntimeError("CORS_ORIGINS must contain at least one origin")
