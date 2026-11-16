# Kootukudil Mobile

Standalone Expo + React Native application. It runs in parallel with the Vite web app in `../frontend` and talks to the FastAPI service in `../backend`.

## Requirements

- Node.js 22.13 or newer (use the repository's nvm setup if available)
- npm
- Expo Go for device development, or Android Studio/Android SDK for local native builds
- Backend running on port `8001`

## Configure and run

```bash
nvm use 22
cp .env.example .env
npm install
npm start
```

For the Android emulator, the default API address `http://10.0.2.2:8001` reaches the host machine. For a physical phone, set `EXPO_PUBLIC_API_URL` in `.env` to the computer's LAN address, for example `http://192.168.1.20:8001`. The computer and phone must be on the same network, and the backend must allow inbound connections on port `8001`.

Use the Expo terminal controls to open the app on an Android emulator or scan the development QR code with Expo Go. For iOS Simulator development, set `EXPO_PUBLIC_API_URL=http://localhost:8001`; iOS packaging and distribution remain out of scope.

## Features

- Internal email/password login and registration
- Apartment, flat, and Owner/Tenant registration
- Pending membership approval with eligible approver names
- Apartment selection and apartment-scoped EB accounts
- Common and Individual EB bills with server-calculated balances
- Multiple payments per bill and editing one's own payment
- Membership, apartment, and EB approval inbox
- OS-backed access-token storage through Expo SecureStore

## Android APK

The EAS `preview` profile produces an installable APK. Before building, configure `EXPO_PUBLIC_API_URL` in the EAS `preview` environment to the deployed HTTPS API URL. Do not ship the local Android emulator fallback in a production APK. Set the profile's `environment` to `preview` in `eas.json`.

```bash
npx eas-cli login
npx eas-cli build:configure
npx eas-cli env:set --name EXPO_PUBLIC_API_URL --value https://api.example.com --environment preview --visibility plaintext
npm run android:apk
```

Android builds need a valid Expo/EAS account. For local builds, install Android Studio and the Android SDK, then generate native Android files with `npx expo prebuild --platform android` and run the Gradle assemble task. Do not commit generated native folders unless the project moves to an explicitly maintained bare workflow.

## API and permissions

The app sends a Kootukudil bearer token and `X-Apartment-ID` on apartment-scoped requests. The backend remains authoritative for membership approval, apartment/flat isolation, EB access, payment ownership, and balance calculations. Configure backend `CORS_ORIGINS` for browser-based Expo web use; native Android requests do not rely on browser CORS.
