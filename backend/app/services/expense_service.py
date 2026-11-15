from bson import ObjectId
from fastapi import HTTPException
from app.core.database import get_database
from app.models import Expense, ExpenseCreate, ExpenseWithPayments, Payment

async def create_new_expense(expense: ExpenseCreate, admin_id: str) -> Expense:
    db = get_database()
    expense_dict = expense.model_dump()
    expense_dict["created_by"] = admin_id

    result = await db.expenses.insert_one(expense_dict)
    created_expense = await db.expenses.find_one({"_id": result.inserted_id})
    created_expense["id"] = str(created_expense["_id"])
    return Expense(**created_expense)

async def list_expenses(month: int | None = None, year: int | None = None) -> list[ExpenseWithPayments]:
    db = get_database()
    query = {}
    if month:
        query["month"] = month
    if year:
        query["year"] = year

    expenses = await db.expenses.find(query).to_list(length=None)
    result = []

    for expense_data in expenses:
        expense_data["id"] = str(expense_data["_id"])
        expense = Expense(**expense_data)

        payments = await db.payments.find({"expense_id": expense.id}).to_list(length=None)
        payment_objects = []
        for p in payments:
            p["id"] = str(p["_id"])
            payment_objects.append(Payment(**p))

        total_paid = sum(p.amount for p in payment_objects)
        remaining_amount = expense.amount - total_paid

        result.append(
            ExpenseWithPayments(
                **expense.model_dump(),
                payments=payment_objects,
                total_paid=total_paid,
                remaining_amount=remaining_amount,
            )
        )
    return result

async def get_expense_by_id(expense_id: str) -> ExpenseWithPayments:
    if not ObjectId.is_valid(expense_id):
        raise HTTPException(status_code=400, detail="Invalid expense ID format")

    db = get_database()
    expense_data = await db.expenses.find_one({"_id": ObjectId(expense_id)})
    if not expense_data:
        raise HTTPException(status_code=404, detail="Expense not found")

    expense_data["id"] = str(expense_data["_id"])
    expense = Expense(**expense_data)

    payments = await db.payments.find({"expense_id": expense.id}).to_list(length=None)
    payment_objects = []
    for p in payments:
        p["id"] = str(p["_id"])
        payment_objects.append(Payment(**p))

    total_paid = sum(p.amount for p in payment_objects)
    remaining_amount = expense.amount - total_paid

    return ExpenseWithPayments(
        **expense.model_dump(),
        payments=payment_objects,
        total_paid=total_paid,
        remaining_amount=remaining_amount,
    )
