#!/bin/bash

echo "========================================"
echo "MT5 Web Trading Dashboard Setup"
echo "========================================"
echo ""

echo "[1/4] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Backend installation failed"
    exit 1
fi
cd ..

echo ""
echo "[2/4] Installing Python dependencies..."
cd backend/python
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Python installation failed"
    exit 1
fi
cd ../..

echo ""
echo "[3/4] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend installation failed"
    exit 1
fi
cd ..

echo ""
echo "[4/4] Creating environment files..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "Created backend/.env"
fi
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "Created frontend/.env"
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Configure your .env files in backend and frontend folders"
echo "2. Run './start.sh' to start the application"
echo ""
