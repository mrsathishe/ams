from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGODB_URL, DATABASE_NAME

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def connect_to_mongo():
    """Create database connection"""
    db.client = AsyncIOMotorClient(MONGODB_URL)
    db.database = db.client[DATABASE_NAME]
    print(f"Connected to MongoDB database: {DATABASE_NAME}")

async def close_mongo_connection():
    """Close database connection"""
    db.client.close()
    print("Disconnected from MongoDB")

def get_database():
    return db.database
