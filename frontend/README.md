# Frontend (Vite + React + TypeScript)

This is the frontend for the Apartment Management System, built with Vite, React, and TypeScript.

## Development Setup

### Prerequisites

- Node.js (v20.19+ or v22.12+)
- npm

### Installation

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

-   `src/`: Contains the main source code for the application.
    -   `components/`: Reusable React components.
    -   `lib/`: Contains the authentication logic and API client.
    -   `pages/`: Page components for each route.
    -   `types/`: TypeScript type definitions.
    -   `App.tsx`: The main application component.
    -   `main.tsx`: The entry point of the application.
    -   `Router.tsx`: Defines the application's routes.
-   `public/`: Static assets.
-   `tailwind.config.js`: Tailwind CSS configuration.
-   `vite.config.ts`: Vite configuration.

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Lints the code.
-   `npm run preview`: Serves the production build locally.

## Routes

The application has the following routes:

-   `/`: The home page, which provides options to sign in or register.
-   `/login`: The login page for existing users.
-   `/register`: The registration page for new users.
-   `/dashboard`: The user dashboard, which displays expenses and payment status.
-   `/admin`: The admin dashboard, which allows for expense management.

## API Connections

The frontend communicates with a backend API. The API client is defined in `src/lib/api.ts`. The base URL for the API is `/api`, which is proxied to `http://localhost:8001` by the Vite development server.

### Authentication (`authAPI`)

-   **Login**: `authAPI.login(credentials)`
    -   **Description**: Authenticates a user and returns a JWT.
    -   **Endpoint**: `POST /token`
    -   **Payload (`LoginCredentials`)**: `FormData` with `username` (string, email) and `password` (string).
    -   **Response**: `{ "access_token": "...", "token_type": "bearer" }`
    -   **Used in**: `src/lib/auth.tsx` (called by `src/pages/LoginPage.tsx` via `useAuth` hook).
-   **Register**: `authAPI.register(data)`
    -   **Description**: Creates a new user account.
    -   **Endpoint**: `POST /register`
    -   **Payload (`RegisterData`)**: JSON object with `email` (string), `name` (string), and `password` (string).
    -   **Response**: The created `User` object.
    -   **Used in**: `src/pages/RegisterPage.tsx`.
-   **Get Current User**: `authAPI.getCurrentUser()`
    -   **Description**: Fetches the details of the currently authenticated user.
    -   **Endpoint**: `GET /users/me`
    -   **Headers**: Requires a valid JWT in the `Authorization` header.
    -   **Response**: The current `User` object.
    -   **Used in**: `src/lib/auth.tsx` (to initialize auth state).

### Expenses (`expensesAPI`)

-   **Get Expenses**: `expensesAPI.getExpenses(month, year)`
    -   **Description**: Retrieves a list of expenses, optionally filtered by month and year.
    -   **Endpoint**: `GET /expenses`
    -   **Query Parameters**: `month` (number, optional), `year` (number, optional).
    -   **Response**: An array of `ExpenseWithPayments` objects.
    -   **Used in**: `src/pages/DashboardPage.tsx`, `src/pages/AdminPage.tsx`.
-   **Get Expense**: `expensesAPI.getExpense(id)`
    -   **Description**: Retrieves a single expense by its ID.
    -   **Endpoint**: `GET /expenses/{id}`
    -   **Response**: A single `ExpenseWithPayments` object.
    -   **Used in**: Not currently used in any component.
-   **Create Expense**: `expensesAPI.createExpense(expense)`
    -   **Description**: Creates a new expense record.
    -   **Endpoint**: `POST /expenses`
    -   **Payload (`Omit<Expense, "id" | "created_at" | "created_by">`)**: JSON object with `amount` (number), `month` (number), `year` (number), `expense_type` (string), and `description` (string, optional).
    -   **Response**: The created `Expense` object.
    -   **Used in**: `src/pages/AdminPage.tsx`.

### Payments (`paymentsAPI`)

-   **Create Payment**: `paymentsAPI.createPayment(payment)`
    -   **Description**: Records a new payment for an expense.
    -   **Endpoint**: `POST /payments`
    -   **Payload (`Omit<Payment, "id" | "created_at">`)**: JSON object with `user_id` (string), `expense_id` (string), `amount` (number), `payment_date` (string), and `payment_method` (string, optional).
    -   **Response**: The created `Payment` object.
    -   **Used in**: Not currently used in any component (form is present in `AdminPage` but not wired up).
-   **Get User Payments**: `paymentsAPI.getUserPayments(userId)`
    -   **Description**: Retrieves all payments made by a specific user.
    -   **Endpoint**: `GET /payments/user/{userId}`
    -   **Response**: An array of `Payment` objects.
    -   **Used in**: `src/pages/DashboardPage.tsx`.

### Documents (`documentsAPI`)

-   **Get Documents**: `documentsAPI.getDocuments(month, year)`
    -   **Description**: Retrieves a list of documents, optionally filtered by month and year.
    -   **Endpoint**: `GET /documents`
    -   **Query Parameters**: `month` (number, optional), `year` (number, optional).
    -   **Response**: An array of `Document` objects.
    -   **Used in**: Not currently used in any component.
-   **Upload Document**: `documentsAPI.uploadDocument(file, title, expenseId, month, year)`
    -   **Description**: Uploads a new document.
    -   **Endpoint**: `POST /documents/upload`
    -   **Payload**: `FormData` with `file` (File), `title` (string), and optional `expense_id` (string), `month` (number), and `year` (number).
    -   **Response**: The created `Document` object.
    -   **Used in**: Not currently used in any component (form is present in `AdminPage` but not wired up).
-   **Download Document**: `documentsAPI.downloadDocument(id)`
    -   **Description**: Downloads a document file by its ID.
    -   **Endpoint**: `GET /documents/{id}/download`
    -   **Response**: The document file as a `Blob`.
    -   **Used in**: Not currently used in any component.

### Analytics (`analyticsAPI`)

-   **Get Expense Analytics**: `analyticsAPI.getExpenseAnalytics(year)`
    -   **Description**: Retrieves aggregated expense and payment data for a given year.
    -   **Endpoint**: `GET /analytics/expenses`
    -   **Query Parameters**: `year` (number, optional).
    -   **Response**: An object containing analytics data for the specified year.
    -   **Used in**: `src/components/ExpenseCharts.tsx`.
