from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class Apartment(BaseModel):
    id: str
    name: str | None = None
    total_flat_count: int = Field(ge=0)
    flat_count: int = 0
    status: Literal["pending", "active", "suspended"] = "pending"
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Flat(BaseModel):
    id: str
    apartment_id: str
    building_id: str | None = None
    name: str = Field(min_length=1, max_length=80)
    individual_eb_enabled: bool = False
    tenant_membership_approval: Literal["owner", "tenant", "owner_or_tenant"] = "owner"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RegistrationApartmentOption(BaseModel):
    id: str
    name: str
    total_flat_count: int
    flats: list[Flat] = Field(default_factory=list)


class ApartmentChange(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    total_flat_count: int | None = Field(default=None, ge=1, le=500)

    @model_validator(mode="after")
    def require_change(self):
        if self.name is None and self.total_flat_count is None:
            raise ValueError("At least one apartment field must be provided")
        return self


class ApartmentChangeRequest(BaseModel):
    id: str
    apartment_id: str
    requested_by: str
    changes: ApartmentChange
    required_approvals: int
    approved_by: list[str] = Field(default_factory=list)
    status: Literal["pending", "approved", "rejected"] = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FlatApprovalPolicyUpdate(BaseModel):
    tenant_membership_approval: Literal["owner", "tenant", "owner_or_tenant"]