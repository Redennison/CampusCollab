from supabase_client import supabase

# def get_matches(user_id: str):
#     """
#     Get all matches
#     """
#     response = supabase.rpc("get_matched_users", {"target_user_id": user_id}).execute()    
#     return response.data if response.data else []

def get_matches(user_id: str):
    """
    Get all matches
    """
    response = supabase.rpc("matched_users_object", {"target_user_id": user_id}).execute()    
    return response.data if response.data else []