import os
import uuid
import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv
from typing import Any, List, Optional, Tuple
from uuid import UUID

load_dotenv()
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")

def parse_pg_array_string(s: str) -> list[str]:
    s = s.strip('{}')
    return [item.strip('"') for item in s.split(',') if item]

def normalize_row(row: dict) -> dict:
    result = {}
    for key, value in row.items():
        if isinstance(value, UUID):
            result[key] = str(value)
        elif isinstance(value, str) and value.startswith("{") and value.endswith("}"):
            result[key] = parse_pg_array_string(value)
        else:
            result[key] = value
    return result

def run_query(query: str, params: Optional[Tuple[Any, ...]] = None) -> List[dict]:
    with psycopg.connect(SUPABASE_DB_URL, row_factory=dict_row) as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            if cur.description:
                raw_rows = cur.fetchall()
                return [normalize_row(row) for row in raw_rows]
            return []
