# AptSync

A comprehensive apartment management system to track expenses, payments, and documents.

## Project Structure

```
ams/
├── frontend/   ← React + Vite (Admin & User UI)
├── backend/    ← Flask (APIs, MongoDB integration)
├── README.md
```

## Features

### Admin Features

- Enter monthly apartment expenses (EB bills, etc.)
- Track payment details (name, date, amount)
- View monthly and yearly expense charts
- Upload and manage documents
- Filter expenses by month/year

### User Features

- View apartment expenses
- Check payment status (paid/unpaid)
- View payment dates
- Access monthly and yearly expense charts
- Download EB bills and documents

## Tech Stack

### Frontend

- **React 19.2.0** - JavaScript framework
- **Vite 7.2.4** - Build tool and dev server
- **TypeScript 5.9.3** - Type safety
- **React Router DOM 7.9.6** - Client-side routing
- **Tailwind CSS + Styled Components** - Styling
- **Chart.js 4.5.1** - Data visualization
- **Zustand 5.0.8** - State management
- **TanStack React Query 5.90.11** - Data fetching
- **React Hook Form 7.66.1** - Form handling

### Backend

- **Flask 2.1.3** - Python web framework
- **MongoDB** - Database
- **MongoEngine 0.9.5** - ODM (Object Document Mapper)
- **PyMongo 3.12.3** - MongoDB driver
- **JWT** - Authentication

## Database Setup

- **Connection**: `mongodb+srv://sathish:Theheros%4009@user.wl4j0pk.mongodb.net/`
- **Database**: `ams`
- **Collections**: `users`, `expenses`, `payments`, `documents`

## Getting Started

### Quick Start

```bash
# Clone the repository
git clone https://github.com/mrsathishe/ams.git
cd ams

# Start both services
chmod +x start.sh
./start.sh
```

**Access the application:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:6000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
source venv/bin/activate  # Activate virtual environment
python run.py             # Runs on http://localhost:6000
```

## Current Status

✅ **Complete and Running**

- Backend API with all endpoints
- Frontend with admin and user dashboards
- Database integration with MongoDB
- Authentication and authorization
- Expense and payment tracking
- Document upload/download
- Charts and analytics
- Responsive UI design

## First Time Setup

1. **Access**: Go to http://localhost:5173
2. **Register**: Create your first user account
3. **Admin Access**: Update user role to "admin" in MongoDB
4. **Start Using**: Add expenses, record payments, upload documents

## Authentication

- Single Sign-On (SSO) implementation
- Redirects to `http://localhost:5173` after login/register

## GitHub Repository

https://github.com/mrsathishe/ams.git
