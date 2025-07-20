# AMS Setup and Usage Guide

## What's Running

✅ **Backend API**: http://localhost:8001 (FastAPI)
✅ **Frontend**: http://localhost:3002 (Next.js)

## Current Setup Status

The AMS (Apartment Management System) has been successfully set up with:

### Backend Features ✅

- FastAPI server running on port 8000
- MongoDB connection configured
- Authentication system with JWT
- User management (admin/user roles)
- Expense tracking
- Payment recording
- Document upload/download
- Analytics and charts data API

### Frontend Features ✅

- Next.js application running on port 3002
- Login/Register pages
- Admin dashboard
- User dashboard
- Expense charts and analytics
- Document management
- Responsive design with Tailwind CSS

## Getting Started

### 1. Access the Application

Open your browser and go to: http://localhost:3002

You'll see the AMS landing page with two options:

- **Sign In**: Redirects to http://localhost:3000 (external sign-in system)
- **Register**: Creates a new user account in the AMS system

### 2. User Registration

1. Click "Register" on the landing page
2. Fill in your details (name, email, password)
3. After successful registration, you'll be redirected to http://localhost:3000
4. **Important**: New users are created with "user" role by default

### 3. Admin Setup

To create an admin user, you have two options:

- **Option 1**: Register as a user, then manually update the role to "admin" in MongoDB
- **Option 2**: Modify the registration code to create admin users directly

### 3. MongoDB Database

The system connects to:

- **Connection**: `mongodb+srv://sathish:Theheros%4009@user.wl4j0pk.mongodb.net/`
- **Database**: `ams`
- **Collections**: `users`, `expenses`, `payments`, `documents`

### 4. Admin Functions

Once you have admin access, you can:

- Add monthly expenses (EB bills, maintenance, etc.)
- Record payments from residents
- Upload documents (bills, receipts)
- View analytics and charts
- Manage all apartment expenses

### 5. User Functions

Regular users can:

- View apartment expenses
- Check their payment status
- See payment history
- Download documents
- View expense charts

## API Documentation

The FastAPI backend provides automatic API documentation at:

- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

## Key Features Implemented

### Authentication & Authorization

- JWT-based authentication
- Role-based access (admin/user)
- Secure password hashing

### Expense Management

- Monthly expense tracking
- Multiple expense types (EB, Water, Maintenance, etc.)
- Payment recording with user details
- Balance calculations

### Document Management

- File upload for bills and documents
- Download functionality
- Document categorization by month/year

### Analytics & Charts

- Monthly and yearly expense visualization
- Payment status tracking
- Chart.js integration for data visualization

### Frontend UI

- Clean, responsive design
- Separate dashboards for admin and users
- Real-time data updates
- Form validation and error handling

## Development Commands

### Backend

```bash
cd backend
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm run dev
```

### Both Services

```bash
./start.sh
```

## Environment Variables

The system uses these key configurations:

- MongoDB connection string (in `backend/config.py`)
- JWT secret key
- CORS settings for frontend integration

## Next Steps

1. **Create Admin User**: Register and update role in database
2. **Add Expense Data**: Start adding monthly apartment expenses
3. **Register Users**: Add other apartment residents as users
4. **Upload Documents**: Add EB bills and other documents
5. **Test Features**: Explore all admin and user features

## Troubleshooting

### Backend Issues

- Check MongoDB connection
- Verify all Python dependencies are installed
- Check if port 8000 is available

### Frontend Issues

- Ensure Node.js and npm are installed
- Check if ports 3000-3002 are available
- Verify API connection to backend

### Database Issues

- Verify MongoDB connection string
- Check network connectivity
- Ensure database permissions

The AMS system is now fully functional and ready for use!
