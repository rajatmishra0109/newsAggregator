@echo off
echo Starting Content Aggregator...
echo.

echo Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Starting Backend (Flask) on port 5000...
start cmd /k "cd backend && pip install -r requirements.txt && python app.py"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak

echo.
echo Starting Frontend (React) on port 3000...
start cmd /k "cd frontend && npm install && npm start"

echo.
echo Both services are starting in new windows!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
