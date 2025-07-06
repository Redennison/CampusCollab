from supabase_client import supabase
from datetime import datetime

def get_user_by_email(email: str):
    response = supabase.table("User").select("*").eq("email", email).limit(1).execute()
    return response.data[0] if response.data else None

def insert_user(email: str, password: str):
    return supabase.table("User").insert({
        "email": email, 
        "password": password, 
        "has_onboarded": False, 
        "last_login": datetime.now().isoformat()
    }).execute()

def update_user_by_email(email: str, update_data: dict):
    """
    Update user information by email address.
    Only updates the fields provided in update_data.
    """
    # First verify the user exists
    user = get_user_by_email(email)
    if not user:
        raise ValueError(f"User with email {email} not found")
    
    # Update the user record
    response = supabase.table("User").update(update_data).eq("email", email).execute()
    
    if response.data:
        return response.data[0]
    else:
        raise ValueError("Failed to update user")
