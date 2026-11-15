from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_admin_user, get_current_active_user
from app.models import Payment, PaymentCreate, User
from app.services.payment_service import list_user_payments, record_payment

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("", response_model=Payment)
async def create_payment(
    payment: PaymentCreate,
    current_user: User = Depends(get_admin_user),
):
    return await record_payment(payment)

@router.get("/user/{user_id}", response_model=List[Payment])
async def get_user_payments(
    user_id: str,
    current_user: User = Depends(get_current_active_user),
):
    if current_user.role != "admin" and str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return await list_user_payments(user_id)
