from supabase_client import supabase
from datetime import datetime
from sentence_transformers import SentenceTransformer
from typing import List

model = SentenceTransformer('all-MiniLM-L6-v2')

def get_user_by_email(email: str):
    response = supabase.table("User").select("*").eq("email", email).limit(1).execute()
    return response.data[0] if response.data else None

def get_user_by_id(id: str):
    response = supabase.table("User").select("*").eq("id", id).limit(1).execute()
    return response.data[0] if response.data else None

def insert_user(email: str, password: str):
    return supabase.table("User").insert({
        "email": email, 
        "password": password, 
        "has_onboarded": False, 
        "last_login": datetime.now().isoformat()
    }).execute()

def update_user_by_id(id: str, update_data: dict) -> dict:
    """
    Update user information by ID.
    Only updates the fields provided in update_data.
    """
    response = supabase.table("User").update(update_data).eq("id", id).execute()
    
    if response.data:
        return response.data[0]
    raise ValueError("Failed to update user")

def get_onboarded_users_except_current(user_id: str):
    """
    Get all users who have completed onboarding, excluding the current user.
    Returns only the specified fields for the people discovery feature.
    """
    response = supabase.table("User").select(
        "id, first_name, last_name, bio, image_url, user_domain, user_sector, skills, linkedin_url, github_url, twitter_url"
    ).eq("has_onboarded", True).neq("id", user_id).execute()
    
    return response.data if response.data else []

def get_user_recommendations(user_id: str):
    """
    Get the recommendations for a user.
    """

    recommended_user_ids = supabase.table("recommendations").select("*").eq("user_id", user_id).execute()

    # If user's recommendations don't exist
    if not recommended_user_ids.data:
        user = get_user_by_id(user_id)
        embed_user_and_add_to_recommendations(user)
        recommended_user_ids = supabase.table("recommendations").select("*").eq("user_id", user_id).execute()

    recommended_users = supabase.table("User").select("*").in_("id", recommended_user_ids.data[0]["recommended_user_ids"]).execute()
    if recommended_users.data:
        return recommended_users.data
    # Fallback for the users without embeddings and recommendations yet (old users)
    return get_onboarded_users_except_current(user_id)

def embed_user_and_add_to_recommendations(user: dict):
    """
    Embed a user and add their embedding to the user_vectors table and add the results to the recommendations table.
    """
    embedding = add_user_embedding(user)
    add_to_recommendations(embedding, user["id"])

def add_user_embedding(user: dict) -> List[float]:
    """
    Generate and upsert an embedding for the user.
    Returns the embedding.
    """
    # Check if the embedding already exists
    response = supabase.table("user_vectors").select("*").eq("user_id", user["id"]).limit(1).execute()
    if response.data:
        return response.data[0]["embedding"]

    # Generate string to embed
    bio = user.get('bio', '')
    user_domain = ', '.join(user.get('user_domain', []))
    user_sector = ', '.join(user.get('user_sector', []))
    desired_skills = ', '.join(user.get('desired_skills', []))
    desired_domain = ', '.join(user.get('desired_domain', []))
    skills = ', '.join(user.get('skills', []))

    str_to_embed = (
        f"Bio: {bio}."
        f"Domain: {user_domain}."
        f"Sector: {user_sector}."
        f"Skills: {skills}."
        f"Desired Skills: {desired_skills}."
        f"Desired Domain: {desired_domain}."
    )

    # Generate embedding
    embedding = get_text_embedding(str_to_embed)
    supabase.table("user_vectors").insert({"user_id": user["id"], "embedding": embedding}).execute()

    return embedding

def add_to_recommendations(embedding: List[float], user_id: str):
    """
    Use a user's embedding to perform a similarity search on the user_vectors table
    and upsert the results into the recommendations table.
    """
    similar_users = get_similar_users_rpc(embedding, user_id)

    # Upsert into recommendations table
    supabase.table("recommendations").upsert({
        "user_id": user_id,
        "recommended_user_ids": similar_users
    }).execute()

def get_text_embedding(text: str) -> List[float]:
    """
    Generate an embedding for the given text using a sentence-transformers model.
    Returns the embedding as a list of floats.
    """
    embedding = model.encode(text)
    return embedding.tolist()

def get_similar_users_rpc(embeddings: list, user_id: str, top_n: int = 10):
    # Flatten if nested

    if isinstance(embeddings[0], list):
        embeddings = embeddings[0]
    embedding_str = "[" + ",".join([str(x) for x in embeddings]) + "]"

    try:
        response = supabase.rpc(
            "get_similar_users",
            {
                "input_embedding": embedding_str,
                "current_user_id": user_id,
                "n": top_n
            }
        ).execute()
        return [row["user_id"] for row in response.data]
    except Exception as e:
        print("Exception during Supabase RPC:", e)
        return []
