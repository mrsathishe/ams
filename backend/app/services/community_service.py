from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError

from app.core.database import get_database
from app.models.community import (
    Building,
    BuildingCreate,
    BuildingUpdate,
    Community,
    CommunityCreate,
    CommunityUpdate,
)
from app.models.user import User


def _community_view(document: dict, building_count: int = 0) -> Community:
    return Community(
        id=str(document["_id"]),
        name=document["name"],
        status=document.get("status", "active"),
        total_building_count=building_count,
        total_flat_count=int(document.get("total_flat_count", 0)),
        created_at=document["created_at"],
    )


def _building_view(document: dict) -> Building:
    return Building(
        id=str(document["_id"]),
        community_id=document["community_id"],
        name=document["name"],
        total_flat_count=document["total_flat_count"],
        flat_count=document.get("flat_count", 0),
        created_at=document["created_at"],
    )


async def list_communities(*, include_inactive: bool = False) -> list[Community]:
    db = get_database()
    query = {} if include_inactive else {"status": "active"}
    documents = await db.apartments.find(query).sort("name", 1).to_list(length=None)
    result = []
    for document in documents:
        count = await db.buildings.count_documents(
            {"community_id": str(document["_id"])}
        )
        result.append(_community_view(document, count))
    return result


async def list_community_buildings(community_id: str) -> list[Building]:
    if not ObjectId.is_valid(community_id):
        raise HTTPException(status_code=400, detail="Invalid community ID")
    db = get_database()
    if not await db.apartments.find_one({"_id": ObjectId(community_id)}):
        raise HTTPException(status_code=404, detail="Community not found")
    documents = await db.buildings.find(
        {"community_id": community_id}
    ).sort("name", 1).to_list(length=None)
    return [_building_view(document) for document in documents]


async def create_community(data: CommunityCreate, admin: User) -> Community:
    db = get_database()
    name = data.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="Community name cannot be empty")
    document = {
        "name": name,
        "total_flat_count": 0,
        "flat_count": 0,
        "status": "active",
        "created_by": admin.id,
        "hierarchy_version": 2,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.apartments.insert_one(document)
    document["_id"] = result.inserted_id
    return _community_view(document)


async def update_community(
    community_id: str, data: CommunityUpdate
) -> Community:
    if not ObjectId.is_valid(community_id):
        raise HTTPException(status_code=400, detail="Invalid community ID")
    name = data.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="Community name cannot be empty")
    db = get_database()
    result = await db.apartments.update_one(
        {"_id": ObjectId(community_id)}, {"$set": {"name": name}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Community not found")
    document = await db.apartments.find_one({"_id": ObjectId(community_id)})
    count = await db.buildings.count_documents({"community_id": community_id})
    return _community_view(document, count)


async def delete_community(community_id: str) -> dict[str, str]:
    if not ObjectId.is_valid(community_id):
        raise HTTPException(status_code=400, detail="Invalid community ID")
    db = get_database()
    community = await db.apartments.find_one({"_id": ObjectId(community_id)})
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")

    has_memberships = await db.memberships.find_one({"apartment_id": community_id})
    has_accounts = await db.eb_accounts.find_one({"apartment_id": community_id})
    has_approvals = await db.approval_requests.find_one(
        {"apartment_id": community_id}
    )
    if has_memberships or has_accounts or has_approvals:
        raise HTTPException(
            status_code=409,
            detail="Community cannot be deleted while users or related records are associated",
        )

    await db.flats.delete_many({"apartment_id": community_id})
    await db.buildings.delete_many({"community_id": community_id})
    await db.apartments.delete_one({"_id": ObjectId(community_id)})
    return {"message": "Community deleted"}


async def create_building(
    community_id: str, data: BuildingCreate
) -> Building:
    if not ObjectId.is_valid(community_id):
        raise HTTPException(status_code=400, detail="Invalid community ID")
    db = get_database()
    community = await db.apartments.find_one({"_id": ObjectId(community_id)})
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    name = data.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="Building name cannot be empty")
    document = {
        "community_id": community_id,
        "name": name,
        "total_flat_count": data.total_flat_count,
        "flat_count": 0,
        "created_at": datetime.now(timezone.utc),
    }
    try:
        result = await db.buildings.insert_one(document)
    except DuplicateKeyError as exc:
        raise HTTPException(
            status_code=409, detail="A building with this name already exists"
        ) from exc
    document["_id"] = result.inserted_id
    await _sync_community_capacity(community_id)
    return _building_view(document)


async def update_building(building_id: str, data: BuildingUpdate) -> Building:
    if not ObjectId.is_valid(building_id):
        raise HTTPException(status_code=400, detail="Invalid building ID")
    db = get_database()
    building = await db.buildings.find_one({"_id": ObjectId(building_id)})
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    changes = data.model_dump(exclude_unset=True)
    if "name" in changes:
        changes["name"] = changes["name"].strip()
        if not changes["name"]:
            raise HTTPException(status_code=422, detail="Building name cannot be empty")
    if not changes:
        raise HTTPException(status_code=422, detail="No building changes supplied")
    if "total_flat_count" in changes:
        count = await db.flats.count_documents({"building_id": building_id})
        if changes["total_flat_count"] < count:
            raise HTTPException(
                status_code=409,
                detail="Unit capacity cannot be less than the number of registered units",
            )
    try:
        await db.buildings.update_one(
            {"_id": building["_id"]}, {"$set": changes}
        )
    except DuplicateKeyError as exc:
        raise HTTPException(
            status_code=409, detail="A building with this name already exists"
        ) from exc
    updated = await db.buildings.find_one({"_id": building["_id"]})
    await _sync_community_capacity(building["community_id"])
    return _building_view(updated)


async def delete_building(building_id: str) -> dict[str, str]:
    if not ObjectId.is_valid(building_id):
        raise HTTPException(status_code=400, detail="Invalid building ID")
    db = get_database()
    building = await db.buildings.find_one({"_id": ObjectId(building_id)})
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    flat_ids = [
        str(document["_id"])
        for document in await db.flats.find(
            {"building_id": building_id}, {"_id": 1}
        ).to_list(length=None)
    ]
    has_memberships = bool(
        flat_ids
        and await db.memberships.find_one({"flat_id": {"$in": flat_ids}})
    )
    has_accounts = bool(
        flat_ids
        and await db.eb_accounts.find_one({"flat_id": {"$in": flat_ids}})
    )
    if has_memberships or has_accounts:
        raise HTTPException(
            status_code=409,
            detail="Building cannot be deleted while users or EB accounts are associated",
        )

    await db.flats.delete_many({"building_id": building_id})
    await db.buildings.delete_one({"_id": building["_id"]})
    await _sync_community_capacity(building["community_id"])
    return {"message": "Building deleted"}


async def _sync_community_capacity(community_id: str) -> None:
    db = get_database()
    buildings = await db.buildings.find(
        {"community_id": community_id}, {"total_flat_count": 1}
    ).to_list(length=None)
    total_capacity = sum(int(item.get("total_flat_count", 0)) for item in buildings)
    await db.apartments.update_one(
        {"_id": ObjectId(community_id)},
        {"$set": {"total_flat_count": total_capacity}},
    )
