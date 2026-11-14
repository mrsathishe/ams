# AMS Frontend

This is the frontend application for the Apartment Management System (AMS). It is a React + Vite + TypeScript app used to manage apartment expenses, user authentication, and admin-side operations.

The frontend talks to the AMS backend API running on `http://localhost:8001` and also interacts with the external auth service running on `http://localhost:3000` for social/external login and registration flows.

## Tech Stack

- React 18
- Vite 5
- TypeScript
- React Router DOM
- Tailwind CSS
- Axios
- Chart.js + react-chartjs-2
- LocalStorage-based auth persistence

## Project Purpose

This frontend is responsible for:

- user authentication (local login + external auth callback)
- registration flow
- expense viewing for tenants/users
- payment status tracking
- admin management of expenses
- monthly analytics charts

## Folder Structure

- `src/App.tsx` – route setup and root app shell
- `src/main.tsx` – app bootstrap
- `src/pages/` – page-level screens
- `src/index.css` – global styles and Tailwind setup
- `components/` – reusable UI components like charts
- `lib/` – API logic and auth helpers
- `types/` – TypeScript interfaces for backend data

## Pages and Behavior

### 1) Home Page (`/`)

Purpose:

- landing screen for the app
- entry point to auth flows

Buttons:

- `Sign In`
  - Redirects to the external auth service at `http://localhost:3000/login?callback=<current-url>/auth/callback`
  - This is used for external authentication flow
- `Register`
  - Redirects to `http://localhost:3000/register?callback=<current-url>/auth/callback`
- `Local Login`
  - Navigates to `/login` inside the frontend for local email/password login

Fields:

- None on this screen

### 2) Local Login Page (`/login`)

Purpose:

- login using email and password against the AMS backend API

Fields:

- `Email address`
- `Password`

Buttons:

- `Sign in`
  - validates inputs
  - calls `authAPI.login({ username, password })`
  - stores access token in localStorage
  - fetches current user details
  - redirects the user to `/dashboard`
- `Don't have an account? Register here`
  - navigates to `/register`

Behavior:

- On failure, shows `Invalid email or password`
- On success, user sees the dashboard

### 3) Register Page (`/register`)

Purpose:

- create a new user account

Fields:

- `Full Name`
- `Email Address`
- `Password`
- `Confirm Password`

Buttons:

- `Register`
  - checks that both password fields match
  - submits user data to backend API
  - on success, redirects to the app root or login flow
- `Back to home`
  - navigates back to `/`

Behavior:

- Errors displayed if passwords do not match or backend rejects registration

### 4) Auth Callback Page (`/auth/callback`)

Purpose:

- handles authentication result returned from the external auth system

What it reads from the URL:

- `auth_status`
- `auth_method`
- `timestamp`
- `token`
- `token_type`
- `expires_in`
- `error_code`
- `error_message`

What it does:

- validates the callback payload
- decodes JWT token information
- exchanges the token with backend using `POST /auth/exchange-token`
- stores user/auth data in `localStorage`
- redirects user to `/admin` or `/dashboard` based on role

Displays:

- loading message during auth processing
- error message if callback is invalid or failed

### 5) User Dashboard (`/dashboard`)

Purpose:

- show the logged-in user their expense and payment information

Top header:

- `AMS Dashboard`
- user greeting with name/email
- `Logout` button

Filters:

- `Year` dropdown
- `Month` dropdown

Table columns:

- `Month/Year`
- `Type`
- `Amount`
- `Status`
- `Payment Date`

Behavior:

- fetches expenses and payments for the selected month/year and current user
- shows each expense with its payment status and payment date
- displays `Paid` or `Unpaid` badge per item
- loads charts under the table

Chart section:

- `ExpenseCharts` component renders bar and line charts for monthly expense analytics

Logout button:

- clears auth data and redirects to `/`

### 6) Admin Dashboard (`/admin`)

Purpose:

- admin-only module for managing apartment expenses

Header:

- `Admin Dashboard`
- greeting with admin name/email
- `Logout` button

Quick Action buttons:

- `Add New Expense`
  - opens an expense form
- `Record Payment`
  - intended to open a payment creation form
- `Upload Document`
  - intended to open a document upload form

Current implemented admin form:

- `Add Expense`
  - fields:
    - `Amount`
    - `Month`
    - `Year`
    - `Expense Type`
    - `Description`
  - buttons:
    - `Save`
      - creates the expense via API
    - `Cancel`
      - closes the form

Filters:

- `Year`
- `Month`

Expense table columns:

- `Month/Year`
- `Type`
- `Amount`
- `Description`

Behavior:

- fetches and displays expense records for selected filters
- validates admin access before rendering content
- charts are shown at the bottom based on selected year

## Main App Flow

1. User lands on home page
2. User chooses local login or external auth
3. Credentials are validated
4. Backend returns token
5. App stores token and user information
6. User is redirected to dashboard or admin dashboard
7. Dashboard loads expenses and payment data from backend
8. Admin can create expense records and view analytics

## Authentication Model

The frontend stores auth info using `localStorage`, mainly under the key `auth_user` and `token` depending on the auth flow.

Important auth-related data includes:

- user id
- username/email
- role (`admin` / `user`)
- token
- expiry timestamp
- created auth metadata

## API Integration

The frontend uses a centralized API layer in `lib/api.ts` that connects to:

- `http://localhost:8001`

Main API groups:

- auth
- users
- expenses
- payments
- documents
- analytics

## How to Run Everything

### Prerequisites

- Node.js 20+
- npm
- backend AMS API running on `http://localhost:8001`
- external auth service running on `http://localhost:3000` if you use the social/external auth flow

### Frontend

From the `ams/frontend` folder:

```bash
npm install
npm run dev
```

The Vite dev server runs on:

```text
http://localhost:3001
```

### Production build

```bash
npm run build
```

Preview the production app:

```bash
npm run preview
```

## Notes

- This frontend is designed to work with the AMS backend and external auth service.
- If the backend is down, pages that fetch data will fail gracefully or show loading/error states.
- Some admin actions such as `Record Payment` and `Upload Document` are prepared in the UI but may need backend support and additional form implementation to be fully complete.
- The app uses client-side routing with React Router, not Next.js routing.

## Quick Developer Checklist

Before starting the app:

- ensure backend is running
- ensure auth service is running if testing external login/register
- run `npm install`
- run `npm run dev`

Then open:

```text
http://localhost:3001
```
