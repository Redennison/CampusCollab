# MatchaGoose

## Currently Supported Features
### Signup / login page
Frontend: `Login.tsx` \
Backend: `main.py`, `user_service.py`, `jwt_service.py`
### Onboarding pages
Frontend: `/app/onboarding/page.tsx` \
Backend: `main.py`, `user_service.py`, `auth.py`
### Swiping page
Frontend: `/app/home/page.tsx` \
Backend: `main.py`, `user_service.py`, `auth.py`
### Liking
Frontend: `/app/home/page.tsx` \
Backend: `main.py`, `user_service.py`, `like_service.py`
### Matching
Frontend: `/app/home/page.tsx` \
Backend: `main.py`, `user_service.py`, `like_service.py`

## Production Dataset
Generated using `/sql/generate_production_data.py`

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

## Signin and Sign up Page
<img width="2940" height="1446" alt="image" src="https://github.com/user-attachments/assets/f0a9b7b4-8487-4311-b32f-134f717635a6" />

## Onboarding Pages
<img width="2940" height="1446" alt="image" src="https://github.com/user-attachments/assets/4a64854b-8490-4312-8f12-98455adee724" />
<img width="2940" height="1446" alt="image" src="https://github.com/user-attachments/assets/fd7a3cc7-56ad-4582-aecd-c9a1e2cac619" />
<img width="2940" height="1446" alt="image" src="https://github.com/user-attachments/assets/fc5f3ee4-85e9-4555-8c42-1d518ea339f3" />
<img width="2940" height="1446" alt="image" src="https://github.com/user-attachments/assets/85cbdd0d-60f6-46b8-a02d-f2d20f94aa38" />


## Swiping Page
<img width="2940" height="1446" alt="image" src="https://github.com/user-attachments/assets/f5a6f9d4-3edc-48ee-9829-6b0fdacae003" />

## Chat Page
<img width="2940" height="1446" alt="image" src="https://github.com/user-attachments/assets/aaa57371-4182-4eb4-aef9-e109c419c30b" />


### Backend
Open a new terminal.\
`cd backend`\
`python3 -m venv venv`\
`source venv/bin/activate`\
`pip3 install -r requirements.txt`\
`python -m uvicorn main:app --reload`
