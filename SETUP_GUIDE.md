# Kootukudil Setup

## Prerequisites

- Python and a MongoDB connection string
- Node.js 20+ for the Vite web app
- Node.js 22.13+ for Expo SDK 58 (`nvm use 22`)
- Android Studio/Android SDK for local Android builds, or an Expo/EAS account for cloud APK builds

## Environment

Copy `.env.example` to `backend/.env`. Set `MONGODB_URL` and a strong `JWT_SECRET_KEY` (at least 32 bytes). `MONGODB_DB_NAME` defaults to `kootukudil`; `CORS_ORIGINS` defaults to the local web origin `http://localhost:3001`.

The backend uses environment-provided database and JWT settings and fails startup when the required MongoDB URL or JWT secret is missing/weak. Do not commit `.env`.

## Start services

Backend:

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Web frontend, in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Mobile app, in another terminal:

```bash
cd mobile
nvm use 22
cp .env.example .env
npm install
npm start
```

Android emulator uses `http://10.0.2.2:8001`. A physical phone must use the development computer's LAN IP in `EXPO_PUBLIC_API_URL` and be able to reach port `8001`.

## First administrator

Register through Kootukudil, then manually set `is_super_admin: true` for the intended user document in MongoDB. There is deliberately no public administrator registration or bootstrap route.

## APK

From `mobile/`, sign in to EAS and run:

```bash
nvm use 22
npx eas-cli login
npm run android:apk
```

The `preview` EAS profile creates an installable APK. iOS packaging/distribution is deferred. See [mobile/README.md](mobile/README.md) for more details.
