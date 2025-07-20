from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from datetime import datetime, timedelta
from typing import List, Optional
import os
import shutil
from pathlib import Path

from database import connect_to_mongo, close_mongo_connection, get_database
from models import *
from auth import *
from config import FRONTEND_URL, ACCESS_TOKEN_EXPIRE_MINUTES, UPLOAD_DIR

# Create FastAPI app
app = FastAPI(title="AMS API", description="Apartment Management System API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Database events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Root endpoint
@app.get("/")
async def root():
    return {"message": "AMS API is running"}

# Authentication endpoints
@app.post("/register", response_model=User)
async def register_user(user: UserCreate):
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    
    result = await db.users.insert_one(user_dict)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user["_id"])
    
    return User(**created_user)

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# Expense endpoints
@app.post("/expenses", response_model=Expense)
async def create_expense(
    expense: ExpenseCreate,
    current_user: User = Depends(get_admin_user)
):
    db = get_database()
    expense_dict = expense.dict()
    expense_dict["created_by"] = current_user.id
    
    result = await db.expenses.insert_one(expense_dict)
    created_expense = await db.expenses.find_one({"_id": result.inserted_id})
    created_expense["id"] = str(created_expense["_id"])
    
    return Expense(**created_expense)

@app.get("/expenses", response_model=List[ExpenseWithPayments])
async def get_expenses(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_active_user)
):
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
        
        # Get payments for this expense
        payments = await db.payments.find({"expense_id": str(expense_data["_id"])}).to_list(length=None)
        payment_objects = []
        for payment in payments:
            payment["id"] = str(payment["_id"])
            payment_objects.append(Payment(**payment))
        
        # Calculate totals
        total_paid = sum(payment.amount for payment in payment_objects)
        remaining_amount = expense.amount - total_paid
        
        expense_with_payments = ExpenseWithPayments(
            **expense.dict(),
            payments=payment_objects,
            total_paid=total_paid,
            remaining_amount=remaining_amount
        )
        result.append(expense_with_payments)
    
    return result

@app.get("/expenses/{expense_id}", response_model=ExpenseWithPayments)
async def get_expense(
    expense_id: str,
    current_user: User = Depends(get_current_active_user)
):
    db = get_database()
    expense_data = await db.expenses.find_one({"_id": ObjectId(expense_id)})
    
    if not expense_data:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    expense = Expense(**expense_data)
    
    # Get payments for this expense
    payments = await db.payments.find({"expense_id": expense.id}).to_list(length=None)
    payments = [Payment(**payment) for payment in payments]
    
    # Calculate totals
    total_paid = sum(payment.amount for payment in payments)
    remaining_amount = expense.amount - total_paid
    
    return ExpenseWithPayments(
        **expense.dict(),
        payments=payments,
        total_paid=total_paid,
        remaining_amount=remaining_amount
    )

# Payment endpoints
@app.post("/payments", response_model=Payment)
async def create_payment(
    payment: PaymentCreate,
    current_user: User = Depends(get_admin_user)
):
    db = get_database()
    
    # Verify expense exists
    expense = await db.expenses.find_one({"_id": payment.expense_id})
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Verify user exists
    user = await db.users.find_one({"_id": payment.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = await db.payments.insert_one(payment.dict())
    created_payment = await db.payments.find_one({"_id": result.inserted_id})
    
    return Payment(**created_payment)

@app.get("/payments/user/{user_id}", response_model=List[Payment])
async def get_user_payments(
    user_id: str,
    current_user: User = Depends(get_current_active_user)
):
    db = get_database()
    
    # Users can only view their own payments unless they're admin
    if current_user.role != "admin" and str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    payments = await db.payments.find({"user_id": ObjectId(user_id)}).to_list(length=None)
    return [Payment(**payment) for payment in payments]

# Document endpoints
@app.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    expense_id: Optional[str] = Form(None),
    month: Optional[int] = Form(None),
    year: Optional[int] = Form(None),
    current_user: User = Depends(get_admin_user)
):
    db = get_database()
    
    # Create unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create document record
    document_data = {
        "title": title,
        "filename": filename,
        "file_path": file_path,
        "file_type": file.content_type,
        "uploaded_by": current_user.id
    }
    
    if expense_id:
        document_data["expense_id"] = ObjectId(expense_id)
    if month:
        document_data["month"] = month
    if year:
        document_data["year"] = year
    
    result = await db.documents.insert_one(document_data)
    created_document = await db.documents.find_one({"_id": result.inserted_id})
    
    return Document(**created_document)

@app.get("/documents", response_model=List[Document])
async def get_documents(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_active_user)
):
    db = get_database()
    query = {}
    
    if month:
        query["month"] = month
    if year:
        query["year"] = year
    
    documents = await db.documents.find(query).to_list(length=None)
    return [Document(**doc) for doc in documents]

@app.get("/documents/{document_id}/download")
async def download_document(
    document_id: str,
    current_user: User = Depends(get_current_active_user)
):
    db = get_database()
    document = await db.documents.find_one({"_id": ObjectId(document_id)})
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    file_path = document["file_path"]
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=file_path,
        filename=document["filename"],
        media_type=document["file_type"]
    )

# Analytics endpoints
@app.get("/analytics/expenses")
async def get_expense_analytics(
    year: Optional[int] = None,
    current_user: User = Depends(get_current_active_user)
):
    db = get_database()
    
    # Get expenses for the year
    query = {}
    if year:
        query["year"] = year
    else:
        query["year"] = datetime.now().year
    
    expenses = await db.expenses.find(query).to_list(length=None)
    
    # Group by month
    monthly_data = {}
    for expense in expenses:
        month = expense["month"]
        if month not in monthly_data:
            monthly_data[month] = {"total_expense": 0, "total_paid": 0}
        
        monthly_data[month]["total_expense"] += expense["amount"]
        
        # Get payments for this expense
        payments = await db.payments.find({"expense_id": expense["_id"]}).to_list(length=None)
        total_paid = sum(payment["amount"] for payment in payments)
        monthly_data[month]["total_paid"] += total_paid
    
    return {
        "year": year or datetime.now().year,
        "monthly_data": monthly_data
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
