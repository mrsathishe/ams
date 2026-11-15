from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field

class PaymentBase(BaseModel):
    user_id: str
    expense_id: str
    amount: float
    payment_date: datetime
    payment_method: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
