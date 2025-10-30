@echo off
REM Start Backend
echo Starting backend server on port 5001...
cd backend
start cmd /k npm start

REM Wait for backend to start
timeout /t 3

REM Start Frontend
echo Starting frontend on port 3000...
cd ..
start cmd /k npm start

echo Both servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
