from db import run_query
from datetime import datetime
from sentence_transformers import SentenceTransformer
from typing import List

model = SentenceTransformer('all-MiniLM-L6-v2')

def get_user_by_email(email: str):
    query = '''
        SELECT * FROM "User"
        WHERE email = %s
        LIMIT 1
    '''
    rows = run_query(query, (email,))
    return rows[0] if rows else None

def get_user_by_id(id: str):
    query = '''
        SELECT * FROM "User"
        WHERE id = %s
        LIMIT 1
    '''
    rows = run_query(query, (id,))
    return rows[0] if rows else None

def insert_user(email: str, password: str):
    query = '''
        INSERT INTO "User" (email, password, has_onboarded, last_login)
        VALUES (%s, %s, %s, %s)
        RETURNING *
    '''
    params = (email, password, False, datetime.now().isoformat())
    rows = run_query(query, params)
    return rows[0] if rows else None

def update_user_by_id(id: str, update_data: dict) -> dict:
    """
    Update user information by ID.
    Only updates the fields provided in update_data.
    """
    # First verify the user exists
    user = get_user_by_id(id)
    if not user:
        raise ValueError(f"User with id {id} not found")
    
    if not update_data:
        raise ValueError("No data provided to update.")

    # Build dynamic SET clause
    set_clause = ", ".join(f'{key} = %s' for key in update_data.keys())
    values = list(update_data.values())
    values.append(id)  # for the WHERE clause

    query = f'''
        UPDATE "User"
        SET {set_clause}
        WHERE id = %s
        RETURNING *
    '''

    rows = run_query(query, tuple(values))
    if rows:
        return rows[0]
    else:
        raise ValueError("Failed to update user")

def get_onboarded_users_except_current(user_id: str):
    """
    Get all users who have completed onboarding, excluding the current user.
    Returns only the specified fields for the people discovery feature.
    """
    query = '''
        SELECT id, first_name, last_name, bio, image_url, user_domain, user_sector,
               skills, linkedin_url, github_url, twitter_url
        FROM "User"
        WHERE has_onboarded = TRUE AND id != %s
    '''
    rows = run_query(query, (user_id,))
    return rows if rows else []

def get_user_recommendations(user_id: str):
    """
    Get the recommendations for a user.
    """
    # Try to fetch recommendations
    query = 'SELECT * FROM "recommendations" WHERE user_id = %s LIMIT 1'
    rows = run_query(query, (user_id,))

    # If no recommendations exist, generate them
    if not rows or not rows[0]["recommended_user_ids"]:
        user = get_user_by_id(user_id)
        embed_user_and_add_to_recommendations(user)
        rows = run_query(query, (user_id,))

    recommended_ids = rows[0]["recommended_user_ids"]
    
    query = 'SELECT likee_id FROM "Likes" WHERE liker_id = %s'
    liked_ids = run_query(query, (user_id,))
    liked_id_set = {row['likee_id'] for row in liked_ids}
    recommended_ids = [uid for uid in recommended_ids if str(uid) not in liked_id_set]
    
    # Fetch the actual recommended users
    if recommended_ids:
        placeholders = ', '.join(['%s'] * len(recommended_ids))
        user_query = f'SELECT * FROM "User" WHERE id IN ({placeholders})'
        recommended_users = run_query(user_query, tuple(recommended_ids))
        if recommended_users:
            user_dict = {user['id']: user for user in recommended_users}
            ordered_users = [user_dict[str(uid)] for uid in recommended_ids if str(uid) in user_dict]
            return ordered_users or get_onboarded_users_except_current(user_id)
    
    # No recommendations in list — fallback
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

    # Upsert embedding into user_vectors table
    upsert_query = '''
        INSERT INTO user_vectors (user_id, embedding)
        VALUES (%s, %s)
        ON CONFLICT (user_id)
        DO UPDATE SET embedding = EXCLUDED.embedding
    '''
    run_query(upsert_query, (user["id"], embedding))

    return embedding

def add_to_recommendations(embedding: List[float], user_id: str):
    """
    Use a user's embedding to perform a similarity search on the user_vectors table
    and upsert the results into the recommendations table.
    """
    similar_users = get_similar_users(embedding, user_id)

    # Upsert into recommendations table
    upsert_query = '''
        INSERT INTO recommendations (user_id, recommended_user_ids)
        VALUES (%s, %s)
        ON CONFLICT (user_id)
        DO UPDATE SET recommended_user_ids = EXCLUDED.recommended_user_ids
    '''
    run_query(upsert_query, (user_id, similar_users))

def get_text_embedding(text: str) -> List[float]:
    """
    Generate an embedding for the given text using a sentence-transformers model.
    Returns the embedding as a list of floats.
    """
    embedding = model.encode(text)
    return embedding.tolist()

def get_similar_users(embedding: List[float], user_id: str, top_n: int = 10) -> List[str]:
    """
    Perform a vector similarity search using SQL and pgvector.
    Returns a list of user_ids most similar to the input embedding, excluding the given user_id.
    """
    # Flatten if needed
    if isinstance(embedding[0], list):
        embedding = embedding[0]

    query = '''
        SELECT user_id
        FROM "user_vectors"
        WHERE user_id != %s
        ORDER BY embedding <=> %s::vector
        LIMIT %s
    '''

    try:
        rows = run_query(query, (user_id, embedding, top_n))
        return [row["user_id"] for row in rows]
    except Exception as e:
        print("Exception during similarity search:", e)
        return []
