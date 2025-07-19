from db import run_query

def is_match(liker_id: str, likee_id: str) -> bool:
    """
    Check if both users have liked each other (mutual match).
    Returns True if a match exists, otherwise False.
    """
    query = '''
        SELECT 1 FROM "Likes"
        WHERE liker_id = %s AND likee_id = %s
        LIMIT 1
    '''

    like1 = run_query(query, (liker_id, likee_id))
    like2 = run_query(query, (likee_id, liker_id))

    return bool(like1) and bool(like2)
