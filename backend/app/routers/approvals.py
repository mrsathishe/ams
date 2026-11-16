from fastapi import APIRouter, Depends

from app.dependencies import get_approved_user
from app.models.user import User
from app.services.apartment_service import approve_apartment_change
from app.services.eb_service import approve_eb_change
from app.services.membership_service import (
    approve_membership,
    list_approval_items,
)

router = APIRouter(prefix="/approvals", tags=["Approvals"])


@router.get("/pending")
async def get_pending_approvals(current_user: User = Depends(get_approved_user)):
    return await list_approval_items(current_user)


@router.post("/{request_id}/approve")
async def approve_request(request_id: str, current_user: User = Depends(get_approved_user)):
    from app.core.database import get_database
    from bson import ObjectId

    db = get_database()
    if not ObjectId.is_valid(request_id):
        return await approve_membership(request_id, current_user)
    request = await db.approval_requests.find_one({"_id": ObjectId(request_id)})
    if request:
        if request["type"] == "apartment_change":
            return await approve_apartment_change(request_id, current_user)
        return await approve_eb_change(request_id, current_user)
    return await approve_membership(request_id, current_user)