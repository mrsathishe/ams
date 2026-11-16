from datetime import datetime, timezone
from typing import Literal
from pydantic import BaseModel, EmailStr, Field
from app.models.membership import MembershipSummary

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=100)

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)

class User(UserBase):
    id: str = ""
    is_active: bool = True
    is_super_admin: bool = False
    approval_status: Literal["pending", "approved"] = "pending"
    memberships: list[MembershipSummary] = Field(default_factory=list)
    active_apartment_id: str | None = Field(default=None, exclude=True)
    active_flat_id: str | None = Field(default=None, exclude=True)
    active_membership: dict = Field(default_factory=dict, exclude=True)
    active_memberships: list[dict] = Field(default_factory=list, exclude=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
