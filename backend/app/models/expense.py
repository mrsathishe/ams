from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.payment import Payment

class ExpenseBase(BaseModel):
    amount: float
    month: int
    year: int
    expense_type: str = "EB"
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str = ""

class ExpenseWithPayments(Expense):
    payments: List[Payment] = []
    total_paid: float = 0
    remaining_amount: float = 0
