from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError, OperationFailure
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
    await db.database.buildings.create_index(
        [("community_id", 1), ("name", 1)], unique=True
    )
    await migrate_community_hierarchy()
    await db.database.users.create_index("email", unique=True)
    flat_indexes = await db.database.flats.list_indexes().to_list(length=None)
    for index in flat_indexes:
        if index.get("name") == "apartment_id_1_name_1":
            try:
                await db.database.flats.drop_index(index["name"])
            except OperationFailure as exc:
                if exc.code != 27:
                    raise
    await db.database.flats.create_index(
        [("building_id", 1), ("name", 1)],
        unique=True,
        partialFilterExpression={"building_id": {"$type": "string"}},
    )
    await db.database.memberships.create_index([("user_id", 1), ("apartment_id", 1)], unique=True)
    await db.database.eb_accounts.create_index(
        [("apartment_id", 1), ("account_type", 1), ("flat_id", 1)], unique=True
    )
    await db.database.eb_bills.create_index(
        [("account_id", 1), ("period_start", 1), ("period_end", 1)], unique=True
    )
    await db.database.eb_payments.create_index("bill_id")
    
    print("Connected to MongoDB")


async def migrate_community_hierarchy():
    """Assign existing apartments and flats a compatible community/building hierarchy."""
    communities = await db.database.apartments.find({}).to_list(length=None)
    for community in communities:
        if community.get("hierarchy_version") == 2:
            continue

        community_id = str(community["_id"])
        buildings = await db.database.buildings.find(
            {"community_id": community_id}
        ).to_list(length=None)
        flats = await db.database.flats.find(
            {"apartment_id": community_id}
        ).to_list(length=None)
        if not buildings:
            try:
                building_result = await db.database.buildings.insert_one(
                    {
                        "community_id": community_id,
                        "name": "Main Building",
                        "total_flat_count": max(
                            int(community.get("total_flat_count", 1)), len(flats), 1
                        ),
                        "flat_count": len(flats),
                        "created_at": community.get(
                            "created_at", datetime.now(timezone.utc)
                        ),
                    }
                )
                buildings = [{"_id": building_result.inserted_id}]
            except DuplicateKeyError:
                buildings = await db.database.buildings.find(
                    {"community_id": community_id}
                ).to_list(length=None)

        default_building_id = str(buildings[0]["_id"])
        await db.database.flats.update_many(
            {
                "apartment_id": community_id,
                "$or": [
                    {"building_id": {"$exists": False}},
                    {"building_id": None},
                ],
            },
            {"$set": {"building_id": default_building_id}},
        )
        for building in buildings:
            building_id = str(building["_id"])
            flat_count = await db.database.flats.count_documents(
                {"building_id": building_id}
            )
            await db.database.buildings.update_one(
                {"_id": building["_id"]},
                {
                    "$set": {
                        "flat_count": flat_count,
                        "total_flat_count": max(
                            int(building.get("total_flat_count", 1)), flat_count, 1
                        ),
                    }
                },
            )

        flat_count = await db.database.flats.count_documents(
            {"apartment_id": community_id}
        )
        await db.database.apartments.update_one(
            {"_id": community["_id"]},
            {
                "$set": {
                    "hierarchy_version": 2,
                    "flat_count": flat_count,
                    "total_flat_count": max(
                        int(community.get("total_flat_count", 1)), flat_count, 1
                    ),
                }
            },
        )


async def close_mongo_connection():
    """Close database connection"""
    db.client.close()
    print("Disconnected from MongoDB")

def get_database():
    return db.database
