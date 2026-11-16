from datetime import datetime, timezone
from fastapi import HTTPException, status
from bson import ObjectId
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

    apartment = None
    flat = None
    if user_data.apartment_id:
        if not ObjectId.is_valid(user_data.apartment_id):
            raise HTTPException(status_code=400, detail="Invalid apartment ID")
        apartment = await db.apartments.find_one(
            {"_id": ObjectId(user_data.apartment_id), "status": "active"}
        )
        if not apartment:
            raise HTTPException(status_code=404, detail="Apartment not found")
        if user_data.flat_id:
            if not ObjectId.is_valid(user_data.flat_id):
                raise HTTPException(status_code=400, detail="Invalid flat ID")
            flat = await db.flats.find_one(
                {
                    "_id": ObjectId(user_data.flat_id),
                    "apartment_id": str(apartment["_id"]),
                }
            )
            if not flat:
                raise HTTPException(status_code=404, detail="Flat not found in this apartment")
    else:
        apartment = {
            "name": user_data.apartment_name.strip() if user_data.apartment_name else None,
            "total_flat_count": user_data.total_flat_count,
            "flat_count": 0,
            "status": "pending",
            "created_at": datetime.now(timezone.utc),
        }

    user_data_doc = {
        "email": email,
        "name": user_data.name.strip(),
        "password": get_password_hash(user_data.password),
        "is_active": True,
        "is_super_admin": False,
        "created_at": datetime.now(timezone.utc),
    }
    user_result = await db.users.insert_one(user_data_doc)
    user_id = str(user_result.inserted_id)
    created_apartment_id = None
    created_flat_id = None
    reserved_flat_slot = False

    try:
        if user_data.apartment_id is None:
            apartment["created_by"] = user_id
            apartment_result = await db.apartments.insert_one(apartment)
            apartment_id = str(apartment_result.inserted_id)
            created_apartment_id = apartment_result.inserted_id
        else:
            apartment_id = str(apartment["_id"])

        if flat is None:
            reservation = await db.apartments.update_one(
                {
                    "_id": ObjectId(apartment_id),
                    "status": apartment.get("status", "active"),
                    "flat_count": {"$lt": apartment["total_flat_count"]},
                },
                {"$inc": {"flat_count": 1}},
            )
            if reservation.modified_count != 1:
                raise HTTPException(status_code=409, detail="Apartment has reached its flat limit")
            reserved_flat_slot = True
            flat_document = {
                "apartment_id": apartment_id,
                "name": user_data.flat_name.strip(),
                "individual_eb_enabled": False,
                "tenant_membership_approval": "owner",
                "created_at": datetime.now(timezone.utc),
            }
            flat_result = await db.flats.insert_one(flat_document)
            flat_id = str(flat_result.inserted_id)
            created_flat_id = flat_result.inserted_id
        else:
            flat_id = str(flat["_id"])

        await db.memberships.insert_one(
            {
                "user_id": user_id,
                "apartment_id": apartment_id,
                "flat_id": flat_id,
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
        if created_flat_id:
            await db.flats.delete_one({"_id": created_flat_id})
        if created_apartment_id:
            await db.apartments.delete_one({"_id": created_apartment_id})
        elif reserved_flat_slot:
            await db.apartments.update_one(
                {"_id": ObjectId(apartment_id)}, {"$inc": {"flat_count": -1}}
            )
        await db.users.delete_one({"_id": user_result.inserted_id})
        raise

    user = await get_user_profile(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unable to load account")
    return user
