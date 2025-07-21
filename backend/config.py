import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGODB_URL = "mongodb+srv://sathish:Theheros%4009@user.wl4j0pk.mongodb.net/"
DATABASE_NAME = "ams"

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CORS Configuration
FRONTEND_URL = "http://localhost:3001"

# File Upload Configuration
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
