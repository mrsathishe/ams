# Frontend (Vite + React + TypeScript + Styled Components)

This is the frontend for the APTSYNC Apartment Management System, built with modern React architecture using Vite, TypeScript, and Styled Components.

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

The project follows a modular architecture with component-based organization:

```
src/
├── components/          # Shared/global components
│   ├── Header.tsx      # Main navigation header with profile dropdown
│   └── ui/             # Basic UI components (legacy, being refactored)
├── pages/              # Page-specific modules
│   ├── register/       # Registration page module
│   │   ├── components/ # Page-specific components
│   │   ├── styles.ts   # Page-specific styled components
│   │   └── index.tsx   # Main page component
│   ├── login/          # Login page module
│   ├── dashboard/      # Dashboard page module
│   │   ├── components/ # Dashboard-specific components
│   │   │   ├── StatsCard.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── styles.ts
│   │   └── index.tsx
│   └── [other-pages]/
├── styles/             # Shared styling system
│   └── shared.ts       # Common styled components and themes
├── lib/                # Utilities and business logic
│   ├── api.ts          # API client
│   ├── auth.tsx        # Authentication context
│   └── useAuth.ts      # Authentication hook
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # Entry point
└── Router.tsx          # Application routing
```

## Architecture Overview

### Component-Based Architecture

- **Pages**: Each page is a self-contained module with its own components and styles
- **Components**: Reusable UI components shared across pages
- **Styles**: Centralized styling system using Styled Components
- **Types**: Comprehensive TypeScript typing for type safety

### Styling System

The application uses **Styled Components** with a shared theming system:

- `src/styles/shared.ts` - Common styled components (forms, buttons, layouts)
- Page-specific styles in each page's `styles.ts` file
- Consistent design system with gradients, shadows, and animations

### Key Features

- **Modern UI/UX**: Glass-morphism design with smooth animations
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Type Safety**: Full TypeScript coverage for reliability
- **Modular Components**: Reusable and maintainable component architecture
- **Professional Header**: Contact information, branding, and user profile management

## Available Scripts

-   `npm run dev`: Starts the development server
-   `npm run build`: Builds the application for production (TypeScript + Vite)
-   `npm run lint`: Lints the code using ESLint
-   `npm run lint:fix`: Automatically fixes linting issues
-   `npm run format`: Formats code using Prettier
-   `npm run format:check`: Checks code formatting
-   `npm run type-check`: Type checks without building
-   `npm run test`: Runs Vitest tests
-   `npm run test:ui`: Runs tests with UI
-   `npm run test:e2e`: Runs Playwright end-to-end tests
-   `npm run preview`: Serves the production build locally

## Routes

The application has the following routes:

-   `/`: The home page with landing content
-   `/login`: User authentication page with modern form design
-   `/register`: User registration with comprehensive form validation
-   `/dashboard`: User dashboard with statistics, activity feed, and quick actions
-   `/admin`: Admin dashboard for expense management
-   `/profile`: User profile management

## UI Components

### Shared Components (`src/styles/shared.ts`)

- **Layout**: `PageContainer`, `FormWrapper`, `Card`, `CardHeader`, `CardContent`
- **Forms**: `Form`, `FormGroup`, `Label`, `Input`, `Button`, `Checkbox`
- **Feedback**: `ErrorMessage`
- **Interactive**: `ButtonGrid`, `QuickAccessSection`

### Page-Specific Components

#### Dashboard (`src/pages/dashboard/components/`)
- **StatsCard**: Statistics display with variants (primary, success, warning)
- **RecentActivity**: Activity feed with status indicators
- **Sidebar**: Quick actions and monthly summary

#### Register/Login (`src/pages/register/components/`)
- **FormField**: Reusable form input component
- **QuickAccessButtons**: Social authentication buttons
- **RememberMeCheckbox**: Custom checkbox component

## API Connections

The frontend communicates with a backend API. The API client is defined in `src/lib/api.ts`. The base URL for the API is `/api`, which is proxied to `http://localhost:6000` by the Vite development server.

### Authentication (`authAPI`)

-   **Login**: `authAPI.login(credentials)`
    -   **Description**: Authenticates a user and returns a JWT
    -   **Endpoint**: `POST /token`
    -   **Payload (`LoginCredentials`)**: `FormData` with `username` (string, email) and `password` (string)
    -   **Response**: `{ "access_token": "...", "token_type": "bearer" }`
    -   **Used in**: Authentication context and login page

-   **Register**: `authAPI.register(data)`
    -   **Description**: Creates a new user account
    -   **Endpoint**: `POST /register`
    -   **Payload (`RegisterData`)**: JSON object with `email`, `name`, `password`, and `role`
    -   **Response**: The created `User` object
    -   **Used in**: Registration page

-   **Get Current User**: `authAPI.getCurrentUser()`
    -   **Description**: Fetches the details of the currently authenticated user
    -   **Endpoint**: `GET /users/me`
    -   **Headers**: Requires a valid JWT in the `Authorization` header
    -   **Response**: The current `User` object
    -   **Used in**: Authentication context initialization

### Expenses (`expensesAPI`)

-   **Get Expenses**: `expensesAPI.getExpenses(month, year)`
-   **Get Expense**: `expensesAPI.getExpense(id)`
-   **Create Expense**: `expensesAPI.createExpense(expense)`

### Payments (`paymentsAPI`)

-   **Create Payment**: `paymentsAPI.createPayment(payment)`
-   **Get User Payments**: `paymentsAPI.getUserPayments(userId)`

### Documents (`documentsAPI`)

-   **Get Documents**: `documentsAPI.getDocuments(month, year)`
-   **Upload Document**: `documentsAPI.uploadDocument(...)`
-   **Download Document**: `documentsAPI.downloadDocument(id)`

### Analytics (`analyticsAPI`)

-   **Get Expense Analytics**: `analyticsAPI.getExpenseAnalytics(year)`

## Design System

### Color Palette
- **Primary**: Blue gradient (`#3b82f6` to `#1d4ed8`)
- **Success**: Green (`#10b981`)
- **Warning**: Orange (`#f59e0b`)
- **Error**: Red (`#dc2626`)
- **Neutrals**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold, modern font weights (600-700)
- **Body**: Clean, readable text with proper contrast
- **Interactive**: Medium weight (500) for buttons and links

### Effects
- **Glass-morphism**: Backdrop blur effects on cards and headers
- **Smooth animations**: Hover states and micro-interactions
- **Consistent shadows**: Elevated design with depth

## Contact Information

**APTSYNC - Manage Easy**

📞 **Phone**: +91 - 97900 60943  
📧 **Email**: mrsathishe@gmail.com

Displayed in the application header for easy access.

## Development Guidelines

1. **Component Creation**: Use the page-specific component structure
2. **Styling**: Leverage shared styled components for consistency
3. **Type Safety**: Always define TypeScript interfaces for props
4. **Reusability**: Create reusable components in the shared directory
5. **Testing**: Write tests for critical components and user flows
