from datetime import datetime, timezone
from fastapi import HTTPException, status
from jose import jwt as jose_jwt
from app.core.database import get_database
from app.core.security import get_password_hash
from app.models import UserCreate, User

async def register_new_user(user_data: UserCreate) -> User:
    db = get_database()
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user_dict = user_data.model_dump()
    user_dict["password"] = get_password_hash(user_data.password)
    user_dict["created_at"] = datetime.now(timezone.utc)

    result = await db.users.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    return User(**user_dict)

async def process_external_token(token: str) -> User:
    payload = jose_jwt.get_unverified_claims(token)
    username = payload.get("username") or payload.get("email") or payload.get("preferred_username")
    email = payload.get("email") or username
    role = payload.get("role", "user")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token: missing user email",
        )

    db = get_database()
    existing_user = await db.users.find_one({"email": email})
    now = datetime.now(timezone.utc)

    if existing_user:
        update_data = {
            "email": email,
            "name": username or email,
            "role": role,
            "is_active": True,
            "updated_at": now,
        }
        await db.users.update_one({"email": email}, {"$set": update_data})
        existing_user.update(update_data)
        existing_user["id"] = str(existing_user["_id"])
        return User(**existing_user)

    new_user_data = {
        "email": email,
        "name": username or email,
        "role": role,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.users.insert_one(new_user_data)
    new_user_data["id"] = str(result.inserted_id)
    return User(**new_user_data)
