from typing import List
from pydantic import BaseModel
from app.models.user import User
from app.models.payment import Payment

class UserPaymentStatus(BaseModel):
    user: User
    payments: List[Payment] = []
    total_paid: float = 0
    pending_amount: float = 0
