@echo off
echo ========================================
echo MT5 Web Trading Dashboard
echo ========================================
echo.
echo Starting backend server and frontend...
echo Backend will run on http://localhost:3001
echo Frontend will run on http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.

start "MT5 Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "MT5 Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Check the new windows for logs
echo.
pause
