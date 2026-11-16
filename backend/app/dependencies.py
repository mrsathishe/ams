from bson import ObjectId
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.core.config import ALGORITHM, SECRET_KEY
from app.core.database import get_database
from app.models import TokenData, User
from app.services.user_service import get_user_by_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not isinstance(email, str):
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = await get_user_by_email(token_data.email)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_approved_user(
    selected_apartment_id: str | None = Header(None, alias="X-Apartment-ID"),
    current_user: User = Depends(get_current_active_user),
) -> User:
    if not selected_apartment_id:
        if current_user.is_super_admin:
            return current_user.model_copy(
                update={"active_apartment_id": None, "active_flat_id": None, "active_membership": {"is_super_admin": True}, "active_memberships": []}
            )
        raise HTTPException(status_code=400, detail="X-Apartment-ID is required")
    if not ObjectId.is_valid(selected_apartment_id):
        raise HTTPException(status_code=400, detail="Invalid apartment ID")

    db = get_database()
    apartment = await db.apartments.find_one(
        {"_id": ObjectId(selected_apartment_id), "status": "active"}
    )
    if not apartment:
        raise HTTPException(status_code=404, detail="Apartment not found")

    memberships = []
    if not current_user.is_super_admin:
        memberships = await db.memberships.find(
            {
                "user_id": current_user.id,
                "apartment_id": selected_apartment_id,
                "status": "approved",
            }
        ).to_list(length=None)
    if not current_user.is_super_admin and not memberships:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Approved membership in this apartment is required",
        )
    return current_user.model_copy(
        update={
            "active_apartment_id": selected_apartment_id,
            "active_flat_id": memberships[0]["flat_id"] if memberships else None,
            "active_membership": memberships[0] if memberships else {"is_super_admin": True},
            "active_memberships": memberships,
        }
    )


async def get_admin_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if not current_user.is_super_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user