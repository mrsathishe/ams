# Kootukudil Web

The web client is a React + Vite + TypeScript application. It runs in parallel with the Expo React Native app in `../mobile` and uses the FastAPI service in `../backend`.

## Features

- Combined Login/Register flow with apartment, flat, and Owner/Tenant registration
- Pending membership approval experience
- Apartment selection with scoped Common and Individual EB accounts
- EB bills with derived balances/status and multiple payment rows
- Payment ownership controls and membership/EB approval inbox
- Apartment membership and flat-setting management for authorized users

Authorization and all balance calculations are enforced by the backend; the frontend only reflects the permissions returned by the API.

## Run

```bash
npm install
npm run dev
```

Vite listens on `http://localhost:3001`; the API defaults to `http://localhost:8001` in `lib/api.ts`.

## Validate

```bash
npx tsc --noEmit
npm run lint
npm run build
```
