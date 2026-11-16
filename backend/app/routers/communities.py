from fastapi import APIRouter, Depends

from app.dependencies import get_admin_user
from app.models.community import (
    Building,
    BuildingCreate,
    BuildingUpdate,
    Community,
    CommunityCreate,
    CommunityUpdate,
)
from app.models.user import User
from app.services.community_service import (
    create_building,
    create_community,
    delete_building,
    delete_community,
    list_communities,
    list_community_buildings,
    update_building,
    update_community,
)

router = APIRouter(prefix="/communities", tags=["Communities"])


@router.get("", response_model=list[Community])
async def get_public_communities():
    return await list_communities()


@router.get("/manage", response_model=list[Community])
async def get_managed_communities(
    _: User = Depends(get_admin_user),
):
    return await list_communities(include_inactive=True)


@router.post("", response_model=Community, status_code=201)
async def post_community(
    data: CommunityCreate,
    admin: User = Depends(get_admin_user),
):
    return await create_community(data, admin)


@router.patch("/{community_id}", response_model=Community)
async def patch_community(
    community_id: str,
    data: CommunityUpdate,
    _: User = Depends(get_admin_user),
):
    return await update_community(community_id, data)


@router.delete("/{community_id}")
async def remove_community(
    community_id: str,
    _: User = Depends(get_admin_user),
):
    return await delete_community(community_id)


@router.get("/{community_id}/buildings", response_model=list[Building])
async def get_community_buildings(community_id: str):
    return await list_community_buildings(community_id)


@router.post(
    "/{community_id}/buildings", response_model=Building, status_code=201
)
async def post_building(
    community_id: str,
    data: BuildingCreate,
    _: User = Depends(get_admin_user),
):
    return await create_building(community_id, data)


@router.patch("/buildings/{building_id}", response_model=Building)
async def patch_building(
    building_id: str,
    data: BuildingUpdate,
    _: User = Depends(get_admin_user),
):
    return await update_building(building_id, data)


@router.delete("/buildings/{building_id}")
async def remove_building(
    building_id: str,
    _: User = Depends(get_admin_user),
):
    return await delete_building(building_id)
