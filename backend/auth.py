from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from services import jwt_service

security = HTTPBearer()

def decode_jwt_user_id(token: Optional[str]) -> Optional[str]:
    """
    Return the user_id from a JWT (reads `sub` or `user_id`) or None if invalid.
    Pure function with no FastAPI dependencies so it can be reused in Socket.IO.
    """
    if not token:
        return None
    try:
        payload = jwt.decode(
            token,
            jwt_service.SECRET_KEY,
            algorithms=[jwt_service.ALGORITHM],
            options={"verify_aud": False},  # set True only if you use 'aud'
        )
        return payload.get("sub") or payload.get("user_id")
    except JWTError:
        return None

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = (credentials.credentials or "").strip()
    user_id = decode_jwt_user_id(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"user_id": user_id}
