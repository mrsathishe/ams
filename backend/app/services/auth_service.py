from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from app.core.database import get_database
from app.core.security import get_password_hash
from app.models import User
from app.models.membership import RegistrationRequest
from app.services.user_service import get_user_profile


async def register_new_user(user_data: RegistrationRequest) -> User:
    db = get_database()
    email = str(user_data.email).strip().lower()
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    if not ObjectId.is_valid(user_data.community_id):
        raise HTTPException(status_code=400, detail="Invalid community ID")
    if not ObjectId.is_valid(user_data.building_id):
        raise HTTPException(status_code=400, detail="Invalid building ID")

    community = await db.apartments.find_one(
        {"_id": ObjectId(user_data.community_id), "status": "active"}
    )
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    building = await db.buildings.find_one(
        {
            "_id": ObjectId(user_data.building_id),
            "community_id": user_data.community_id,
        }
    )
    if not building:
        raise HTTPException(
            status_code=404, detail="Building not found in this community"
        )

    flat_number = user_data.flat_number.strip()
    if not flat_number:
        raise HTTPException(status_code=422, detail="Flat or unit name is required")

    try:
        user_result = await db.users.insert_one(
            {
                "email": email,
                "name": user_data.name.strip(),
                "phone_number": user_data.phone_number.strip(),
                "password": get_password_hash(user_data.password),
                "is_active": True,
                "is_super_admin": False,
                "created_at": datetime.now(timezone.utc),
            }
        )
    except DuplicateKeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        ) from exc
    user_id = str(user_result.inserted_id)
    created_flat_id = None
    reserved_building_slot = False
    community_count_incremented = False

    try:
        flat = await db.flats.find_one(
            {"building_id": user_data.building_id, "name": flat_number}
        )
        if not flat:
            reservation = await db.buildings.update_one(
                {
                    "_id": building["_id"],
                    "$expr": {"$lt": ["$flat_count", "$total_flat_count"]},
                },
                {"$inc": {"flat_count": 1}},
            )
            if reservation.modified_count != 1:
                flat = await db.flats.find_one(
                    {"building_id": user_data.building_id, "name": flat_number}
                )
                if not flat:
                    raise HTTPException(
                        status_code=409,
                        detail="This building has reached its configured unit limit",
                    )
            else:
                reserved_building_slot = True
                try:
                    flat_result = await db.flats.insert_one(
                        {
                            "apartment_id": user_data.community_id,
                            "building_id": user_data.building_id,
                            "name": flat_number,
                            "individual_eb_enabled": False,
                            "tenant_membership_approval": "owner",
                            "created_at": datetime.now(timezone.utc),
                        }
                    )
                    created_flat_id = flat_result.inserted_id
                    flat = {"_id": created_flat_id}
                    await db.apartments.update_one(
                        {"_id": community["_id"]}, {"$inc": {"flat_count": 1}}
                    )
                    community_count_incremented = True
                except DuplicateKeyError:
                    await db.buildings.update_one(
                        {"_id": building["_id"]}, {"$inc": {"flat_count": -1}}
                    )
                    reserved_building_slot = False
                    flat = await db.flats.find_one(
                        {"building_id": user_data.building_id, "name": flat_number}
                    )
                    if not flat:
                        raise HTTPException(
                            status_code=409,
                            detail="This flat or unit could not be registered",
                        )

        await db.memberships.insert_one(
            {
                "user_id": user_id,
                "apartment_id": user_data.community_id,
                "community_id": user_data.community_id,
                "flat_id": str(flat["_id"]),
                "building_id": user_data.building_id,
                "flat_number": flat_number,
                "relationship": user_data.relationship,
                "status": "pending",
                "permissions": {
                    "can_view_common_eb": True,
                    "can_view_individual_eb": user_data.relationship == "Owner",
                    "can_add_eb": False,
                    "can_manage_apartment": False,
                },
                "created_at": datetime.now(timezone.utc),
            }
        )
    except Exception:
        await db.memberships.delete_many({"user_id": user_id})
        if created_flat_id:
            await db.flats.delete_one({"_id": created_flat_id})
        if reserved_building_slot:
            await db.buildings.update_one(
                {"_id": building["_id"]}, {"$inc": {"flat_count": -1}}
            )
        if community_count_incremented:
            await db.apartments.update_one(
                {"_id": community["_id"]}, {"$inc": {"flat_count": -1}}
            )
        await db.users.delete_one({"_id": user_result.inserted_id})
        raise

    user = await get_user_profile(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load account",
        )
    return user


async def change_password(email: str, new_password: str) -> tuple[bool, str]:
    db = get_database()
    email = str(email).strip().lower()

    user = await db.users.find_one({"email": email})
    if not user:
        return False, "User not found with this email address"

    hashed_password = get_password_hash(new_password)
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_password, "updated_at": datetime.now(timezone.utc)}},
    )
    return True, "Password changed successfully"
