from app.core.database import get_database
from app.core.security import verify_password
from app.services.user_service import get_user_by_email

async def authenticate_user(email: str, password: str):
    user = await get_user_by_email(email)
    if not user:
        print(f"Authentication failed: User with email {email} not found.")
        return False
    # Get the user from DB to access password
    db = get_database()
    user_data = await db.users.find_one({"email": email})
    if not user_data or not verify_password(password, user_data["password"]):
        print(f"Authentication failed: Invalid password for user {email}.")
        return False
    return user