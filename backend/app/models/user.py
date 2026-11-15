from datetime import datetime, timezone
from pydantic import BaseModel, Field

class UserBase(BaseModel):
    email: str
    name: str
    role: str = "user"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
