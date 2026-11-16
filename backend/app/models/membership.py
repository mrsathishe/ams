from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, model_validator


class RegistrationRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=72)
    relationship: Literal["Owner", "Tenant"]
    apartment_id: str | None = None
    apartment_name: str | None = Field(default=None, max_length=120)
    total_flat_count: int | None = Field(default=None, ge=1, le=500)
    flat_id: str | None = None
    flat_name: str | None = Field(default=None, max_length=80)

    @model_validator(mode="after")
    def validate_apartment_and_flat(self):
        if self.apartment_id:
            if self.total_flat_count is not None:
                raise ValueError("total_flat_count is only for a new apartment")
            if self.flat_id and self.flat_name:
                raise ValueError("Choose an existing flat or enter a new flat name")
            if not self.flat_id and not self.flat_name:
                raise ValueError("Select a flat or enter a new flat name")
        else:
            if self.flat_id:
                raise ValueError("flat_id requires an existing apartment")
            if self.total_flat_count is None:
                raise ValueError("total_flat_count is required for a new apartment")
            if not self.flat_name:
                raise ValueError("flat_name is required for a new apartment")
        return self


class MembershipPermissions(BaseModel):
    can_view_common_eb: bool = True
    can_view_individual_eb: bool = False
    can_add_eb: bool = False
    can_manage_apartment: bool = False


class MembershipSummary(BaseModel):
    id: str
    apartment_id: str
    apartment_name: str
    flat_id: str
    flat_name: str
    relationship: Literal["Owner", "Tenant"]
    status: Literal["pending", "approved", "rejected"]
    permissions: MembershipPermissions = Field(default_factory=MembershipPermissions)
    approval_required_by: str = "Owner"
    eligible_approver_names: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Membership(BaseModel):
    id: str
    user_id: str
    apartment_id: str
    flat_id: str
    relationship: Literal["Owner", "Tenant"]
    status: Literal["pending", "approved", "rejected"] = "pending"
    permissions: MembershipPermissions = Field(default_factory=MembershipPermissions)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MembershipPermissionUpdate(BaseModel):
    can_view_common_eb: bool | None = None
    can_view_individual_eb: bool | None = None
    can_add_eb: bool | None = None
    can_manage_apartment: bool | None = None


class MembershipView(BaseModel):
    id: str
    user_id: str
    name: str
    email: str
    apartment_id: str
    flat_id: str
    flat_name: str
    relationship: Literal["Owner", "Tenant"]
    status: Literal["pending", "approved", "rejected"]
    permissions: MembershipPermissions = Field(default_factory=MembershipPermissions)