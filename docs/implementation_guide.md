# Project Documentation — Plan, Architecture, Design & API

This document combines **project planning**, **software architecture**, **system design**, and **API documentation** into a single unified reference for your **Apartment Management System / User Registration App** using **React + Flask + MongoDB**.

---

# 1. Project Plan Documentation

## 1.1 Project Overview

A full-stack application that supports:

*   User Registration
*   User Login & Authentication
*   Protected APIs
*   JWT-based session handling
*   User profile retrieval and management

Tech Stack:

*   **Frontend:** React
*   **Backend:** Flask
*   **Database:** MongoDB
*   **Auth:** JWT (Access + Refresh tokens)
*   **Security:** bcrypt, HTTPS, rate limiting

---

## 1.2 Milestones Overview

### **Milestone 0 — Setup & Repo Structure**

*   Create Git repo with branches: `main`, `dev`, `feature/auth`.
*   Setup folders: `frontend/` and `backend/`.
*   Add `.env.example`.

### **Milestone 1 — Backend Skeleton & API Contract**

*   Create Flask project structure (folders only).
*   Document all API endpoints.
*   Define validation rules.
*   Decide JWT auth strategy.
*   Postman dummy tests.

### **Milestone 2 — DB & Models**

*   Define MongoDB schema & indexes.
*   Create `users` collection structure.

### **Milestone 3 — Backend Functionality**

*   Implement full registration, login, JWT creation, password hashing.
*   Add `/me` protected route.

### **Milestone 4 — Frontend Skeleton**

*   Build pages: Register, Login, Dashboard.
*   Create API service.

### **Milestone 5 — Security Hardening**

*   bcrypt hashing
*   CORS rules
*   Rate limiting
*   JWT expiry tuning

### **Milestone 6 — Testing**

*   Backend tests
*   Frontend validation tests
*   E2E testing

### **Milestone 7 — Deployment**

*   Host Flask on Render/Railway.
*   Host React on Netlify/Vercel.
*   MongoDB Atlas.

---

# 2. Architecture Documentation

## 2.1 High-Level Architecture

```
[ React Frontend ]
      ↓ HTTPS
[ Flask Backend (REST APIs) ]
      ↓ PyMongo
[ MongoDB Atlas ]
```

### Responsibilities:

*   **React:** UI, forms, token handling, protected pages.
*   **Flask:** Validation, hashing, JWT issuing, security.
*   **MongoDB:** User storage.

---

## 2.2 Backend Folder Architecture

```
/backend
│
├── app/
│   ├── __init__.py
│   ├── routes/
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
├── run.py
└── docs/
    └── api.md
```

---

# 3. System Design Documentation

## 3.1 User Flow

### Registration Flow

1.  User fills form in React.
2.  React validates input.
3.  React → Flask: POST `/api/register`.
4.  Flask validates data.
5.  Hash password via bcrypt.
6.  Save user in MongoDB.

### Login Flow

1.  User enters email/password.
2.  Flask verifies hash.
3.  Flask creates JWT access + refresh tokens.
4.  React stores access token.

### Protected API Flow

1.  React adds `Authorization: Bearer <token>`.
2.  Flask validates token.
3.  Returns user profile.

---

## 3.2 Database Design (MongoDB)

### Collection: `users`

```
{
  _id: ObjectId,
  name: String,
  email: String,
  password_hash: String,
  phone: String,
  flat_number: String,
  building_name: String,
  created_at: ISODate,
  updated_at: ISODate
}
```

### Indexes:

*   **email** → unique

---

## 3.3 Security Design

### Password Handling

*   Use bcrypt for hashing.
*   Never hash in frontend.
*   Always hash in backend using random salt.

### JWT Strategy

| Token         | Expiry     | Stored Where | Purpose      |
| ------------- | ---------- | ------------ | ------------ |
| Access Token  | 15 minutes | Header       | Auth         |
| Refresh Token | 7 days     | Cookie/DB    | Renew access |

### Transport Security

*   HTTPS mandatory.

### API Security

*   Rate limit login.
*   Central error handler.
*   Validation on all endpoints.

---

# 4. API Documentation

## 4.1 Authentication APIs

### **POST /api/register**

Request:

```
{
  "name": "Sathish",
  "email": "sathish@example.com",
  "password": "StrongPass123!"
}
```

Response 201:

```
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Sathish",
    "email": "sathish@example.com"
  }
}
```

Errors:

```
400 — INVALID_EMAIL
409 — DUPLICATE_EMAIL
```

---

### **POST /api/login**

Request:

```
{
  "email": "sathish@example.com",
  "password": "StrongPass123!"
}
```

Success:

```
{
  "token": "jwt-access-token",
  "refresh_token": "jwt-refresh-token"
}
```

Error:

```
401 — UNAUTHORIZED
```

---

### **GET /api/me** (Protected)

Response:

```
{
  "id": 1,
  "name": "Sathish",
  "email": "sathish@example.com"
}
```

---

### **POST /api/logout**

```
{ "message": "Logged out successfully" }
```

---

### **POST /api/refresh**

```
{ "token": "new-access-token" }
```

---

### **POST /api/updatePassword** (Protected)

Request:

```
{
  "old_password": "StrongPassword123!",
  "new_password": "ANewStrongerPassword456!"
}
```

Response 200:

```
{
  "message": "Password updated successfully"
}
```

Errors:

```
400 — BAD_REQUEST (e.g., missing fields)
401 — UNAUTHORIZED (e.g., invalid old password)
```
---

# 5. Validation Rules

*   Email must be valid.
*   Password must include uppercase + number + 8+ chars.
*   Name max length: 50 chars.
*   Standard error response:

```
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password too weak"
  }
}
```

---

# 6. Environment Configuration

Example `.env`:

```
FLASK_ENV=development
SECRET_KEY=supersecretkey
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
MONGO_URI=mongodb+srv://....
```

---

# 7. Acceptance Criteria

*   Architecture finalized
*   API contract complete
*   Dummy endpoints working in Postman
*   MongoDB schema defined
*   React pages structured
*   Security checklist applied

---
---

# 8. Frontend Implementation Steps

This section details the steps to connect the frontend to the backend APIs that are not yet implemented.

## 8.1 Add `updatePassword` Function to `api.ts`

In `frontend/src/lib/api.ts`, add a new function to the `authAPI` object to handle password updates.

```typescript
// In frontend/src/lib/api.ts, inside the authAPI object:

updatePassword: async (data: UpdatePasswordData): Promise<{ message: string }> => {
  const response = await api.post("/updatePassword", data);
  return response.data;
},
```

You will also need to add the `UpdatePasswordData` type to `frontend/src/types/index.ts`:

```typescript
// In frontend/src/types/index.ts

export interface UpdatePasswordData {
  old_password: string;
  new_password: string;
}
```

## 8.2 Add `logout` Function to `api.ts`

In `frontend/src/lib/api.ts`, add a `logout` function.

```typescript
// In frontend/src/lib/api.ts, inside the authAPI object:

logout: async (): Promise<{ message: string }> => {
  const response = await api.post("/logout");
  return response.data;
},
```

## 8.3 Add `refreshToken` Function to `api.ts`

In `frontend/src/lib/api.ts`, add a `refreshToken` function. This will be used to get a new access token when the old one expires.

```typescript
// In frontend/src/lib/api.ts, inside the authAPI object:

refreshToken: async (): Promise<{ token: string }> => {
  const response = await api.post("/refresh");
  return response.data;
},
```

## 8.4 Create a Profile Page

Create a new page `frontend/src/pages/ProfilePage.tsx` where users can update their password. This page should have a form with fields for "Old Password" and "New Password".

## 8.5 Implement Logout Button

In your main navigation or dashboard, add a logout button that calls the `auth.logout()` function from your `useAuth` hook. This function should clear the user's token from local storage and redirect them to the login page.

## 8.6 Implement Automatic Token Refresh

In `frontend/src/lib/api.ts`, you can enhance the Axios interceptor to automatically refresh the token if a request fails with a 401 Unauthorized error.

```typescript
// In frontend/src/lib/api.ts

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { token } = await authAPI.refreshToken();
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = "Bearer " + token;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```