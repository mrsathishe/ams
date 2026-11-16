from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException

from app.core.database import get_database
from app.models.apartment import (
    Apartment,
    ApartmentChange,
    ApartmentChangeRequest,
    FlatApprovalPolicyUpdate,
    Flat,
    RegistrationApartmentOption,
)
from app.models.user import User
from app.models.membership import MembershipView


async def get_registration_options() -> list[RegistrationApartmentOption]:
    db = get_database()
    apartments = await db.apartments.find({"status": "active"}).sort("name", 1).to_list(length=None)
    options = []
    for apartment in apartments:
        apartment_id = str(apartment["_id"])
        flat_documents = await db.flats.find({"apartment_id": apartment_id}).sort("name", 1).to_list(length=None)
        flats = []
        for flat in flat_documents:
            flat["id"] = str(flat.pop("_id"))
            flat["apartment_id"] = apartment_id
            flats.append(Flat(**flat))

        options.append(
            RegistrationApartmentOption(
                id=apartment_id,
                name=apartment.get("name") or f"Apartment {apartment_id[-6:]}",
                total_flat_count=apartment["total_flat_count"],
                flats=flats,
            )
        )
    return options


async def list_user_apartments(user: User) -> list[Apartment]:
    db = get_database()
    if user.is_super_admin:
        apartment_documents = await db.apartments.find({"status": "active"}).sort("name", 1).to_list(length=None)
    else:
        memberships = await db.memberships.find(
            {"user_id": user.id, "status": "approved"}
        ).to_list(length=None)
        apartment_ids = list({membership["apartment_id"] for membership in memberships})
        if not apartment_ids:
            return []
        apartment_documents = await db.apartments.find(
            {"_id": {"$in": [ObjectId(apartment_id) for apartment_id in apartment_ids]}, "status": "active"}
        ).sort("name", 1).to_list(length=None)

    result = []
    for apartment in apartment_documents:
        apartment["id"] = str(apartment.pop("_id"))
        apartment["status"] = apartment.get("status", "active")
        result.append(Apartment(**apartment))
    return result


async def request_apartment_change(
    apartment_id: str, changes: ApartmentChange, requester: User
) -> ApartmentChangeRequest:
    if not ObjectId.is_valid(apartment_id):
        raise HTTPException(status_code=400, detail="Invalid apartment ID")
    db = get_database()
    apartment = await db.apartments.find_one({"_id": ObjectId(apartment_id)})
    if not apartment:
        raise HTTPException(status_code=404, detail="Apartment not found")

    change_data = changes.model_dump(exclude_unset=True)
    if "total_flat_count" in change_data:
        flat_count = await db.flats.count_documents({"apartment_id": apartment_id})
        if change_data["total_flat_count"] < flat_count:
            raise HTTPException(status_code=400, detail="Flat count cannot be less than existing flats")

    if requester.is_super_admin:
        await db.apartments.update_one({"_id": apartment["_id"]}, {"$set": change_data})
        return ApartmentChangeRequest(
            id="",
            apartment_id=apartment_id,
            requested_by=requester.id,
            changes=changes,
            required_approvals=0,
            approved_by=[requester.id],
            status="approved",
        )

    owner_membership = await db.memberships.find_one(
        {
            "user_id": requester.id,
            "apartment_id": apartment_id,
            "relationship": "Owner",
            "status": "approved",
            "permissions.can_manage_apartment": True,
        }
    )
    if not owner_membership:
        raise HTTPException(status_code=403, detail="Not authorized to request apartment changes")

    owner_count = await db.memberships.count_documents(
        {"apartment_id": apartment_id, "relationship": "Owner", "status": "approved"}
    )
    required_approvals = 1 if owner_count == 2 else 2
    request_document = {
        "type": "apartment_change",
        "apartment_id": apartment_id,
        "requested_by": requester.id,
        "changes": change_data,
        "required_approvals": required_approvals,
        "approved_by": [],
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.approval_requests.insert_one(request_document)
    request_document["id"] = str(result.inserted_id)
    return ApartmentChangeRequest(**request_document)


async def approve_apartment_change(request_id: str, approver: User) -> ApartmentChangeRequest:
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid change request ID")
    db = get_database()
    request = await db.approval_requests.find_one({"_id": ObjectId(request_id)})
    if not request or request.get("type") != "apartment_change":
        raise HTTPException(status_code=404, detail="Apartment change request not found")
    if request["status"] != "pending":
        raise HTTPException(status_code=409, detail="Change request is not pending")
    if request["requested_by"] == approver.id:
        raise HTTPException(status_code=403, detail="You cannot approve your own change")

    if approver.is_super_admin:
        request["approved_by"] = list(set(request.get("approved_by", []) + [approver.id]))
        await db.apartments.update_one(
            {"_id": ObjectId(request["apartment_id"])}, {"$set": request["changes"]}
        )
        request["status"] = "approved"
    else:
        owner_membership = await db.memberships.find_one(
            {
                "user_id": approver.id,
                "apartment_id": request["apartment_id"],
                "relationship": "Owner",
                "status": "approved",
            }
        )
        if not owner_membership:
            raise HTTPException(status_code=403, detail="Only apartment Owners can approve this change")
        if approver.id in request.get("approved_by", []):
            raise HTTPException(status_code=409, detail="You have already approved this change")
        await db.approval_requests.update_one(
            {"_id": request["_id"], "status": "pending"},
            {"$addToSet": {"approved_by": approver.id}},
        )
        request = await db.approval_requests.find_one({"_id": request["_id"]})
        if len(request.get("approved_by", [])) >= request["required_approvals"]:
            await db.apartments.update_one(
                {"_id": ObjectId(request["apartment_id"])}, {"$set": request["changes"]}
            )
            request["status"] = "approved"

    if request["status"] == "approved":
        await db.approval_requests.update_one(
            {"_id": request["_id"]}, {"$set": {"status": "approved"}}
        )
    request["id"] = str(request.pop("_id"))
    return ApartmentChangeRequest(**request)


async def list_apartment_change_requests(apartment_id: str, requester: User) -> list[ApartmentChangeRequest]:
    if not ObjectId.is_valid(apartment_id):
        raise HTTPException(status_code=400, detail="Invalid apartment ID")
    db = get_database()
    if not requester.is_super_admin:
        owner = await db.memberships.find_one(
            {
                "user_id": requester.id,
                "apartment_id": apartment_id,
                "relationship": "Owner",
                "status": "approved",
                "permissions.can_manage_apartment": True,
            }
        )
        if not owner:
            raise HTTPException(status_code=403, detail="Not authorized to view apartment changes")

    requests = await db.approval_requests.find(
        {"type": "apartment_change", "apartment_id": apartment_id}
    ).sort("created_at", -1).to_list(length=None)
    result = []
    for request in requests:
        request["id"] = str(request.pop("_id"))
        result.append(ApartmentChangeRequest(**request))
    return result


async def set_flat_membership_approval_policy(
    flat_id: str, update: FlatApprovalPolicyUpdate, requester: User
) -> dict:
    if not ObjectId.is_valid(flat_id):
        raise HTTPException(status_code=400, detail="Invalid flat ID")
    db = get_database()
    flat = await db.flats.find_one(
        {"_id": ObjectId(flat_id), "apartment_id": requester.active_apartment_id}
    )
    if not flat:
        raise HTTPException(status_code=404, detail="Flat not found")
    if not requester.is_super_admin:
        owner = await db.memberships.find_one(
            {
                "user_id": requester.id,
                "flat_id": flat_id,
                "relationship": "Owner",
                "status": "approved",
            }
        )
        if not owner:
            raise HTTPException(status_code=403, detail="Only a same-flat Owner can update this policy")
    await db.flats.update_one(
        {"_id": ObjectId(flat_id)},
        {"$set": {"tenant_membership_approval": update.tenant_membership_approval}},
    )
    return {"flat_id": flat_id, "tenant_membership_approval": update.tenant_membership_approval}


async def list_apartment_flats(apartment_id: str, user: User) -> list[Flat]:
    if not ObjectId.is_valid(apartment_id):
        raise HTTPException(status_code=400, detail="Invalid apartment ID")
    if not user.is_super_admin and user.active_apartment_id != apartment_id:
        raise HTTPException(status_code=403, detail="Apartment is outside the active scope")
    db = get_database()
    flat_documents = await db.flats.find({"apartment_id": apartment_id}).sort("name", 1).to_list(length=None)
    result = []
    for flat in flat_documents:
        flat["id"] = str(flat.pop("_id"))
        flat["apartment_id"] = apartment_id
        result.append(Flat(**flat))
    return result


async def list_apartment_memberships(apartment_id: str, user: User) -> list[MembershipView]:
    if not ObjectId.is_valid(apartment_id):
        raise HTTPException(status_code=400, detail="Invalid apartment ID")
    db = get_database()
    if not user.is_super_admin:
        if user.active_apartment_id != apartment_id:
            raise HTTPException(status_code=403, detail="Apartment is outside the active scope")
        owner = await db.memberships.find_one(
            {
                "user_id": user.id,
                "apartment_id": apartment_id,
                "relationship": "Owner",
                "status": "approved",
            }
        )
        if not owner:
            raise HTTPException(status_code=403, detail="Only an apartment Owner can manage memberships")

    membership_documents = await db.memberships.find({"apartment_id": apartment_id}).to_list(length=None)
    result = []
    for membership in membership_documents:
        member = await db.users.find_one({"_id": ObjectId(membership["user_id"])})
        flat = await db.flats.find_one({"_id": ObjectId(membership["flat_id"])})
        if not member or not flat:
            continue
        result.append(
            MembershipView(
                id=str(membership["_id"]),
                user_id=str(member["_id"]),
                name=member["name"],
                email=member["email"],
                apartment_id=apartment_id,
                flat_id=str(flat["_id"]),
                flat_name=flat["name"],
                relationship=membership["relationship"],
                status=membership["status"],
                permissions=membership.get("permissions", {}),
            )
        )
    return result