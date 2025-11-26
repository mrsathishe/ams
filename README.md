# AptSync (Apartment Management System)

A comprehensive apartment management system to track expenses, payments, and documents.

## Project Structure

```
ams-project/
├── frontend/   ← Next.js (Admin & User UI)
├── backend/    ← FastAPI (APIs, MongoDB integration)
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

- **Next.js** - React framework
- **Chart.js/Recharts** - Data visualization
- **Tailwind CSS** - Styling

### Backend

- **FastAPI** - Python web framework
- **MongoDB** - Database
- **Pydantic** - Data validation
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
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
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
