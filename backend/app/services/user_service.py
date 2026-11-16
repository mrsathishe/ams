from bson import ObjectId

from app.core.database import get_database
from app.models import User
from app.models.membership import MembershipSummary


async def get_user_by_email(email: str) -> User | None:
    db = get_database()
    user = await db.users.find_one({"email": email})
    if user:
        return await get_user_profile(str(user["_id"]))
    return None


async def get_user_profile(user_id: str) -> User | None:
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return None

    memberships = await db.memberships.find({"user_id": user_id}).to_list(length=None)
    summaries = []
    for membership in memberships:
        apartment = await db.apartments.find_one({"_id": ObjectId(membership["apartment_id"])})
        flat = await db.flats.find_one({"_id": ObjectId(membership["flat_id"])})
        if not apartment or not flat:
            continue

        approver_names = []
        approval_required_by = "Owner"
        if membership.get("status") == "pending":
            approval_required_by, approver_names = await get_membership_approver_info(
                membership, flat
            )

        summaries.append(
            MembershipSummary(
                id=str(membership["_id"]),
                apartment_id=str(apartment["_id"]),
                apartment_name=apartment.get("name") or f"Apartment {str(apartment['_id'])[-6:]}",
                flat_id=str(flat["_id"]),
                flat_name=flat["name"],
                relationship=membership["relationship"],
                status=membership["status"],
                permissions=membership.get("permissions", {}),
                approval_required_by=approval_required_by,
                eligible_approver_names=approver_names,
                created_at=membership["created_at"],
            )
        )

    user["id"] = str(user["_id"])
    user["memberships"] = summaries
    user["approval_status"] = (
        "approved"
        if user.get("is_super_admin")
        or any(membership.status == "approved" for membership in summaries)
        else "pending"
    )
    return User(**user)


async def get_membership_approver_info(membership: dict, flat: dict) -> tuple[str, list[str]]:
    db = get_database()
    relationship = membership["relationship"]
    policy = flat.get("tenant_membership_approval", "owner")
    if relationship == "Owner":
        relationships = ["Owner"]
        required_by = "Owner"
    elif policy == "tenant":
        relationships = ["Tenant", "Rental"]
        required_by = "Rental"
    elif policy == "owner_or_tenant":
        relationships = ["Owner", "Tenant", "Rental"]
        required_by = "Owner or Rental"
    else:
        relationships = ["Owner"]
        required_by = "Owner"

    eligible = await db.memberships.find(
        {
            "flat_id": membership["flat_id"],
            "status": "approved",
            "relationship": {"$in": relationships},
            "user_id": {"$ne": membership["user_id"]},
        }
    ).to_list(length=None)
    names = []
    for record in eligible:
        user = await db.users.find_one({"_id": ObjectId(record["user_id"])})
        if user and user.get("name"):
            names.append(user["name"])
    return required_by, sorted(set(names))