# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AptSync is an apartment management system with a Flask backend and React (Vite) frontend. The system handles user authentication, expense tracking, payments, and document management for apartment complexes.

## Architecture

**Backend (Flask + MongoDB)**
- `backend/app/` - Main application directory
- `backend/app/routes/routes.py` - API endpoints with `/api` prefix
- `backend/app/services/` - Business logic services (auth, user management)
- `backend/app/models/` - MongoDB models using MongoEngine
- `backend/app/utils/` - Utilities for JWT, password hashing, responses
- `backend/run.py` - Application entry point (runs on port 6000)

**Frontend (React + Vite + TypeScript)**
- `frontend/src/pages/` - Route components (Home, Login, Register, Dashboard, Admin, Profile)
- `frontend/src/lib/` - API client, authentication context, and auth hooks
- `frontend/src/components/` - Reusable UI components
- `frontend/src/Router.tsx` - React Router configuration
- Uses Tailwind CSS, Chart.js, and React Hook Form

## Development Commands

### Start Both Services
```bash
./start.sh
```
This starts both backend (port 6000) and frontend (port 5173) concurrently.

### Backend Only
```bash
cd backend
source venv/bin/activate  # Activate virtual environment
python run.py
```

### Frontend Only
```bash
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
```

## Database Configuration

- Uses MongoDB Atlas cloud database
- Configuration in `backend/app/config.py` 
- Connects via environment variables (MONGODB_USER_NAME, MONGODB_PASSWORD, MONGODB_URI)
- Falls back to local MongoDB if credentials not found
- Database name: "ams"

## Authentication Flow

- JWT-based authentication with access and refresh tokens
- Services: login, register, logout, refresh, update_password
- Protected routes use JWT validation
- Frontend uses React Context for auth state management

## Key Files to Understand

- `backend/app/__init__.py` - Flask app factory and MongoDB setup
- `backend/app/routes/routes.py` - All API endpoints
- `frontend/src/lib/api.ts` - API client configuration
- `frontend/src/lib/useAuth.ts` - Authentication hook
- `start.sh` - Development startup script

## Port Configuration

- Backend API: http://localhost:6000
- Frontend: http://localhost:5173  
- API Documentation: http://localhost:6000/docs (if using FastAPI, but currently Flask)

## Project Structure Notes

- The `nextjs_bk/` directory contains old Next.js code (backup)
- Current frontend uses Vite + React Router instead of Next.js
- The `bck_bk/` and `old/` directories contain legacy code