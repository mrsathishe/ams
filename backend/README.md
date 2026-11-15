# AMS Backend

This directory contains the FastAPI service for the Apartment Management System. It serves the frontend on port `8001`, uses MongoDB for persistent data, and exposes authentication, expense, payment, document, analytics, and diagnostic APIs.

The active application entry point is [`app/main.py`](app/main.py). [`app/main-old.py`](app/main-old.py) is the former monolithic implementation and is kept for historical reference; it is not imported by the active application.

## Technology Stack

| Technology             | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- | ------ |
| Python 3.10+           | Runtime; the source uses modern union type syntax such as `str        | None`. |
| FastAPI                | HTTP API, request validation, dependency injection, and OpenAPI docs. |
| Uvicorn                | ASGI server used to run FastAPI.                                      |
| Motor                  | Asynchronous MongoDB client used by the application.                  |
| MongoDB / PyMongo BSON | Persistence and `ObjectId` validation/conversion.                     |
| Pydantic 2             | Request and response models.                                          |
| python-jose            | Local JWT creation and validation.                                    |
| bcrypt                 | Password hashing and verification.                                    |
| python-multipart       | Multipart form and file upload parsing.                               |
| python-dotenv          | Loads environment variables from `.env`.                              |

`passlib`, `email-validator`, and direct `pymongo` are listed in `requirements.txt`, but the active application currently uses `bcrypt` directly, declares email fields as plain strings, and connects asynchronously through Motor.

## Setup and Run

From this directory, install the dependencies into the Python environment you intend to use:

```bash
python -m pip install -r requirements.txt
```

Configure the environment as described below, then start the backend on the port expected by the frontend:

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Alternatively, from this directory run `python app/run.py`. The repository-level `start.sh` starts the backend and frontend together. The interactive API documentation is available at `http://localhost:8001/docs`; the OpenAPI schema is at `http://localhost:8001/openapi.json`.

Uvicorn defaults to port `8000`; specify `--port 8001` when using the command above because the frontend API client uses port `8001`.

## Configuration

The active configuration is defined in [`app/core/config.py`](app/core/config.py). The backend expects a `.env` file to be discoverable by `python-dotenv`; the repository template is [`../.env.example`](../.env.example). Do not commit real credentials.

| Setting                           | Used by code | Default / behavior                                                                                                      |
| --------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URL`                     | Yes          | MongoDB connection string. There is no safe working default; configure it before startup.                               |
| `MONGODB_DB_NAME`                 | Yes          | Database name; defaults to `ams`.                                                                                       |
| `JWT_SECRET_KEY`                  | Yes          | Local AMS JWT signing key. The source has a development fallback; set a unique, strong value outside local development. |
| `JWT_ALGORITHM`                   | No           | Present in the example file, but the code currently hardcodes `HS256`.                                                  |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | No           | Present in the example file, but the code currently hardcodes 30 minutes.                                               |
| `FRONTEND_URL`                    | No           | CORS origin is currently hardcoded in `config.py` as `http://localhost:3001`.                                           |
| `UPLOAD_DIR`                      | No           | Upload path is currently hardcoded as `uploads`, relative to the process working directory.                             |
| `MAX_FILE_SIZE`                   | No           | A 10 MiB constant is defined but is not enforced by the upload service.                                                 |

Use a frontend origin that matches `FRONTEND_URL` when changing the local or deployed frontend address. Run the server from `backend/` if you want the relative `uploads/` directory to be created there.

## Application Structure

```text
backend/
├── requirements.txt
├── README.md
└── app/
    ├── main.py                 FastAPI app, middleware, lifespan, router registration
    ├── run.py                  Optional Uvicorn launcher
    ├── dependencies.py         Authentication and role dependencies
    ├── main-old.py             Superseded monolithic implementation
    ├── core/
    │   ├── config.py           Environment and application settings
    │   ├── database.py         Motor client lifecycle and database accessor
    │   ├── security.py         Password and local JWT helpers
    │   └── logger.py           Execution-time logging decorator
    ├── models/                 Pydantic request/response data models
    ├── routers/                HTTP endpoints grouped by feature
    ├── services/               Database and domain operations used by routers
    └── utils/                  Currently empty; no active utility modules
```

### Application and Core

- [`app/main.py`](app/main.py): creates the FastAPI `app`, installs CORS middleware, registers routers, and defines `lifespan(app)`. The lifespan creates the upload directory, connects to MongoDB before serving requests, and closes the client during shutdown. `root()` serves `GET /`.
- [`app/run.py`](app/run.py): inserts the backend directory into Python's module search path and starts `app.main:app` with reload enabled on port `8001`.
- [`app/core/config.py`](app/core/config.py): loads dotenv values and defines `MONGODB_URL`, `DATABASE_NAME`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `FRONTEND_URL`, `UPLOAD_DIR`, and `MAX_FILE_SIZE`.
- [`app/core/database.py`](app/core/database.py): `Database` holds the Motor client and selected database. `connect_to_mongo()` creates the client and pings MongoDB; `close_mongo_connection()` closes it; `get_database()` returns the selected database for services.
- [`app/core/security.py`](app/core/security.py): `get_password_hash()` hashes passwords with bcrypt; `verify_password()` checks a submitted password; `create_access_token()` signs a local AMS JWT with an expiration.
- [`app/core/logger.py`](app/core/logger.py): `log_execution_time()` wraps synchronous or asynchronous functions and logs arguments, duration, and errors. It is applied to registration and password-login endpoints.

### Request Dependencies

[`app/dependencies.py`](app/dependencies.py) defines the OAuth2 bearer-token dependency and authorization checks:

- `get_current_user()` decodes a local AMS JWT, reads its `sub` email, and loads the corresponding user.
- `get_current_active_user()` rejects inactive accounts.
- `get_admin_user()` requires the loaded account's role to be `admin`.

### Routers and API Endpoints

All paths below are registered without a shared `/api` prefix. Protected endpoints expect `Authorization: Bearer <AMS token>` unless stated otherwise.

| Method and path                         | Access                               | Purpose                                                                                                                                   |
| --------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /`                                 | Public                               | Health/message response.                                                                                                                  |
| `POST /register`                        | Public                               | Create an AMS user from a JSON `UserCreate` body.                                                                                         |
| `POST /token`                           | Public                               | Password login using OAuth2 form fields `username` (email) and `password`; returns an AMS bearer token.                                   |
| `POST /auth/exchange-token`             | Public                               | Accept an external token as multipart/form field `token` and attempt to issue an AMS token. See the security and integration notes below. |
| `GET /users/me`                         | Active user                          | Return the authenticated user's profile.                                                                                                  |
| `POST /expenses`                        | Admin                                | Create an expense.                                                                                                                        |
| `GET /expenses?month=&year=`            | Active user                          | List expenses, optionally filtered by month and/or year, with payments and totals.                                                        |
| `GET /expenses/{expense_id}`            | Active user                          | Return one expense with its payments and totals.                                                                                          |
| `POST /payments`                        | Admin                                | Record a payment after checking the referenced expense and user.                                                                          |
| `GET /payments/user/{user_id}`          | Active user; admin may view any user | List payments for the specified user.                                                                                                     |
| `POST /documents/upload`                | Admin                                | Upload a document as multipart form data. Required fields: `file`, `title`; optional: `expense_id`, `month`, `year`.                      |
| `GET /documents?month=&year=`           | Active user                          | List documents with optional month/year filters.                                                                                          |
| `GET /documents/{document_id}/download` | Active user                          | Download a stored document.                                                                                                               |
| `GET /analytics/expenses?year=`         | Active user                          | Return yearly monthly totals for expenses and payments. Defaults to the current year.                                                     |
| `GET /debug/db-status`                  | Public                               | Report database connectivity, collection names, and counts.                                                                               |
| `POST /debug/init-db`                   | Public                               | Insert sample users and expenses when the corresponding collections are empty. Development-only operation.                                |

Router implementations are in [`app/routers/auth.py`](app/routers/auth.py), [`users.py`](app/routers/users.py), [`expenses.py`](app/routers/expenses.py), [`payments.py`](app/routers/payments.py), [`documents.py`](app/routers/documents.py), [`analytics.py`](app/routers/analytics.py), and [`debug.py`](app/routers/debug.py). Each router validates the request, applies dependencies, calls a service, and returns the endpoint result.

### Services

- [`app/services/auth.py`](app/services/auth.py): `authenticate_user(email, password)` loads the account and checks its stored bcrypt password hash.
- [`app/services/auth_service.py`](app/services/auth_service.py): `register_new_user(user_data)` rejects duplicate email addresses, hashes the password, and inserts the user. `process_external_token(token)` currently extracts claims without verifying the token and creates/updates an AMS user.
- [`app/services/user_service.py`](app/services/user_service.py): `get_user_by_email(email)` loads a user from MongoDB and converts MongoDB `_id` into the API's string `id`.
- [`app/services/expense_service.py`](app/services/expense_service.py): `create_new_expense()` inserts an expense; `list_expenses()` filters and joins payments to calculate totals; `get_expense_by_id()` validates the MongoDB ID and returns one expense with payments.
- [`app/services/payment_service.py`](app/services/payment_service.py): `record_payment()` validates IDs and referenced records before inserting; `list_user_payments()` supports stored user IDs as either strings or BSON `ObjectId`s.
- [`app/services/document_service.py`](app/services/document_service.py): `save_and_record_document()` saves an uploaded file and its MongoDB record; `list_documents()` filters and converts IDs; `get_document_file_info()` validates the document, checks that its file exists, and returns its metadata.
- [`app/services/analytics_service.py`](app/services/analytics_service.py): `calculate_yearly_expense_analytics(year)` groups expenses and payments by month, matching legacy string and BSON expense IDs.

### Data Models and MongoDB Collections

Models are Pydantic classes in [`app/models/`](app/models/), re-exported by [`app/models/__init__.py`](app/models/__init__.py). Services generally convert MongoDB `_id` values to string `id` fields before constructing response models.

| Collection  | Main fields used by the backend                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| `users`     | `email`, `name`, `role`, `is_active`, `password` (local registration hash), `created_at`, `updated_at`     |
| `expenses`  | `amount`, `month`, `year`, `expense_type`, `description`, `created_by`, `created_at`                       |
| `payments`  | `user_id`, `expense_id`, `amount`, `payment_date`, `payment_method`, `created_at`                          |
| `documents` | `title`, `filename`, `file_path`, `file_type`, `expense_id`, `month`, `year`, `uploaded_by`, `uploaded_at` |

MongoDB creates collections on first insert; there is no migration or index-creation module in this backend. The model classes are:

- [`app/models/user.py`](app/models/user.py): `UserBase`, `UserCreate`, and `User`.
- [`app/models/token.py`](app/models/token.py): `Token` and `TokenData`.
- [`app/models/expense.py`](app/models/expense.py): `ExpenseBase`, `ExpenseCreate`, `Expense`, and `ExpenseWithPayments`.
- [`app/models/payment.py`](app/models/payment.py): `PaymentBase`, `PaymentCreate`, and `Payment`.
- [`app/models/document.py`](app/models/document.py): `DocumentBase`, `DocumentCreate`, and `Document`.
- [`app/models/reports.py`](app/models/reports.py): `UserPaymentStatus`, a report model not currently used by the active routes/services.

### Request and Data Flow

1. FastAPI matches a request to a router registered by `app/main.py`.
2. Protected routes resolve bearer-token and role dependencies from `app/dependencies.py`.
3. The router validates the payload with a Pydantic model and delegates work to a service.
4. The service uses `get_database()` to access Motor collections, performs the domain/database work, and prepares model-compatible IDs.
5. FastAPI serializes the returned model or value into the HTTP response.

## Security and Operational Notes

The following are current code limitations, not guarantees of production readiness:

- `process_external_token()` uses unverified JWT claims. Do not rely on this exchange endpoint for authentication until signature, issuer, audience, and external-user lookup are implemented. The sibling auth service's token format and identity lookup must be configured to match.
- Public registration accepts a `role` field through `UserCreate`, while authorization trusts the stored role. Restrict role assignment server-side before exposing registration to untrusted clients.
- Both debug endpoints are unauthenticated. In particular, `/debug/init-db` writes sample data; disable or protect debug routes outside development.
- `log_execution_time()` logs function arguments and is applied to auth endpoints; login arguments can include passwords. Avoid retaining or exposing these logs and redact credentials before production use.
- `connect_to_mongo()` currently prints the MongoDB connection string. Remove that log before using a credential-bearing URI in production.
- The file-size setting is not enforced, and upload validation is limited. Add size/type limits and deployment-appropriate storage/access controls before accepting untrusted uploads.
- `JWT_SECRET_KEY` has a source-code fallback. Set a strong secret in the environment and rotate any key that has been exposed.
- The external-token exchange expects an email-like claim, but a token containing only a subject ID cannot identify the external account without a trusted user lookup.

## Testing and Maintenance

There is no dedicated test suite under `backend/` at present. The repository has standalone database/token scripts at its root; they require their respective local services and environment configuration. At minimum, after backend changes:

```bash
python -m compileall -q app
python -m uvicorn app.main:app --port 8001
```

Use `http://localhost:8001/docs` to inspect and manually exercise the registered routes. Do not run `/debug/init-db` against a production database.
