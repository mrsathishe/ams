from typing import Optional
from fastapi import APIRouter, Depends
from app.dependencies import get_current_active_user
from app.models import User
from app.services.analytics_service import calculate_yearly_expense_analytics

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/expenses")
async def get_expense_analytics(
    year: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
):
    return await calculate_yearly_expense_analytics(year)
