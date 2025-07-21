#!/bin/bash

# Start AMS Project

echo "Starting AMS (Apartment Management System)..."

# Start Backend
echo "Starting FastAPI backend..."
cd backend
/usr/local/bin/python3.13 -m uvicorn main:app --reload --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "Starting Next.js frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "Services started successfully!"
echo "Backend API: http://localhost:8001"
echo "Frontend: http://localhost:3001"
echo ""
echo "To stop the services:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
