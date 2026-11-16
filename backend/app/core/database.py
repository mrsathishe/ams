from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGODB_URL, DATABASE_NAME

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def connect_to_mongo():
    """Create database connection"""
    db.client = AsyncIOMotorClient(MONGODB_URL)
    db.database = db.client[DATABASE_NAME]

    await db.client.admin.command("ping")
    await db.database.users.create_index("email", unique=True)
    await db.database.flats.create_index([("apartment_id", 1), ("name", 1)], unique=True)
    await db.database.memberships.create_index([("user_id", 1), ("apartment_id", 1)], unique=True)
    await db.database.eb_accounts.create_index(
        [("apartment_id", 1), ("account_type", 1), ("flat_id", 1)], unique=True
    )
    await db.database.eb_bills.create_index(
        [("account_id", 1), ("period_start", 1), ("period_end", 1)], unique=True
    )
    await db.database.eb_payments.create_index("bill_id")
    
    print("Connected to MongoDB")

async def close_mongo_connection():
    """Close database connection"""
    db.client.close()
    print("Disconnected from MongoDB")

def get_database():
    return db.database
