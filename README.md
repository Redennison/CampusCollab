# MatchaGoose

## Currently Supported Features
### Signup / login page
Frontend: `Login.tsx` \
Backend: `main.py`, `user_service.py`, `jwt_service.py`
### Onboarding pages
Frontend: `/app/onboarding/page.tsx`
Backend: `main.py`, `user_service.py`, `auth.py`
### Swiping page
Frontend: `/app/home/page.tsx`
Backend: `main.py`, `user_service.py`, `auth.py`
### Liking
Frontend: `/app/home/page.tsx`
Backend: `main.py`, `user_service.py`, `like_service.py`
### Matching
Frontend: `/app/home/page.tsx`
Backend: `main.py`, `user_service.py`, `like_service.py`

## Setup

### Environment Variables
Create a `.env` file in the backend directory with the following variables:\
`SUPABASE_URL=https://xpssholimgirhamcnrpq.supabase.co/`

Read-only key:\
`SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwc3Nob2xpbWdpcmhhbWNucnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzAzODIsImV4cCI6MjA2MzM0NjM4Mn0.VuyRWk75KymzsmPUWWFqxYWQrSkEvI4YlXtHeScWrMc`

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
