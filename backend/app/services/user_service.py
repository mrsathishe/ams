from app.core.database import get_database

from app.models import User


async def get_user_by_email(email: str) -> User | None:
    db = get_database()
    user = await db.users.find_one({"email": email})
    if user:
        user["id"] = str(user["_id"])
        return User(**user)
    return None