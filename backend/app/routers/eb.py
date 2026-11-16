from fastapi import APIRouter, Depends, status

from app.dependencies import get_approved_user
from app.models.eb import (
    EBAccount,
    EBAccountCreate,
    EBBillChange,
    EBBillCreate,
    EBBillView,
    EBPaymentChange,
    EBPaymentCreate,
    EBPaymentView,
    IndividualEBToggle,
)
from app.models.user import User
from app.services.eb_service import (
    add_eb_payment,
    approve_eb_change,
    create_eb_account,
    create_eb_bill,
    list_eb_accounts,
    list_eb_bills,
    set_individual_eb_enabled,
    update_eb_bill,
    update_eb_payment,
)

router = APIRouter(tags=["Electricity Board"])


@router.get("/eb-accounts", response_model=list[EBAccount])
async def get_eb_accounts(current_user: User = Depends(get_approved_user)):
    return await list_eb_accounts(current_user)


@router.post("/eb-accounts", response_model=EBAccount, status_code=status.HTTP_201_CREATED)
async def post_eb_account(
    account: EBAccountCreate,
    current_user: User = Depends(get_approved_user),
):
    return await create_eb_account(account, current_user)


@router.patch("/flats/{flat_id}/individual-eb")
async def patch_individual_eb(
    flat_id: str,
    update: IndividualEBToggle,
    current_user: User = Depends(get_approved_user),
):
    return await set_individual_eb_enabled(flat_id, update.enabled, current_user)


@router.get("/eb-accounts/{account_id}/bills", response_model=list[EBBillView])
async def get_account_bills(
    account_id: str,
    current_user: User = Depends(get_approved_user),
):
    return await list_eb_bills(account_id, current_user)


@router.post("/eb-accounts/{account_id}/bills", status_code=status.HTTP_201_CREATED)
async def post_eb_bill(
    account_id: str,
    bill: EBBillCreate,
    current_user: User = Depends(get_approved_user),
):
    return await create_eb_bill(account_id, bill, current_user)


@router.patch("/eb-bills/{bill_id}")
async def patch_eb_bill(
    bill_id: str,
    changes: EBBillChange,
    current_user: User = Depends(get_approved_user),
):
    return await update_eb_bill(bill_id, changes, current_user)


@router.post("/eb-bills/{bill_id}/payments", response_model=EBPaymentView)
async def post_eb_payment(
    bill_id: str,
    payment: EBPaymentCreate,
    current_user: User = Depends(get_approved_user),
):
    return await add_eb_payment(bill_id, payment, current_user)


@router.patch("/eb-payments/{payment_id}", response_model=EBPaymentView)
async def patch_eb_payment(
    payment_id: str,
    changes: EBPaymentChange,
    current_user: User = Depends(get_approved_user),
):
    return await update_eb_payment(payment_id, changes, current_user)

