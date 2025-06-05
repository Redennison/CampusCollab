from supabase_client import supabase

def get_user_by_email(email: str):
    response = supabase.table("User").select("*").eq("email", email).limit(1).execute()
    return response.data[0] if response.data else None

def insert_user(email: str, password: str):
    return supabase.table("User").insert({"email": email, "password": password}).execute()
