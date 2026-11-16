# Kootukudil

Kootukudil is a multi-apartment management application. The current implementation focuses on internal accounts, apartment/flat memberships and approvals, and Common/Individual EB bill and payment management.

## Project layout

```text
backend/   FastAPI API and MongoDB domain services
frontend/  React + Vite web client
mobile/    Expo + React Native app for Android and iOS-ready development
```

## Stack

- Web: React 18, TypeScript, Vite, React Router, Tailwind CSS
- Mobile: React Native, Expo SDK 58, Expo Router, SecureStore
- API: Python, FastAPI, Pydantic 2, Motor, MongoDB
- Authentication: Internal email/password, bcrypt, signed JWT
- Mobile Android distribution: Expo Application Services (EAS)

## Local setup

Copy `.env.example` to `backend/.env` and configure `MONGODB_URL` and a strong `JWT_SECRET_KEY`. The configured MongoDB database name defaults to `kootukudil`. Never commit credentials.

### Backend

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

API documentation: `http://localhost:8001/docs`.

### Web

```bash
cd frontend
npm install
npm run dev
```

Web development URL: `http://localhost:3001`.

### Mobile

```bash
cd mobile
nvm use 22
cp .env.example .env
npm install
npm start
```

For an Android emulator, the default API address is `http://10.0.2.2:8001`. For a physical device, set `EXPO_PUBLIC_API_URL` to the host computer's LAN address. See [mobile/README.md](mobile/README.md) for APK build setup.

The repository-level `start.sh` starts the backend and web frontend. It does not start the mobile development server.

## Initial Super Admin

There is no public Super Admin registration or bootstrap endpoint. A developer must create an account through internal registration and manually set `is_super_admin: true` on that user document in MongoDB. Ordinary registration cannot set this flag.

New apartment and membership requests are pending until an eligible approver approves them. Pending users cannot access protected EB APIs.

## EB behavior

Bills belong to an EB account, not directly to a user. Common EB is apartment-scoped; Individual EB is flat-scoped and must be enabled for that flat. Payments are separate records linked to a bill and include payer and payment date. The backend derives previous balance, total payable, amount paid, closing balance, and payment status.

The backend is authoritative for apartment/flat scope, membership permissions, approvals, payment ownership, and balance validation. Audit logs and backup/recovery are not part of this phase.

## Validation

```bash
cd backend && .venv/bin/python -m compileall -q app
cd ../frontend && npx tsc --noEmit && npm run build
cd ../mobile && nvm use 22 && npm run lint && npm run typecheck
```
