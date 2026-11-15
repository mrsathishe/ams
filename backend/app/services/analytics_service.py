from datetime import datetime, timezone
from app.core.database import get_database

async def calculate_yearly_expense_analytics(year: int | None = None) -> dict:
    db = get_database()
    target_year = year or datetime.now(timezone.utc).year

    expenses = await db.expenses.find({"year": target_year}).to_list(length=None)
    monthly_data = {}

    for expense in expenses:
        month = expense["month"]
        if month not in monthly_data:
            monthly_data[month] = {"total_expense": 0, "total_paid": 0}

        monthly_data[month]["total_expense"] += expense["amount"]

        # Match payments whether stored as string ID or ObjectId
        expense_id_obj = expense["_id"]
        expense_id_str = str(expense_id_obj)
        payments = await db.payments.find(
            {"expense_id": {"$in": [expense_id_str, expense_id_obj]}}
        ).to_list(length=None)

        monthly_data[month]["total_paid"] += sum(p["amount"] for p in payments)

    return {
        "year": target_year,
        "monthly_data": monthly_data,
    }
