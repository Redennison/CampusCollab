from auth import get_current_user
from services import jwt_service
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, List
from services import user_service, jwt_service, like_service
from supabase_client import supabase
from fastapi import Depends, Body

# Define the request body model for sign up and sign in
class SignUpOrInRequest(BaseModel):
    email: str
    password: str

# Define the request body model for user updates during onboarding
class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    user_domain: Optional[List[str]] = None
    desired_domain: Optional[List[str]] = None
    user_sector: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    desired_skills: Optional[List[str]] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    other_url: Optional[str] = None
    has_onboarded: Optional[bool] = None

# Define the response model for people discovery
class PeopleResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    bio: Optional[str] = None
    image_url: Optional[str] = None
    user_domain: List[str]
    user_sector: List[str]
    skills: List[str]
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None

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
    data = user_service.insert_user(request.email, hashed_password)
    print({"data is going to be": data})  

    user_id = data.data[0]['id']

    print({"user_id is": user_id})
    # Create JWT token
    token = jwt_service.create_jwt_token(user_id)

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
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    hashed_password = user.get("password")
    if not hashed_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify the password
    if not pwd_context.verify(request.password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = user.get("id")
    # Create JWT token
    token = jwt_service.create_jwt_token(user_id)
    return {"access_token": token, "token_type": "bearer"}

"""
Get current user's profile information.
Returns the user's profile data including onboarding status.
"""
@app.get("/users/me", status_code=200)
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Get current user's profile information.
    Returns user data including has_onboarded status.
    """
    try:
        # Get user email from JWT token
        user_id = current_user.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user data
        user = user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Remove sensitive information
        user_data = {key: value for key, value in user.items() if key != "password"}
        
        return user_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user profile: {str(e)}")

"""
Update user information during onboarding process.
Accepts any combination of user fields and updates them in the database.
Can be called multiple times to progressively update user information.
"""
@app.patch("/users/update", status_code=200)
def update_user_info(request: UserUpdateRequest, current_user: dict = Depends(get_current_user)):
    """
    Update user information during onboarding.
    Only updates fields that are provided in the request.
    """
    try:
        # Get user email from JWT token (the user_id in JWT is actually the email)
        user_id = current_user.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Check if user exists
        existing_user = user_service.get_user_by_id(user_id)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Build update data from non-None fields
        update_data = {}
        for field, value in request.dict(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        # Only proceed if there's data to update
        if not update_data:
            return {"message": "No data provided for update"}
        
        # Update user information
        updated_user = user_service.update_user_by_id(user_id, update_data)
        
        return {
            "message": "User information updated successfully",
            "updated_fields": list(update_data.keys()),
            "user": updated_user
        }
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")

"""
Get all users who have completed onboarding, excluding the current user.
Returns a list of users with their profile information for discovery.
"""
@app.get("/people", response_model=List[PeopleResponse], status_code=200)
def get_people(current_user: dict = Depends(get_current_user)):
    """
    Get all onboarded users except the current user.
    Returns user profiles for the people discovery feature.
    """
    try:
        # Get user email from JWT token
        user_id = current_user.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get all onboarded users except the current user
        people = user_service.get_onboarded_users_except_current(user_id)
        
        for person in people:
            for field in ["bio", "image_url", "linkedin_url", "github_url", "twitter_url"]:
                if person.get(field) is None:
                    person[field] = ""
        return people
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch people: {str(e)}")

@app.post("/like", status_code=201)
def like_user(
    likee_id: str = Body(..., embed=True),
    current_user: dict = Depends(get_current_user)
):
    """
    Like another user. The current user (liker) likes the user with likee_id.
    """
    try:
        # Get current user's email and fetch their user record to get the UUID
        user_id = current_user.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        liker = user_service.get_user_by_id(user_id)
        if not liker or not liker.get("id"):
            raise HTTPException(status_code=404, detail="Liker user not found")
        liker_id = liker["id"]

        # Insert the like into the Likes table
        supabase.table("Likes").insert({
            "liker_id": liker_id,
            "likee_id": likee_id,
            "liked_at": datetime.utcnow().isoformat()
        }).execute()

        # Boolean to notify client of match
        # Note that adding to match table is handled via trigger
        is_match = like_service.is_match(liker_id, likee_id)

        response = {
            "message": "User liked successfully",
            "is_match": is_match,
        }

        if is_match:
            matched_with = user_service.get_user_by_id(likee_id)
            response["matched_with"] = matched_with['first_name']

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to like user: {str(e)}")