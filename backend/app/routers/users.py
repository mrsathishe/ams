from fastapi import APIRouter, Depends
from app.dependencies import get_current_active_user
from app.models import User
from app.services.user_service import get_user_profile

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return await get_user_profile(current_user.id)
