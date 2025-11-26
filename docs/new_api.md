Apartment management system.

Milestone 1 — Backend Skeleton & API Design
1. Project Structure Setup
/backend
│
├── app/
│   ├── __init__.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── user.py
│   ├── models/
│   │   └── user.py
│   ├── services/
│   │   └── auth_service.py
│   ├── utils/
│   │   ├── validators.py
│   │   └── responses.py
│   └── config.py
│
├── tests/
│   └── test_auth.py
│
├── requirements.txt
├── run.py
└── docs/
    └── api.md

2. API Contract Design
POST /api/register
Request Body:
{
  "name": "Sathish",
  "email": "sathish@example.com",
  "password": "StrongPass123!"
}

Response 201:
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Sathish",
    "email": "sathish@example.com"
  }
}

Error 400:
{ "error": "Invalid email format", "code": "INVALID_EMAIL" }

Error 409:
{ "error": "Email already exists", "code": "DUPLICATE_EMAIL" }


POST /api/login
Request Body:
{
  "email": "sathish@example.com",
  "password": "StrongPass123!"
}

Response 200:
{
  "token": "jwt-access-token",
  "refresh_token": "jwt-refresh-token"
}

Error 401:
{ "error": "Invalid credentials", "code": "UNAUTHORIZED" }


GET /api/me
Headers: Authorization: Bearer <token> Response 200:
{
  "id": 1,
  "name": "Sathish",
  "email": "sathish@example.com"
}

Error 401:
{ "error": "Token expired or invalid", "code": "TOKEN_INVALID" }


POST /api/logout (Optional)
Response 200:
{ "message": "Logged out successfully" }


POST /api/refresh (Optional)
Response 200:
{ "token": "new-access-token" }


3. Authentication Flow
Token Types
Token Type
Expiry
Storage
Purpose
Access Token
15 min
Header
Auth for API
Refresh Token
7 days
HTTP-only cookie / DB
Renew access token

Example JWT Claims
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1730490000,
  "exp": 1730490900
}


4. Validation Rules
Email must follow valid format.
Password must be 8+ chars with uppercase + number.
Name max 50 chars.
Standard Error Format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password must be at least 8 characters long"
  }
}


5. Environment & Config
.env example:
FLASK_ENV=development
SECRET_KEY=supersecretkey
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7


6. Dummy Route Structure (Placeholder)
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    return jsonify(success=True, message="Registered", user=data), 201


7. Acceptance Criteria
docs/api.md completed
All dummy routes created
Responses follow designed JSON format
Postman tests working

