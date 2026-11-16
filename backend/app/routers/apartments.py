from fastapi import APIRouter, Depends

from app.dependencies import get_approved_user, get_current_active_user
from app.models import Apartment, User
from app.models.apartment import (
    ApartmentChange,
    ApartmentChangeRequest,
    Flat,
    FlatApprovalPolicyUpdate,
    RegistrationApartmentOption,
)
from app.models.membership import MembershipView
from app.services.apartment_service import (
    approve_apartment_change,
    get_registration_options,
    list_apartment_change_requests,
    list_apartment_flats,
    list_apartment_memberships,
    list_user_apartments,
    request_apartment_change,
    set_flat_membership_approval_policy,
)

router = APIRouter(prefix="/apartments", tags=["Apartments"])


@router.get("/registration-options", response_model=list[RegistrationApartmentOption])
async def list_registration_options():
    return await get_registration_options()


@router.get("", response_model=list[Apartment])
async def list_apartments_for_current_user(
    current_user: User = Depends(get_current_active_user),
):
    return await list_user_apartments(current_user)


@router.get("/{apartment_id}/flats", response_model=list[Flat])
async def get_apartment_flats(
    apartment_id: str,
    current_user: User = Depends(get_approved_user),
):
    return await list_apartment_flats(apartment_id, current_user)


@router.get("/{apartment_id}/memberships", response_model=list[MembershipView])
async def get_apartment_memberships(
    apartment_id: str,
    current_user: User = Depends(get_approved_user),
):
    return await list_apartment_memberships(apartment_id, current_user)


@router.post("/{apartment_id}/change-requests", response_model=ApartmentChangeRequest)
async def create_apartment_change_request(
    apartment_id: str,
    changes: ApartmentChange,
    current_user: User = Depends(get_current_active_user),
):
    return await request_apartment_change(apartment_id, changes, current_user)


@router.get("/{apartment_id}/change-requests", response_model=list[ApartmentChangeRequest])
async def get_apartment_change_requests(
    apartment_id: str,
    current_user: User = Depends(get_current_active_user),
):
    return await list_apartment_change_requests(apartment_id, current_user)


@router.post("/change-requests/{request_id}/approve", response_model=ApartmentChangeRequest)
async def approve_apartment_change_request(
    request_id: str,
    current_user: User = Depends(get_current_active_user),
):
    return await approve_apartment_change(request_id, current_user)


@router.patch("/flats/{flat_id}/membership-approval-policy")
async def patch_membership_approval_policy(
    flat_id: str,
    update: FlatApprovalPolicyUpdate,
    current_user: User = Depends(get_approved_user),
):
    return await set_flat_membership_approval_policy(flat_id, update, current_user)