from auth import get_current_user
from services import jwt_service
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from services import user_service
from supabase_client import supabase
from fastapi import Depends

# Define the request body model for sign up and sign in
class SignUpOrInRequest(BaseModel):
    email: str
    password: str

# Create a FastAPI app instance
app = FastAPI()

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

"""
Sign up a new user with email and password.
Password is hashed before storing.
Returns a success message if the email is not taken.
"""
@app.post("/signup", status_code=201)
def sign_up(request: SignUpOrInRequest):
    # Check if the email already exists using user_service
    existing_user = user_service.get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Hash the password before storing
    hashed_password = pwd_context.hash(request.password)

    # Store the user with hashed password
    user_service.insert_user(request.email, hashed_password)

    # Create JWT token
    token = jwt_service.create_jwt_token(request.email)

    # Return success message with JWT token
    return {"message": "Sign up successful", "access_token": token, "token_type": "bearer"}

"""
Sign in a user by verifying email and password.
Returns a JWT if authentication is successful.
"""
@app.post("/signin", status_code=200)
def sign_in(request: SignUpOrInRequest):
    # Check if the user exists
    user = user_service.get_user_by_email(request.email)
    hashed_password = user.get("password")
    if not hashed_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify the password
    if not pwd_context.verify(request.password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create JWT token
    token = jwt_service.create_jwt_token(user['id'])
    return {"access_token": token, "token_type": "bearer"}

"""
Test route to verify the get_current_user middleware.
Returns the current user's id if the token is valid.
"""
@app.get("/me", status_code=200)
def get_me(current_user: dict = Depends(get_current_user)):
    return {"user_id": current_user["user_id"]}
