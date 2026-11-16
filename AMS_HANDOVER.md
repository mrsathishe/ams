# Kootukudil Implementation Handover

**Status date:** 2026-11-16  
**Branch:** `kootukudil`  
**Base:** `3cbe7a9` (`origin/refractor`)  
**Commit status:** Work is present in the `kootukudil` working tree but is not committed. Do not reset or discard it. Existing deletions and the user's `docs/` files are preserved.

## Repository State

The branch is `kootukudil`. The worktree is intentionally dirty: it includes the approved implementation changes, generated `mobile/` project, refreshed documentation, and pre-existing uncommitted deletions of older instruction/scripts. No changes were staged or committed. Run `git status --short --branch` before making further changes.

## Implemented

### Backend

- Internal email/password registration and JWT login. External token exchange and public debug routes are absent from `app/main.py`.
- Password hashes use bcrypt; client-provided role fields are not accepted. Super Admin is a manually assigned `users.is_super_admin` database flag.
- New users create pending apartment/flat memberships. Current-user response includes membership state, approval rule, and eligible approver names without contact fields.
- Apartment/flat registration, apartment/member views, configurable Tenant membership approvers, permission updates, apartment change requests, and an approval inbox are implemented.
- Apartment detail changes require two different Owner approvals, or one other Owner when there are exactly two. Super Admin can approve/override. Self-approval is rejected.
- Common and Individual EB accounts, bill period, opening/carry-forward balances, derived total paid/closing balance/status, multiple payments, payment ownership edits, overpayment checks, and Owner approval requests are implemented.
- Protected data APIs validate `X-Apartment-ID` against approved membership. Individual EB checks the matching flat membership.
- Startup requires `MONGODB_URL` and a JWT secret of at least 32 bytes. Mongo indexes are created at startup. Database connection logging does not print the URI.
- Old global expense/payment/document/analytics modules and their APIs were removed from the active package because they were unscoped.

Important backend modules:

- `backend/app/main.py`: lifecycle, CORS, router registration.
- `backend/app/core/config.py`, `database.py`, `security.py`: settings, Motor connection/indexes, bcrypt/JWT.
- `backend/app/dependencies.py`: bearer authentication, active user, Super Admin, apartment scope.
- `backend/app/models/{user,apartment,membership,eb,token}.py`: Pydantic contracts.
- `backend/app/routers/{auth,users,apartments,memberships,approvals,eb}.py`: HTTP endpoints.
- `backend/app/services/{auth,auth_service,user_service,apartment_service,membership_service,eb_service}.py`: business/database operations.

### Web

- Existing Vite + React + TypeScript frontend kept in `frontend/`; obsolete Next-style scaffold and external-auth callback were removed.
- Internal auth uses a single token/session source. Login and registration share one view; registration collects apartment, flat, and Owner/Tenant relation.
- Pending Approval view displays eligible names and refreshes approval state.
- Apartment selection, EB accounts, derived bill values, payments, own-payment edit, approval inbox, membership settings and flat policy controls are implemented.
- Product/package identity is Kootukudil. ESLint config and shared typed API error conversion were added.

### Mobile

- Standalone Expo SDK 58 React Native app at `mobile/`, independent of the Vite app.
- Uses Expo Router, SecureStore, internal auth/onboarding, pending approval, apartment selection, EB accounts/bills/payments, approval inbox, and developer attribution.
- App ID: `com.satz.kootukudil`; EAS `preview` profile is configured for an internal Android APK.
- Mobile toolchain is Node `22.17.1` via `nvm use 22`; SDK 58 requires Node `22.13+`.

## Environment and Configuration

### Backend

`backend/.env` exists locally and is not committed. Required settings are `MONGODB_URL` and `JWT_SECRET_KEY` (at least 32 bytes). Optional/configurable settings include `MONGODB_DB_NAME` (defaults to `kootukudil`), `JWT_ALGORITHM`, `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`, and comma-separated `CORS_ORIGINS` (default `http://localhost:3001`). Do not print or copy secrets into this document.

Backend startup should run from `backend/`:

```bash
.venv/bin/python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

A developer must manually set `is_super_admin: true` on the intended `users` document in MongoDB. There is no public bootstrap endpoint.

### Web

Vite serves `http://localhost:3001`; API client defaults to `http://localhost:8001`. CORS must include the web origin.

### Mobile

`mobile/.env.example` defaults `EXPO_PUBLIC_API_URL` to `http://10.0.2.2:8001` for the Android emulator. A physical phone needs a reachable LAN URL for local work. For a production APK, set this public client value to the deployed HTTPS API URL in EAS `preview` environment. Do not use the emulator URL in a distributed APK. The production URL has not been supplied yet.

## MongoDB and Live Verification

A read-only MongoDB admin `ping` succeeded on 2026-11-16 using a Motor client created and used inside the same asyncio loop. The URI parses as MongoDB and is configured, but its value is intentionally not recorded here.

This confirms connectivity only. No live registration, membership approval, cross-apartment isolation, EB accounting, concurrent payment, or device smoke flow has been run against the database. Payment creation/edit uses MongoDB transactions, so verify the deployment supports transactions (Atlas/replica set) before resident use.

## Validation Already Run

- Backend: `compileall`, startup settings validation, OpenAPI generation; 22 registered paths, with external token exchange and `/debug/*` absent.
- Web: `npx tsc --noEmit`, Vite production build, ESLint; all passed.
- Mobile: `npm run lint`, `npm run typecheck`, `npx expo-doctor` (20/20), Android Metro export; all passed.
- Git: `git diff --check` passed.
- No unit/integration/e2e test files were created, per instruction.

## Remaining Work

1. **Production API URL and APK:** Configure EAS project/auth, then set the real API URL and build an installable APK. Current config’s preview build is an APK; no APK artifact exists yet.
2. **PWA:** Add web manifest/service-worker/installability support. PWA support is not implemented.
3. **APK distribution:** Add a website download flow/page after a production APK exists. Not implemented.
4. **Live/manual smoke checks:** Exercise registration, Super Admin approval, Owner/Tenant membership approval, apartment/flat isolation, bill carry-forward, split payments, overpayment rejection, and payment ownership on a reachable Mongo deployment and Android device.
5. **Mobile parity:** The mobile app does not yet include all web apartment membership/flat-permission management or bill-edit controls. Ensure the reviewed `mobile/src/app/(app)/eb.tsx` is used as the current source, since it received edits during handover preparation.
6. **Production dependency advisory:** `npm audit --omit=dev` reports three moderate transitive mobile advisories through `@expo/fingerprint`/`minimatch`. The suggested forced remediation downgrades Expo to SDK 52, so it was not applied. Reassess with a compatible upstream fix before shipping.

## Exact APK Next Steps

From `mobile/`, with Node 22 active:

```bash
nvm use 22
npx eas-cli login
npx eas-cli build:configure
npx eas-cli env:set --name EXPO_PUBLIC_API_URL --value https://api.example.com --environment preview --visibility plaintext
npm run android:apk
```

The `preview` profile in `mobile/eas.json` selects the `preview` environment and `buildType: apk`. Replace `https://api.example.com` with the actual public HTTPS API origin. The user must provide/deploy that API URL and authenticate to EAS before this can produce an artifact. No Android SDK (`adb`/`sdkmanager`) was detected locally, so local Gradle APK builds are not currently available.

## Scope Boundaries and Known Gaps

- Current implementation follows the approved prompt's **apartment/flat, Owner/Tenant, Common/Individual EB** model. The older `docs/Kootukudil_Product_Roadmap.md` also describes Compound/Building hierarchy, EB share snapshots/UPI collection, notifications and messaging; those are not implemented and must not be assumed complete.
- Audit logs, backup/recovery, iOS distribution, payment-provider verification, UPI QR collection, messaging, and notifications remain deferred.
- The backend stores bill money as Python floating point rather than integer paise/Decimal. This should be reviewed before production financial use; no speculative migration was applied during this handover task.
- Root README and backend/web/mobile READMEs describe current architecture. The original implementation prompt remains in `docs/Kootukudil_AI_Implementation_Prompt.md`.

## Running Mobile Development

The Expo server is currently running at `exp://192.168.1.4:8081` (Expo Go QR); web preview is at `http://localhost:8081`. The dev process can be stopped with Ctrl+C in its terminal. Backend and frontend API servers are not confirmed running.
