from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class CommunityCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class CommunityUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class Community(BaseModel):
    id: str
    name: str
    status: Literal["pending", "active", "suspended"]
    total_building_count: int
    total_flat_count: int
    created_at: datetime


class BuildingCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    total_flat_count: int = Field(ge=1, le=5000)


class BuildingUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    total_flat_count: int | None = Field(default=None, ge=1, le=5000)


class Building(BaseModel):
    id: str
    community_id: str
    name: str
    total_flat_count: int
    flat_count: int
    created_at: datetime
