from datetime import datetime, timedelta, timezone
from jose import jwt

# Secret key and algorithm (consider loading these from environment variables)
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Define expiration time here

def create_jwt_token(email: str) -> str:
    """
    Create a JWT token for the given email with an expiration time.
    """
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": email,
        "exp": datetime.now(timezone.utc) + access_token_expires
    }
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token