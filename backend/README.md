# Kootukudil Backend

FastAPI API for internal authentication, multi-apartment membership, approvals, and scoped Electricity Board (EB) accounts/bills/payments. The active application is `app/main.py`; old global expense/payment/document APIs and external token exchange are not active.

## Stack

Python 3.10+, FastAPI, Uvicorn, MongoDB, Motor, Pydantic 2, python-jose, bcrypt, python-dotenv, and python-multipart.

## Configure and run

Set `MONGODB_URL`, `MONGODB_DB_NAME` (defaults to `kootukudil`), and a strong `JWT_SECRET_KEY` of at least 32 bytes in `backend/.env`. Set `CORS_ORIGINS` to a comma-separated list of approved web origins.

```bash
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

API docs are at `http://localhost:8001/docs`.

## Structure

- `app/main.py`: FastAPI app, lifecycle, CORS, router registration.
- `app/core/config.py`: environment-backed settings and startup validation.
- `app/core/database.py`: Motor connection, indexes, and database accessor.
- `app/core/security.py`: bcrypt password hashing and local JWT creation.
- `app/core/logger.py`: request-handler timing logs without argument values.
- `app/dependencies.py`: bearer JWT validation, active-user checks, Super Admin and apartment-scope enforcement.
- `app/models/`: Pydantic schemas for users, apartments/flats, memberships, approval requests, EB accounts, bills, and payments.
- `app/routers/`: HTTP boundary for auth, apartments, memberships, approvals, and EB APIs.
- `app/services/`: account, membership, apartment, and EB business/database logic.
- `app/run.py`: optional Uvicorn launcher.

## API surface

- `POST /register`, `POST /token`, `GET /users/me`: internal account creation, login, and profile.
- `GET /apartments/registration-options`, `GET /apartments`: registration discovery and approved apartments for the current user.
- `GET /communities`, `GET /communities/{community_id}/buildings`: public registration choices.
- Super Admin community management: `GET /communities/manage`, `POST /communities`, `PATCH|DELETE /communities/{community_id}`, `POST /communities/{community_id}/buildings`, and `PATCH|DELETE /communities/buildings/{building_id}`.
- `/apartments/{apartment_id}/flats`, `/memberships`, `/change-requests`: scoped flat/member administration and apartment change requests.
- `/memberships/pending-approvals`, `/memberships/{id}/approve`, `/memberships/{id}/permissions`: membership review and grants.
- `/approvals/pending`, `/approvals/{request_id}/approve`: scoped approval inbox and dispatch.
- `/eb-accounts`, `/eb-accounts/{id}/bills`, `/eb-bills/{id}/payments`, `/eb-payments/{id}`: account, bill, and payment workflows.
- `/flats/{flat_id}/individual-eb`: enable or disable a flat's Individual EB account.

Protected apartment data requests include `X-Apartment-ID`; the backend verifies the caller's approved membership in that apartment. Super Admin status is set manually in MongoDB and is never accepted from registration input. Debug routes and external authentication are removed from the active app.

## Data and calculations

Collections: `users`, `apartments` (communities), `buildings`, `flats`, `memberships`, `approval_requests`, `eb_accounts`, `eb_bills`, and `eb_payments`.

Community management stores the hierarchy as Community (`apartments`) → Building (`buildings`) → Flat/Unit (`flats`). Building unit capacity is configured by a Super Admin. A flat record is created on the first successful registration for its entered unit number; later residents selecting that same community, building, and unit share the flat record while receiving their own membership. Deleting a community or building is rejected while memberships or related EB/approval records are associated.

On startup, existing apartment and flat documents are migrated idempotently: legacy flats are attached to a `Main Building`, capacities and flat counts are retained, and the community is marked with hierarchy version 2. Existing memberships, account IDs, and EB records remain unchanged. Existing user profiles may have no `phone_number`; new registrations require and store one. Existing `Tenant` membership values remain supported, while the registration form now stores `Rental`.

Common EB belongs to an apartment; Individual EB belongs to one flat. The first bill's opening balance is used as its previous balance. Later bills carry forward the preceding bill's closing balance. `total_paid` is the sum of linked payment records; closing balance and Pending/Partially Paid/Paid status are computed by the service. Overpayments are rejected, and users may update only their own payment records.

## Validation

```bash
.venv/bin/python -m compileall -q app
.venv/bin/python -c 'from app.main import app; print(sorted(app.openapi()["paths"]))'
```

There is no backend test suite. Do not expose membership or apartment records based solely on client-supplied IDs; keep all new routes apartment/flat scoped.
