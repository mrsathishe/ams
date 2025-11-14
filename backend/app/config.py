import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

class Config:
    # Load from environment
    db_user = os.getenv("MONGODB_USER_NAME")
    db_pass = os.getenv("MONGODB_PASSWORD")
    base_uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("DB_NAME", "ams")

    # Replace placeholders in URI with actual username/password
    if base_uri and db_user and db_pass:
        mongo_uri = base_uri.replace("<db_user_name>", db_user).replace("<db_password>", db_pass).replace("<db_name>",db_name)
    else:
        mongo_uri = f"mongodb://localhost:27017/{db_name}"  # fallback for local dev

    MONGODB_SETTINGS = {
        # "db": db_name,
        "host": mongo_uri
    }

    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"
