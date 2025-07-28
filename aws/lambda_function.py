import os
from supabase import create_client

# Load .env locally, skip in Lambda
if not os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
    from dotenv import load_dotenv
    load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_similar_users_rpc(embedding: list, user_id: str, top_n: int = 10):
    # Flatten if nested
    if isinstance(embedding[0], list):
        embedding = embedding[0]
    try:
        '''
            Here is the associated SQL for the get_similar_users function:

            select user_id
            from user_vectors
            where user_id != current_user_id
            order by embedding <=> input_embedding
            limit n;
        '''
        response = supabase.rpc(
            "get_similar_users",
            {
                "input_embedding": embedding,
                "current_user_id": user_id,
                "n": top_n
            }
        ).execute()
        return [row["user_id"] for row in response.data]
    except Exception as e:
        print("Exception during Supabase RPC:", e)
        return []

def update_all_recommendations():
    """
    For all onboarded users with existing embeddings,
    recompute and update the recommended users list.
    """
    # This performs a join between the User and user_vectors table on user.id = user_vectors.user_id
    '''
        Here is the associated SQL for the code below:

        SELECT "User".id, "user_vectors".embedding
        FROM "User"
        JOIN "user_vectors" ON "User".id = "user_vectors".user_id
        WHERE "User".has_onboarded = TRUE;
    '''
    
    response = (
        supabase
        .table("User")
        .select("id, user_vectors(embedding)")
        .eq("has_onboarded", True)
        .execute()
    )

    users = response.data or []

    for user in users:
        user_id = user["id"]
        user_vectors = user.get("user_vectors")
        embedding = user_vectors["embedding"] if user_vectors else None
        if not embedding: continue

        similar_users = get_similar_users_rpc(embedding, user_id)

        '''
            Here is the associated SQL for the code below:

            INSERT INTO "recommendations" (user_id, recommended_user_ids)
            VALUES ('<user_id>', ARRAY['<id1>', '<id2>', ..., '<idN>'])
            ON CONFLICT (user_id)
            DO UPDATE SET recommended_user_ids = EXCLUDED.recommended_user_ids;
        '''

        supabase.table("recommendations").upsert({
            "user_id": user_id,
            "recommended_user_ids": similar_users
        }).execute()

def lambda_handler(event, context):
    update_all_recommendations()
    return {"status": "success"}