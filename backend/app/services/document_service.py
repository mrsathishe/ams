import os
import shutil
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import HTTPException, UploadFile
from app.core.config import UPLOAD_DIR
from app.core.database import get_database
from app.models import Document

async def save_and_record_document(
    file: UploadFile,
    title: str,
    admin_id: str,
    expense_id: str | None = None,
    month: int | None = None,
    year: int | None = None,
) -> Document:
    db = get_database()

    # Sanitize filename to prevent path traversal attacks
    safe_original_name = os.path.basename(file.filename or "uploaded_file")
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{safe_original_name}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document_data = {
        "title": title,
        "filename": filename,
        "file_path": file_path,
        "file_type": file.content_type or "application/octet-stream",
        "uploaded_by": admin_id,
        "uploaded_at": datetime.now(timezone.utc),
    }

    if expense_id:
        if not ObjectId.is_valid(expense_id):
            raise HTTPException(status_code=400, detail="Invalid expense_id format")
        document_data["expense_id"] = expense_id
    if month is not None:
        document_data["month"] = month
    if year is not None:
        document_data["year"] = year

    result = await db.documents.insert_one(document_data)
    created_document = await db.documents.find_one({"_id": result.inserted_id})
    created_document["id"] = str(created_document["_id"])
    return Document(**created_document)

async def list_documents(month: int | None = None, year: int | None = None) -> list[Document]:
    db = get_database()
    query = {}
    if month is not None:
        query["month"] = month
    if year is not None:
        query["year"] = year

    documents = await db.documents.find(query).to_list(length=None)
    result = []
    for doc in documents:
        doc["id"] = str(doc["_id"])
        if isinstance(doc.get("expense_id"), ObjectId):
            doc["expense_id"] = str(doc["expense_id"])
        result.append(Document(**doc))
    return result

async def get_document_file_info(document_id: str) -> dict:
    if not ObjectId.is_valid(document_id):
        raise HTTPException(status_code=400, detail="Invalid document ID format")

    db = get_database()
    document = await db.documents.find_one({"_id": ObjectId(document_id)})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if not os.path.exists(document["file_path"]):
        raise HTTPException(status_code=404, detail="File not found on server")

    return document
