from supabase_client import supabase

def get_matches(user_id: str):
    """
    Get all users matched with the given user_id.
    """
    response = supabase.rpc("matched_users_object", {"target_user_id": user_id}).execute()    
    return response.data if response.data else []
