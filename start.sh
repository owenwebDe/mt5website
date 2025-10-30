#!/bin/bash

echo "========================================"
echo "MT5 Web Trading Dashboard"
echo "========================================"
echo ""
echo "Starting backend server and frontend..."
echo "Backend will run on http://localhost:3001"
echo "Frontend will run on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend in background
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Servers are running. Press Ctrl+C to stop both."
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
