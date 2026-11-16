from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException

from app.core.database import get_database
from app.models.membership import Membership
from app.models.user import User
from app.services.user_service import get_membership_approver_info


async def approve_membership(membership_id: str, approver: User) -> Membership:
    if not ObjectId.is_valid(membership_id):
        raise HTTPException(status_code=400, detail="Invalid membership ID")

    db = get_database()
    membership = await db.memberships.find_one({"_id": ObjectId(membership_id)})
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")
    if membership["status"] != "pending":
        raise HTTPException(status_code=409, detail="Membership is not pending")
    if str(membership["user_id"]) == approver.id:
        raise HTTPException(status_code=403, detail="You cannot approve your own membership")

    if not approver.is_super_admin:
        flat = await db.flats.find_one({"_id": ObjectId(membership["flat_id"])})
        if not flat:
            raise HTTPException(status_code=404, detail="Flat not found")
        eligible = await db.memberships.find_one(
            {
                "user_id": approver.id,
                "flat_id": membership["flat_id"],
                "status": "approved",
                "relationship": {"$in": eligible_relationships(membership, flat)},
            }
        )
        if not eligible:
            raise HTTPException(status_code=403, detail="Not eligible to approve this membership")

    await db.memberships.update_one(
        {"_id": membership["_id"], "status": "pending"},
        {
            "$set": {
                "status": "approved",
                "approved_by": approver.id,
                "approved_at": datetime.now(timezone.utc),
            }
        },
    )
    apartment = await db.apartments.find_one({"_id": ObjectId(membership["apartment_id"])})
    if apartment and apartment.get("status") == "pending" and approver.is_super_admin:
        await db.apartments.update_one(
            {"_id": apartment["_id"]}, {"$set": {"status": "active"}}
        )
    membership["id"] = str(membership.pop("_id"))
    membership["user_id"] = str(membership["user_id"])
    membership["apartment_id"] = str(membership["apartment_id"])
    membership["flat_id"] = str(membership["flat_id"])
    membership["status"] = "approved"
    return Membership(**membership)


def eligible_relationships(membership: dict, flat: dict) -> list[str]:
    if membership["relationship"] == "Owner":
        return ["Owner"]
    policy = flat.get("tenant_membership_approval", "owner")
    if policy == "tenant":
        return ["Tenant", "Rental"]
    if policy == "owner_or_tenant":
        return ["Owner", "Tenant", "Rental"]
    return ["Owner"]


async def pending_memberships_for_user(user: User) -> list[dict]:
    db = get_database()
    if user.is_super_admin:
        pending = await db.memberships.find({"status": "pending"}).to_list(length=None)
    else:
        approved = await db.memberships.find(
            {"user_id": user.id, "status": "approved"}
        ).to_list(length=None)
        eligible_flat_ids = set()
        for membership in approved:
            flat = await db.flats.find_one({"_id": ObjectId(membership["flat_id"])})
            if not flat:
                continue
            if membership["relationship"] == "Owner":
                eligible_flat_ids.add(membership["flat_id"])
            elif flat.get("tenant_membership_approval") in {"tenant", "owner_or_tenant"}:
                eligible_flat_ids.add(membership["flat_id"])
        pending = await db.memberships.find(
            {"status": "pending", "flat_id": {"$in": list(eligible_flat_ids)}}
        ).to_list(length=None)

    result = []
    for membership in pending:
        if membership["user_id"] == user.id:
            continue
        flat = await db.flats.find_one({"_id": ObjectId(membership["flat_id"])})
        if not flat or not user.is_super_admin:
            eligible = await db.memberships.find_one(
                {
                    "user_id": user.id,
                    "flat_id": membership["flat_id"],
                    "status": "approved",
                    "relationship": {"$in": eligible_relationships(membership, flat or {})},
                }
            )
            if not eligible:
                continue
        target = await db.users.find_one({"_id": ObjectId(membership["user_id"])})
        apartment = await db.apartments.find_one({"_id": ObjectId(membership["apartment_id"])})
        result.append(
            {
                "id": str(membership["_id"]),
                "name": target.get("name") if target else "",
                "relationship": membership["relationship"],
                "apartment_id": membership["apartment_id"],
                "flat_id": membership["flat_id"],
                "flat_name": flat.get("name") if flat else "",
                "apartment_name": (apartment or {}).get("name") or "Apartment",
                "type": "membership",
            }
        )
    return result


async def list_approval_items(user: User) -> list[dict]:
    db = get_database()
    items = await pending_memberships_for_user(user)
    if user.is_super_admin:
        apartment_filter = {}
    elif user.active_apartment_id:
        apartment_filter = {"apartment_id": user.active_apartment_id}
    else:
        apartment_filter = {"apartment_id": None}
    if not user.is_super_admin and user.active_apartment_id:
        items = [item for item in items if item["apartment_id"] == user.active_apartment_id]

    apartment_requests = await db.approval_requests.find(
        {**apartment_filter, "type": "apartment_change", "status": "pending"}
    ).to_list(length=None)
    for request in apartment_requests:
        if request["requested_by"] == user.id:
            continue
        if not user.is_super_admin:
            owner = await db.memberships.find_one(
                {
                    "user_id": user.id,
                    "apartment_id": request["apartment_id"],
                    "relationship": "Owner",
                    "status": "approved",
                }
            )
            if not owner:
                continue
        apartment = await db.apartments.find_one({"_id": ObjectId(request["apartment_id"])})
        requester = await db.users.find_one({"_id": ObjectId(request["requested_by"])})
        items.append(
            {
                "id": str(request["_id"]),
                "type": "apartment_change",
                "apartment_id": request["apartment_id"],
                "apartment_name": (apartment or {}).get("name") or "Apartment",
                "name": (requester or {}).get("name", "Owner"),
                "relationship": "Owner",
                "changes": request["changes"],
                "approved_count": len(request.get("approved_by", [])),
                "required_approvals": request["required_approvals"],
            }
        )

    eb_requests = await db.approval_requests.find(
        {
            **apartment_filter,
            "type": {"$in": ["eb_bill_create", "eb_bill_update"]},
            "status": "pending",
        }
    ).to_list(length=None)
    for request in eb_requests:
        if request["requested_by"] == user.id:
            continue
        if not user.is_super_admin:
            owner_query = {
                "user_id": user.id,
                "apartment_id": request["apartment_id"],
                "relationship": "Owner",
                "status": "approved",
            }
            if request.get("flat_id"):
                owner_query["flat_id"] = request["flat_id"]
            if not await db.memberships.find_one(owner_query):
                continue
        account = await db.eb_accounts.find_one({"_id": ObjectId(request["account_id"])})
        requester = await db.users.find_one({"_id": ObjectId(request["requested_by"])})
        items.append(
            {
                "id": str(request["_id"]),
                "type": request["type"],
                "apartment_id": request["apartment_id"],
                "apartment_name": (account or {}).get("name", "EB account"),
                "name": (requester or {}).get("name", "Member"),
                "relationship": "Owner",
                "changes": request["changes"],
                "approved_count": len(request.get("approved_by", [])),
                "required_approvals": request["required_approvals"],
            }
        )
    return items


async def update_membership_permissions(
    membership_id: str,
    updates: dict[str, bool],
    requester: User,
) -> dict:
    if not ObjectId.is_valid(membership_id):
        raise HTTPException(status_code=400, detail="Invalid membership ID")
    if not updates:
        raise HTTPException(status_code=400, detail="No permissions supplied")

    db = get_database()
    target = await db.memberships.find_one({"_id": ObjectId(membership_id)})
    if not target:
        raise HTTPException(status_code=404, detail="Membership not found")
    if target["status"] != "approved":
        raise HTTPException(status_code=409, detail="Membership is not approved")

    if not requester.is_super_admin:
        requester_membership = await db.memberships.find_one(
            {
                "user_id": requester.id,
                "flat_id": target["flat_id"],
                "relationship": "Owner",
                "status": "approved",
            }
        )
        if not requester_membership:
            raise HTTPException(status_code=403, detail="Only a same-flat Owner can grant permissions")
        if target["relationship"] not in {"Tenant", "Rental"}:
            raise HTTPException(status_code=403, detail="Owners cannot change another Owner's permissions")
        if "can_manage_apartment" in updates:
            raise HTTPException(status_code=403, detail="Only a Super Admin can grant apartment management")

    allowed_fields = {
        "can_view_common_eb",
        "can_view_individual_eb",
        "can_add_eb",
        "can_manage_apartment",
    }
    if set(updates) - allowed_fields:
        raise HTTPException(status_code=400, detail="Unsupported permission field")

    fields = {f"permissions.{name}": value for name, value in updates.items()}
    await db.memberships.update_one({"_id": target["_id"]}, {"$set": fields})
    target.setdefault("permissions", {}).update(updates)
    target["id"] = str(target.pop("_id"))
    target["user_id"] = str(target["user_id"])
    target["apartment_id"] = str(target["apartment_id"])
    target["flat_id"] = str(target["flat_id"])
    return target