# MatchaGoose

**A smarter way to meet builders on campus.**  
MatchaGoose is a full-stack web application that helps university students connect with like-minded peers based on shared skills, interests, and project goals. Whether you're looking for a hackathon partner, startup co-founder, or just someone to collaborate with, MatchaGoose helps you discover and connect with the right people.

---

## Features

### 👤 User Experience
- **Signup & Login** – Secure account creation and authentication using hashed passwords.
- **Onboarding** – Multi-step onboarding flow where users provide skills, interests, and profile info.
- **Swiping Interface** – Swipe through curated recommendations and express interest by liking or skipping.
- **Real-Time Chat** – Matched users can chat in real time using sockets.
- **Profile Management** – Users can update their bio, skills, social links, and account credentials.

### 🤖 Smart Matching
- **Vector Embeddings** – User profiles are embedded using a SentenceTransformer model for semantic similarity.
- **Recommendation Engine** – Similar users are ranked using cosine similarity and stored for quick access.
- **Scheduled Updates** – An AWS Lambda function periodically updates recommendations in the background.
- **Automatic Matching** – When two users like each other, they are matched automatically and can begin chatting.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/)
- **UI**: Tailwind CSS, Framer Motion, Radix UI, MUI, Lucide Icons
- **Real-Time**: socket.io-client

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Auth & Security**: bcrypt, Passlib, python-jose
- **Realtime Messaging**: python-socketio
- **Environment Management**: python-dotenv
- **Database Driver**: psycopg (PostgreSQL client)

### Machine Learning
- **Embeddings**: `sentence-transformers` (MiniLM model)

### Infrastructure
- **Database**: PostgreSQL (hosted on [Supabase](https://supabase.com/))
- **Scheduled Tasks**: AWS Lambda + EventBridge (for recommendation updates)

---

## Setup

### Frontend
`cd frontend`\
`npm install`\
`npm run dev`

### Backend
Open a new terminal.\
`cd backend`\
`python3 -m venv venv`\
`source venv/bin/activate`\
`pip3 install -r requirements.txt`\
`python -m uvicorn main:app --reload`

