from supabase_client import supabase

def is_match(liker_id: str, likee_id: str) -> bool:
    """
    Check if both users have liked each other (mutual match).
    Returns True if a match exists, otherwise False.
    """
    # Check if user1 liked user2
    like1 = supabase.table("Likes") \
        .select("like_id") \
        .eq("liker_id", liker_id) \
        .eq("likee_id", likee_id) \
        .limit(1) \
        .execute()
    
    # Check if user2 liked user1
    like2 = supabase.table("Likes") \
        .select("like_id") \
        .eq("liker_id", likee_id) \
        .eq("likee_id", liker_id) \
        .limit(1) \
        .execute()
    
    return bool(like1.data) and bool(like2.data)
