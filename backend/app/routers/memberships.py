from fastapi import APIRouter, Depends

from app.dependencies import get_current_active_user
from app.models import MembershipPermissionUpdate, User
from app.services.membership_service import (
    approve_membership,
    pending_memberships_for_user,
    update_membership_permissions,
)

router = APIRouter(prefix="/memberships", tags=["Memberships"])


@router.get("/pending-approvals")
async def get_pending_membership_approvals(
    current_user: User = Depends(get_current_active_user),
):
    return await pending_memberships_for_user(current_user)


@router.post("/{membership_id}/approve")
async def approve_membership_request(
    membership_id: str,
    current_user: User = Depends(get_current_active_user),
):
    return await approve_membership(membership_id, current_user)


@router.patch("/{membership_id}/permissions")
async def update_membership_permission_set(
    membership_id: str,
    updates: MembershipPermissionUpdate,
    current_user: User = Depends(get_current_active_user),
):
    return await update_membership_permissions(
        membership_id,
        updates.model_dump(exclude_unset=True, exclude_none=True),
        current_user,
    )