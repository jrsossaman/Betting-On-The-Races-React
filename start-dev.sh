#!/bin/bash

# Start Backend
echo "Starting backend server..."
cd backend || exit
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Frontend
echo "Starting frontend..."
cd .. || exit
npm start &
FRONTEND_PID=$!

# Handle cleanup on exit
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
