from auth import get_current_user, decode_jwt_user_id
from services import jwt_service
from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, List
from services import user_service, jwt_service, like_service, match_service
from supabase_client import supabase
from fastapi import Depends, Body
import uuid
import os
import socketio
from dateutil.parser import isoparse
from limiter import get_redis, TokenBucket

# Simple URL validation functions
def validate_social_url(url: str, platform: str) -> bool:
    """Validate social media URL format"""
    if not url.strip():
        return platform == 'twitter'  # Twitter is optional, others required
    
    clean_url = url.strip().lower().replace('https://', '').replace('http://', '')
    
    if platform == 'linkedin':
        return (clean_url.startswith('linkedin.com/in/') or 
                clean_url.startswith('www.linkedin.com/in/')) and len(clean_url.split('/')) >= 3
    
    elif platform == 'github':
        return (clean_url.startswith('github.com/') or 
                clean_url.startswith('www.github.com/')) and len(clean_url.split('/')) >= 2
    
    elif platform == 'twitter':
        return any(clean_url.startswith(domain + '/') for domain in 
                  ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com']) and len(clean_url.split('/')) >= 2
    
    return False

def normalize_url(url: str) -> str:
    """Add https:// if no protocol specified"""
    if not url.strip():
        return url
    url = url.strip()
    return url if url.startswith(('http://', 'https://')) else f'https://{url}'

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=['http://localhost:3000']
)

chat_bucket = TokenBucket(get_redis(), capacity=10, refill_per_sec=0.5)

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
    # Password update fields
    password: Optional[str] = None
    current_password: Optional[str] = None
    # Email update field
    email: Optional[str] = None

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

@sio.event
async def connect(sid, environ):
    print("Socket connected:", sid)

@sio.event
async def joinRoom(sid, room_id):
    await sio.enter_room(sid, room_id)
    print(f"Socket {sid} joined room {room_id}")

@sio.event
async def sendMessage(sid, data):
    sender = data["from"]
    room_id = data["roomId"]
    if not sender or not room_id:
        return

    scope = "chat-send"
    identity = f"user:{sender}"

    allowed, retry_after, _ = await chat_bucket.allow(scope, identity)
    if not allowed:
        await sio.emit("rate_limited", {"retryAfter": retry_after}, room=sid)
        return

    res= supabase.table("Messages").insert({
        "match_id":  data["roomId"],
        "sender_id": data["from"],
        "content":   data["message"],
        "sent_at":   datetime.now(timezone.utc).isoformat()
    }).execute()

    await sio.emit("receiveMessage", data, room=data["roomId"])

@sio.event
def disconnect(sid):
    print("Socket disconnected:", sid)

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

    user_id = data.data[0]['id']

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
Upload profile image to Supabase Storage and return public URL.
Accepts image file and returns the public URL to store in database.
"""
@app.post("/upload-image", status_code=200)
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload image to Supabase Storage and return public URL.
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        content = await file.read()
        
        # Validate file size (max 5MB)
        if len(content) > 5 * 1024 * 1024:  # 5MB limit
            raise HTTPException(status_code=400, detail="File size must be less than 5MB")
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1] if file.filename else '.jpg'
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = f"profiles/{unique_filename}"
        
        # Upload to Supabase Storage
        try:
            result = supabase.storage.from_('profile-images').upload(file_path, content)
            
            if hasattr(result, 'error') and result.error:
                raise HTTPException(status_code=500, detail=f"Failed to upload image: {result.error}")
        except Exception as upload_error:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(upload_error)}")
        
        # Get public URL
        try:
            public_url_result = supabase.storage.from_('profile-images').get_public_url(file_path)
            
            # Handle different possible response formats
            if isinstance(public_url_result, dict):
                image_url = public_url_result.get('publicURL') or public_url_result.get('publicUrl')
            elif hasattr(public_url_result, 'get'):
                image_url = public_url_result.get('publicURL') or public_url_result.get('publicUrl')
            else:
                # Sometimes it might return the URL directly as a string
                image_url = str(public_url_result)
                
            if not image_url:
                raise HTTPException(status_code=500, detail="Failed to get public URL")
            
            return {
                "message": "Image uploaded successfully",
                "image_url": image_url,
                "file_path": file_path
            }
            
        except Exception as url_error:
            raise HTTPException(status_code=500, detail=f"Failed to get public URL: {str(url_error)}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

"""
Update user information during onboarding process.
Accepts any combination of user fields and updates them in the database.
Can be called multiple times to progressively update user information.
"""
@app.patch("/users/update", status_code=200)
def update_user_info(request: UserUpdateRequest, current_user: dict = Depends(get_current_user)):
    """
    Update user information during onboarding and profile management.
    Handles password changes, email updates, and regular profile updates.
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
        
        # Handle password update
        if request.password and request.current_password:
            # Verify current password
            stored_password = existing_user.get("password")
            if not stored_password:
                raise HTTPException(status_code=400, detail="Current password not found")
            
            if not pwd_context.verify(request.current_password, stored_password):
                raise HTTPException(status_code=400, detail="Current password is incorrect")
            
            # Hash the new password
            hashed_new_password = pwd_context.hash(request.password)
            
            # Update password in database
            password_update_data = {"password": hashed_new_password}
            user_service.update_user_by_id(user_id, password_update_data)
        
        elif request.password and not request.current_password:
            raise HTTPException(status_code=400, detail="Current password is required to change password")
        
        # Build update data from non-None fields, excluding password-related fields
        update_data = {}
        exclude_fields = {"password", "current_password"}
        
        for field, value in request.dict(exclude_unset=True).items():
            if value is not None and field not in exclude_fields:
                update_data[field] = value
        
        # Validate and normalize social media URLs
        social_fields = {
            "linkedin_url": "linkedin",
            "github_url": "github", 
            "twitter_url": "twitter"
        }
        
        for field, platform in social_fields.items():
            if field in update_data:
                url = update_data[field]
                if not validate_social_url(url, platform):
                    error_messages = {
                        "linkedin": "Invalid LinkedIn URL. Please use format: https://linkedin.com/in/username",
                        "github": "Invalid GitHub URL. Please use format: https://github.com/username",
                        "twitter": "Invalid Twitter/X URL. Please use format: https://x.com/username"
                    }
                    raise HTTPException(status_code=400, detail=error_messages[platform])
                update_data[field] = normalize_url(url)
        
        # Update other user information if there's data to update
        updated_user = existing_user
        if update_data:
            updated_user = user_service.update_user_by_id(user_id, update_data)

        # Handle onboarding completion
        if updated_user.get("has_onboarded"):
            # Embed the user and add their embedding to the user_vectors table and add the results to the recommendations table.    
            user_service.embed_user_and_add_to_recommendations(updated_user)
        
        # Build response message
        updated_fields = list(update_data.keys())
        if request.password and request.current_password:
            updated_fields.append("password")
        
        return {
            "message": "User information updated successfully",
            "updated_fields": updated_fields,
            "user": {key: value for key, value in updated_user.items() if key != "password"}  # Don't return password
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
        user_id = current_user.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get recommendations for the current user
        people = user_service.get_user_recommendations(user_id)
        
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
    
@app.get("/matches", status_code=200)
def get_matches(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(401, "Invalid token")
    return match_service.get_matches(user_id)

@app.get("/messages", status_code=200)
async def get_messages(matchId: str = Query(...)):
    if not matchId:
        return []

    response = supabase.table("Messages") \
        .select("*") \
        .eq("match_id", matchId) \
        .order("sent_at", desc=False) \
        .execute()

    if hasattr(response, "error") and response.error:
        raise HTTPException(500, str(response.error))
    
    transformed = [
        {
            "message": row["content"],
            "from": row["sender_id"],
            "timestamp": int(isoparse(row["sent_at"]).timestamp() * 1000),
        }
        for row in response.data
    ]
    return transformed

@app.get("/user")
def get_user_image(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        user = user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"image_url": user.get("image_url", "")}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve image: {str(e)}")


app = socketio.ASGIApp(sio, other_asgi_app=app)
