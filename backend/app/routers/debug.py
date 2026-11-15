from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.database import get_database

router = APIRouter(prefix="/debug", tags=["Debug"])

@router.get("/db-status")
async def check_db_status():
    try:
        db = get_database()
        collections = await db.list_collection_names()
        counts = {name: await db[name].count_documents({}) for name in collections}
        return {
            "database_connected": True,
            "collections": collections,
            "collection_counts": counts,
        }
    except Exception as e:
        return {"database_connected": False, "error": str(e)}


@app.post("/debug/init-db")
async def initialize_database():
    """Initialize database with sample data"""
    try:
        db = get_database()
        
        # Check if users exist
        users_count = await db.users.count_documents({})
        created_users = 0
        
        if users_count == 0:
            sample_users = [
                {
                    "email": "admin@ams.com",
                    "name": "AMS Admin",
                    "role": "admin",
                    "is_active": True,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                },
                {
                    "email": "user1@ams.com", 
                    "name": "User One",
                    "role": "user",
                    "is_active": True,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                },
                {
                    "email": "test@example.com",
                    "name": "Test User", 
                    "role": "user",
                    "is_active": True,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            ]
            
            result = await db.users.insert_many(sample_users)
            created_users = len(result.inserted_ids)
        
        # Check if expenses exist
        expenses_count = await db.expenses.count_documents({})
        created_expenses = 0
        
        if expenses_count == 0:
            # Get admin user
            admin_user = await db.users.find_one({"email": "admin@ams.com"})
            if admin_user:
                sample_expenses = [
                    {
                        "amount": 1500.0,
                        "month": 7,
                        "year": 2025,
                        "expense_type": "EB",
                        "description": "July Electricity Bill",
                        "created_at": datetime.utcnow(),
                        "created_by": str(admin_user["_id"])
                    },
                    {
                        "amount": 2200.0,
                        "month": 7,
                        "year": 2025, 
                        "expense_type": "Maintenance",
                        "description": "Building Maintenance",
                        "created_at": datetime.utcnow(),
                        "created_by": str(admin_user["_id"])
                    }
                ]
                
                result = await db.expenses.insert_many(sample_expenses)
                created_expenses = len(result.inserted_ids)
        
        return {
            "success": True,
            "created_users": created_users,
            "created_expenses": created_expenses,
            "total_users": await db.users.count_documents({}),
            "total_expenses": await db.expenses.count_documents({})
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
