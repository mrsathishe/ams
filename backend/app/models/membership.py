from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

Relationship = Literal["Owner", "Tenant", "Rental"]


class RegistrationRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=100)
    phone_number: str = Field(
        min_length=7,
        max_length=20,
        pattern=r"^\+?[0-9][0-9\s()-]{5,18}[0-9]$|^\+?[0-9]{7,15}$",
    )
    password: str = Field(min_length=8, max_length=72)
    relationship: Literal["Owner", "Rental"]
    community_id: str
    building_id: str
    flat_number: str = Field(min_length=1, max_length=80)


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
    relationship: Relationship
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
    relationship: Relationship
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
    relationship: Relationship
    status: Literal["pending", "approved", "rejected"]
    permissions: MembershipPermissions = Field(default_factory=MembershipPermissions)
