select user_id
from user_vectors
where user_id != current_user_id
order by embedding <=> input_embedding
limit n;
