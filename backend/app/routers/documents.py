from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import FileResponse
from app.dependencies import get_admin_user, get_current_active_user
from app.models import Document, User
from app.services.document_service import (
    get_document_file_info,
    list_documents,
    save_and_record_document,
)

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=Document)
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    expense_id: Optional[str] = Form(None),
    month: Optional[int] = Form(None),
    year: Optional[int] = Form(None),
    current_user: User = Depends(get_admin_user),
):
    return await save_and_record_document(
        file=file,
        title=title,
        admin_id=current_user.id,
        expense_id=expense_id,
        month=month,
        year=year,
    )


@router.get("", response_model=List[Document])
async def get_documents(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
):
    return await list_documents(month=month, year=year)


@router.get("/{document_id}/download")
async def download_document(
    document_id: str,
    current_user: User = Depends(get_current_active_user),
):
    document = await get_document_file_info(document_id)
    return FileResponse(
        path=document["file_path"],
        filename=document["filename"],
        media_type=document["file_type"],
    )