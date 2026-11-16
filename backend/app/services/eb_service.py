from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError

from app.core.database import get_database
from app.models.eb import (
    EBAccount,
    EBAccountCreate,
    EBBillChange,
    EBBillCreate,
    EBBillView,
    EBPaymentChange,
    EBPaymentCreate,
    EBPaymentView,
)
from app.models.user import User


def _object_id(value: str, label: str) -> ObjectId:
    if not ObjectId.is_valid(value):
        raise HTTPException(status_code=400, detail=f"Invalid {label} ID")
    return ObjectId(value)


def _permissions(user: User) -> dict:
    return user.active_membership.get("permissions", {})


def _can_view_account(account: dict, user: User) -> bool:
    if user.is_super_admin:
        return True
    memberships = user.active_memberships or [user.active_membership]
    if account["account_type"] == "common":
        return any(
            membership.get("permissions", {}).get("can_view_common_eb", False)
            for membership in memberships
        )
    return (
        any(
            membership.get("flat_id") == account.get("flat_id")
            and membership.get("permissions", {}).get("can_view_individual_eb", False)
            for membership in memberships
        )
    )


def _can_add_eb(user: User, flat_id: str | None = None) -> bool:
    memberships = user.active_memberships or [user.active_membership]
    return user.is_super_admin or any(
        membership.get("permissions", {}).get("can_add_eb", False)
        and (flat_id is None or membership.get("flat_id") == flat_id)
        for membership in memberships
    )


async def _get_account(account_id: str, user: User, require_add: bool = False) -> dict:
    db = get_database()
    account = await db.eb_accounts.find_one(
        {
            "_id": _object_id(account_id, "EB account"),
            "apartment_id": user.active_apartment_id,
        }
    )
    if not account:
        raise HTTPException(status_code=404, detail="EB account not found")
    if not _can_view_account(account, user):
        raise HTTPException(status_code=403, detail="Not authorized to view this EB account")
    account_flat_id = account.get("flat_id") if account["account_type"] == "individual" else None
    if require_add and not _can_add_eb(user, account_flat_id):
        raise HTTPException(status_code=403, detail="Not authorized to add EB records")
    return account


def _as_account(account: dict) -> EBAccount:
    return EBAccount(
        id=str(account["_id"]),
        apartment_id=account["apartment_id"],
        account_type=account["account_type"],
        flat_id=account.get("flat_id"),
        name=account["name"],
        created_by=account["created_by"],
        created_at=account["created_at"],
    )


async def create_eb_account(data: EBAccountCreate, user: User) -> EBAccount:
    db = get_database()
    if not user.active_apartment_id:
        raise HTTPException(status_code=400, detail="Select an apartment first")
    if data.account_type == "common" and not _can_add_eb(user):
        raise HTTPException(status_code=403, detail="Not authorized to add EB accounts")

    flat_id = data.flat_id
    if data.account_type == "individual":
        if not ObjectId.is_valid(flat_id or ""):
            raise HTTPException(status_code=400, detail="Invalid flat ID")
        flat = await db.flats.find_one(
            {"_id": ObjectId(flat_id), "apartment_id": user.active_apartment_id}
        )
        if not flat or not flat.get("individual_eb_enabled"):
            raise HTTPException(status_code=409, detail="Individual EB is not enabled for this flat")
        if not user.is_super_admin and not any(
            membership.get("flat_id") == flat_id for membership in user.active_memberships
        ):
            raise HTTPException(status_code=403, detail="Individual EB is private to its flat")
        if not _can_add_eb(user, flat_id):
            raise HTTPException(status_code=403, detail="Not authorized to add this flat's EB account")
        default_name = f"Individual EB · {flat['name']}"
    else:
        default_name = "Common EB"

    account = {
        "apartment_id": user.active_apartment_id,
        "account_type": data.account_type,
        "flat_id": flat_id,
        "name": data.name.strip() if data.name else default_name,
        "created_by": user.id,
        "created_at": datetime.now(timezone.utc),
    }
    try:
        result = await db.eb_accounts.insert_one(account)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="This EB account already exists")
    account["_id"] = result.inserted_id
    return _as_account(account)


async def list_eb_accounts(user: User) -> list[EBAccount]:
    db = get_database()
    if not user.active_apartment_id:
        raise HTTPException(status_code=400, detail="Select an apartment first")
    accounts = await db.eb_accounts.find(
        {"apartment_id": user.active_apartment_id}
    ).sort("account_type", 1).to_list(length=None)
    return [_as_account(account) for account in accounts if _can_view_account(account, user)]


async def set_individual_eb_enabled(flat_id: str, enabled: bool, user: User) -> dict:
    db = get_database()
    flat_object_id = _object_id(flat_id, "flat")
    flat = await db.flats.find_one(
        {"_id": flat_object_id, "apartment_id": user.active_apartment_id}
    )
    if not flat:
        raise HTTPException(status_code=404, detail="Flat not found")
    if not user.is_super_admin:
        owner = await db.memberships.find_one(
            {
                "user_id": user.id,
                "apartment_id": user.active_apartment_id,
                "flat_id": flat_id,
                "relationship": "Owner",
                "status": "approved",
            }
        )
        if not owner:
            raise HTTPException(status_code=403, detail="Only a same-flat Owner can change this setting")
    await db.flats.update_one({"_id": flat_object_id}, {"$set": {"individual_eb_enabled": enabled}})
    return {"flat_id": flat_id, "individual_eb_enabled": enabled}


async def _calculate_account_bills(account: dict, session=None) -> list[EBBillView]:
    db = get_database()
    cursor = db.eb_bills.find(
        {"account_id": str(account["_id"]), "status": "approved"}, session=session
    ).sort("period_start", 1)
    bills = await cursor.to_list(length=None)
    if not bills:
        return []

    bill_ids = [str(bill["_id"]) for bill in bills]
    payment_docs = await db.eb_payments.find(
        {"bill_id": {"$in": bill_ids}}, session=session
    ).sort("payment_date", 1).to_list(length=None)
    payments_by_bill: dict[str, list[dict]] = {}
    for payment in payment_docs:
        payments_by_bill.setdefault(payment["bill_id"], []).append(payment)

    views = []
    previous_closing = 0.0
    for index, bill in enumerate(bills):
        opening_balance = bill.get("opening_balance", 0.0) if index == 0 else 0.0
        previous_balance = opening_balance if index == 0 else previous_closing
        total_payable = previous_balance + bill["bill_amount"]
        payment_views = []
        total_paid = 0.0
        for payment in payments_by_bill.get(str(bill["_id"]), []):
            total_paid += payment["amount"]
            payer = await db.users.find_one(
                {"_id": ObjectId(payment["paid_by"])}, {"name": 1}, session=session
            )
            payment_views.append(
                EBPaymentView(
                    id=str(payment["_id"]),
                    bill_id=str(bill["_id"]),
                    paid_by=payment["paid_by"],
                    payer_name=payer.get("name", "Member") if payer else "Member",
                    amount=payment["amount"],
                    payment_date=payment["payment_date"],
                    payment_method=payment.get("payment_method"),
                    created_at=payment["created_at"],
                )
            )

        closing_balance = round(total_payable - total_paid, 2)
        if closing_balance < -0.005:
            raise HTTPException(status_code=409, detail="Bill payments exceed the payable balance")
        closing_balance = max(0.0, closing_balance)
        status = "Paid" if closing_balance <= 0.005 else "Partially Paid" if total_paid else "Pending"
        views.append(
            EBBillView(
                id=str(bill["_id"]),
                account_id=str(account["_id"]),
                apartment_id=bill["apartment_id"],
                flat_id=bill.get("flat_id"),
                period_start=bill["period_start"],
                period_end=bill["period_end"],
                opening_balance=opening_balance,
                previous_balance=previous_balance,
                bill_amount=bill["bill_amount"],
                total_payable=total_payable,
                total_paid=total_paid,
                closing_balance=closing_balance,
                payment_status=status,
                description=bill.get("description"),
                created_by=bill["created_by"],
                payments=payment_views,
            )
        )
        previous_closing = closing_balance
    return views


async def list_eb_bills(account_id: str, user: User) -> list[EBBillView]:
    account = await _get_account(account_id, user)
    return await _calculate_account_bills(account)


async def _validate_new_bill(account: dict, data: dict) -> None:
    db = get_database()
    existing = await db.eb_bills.find(
        {"account_id": str(account["_id"]), "status": "approved"}
    ).sort("period_end", -1).to_list(length=1)
    if existing:
        if data.get("opening_balance", 0) != 0:
            raise HTTPException(status_code=400, detail="Opening balance is only allowed on the first bill")
        if str(data["period_start"]) <= str(existing[0]["period_end"]):
            raise HTTPException(status_code=409, detail="Bill periods must not overlap or go backwards")


async def _required_eb_approvals(account: dict) -> int:
    db = get_database()
    query = {
        "apartment_id": account["apartment_id"],
        "relationship": "Owner",
        "status": "approved",
    }
    if account["account_type"] == "individual":
        query["flat_id"] = account["flat_id"]
    owners = await db.memberships.count_documents(query)
    return 1 if owners == 2 else 2


async def create_eb_bill(account_id: str, data: EBBillCreate, user: User) -> dict:
    account = await _get_account(account_id, user, require_add=True)
    bill_data = data.model_dump(mode="json")
    await _validate_new_bill(account, bill_data)
    db = get_database()
    if user.is_super_admin:
        return await _insert_bill(account, bill_data, user.id)

    request_data = {
        "type": "eb_bill_create",
        "apartment_id": account["apartment_id"],
        "flat_id": account.get("flat_id"),
        "account_id": str(account["_id"]),
        "requested_by": user.id,
        "changes": bill_data,
        "required_approvals": await _required_eb_approvals(account),
        "approved_by": [],
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.approval_requests.insert_one(request_data)
    return {"status": "pending", "request_id": str(result.inserted_id)}


async def _insert_bill(account: dict, data: dict, created_by: str) -> EBBillView:
    db = get_database()
    await _validate_new_bill(account, data)
    bill = {
        "account_id": str(account["_id"]),
        "apartment_id": account["apartment_id"],
        "flat_id": account.get("flat_id"),
        "period_start": data["period_start"],
        "period_end": data["period_end"],
        "opening_balance": data.get("opening_balance", 0),
        "bill_amount": data["bill_amount"],
        "description": data.get("description"),
        "created_by": created_by,
        "status": "approved",
        "created_at": datetime.now(timezone.utc),
    }
    try:
        result = await db.eb_bills.insert_one(bill)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="A bill already exists for this period")
    bill["_id"] = result.inserted_id
    return (await _calculate_account_bills(account))[-1]


async def update_eb_bill(bill_id: str, changes: EBBillChange, user: User) -> dict:
    db = get_database()
    bill = await db.eb_bills.find_one({"_id": _object_id(bill_id, "bill")})
    if not bill:
        raise HTTPException(status_code=404, detail="EB bill not found")
    account = await _get_account(bill["account_id"], user)
    if not user.is_super_admin:
        owner_query = {
            "user_id": user.id,
            "apartment_id": account["apartment_id"],
            "relationship": "Owner",
            "status": "approved",
        }
        if account.get("flat_id"):
            owner_query["flat_id"] = account["flat_id"]
        if not await db.memberships.find_one(owner_query):
            raise HTTPException(status_code=403, detail="Tenants cannot edit EB bills")
    change_data = changes.model_dump(mode="json", exclude_unset=True)
    if "opening_balance" in change_data:
        first_bill = await db.eb_bills.find_one(
            {"account_id": bill["account_id"], "status": "approved"}, sort=[("period_start", 1)]
        )
        if first_bill and first_bill["_id"] != bill["_id"]:
            raise HTTPException(status_code=400, detail="Only the first bill can have an opening balance")

    if user.is_super_admin:
        await db.eb_bills.update_one({"_id": bill["_id"]}, {"$set": change_data})
        return {"status": "approved", "bill_id": bill_id}

    request_data = {
        "type": "eb_bill_update",
        "apartment_id": account["apartment_id"],
        "flat_id": account.get("flat_id"),
        "account_id": str(account["_id"]),
        "bill_id": bill_id,
        "requested_by": user.id,
        "changes": change_data,
        "required_approvals": await _required_eb_approvals(account),
        "approved_by": [],
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.approval_requests.insert_one(request_data)
    return {"status": "pending", "request_id": str(result.inserted_id)}


async def approve_eb_change(request_id: str, approver: User) -> dict:
    db = get_database()
    request = await db.approval_requests.find_one(
        {"_id": _object_id(request_id, "approval request")}
    )
    if not request or request.get("type") not in {"eb_bill_create", "eb_bill_update"}:
        raise HTTPException(status_code=404, detail="EB approval request not found")
    if request["status"] != "pending":
        raise HTTPException(status_code=409, detail="Approval request is not pending")
    if request["requested_by"] == approver.id:
        raise HTTPException(status_code=403, detail="You cannot approve your own EB change")

    if not approver.is_super_admin:
        query = {
            "user_id": approver.id,
            "apartment_id": request["apartment_id"],
            "relationship": "Owner",
            "status": "approved",
        }
        if request.get("flat_id"):
            query["flat_id"] = request["flat_id"]
        if not await db.memberships.find_one(query):
            raise HTTPException(status_code=403, detail="Only an eligible Owner can approve this EB change")
        if approver.id in request.get("approved_by", []):
            raise HTTPException(status_code=409, detail="You have already approved this EB change")
        await db.approval_requests.update_one(
            {"_id": request["_id"], "status": "pending"},
            {"$addToSet": {"approved_by": approver.id}},
        )
        request = await db.approval_requests.find_one({"_id": request["_id"]})
        if len(request.get("approved_by", [])) < request["required_approvals"]:
            return {"status": "pending", "request_id": request_id}

    if approver.is_super_admin:
        account = await db.eb_accounts.find_one(
            {"_id": ObjectId(request["account_id"])}
        )
        if not account:
            raise HTTPException(status_code=404, detail="EB account no longer exists")
    else:
        account = await _get_account(request["account_id"], approver)
    if request["type"] == "eb_bill_create":
        await _insert_bill(account, request["changes"], request["requested_by"])
    else:
        bill = await db.eb_bills.find_one({"_id": _object_id(request["bill_id"], "bill")})
        if not bill:
            raise HTTPException(status_code=404, detail="EB bill no longer exists")
        await db.eb_bills.update_one({"_id": bill["_id"]}, {"$set": request["changes"]})

    await db.approval_requests.update_one(
        {"_id": request["_id"]},
        {"$set": {"status": "approved", "approved_at": datetime.now(timezone.utc)}},
    )
    return {"status": "approved", "request_id": request_id}


async def _account_and_bill_for_payment(bill_id: str, user: User, session=None):
    db = get_database()
    bill = await db.eb_bills.find_one(
        {"_id": _object_id(bill_id, "bill"), "status": "approved"}, session=session
    )
    if not bill:
        raise HTTPException(status_code=404, detail="EB bill not found")
    account = await db.eb_accounts.find_one(
        {
            "_id": ObjectId(bill["account_id"]),
            "apartment_id": user.active_apartment_id,
        },
        session=session,
    )
    if not account or not _can_view_account(account, user):
        raise HTTPException(status_code=404, detail="EB bill not found")
    return account, bill


async def add_eb_payment(bill_id: str, data: EBPaymentCreate, user: User) -> EBPaymentView:
    db = get_database()
    async with await db.client.start_session() as session:
        async with session.start_transaction():
            account, bill = await _account_and_bill_for_payment(bill_id, user, session)
            views = await _calculate_account_bills(account, session)
            current_bill = next(view for view in views if view.id == bill_id)
            if data.amount > current_bill.closing_balance + 0.005:
                raise HTTPException(status_code=409, detail="Payment exceeds the remaining balance")
            payment = {
                "bill_id": bill_id,
                "paid_by": user.id,
                "amount": data.amount,
                "payment_date": data.payment_date,
                "payment_method": data.payment_method,
                "created_at": datetime.now(timezone.utc),
            }
            result = await db.eb_payments.insert_one(payment, session=session)
            payment["_id"] = result.inserted_id
            return EBPaymentView(
                id=str(result.inserted_id),
                bill_id=bill_id,
                paid_by=user.id,
                payer_name=user.name,
                amount=data.amount,
                payment_date=data.payment_date,
                payment_method=data.payment_method,
                created_at=payment["created_at"],
            )


async def update_eb_payment(payment_id: str, changes: EBPaymentChange, user: User) -> EBPaymentView:
    db = get_database()
    async with await db.client.start_session() as session:
        async with session.start_transaction():
            payment = await db.eb_payments.find_one(
                {"_id": _object_id(payment_id, "payment")}, session=session
            )
            if not payment:
                raise HTTPException(status_code=404, detail="Payment not found")
            if payment["paid_by"] != user.id:
                raise HTTPException(status_code=403, detail="You may edit only your own payment")
            account, _ = await _account_and_bill_for_payment(payment["bill_id"], user, session)
            views = await _calculate_account_bills(account, session)
            current_bill = next(view for view in views if view.id == payment["bill_id"])
            current_amount = payment["amount"]
            new_amount = changes.amount if changes.amount is not None else current_amount
            if new_amount - current_amount > current_bill.closing_balance + 0.005:
                raise HTTPException(status_code=409, detail="Payment exceeds the remaining balance")
            update_data = changes.model_dump(exclude_unset=True, exclude_none=True)
            await db.eb_payments.update_one({"_id": payment["_id"]}, {"$set": update_data}, session=session)
            payment.update(update_data)
            return EBPaymentView(
                id=payment_id,
                bill_id=payment["bill_id"],
                paid_by=user.id,
                payer_name=user.name,
                amount=payment["amount"],
                payment_date=payment["payment_date"],
                payment_method=payment.get("payment_method"),
                created_at=payment["created_at"],
            )