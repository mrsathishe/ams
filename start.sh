#!/bin/bash

# Start AMS Project

echo "Starting AMS (Apartment Management System)..."

# Start Backend
echo "Starting FastAPI backend..."
cd backend
source /bin/activate && python run.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "Starting Vite frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "Services started successfully!"
echo "Backend API: http://localhost:6000"
echo "Frontend: http://localhost:5173"
echo ""
echo "To stop the services:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
