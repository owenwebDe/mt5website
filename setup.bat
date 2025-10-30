@echo off
echo ========================================
echo MT5 Web Trading Dashboard Setup
echo ========================================
echo.

echo [1/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Installing Python dependencies...
cd backend\python
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Python installation failed
    pause
    exit /b 1
)
cd ..\..

echo.
echo [3/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)
cd ..

echo.
echo [4/4] Creating environment files...
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo Created backend\.env
)
if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
    echo Created frontend\.env
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure your .env files in backend and frontend folders
echo 2. Run 'start.bat' to start the application
echo.
pause
