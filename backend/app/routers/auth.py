from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.core.logger import log_execution_time
from app.core.security import create_access_token
from app.models import User, Token, RegistrationRequest
from app.services.auth import authenticate_user
from app.services.auth_service import register_new_user

router = APIRouter(tags=["Authentication"])

@router.post("/register", response_model=User)
@log_execution_time
async def register_user(user: RegistrationRequest):
    return await register_new_user(user)

@router.post("/token", response_model=Token)
@log_execution_time
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
