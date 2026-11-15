from typing import List, Optional
from fastapi import APIRouter, Depends
from app.dependencies import get_admin_user, get_current_active_user
from app.models import Expense, ExpenseCreate, ExpenseWithPayments, User
from app.services.expense_service import (
    create_new_expense,
    get_expense_by_id,
    list_expenses,
)

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("", response_model=Expense)
async def create_expense(
    expense: ExpenseCreate,
    current_user: User = Depends(get_admin_user),
):
    return await create_new_expense(expense, current_user.id)

@router.get("", response_model=List[ExpenseWithPayments])
async def get_expenses(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
):
    return await list_expenses(month=month, year=year)

@router.get("/{expense_id}", response_model=ExpenseWithPayments)
async def get_expense(
    expense_id: str,
    current_user: User = Depends(get_current_active_user),
):
    return await get_expense_by_id(expense_id)
