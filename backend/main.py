from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone

# Create a FastAPI app instance
app = FastAPI()

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret key for JWT encoding (store in environment variables in future)
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Define the request body model for sign up and sign in
class SignUpOrInRequest(BaseModel):
    email: str
    password: str

# In-memory user store (for testing purposes only)
users_db = {}

"""
Sign up a new user with email and password.
Password is hashed before storing.
Returns a success message if the email is not taken.
"""
@app.post("/signup")
def sign_up(request: SignUpOrInRequest):

    # Check if the email already exists
    if request.email in users_db:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Hash the password before storing
    hashed_password = pwd_context.hash(request.password)

    # Store the user with hashed password
    users_db[request.email] = hashed_password
    return {"message": "Sign up successful"}

"""
Sign in a user by verifying email and password.
Returns a JWT if authentication is successful.
"""
@app.post("/signin")
def sign_in(request: SignUpOrInRequest):

    # Check if the user exists
    hashed_password = users_db.get(request.email)
    if not hashed_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify the password
    if not pwd_context.verify(request.password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": request.email,
        "exp": datetime.now(timezone.utc) + access_token_expires
    }
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}
