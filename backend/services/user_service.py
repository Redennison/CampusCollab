from supabase_client import supabase

def get_user_by_email(email: str):
    return supabase.table("User").select("*").eq("email", email).single().execute()

def insert_user(email: str, password: str):
    return supabase.table("User").insert({"email": email, "password": password}).execute()
