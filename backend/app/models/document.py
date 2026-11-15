from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field

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
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    uploaded_by: str = ""
