#!/bin/bash

# Start AptSync

echo "Starting AptSync..."

# Start Backend
echo "Starting Flask backend..."
cd backend
source venv/bin/activate && python run.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "Starting Vite frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "Services started successfully!"
echo "Backend API: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Note: If port 5173 is in use, Vite will automatically use 5174"
echo "Note: You are using Node.js 20.18.3. Vite requires Node.js v20.19+ or v22.12+"
echo ""
echo "To stop the services:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
