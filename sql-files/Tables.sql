CREATE TABLE likes (
  like_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id    uuid NOT NULL REFERENCES "User"(id),
  likee_id    uuid NOT NULL REFERENCES "User"(id),
  liked_at    timestamp NOT NULL
);

CREATE TABLE matches (
  match_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id    uuid NOT NULL REFERENCES "User"(id),
  user2_id    uuid NOT NULL REFERENCES "User"(id),
  matched_at    timestamp NOT NULL
);

CREATE TABLE messages (
  message_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id    uuid NOT NULL REFERENCES "matches"(match_id),
  sender_id    uuid NOT NULL REFERENCES "User"(id),
  content text NOT NULL,
  sent_at timestamp NOT NULL
);

CREATE TABLE similarity (
  similarity_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  looking_user_id    uuid NOT NULL REFERENCES "User"(id),
  offering_user_id    uuid NOT NULL REFERENCES "User"(id),
  similarity numeric(6,5) NOT NULL
);