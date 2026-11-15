from bson import ObjectId
from fastapi import HTTPException
from app.core.database import get_database
from app.models import Payment, PaymentCreate

async def record_payment(payment: PaymentCreate) -> Payment:
    db = get_database()

    if not ObjectId.is_valid(payment.expense_id) or not ObjectId.is_valid(payment.user_id):
        raise HTTPException(status_code=400, detail="Invalid expense_id or user_id")

    expense = await db.expenses.find_one({"_id": ObjectId(payment.expense_id)})
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    user = await db.users.find_one({"_id": ObjectId(payment.user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = await db.payments.insert_one(payment.model_dump())
    created_payment = await db.payments.find_one({"_id": result.inserted_id})
    created_payment["id"] = str(created_payment["_id"])
    return Payment(**created_payment)

async def list_user_payments(user_id: str) -> list[Payment]:
    db = get_database()
    # Query supports both string and ObjectId formats for backwards compatibility
    query = {"$or": [{"user_id": user_id}]}
    if ObjectId.is_valid(user_id):
        query["$or"].append({"user_id": ObjectId(user_id)})

    payments = await db.payments.find(query).to_list(length=None)
    result = []
    for p in payments:
        p["id"] = str(p["_id"])
        result.append(Payment(**p))
    return result
