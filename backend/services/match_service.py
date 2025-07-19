from db import run_query

def get_matches(user_id: str):
    """
    Get all users matched with the given user_id.
    """
    query = """
        SELECT
            m.match_id,
            m.matched_at,
            /* full user record of the OTHER side of the match */
            to_jsonb(u) AS other_user
        FROM "Matches" m
        JOIN "User" u
          ON u.id = CASE
                      WHEN m.user1_id = %s THEN m.user2_id
                      ELSE m.user1_id
                    END
        WHERE (m.user1_id = %s OR m.user2_id = %s)
          AND u.has_onboarded = TRUE;
    """

    rows = run_query(query, (user_id, user_id, user_id))
    return rows if rows else []
