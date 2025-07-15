from supabase_client import supabase
from datetime import datetime
from sentence_transformers import SentenceTransformer

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

def update_user_by_id(id: str, update_data: dict):
    """
    Update user information by email address.
    Only updates the fields provided in update_data.
    """
    # First verify the user exists
    user = get_user_by_id(id)
    if not user:
        raise ValueError(f"User with id {id} not found")
    
    # Update the user record
    response = supabase.table("User").update(update_data).eq("id", id).execute()
    
    if response.data:
        return response.data[0]
    else:
        raise ValueError("Failed to update user")

def get_onboarded_users_except_current(current_user_email: str):
    """
    Get all users who have completed onboarding, excluding the current user.
    Returns only the specified fields for the people discovery feature.
    """
    response = supabase.table("User").select(
        "id, first_name, last_name, bio, image_url, user_domain, user_sector, skills, linkedin_url, github_url, twitter_url"
    ).eq("has_onboarded", True).neq("email", current_user_email).execute()
    
    return response.data if response.data else []

def embed_user_and_add_to_recommendations(user: dict):
    """
    Embed a user and add their embedding to the user_vectors table and add the results to the recommendations table.
    """
    embedding = add_user_embedding(user)
    add_to_recommendations(embedding, user["id"])

def add_user_embedding(user: dict):
    """
    Add an embedding to the user's record.
    """
    
    #check if user already has an embedding
    response = supabase.table("user_vectors").select("*").eq("user_id", user["id"]).limit(1).execute()
    if response.data:
        return response.data[0]["embedding"]
    
    #otherwise, create an embedding and add it to the user_vectors table
    bio = user.get('bio', '')
    user_domain = ', '.join(user.get('user_domain', []))
    user_sector = ', '.join(user.get('user_sector', []))
    skills = ', '.join(user.get('skills', []))

    str_to_embed = (
        f"Bio: {bio}. "
        f"Domain: {user_domain}. "
        f"Sector: {user_sector}. "
        f"Skills: {skills}."
    )
    embedding = get_text_embedding(str_to_embed)
    supabase.table("user_vectors").insert({"user_id": user["id"], "embedding": embedding}).execute()
    
    return embedding

def add_to_recommendations(embedding: list, user_id: str):
    """
    Use a user's embedding to perform a similarity search on the user_vectors table and add the results to the recommendations table.
    """
    #get the ids of the top 10 most similar users based on a vector search with cosine similarity
    similar_users = get_similar_users_rpc(embedding, user_id)
    
    print(f"similar_users: {similar_users}")
    
    supabase.table("recommendations").upsert({
        "user_id": user_id,
        "recommended_user_ids": similar_users
    }).execute()

def get_text_embedding(text: str, model_name: str = 'all-MiniLM-L6-v2') -> list:
    """
    Generate an embedding for the given text using a sentence-transformers model.
    Returns the embedding as a list of floats.
    """
    model = SentenceTransformer(model_name)
    embedding = model.encode(text)
    return embedding.tolist()

def get_similar_users_rpc(embedding: list, user_id: str, top_n: int = 10):
    # Flatten if nested
    if isinstance(embedding[0], list):
        embedding = embedding[0]
    embedding_str = "[" + ",".join([str(x) for x in embedding]) + "]"
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
