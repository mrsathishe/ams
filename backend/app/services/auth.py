from app.core.database import get_database
from app.core.security import verify_password
from app.services.user_service import get_user_by_email

async def authenticate_user(email: str, password: str):
    normalized_email = email.strip().lower()
    user = await get_user_by_email(normalized_email)
    if not user:
        return False
    if not user.is_active:
        return False

    db = get_database()
    user_data = await db.users.find_one({"email": normalized_email})
    if not user_data or not verify_password(password, user_data["password"]):
        return False
    return user