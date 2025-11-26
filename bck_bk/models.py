from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# User Models
class UserBase(BaseModel):
    email: str
    name: str
    role: str = "user"  # "admin" or "user"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Expense Models
class ExpenseBase(BaseModel):
    amount: float
    month: int
    year: int
    expense_type: str = "EB"  # Electricity Bill, etc.
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: str = ""

# Payment Models
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
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Document Models
class DocumentBase(BaseModel):
    title: str
    filename: str
    file_path: str
    file_type: str
    expense_id: Optional[str] = None
    month: Optional[int] = None
    year: Optional[int] = None

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: str = ""
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    uploaded_by: str = ""

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Response Models
class ExpenseWithPayments(Expense):
    payments: List[Payment] = []
    total_paid: float = 0
    remaining_amount: float = 0

class UserPaymentStatus(BaseModel):
    user: User
    payments: List[Payment] = []
    total_paid: float = 0
    pending_amount: float = 0
