# 📖 Complete Setup Guide - MT5 Web Trading Dashboard

This guide will walk you through the complete setup process from scratch.

## 📋 Table of Contents

1. [Prerequisites Installation](#prerequisites-installation)
2. [Project Setup](#project-setup)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)
6. [First-Time Usage](#first-time-usage)

---

## 1. Prerequisites Installation

### ✅ Step 1.1: Install Node.js

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer and follow the prompts
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v18.17.0 and 9.6.7)

### ✅ Step 1.2: Install Python

1. Go to [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Download **Python 3.8 or higher**
3. **IMPORTANT**: During installation, check "Add Python to PATH"
4. Verify installation:
   ```bash
   python --version
   # or
   python3 --version
   ```
   You should see version number (e.g., Python 3.11.0)

### ✅ Step 1.3: Install MetaTrader 5

1. Go to [https://www.metatrader5.com/en/download](https://www.metatrader5.com/en/download)
2. Download and install MetaTrader 5
3. Open MT5 and create a demo account or use your existing account
4. **Important MT5 Settings**:
   - Go to **Tools → Options → Expert Advisors**
   - Check "Allow automated trading"
   - Check "Allow DLL imports"

### ✅ Step 1.4: Install MongoDB (Optional)

MongoDB is optional for this application. You can skip this if you don't need database logging.

1. Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download and install MongoDB Community Server
3. Start MongoDB service:
   - **Windows**: MongoDB usually starts automatically
   - **Mac/Linux**: `sudo systemctl start mongod`

---

## 2. Project Setup

### ✅ Step 2.1: Automatic Setup (Recommended)

**For Windows:**
```bash
# Double-click setup.bat
# OR run in command prompt:
setup.bat
```

**For Mac/Linux:**
```bash
# Make script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

This will automatically:
- Install all backend dependencies
- Install all Python dependencies
- Install all frontend dependencies
- Create .env files from templates

### ✅ Step 2.2: Manual Setup (Alternative)

If automatic setup doesn't work, follow these manual steps:

**Install Backend Dependencies:**
```bash
cd backend
npm install
```

**Install Python Dependencies:**
```bash
cd backend/python
pip install -r requirements.txt
# or on some systems:
pip3 install -r requirements.txt
```

**Install Frontend Dependencies:**
```bash
cd ../../frontend
npm install
```

**Create Environment Files:**
```bash
# Create backend .env
cd ../backend
cp .env.example .env

# Create frontend .env
cd ../frontend
cp .env.example .env
```

---

## 3. Configuration

### ✅ Step 3.1: Configure Backend (.env)

Open `backend/.env` in a text editor:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Python Bridge Configuration
PYTHON_PORT=5001
PYTHON_BRIDGE_URL=http://localhost:5001
ENABLE_PYTHON_BRIDGE=true

# MongoDB Configuration (Optional - leave empty to skip)
MONGODB_URI=

# MT5 Configuration (Optional - can be set via login form)
MT5_LOGIN=
MT5_PASSWORD=
MT5_SERVER=
```

**Key Points:**
- Leave `MONGODB_URI` empty if not using MongoDB
- Don't put MT5 credentials here - you'll enter them in the login form
- Default ports should work fine for most users

### ✅ Step 3.2: Configure Frontend (.env)

Open `frontend/.env` in a text editor:

```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# Backend WebSocket URL
VITE_BACKEND_URL=http://localhost:3001
```

**Key Points:**
- These should match your backend PORT setting
- If you changed backend PORT to 4000, update URLs accordingly

---

## 4. Running the Application

### ✅ Step 4.1: Automatic Start (Recommended)

**For Windows:**
```bash
# Double-click start.bat
# OR run in command prompt:
start.bat
```

**For Mac/Linux:**
```bash
# Make script executable
chmod +x start.sh

# Run start
./start.sh
```

This will open two terminal windows:
- **Backend** running on `http://localhost:3001`
- **Frontend** running on `http://localhost:5173`

### ✅ Step 4.2: Manual Start (Alternative)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

Wait for message: "✓ Server running on port 3001"

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Wait for message: "Local: http://localhost:5173/"

### ✅ Step 4.3: Access the Application

1. Open your web browser
2. Navigate to `http://localhost:5173`
3. You should see the login page

---

## 5. Troubleshooting

### ❌ Problem: "Python bridge failed to start"

**Solution 1 - Check Python Installation:**
```bash
python --version
# If not found, try:
python3 --version
```

**Solution 2 - Install Dependencies Manually:**
```bash
cd backend/python
pip install MetaTrader5 flask flask-cors pandas python-dotenv
# or
pip3 install MetaTrader5 flask flask-cors pandas python-dotenv
```

**Solution 3 - Check MT5 Installation:**
- Ensure MetaTrader 5 is installed on your system
- The Python library requires MT5 to be installed even if not running

---

### ❌ Problem: "Port 3001 is already in use"

**Solution - Change Port:**

Edit `backend/.env`:
```env
PORT=4000
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:4000/api
VITE_BACKEND_URL=http://localhost:4000
```

---

### ❌ Problem: "Cannot connect to MT5"

**Check 1 - MT5 is Running:**
- Open MetaTrader 5 application
- Make sure you can see it running

**Check 2 - Server Name is Correct:**
- In MT5, go to **Tools → Options → Server**
- Copy the exact server name
- Use this in the login form (e.g., "MetaQuotes-Demo")

**Check 3 - Credentials are Correct:**
- Account number (not email)
- Password
- Server name (case-sensitive)

**Check 4 - Automated Trading is Enabled:**
- In MT5: **Tools → Options → Expert Advisors**
- Check "Allow automated trading"

---

### ❌ Problem: "npm install fails"

**Solution - Clear Cache and Retry:**
```bash
npm cache clean --force
npm install
```

---

### ❌ Problem: "WebSocket connection failed"

**Check 1 - Backend is Running:**
- Make sure backend terminal shows "✓ WebSocket server ready"

**Check 2 - Firewall:**
- Check if your firewall is blocking port 3001
- Temporarily disable firewall to test

**Check 3 - CORS Issues:**
- Verify `FRONTEND_URL` in backend/.env matches your frontend URL

---

## 6. First-Time Usage

### ✅ Step 6.1: Login to MT5

1. Open `http://localhost:5173` in your browser
2. Enter your MT5 credentials:
   - **Account Number**: Your MT5 login number (numeric)
   - **Password**: Your MT5 password
   - **Server**: Your broker's server (e.g., "MetaQuotes-Demo")
3. Click "Connect to MT5"

**Getting Demo Account:**
If you don't have an MT5 account:
1. Open MetaTrader 5
2. Go to **File → Open an Account**
3. Select a broker and create a demo account
4. Use those credentials in the web dashboard

### ✅ Step 6.2: Explore the Dashboard

After successful login, you'll see:

1. **Account Summary** (Top)
   - Balance, Equity, Profit, Margin Level

2. **Market Overview** (Left)
   - Live prices for major pairs
   - Spread indicators
   - Click any pair to select for trading

3. **Order Panel** (Right)
   - Select BUY or SELL
   - Set volume (lot size)
   - Optional: Set Stop Loss and Take Profit
   - Click "Place Order"

4. **TradingView Chart** (Middle)
   - Real-time price chart
   - Changes based on selected symbol

5. **Open Positions** (Bottom)
   - View all active trades
   - Close positions with one click

6. **Trade History** (Bottom)
   - See past trades
   - Filter by wins/losses
   - View statistics

### ✅ Step 6.3: Place Your First Trade

1. **Select a Symbol**
   - Click on "EURUSD" in the Market Overview table

2. **Configure Order**
   - Choose BUY or SELL
   - Set Volume: Start with 0.01 (micro lot)
   - Optional: Set SL/TP for risk management

3. **Execute**
   - Click "Place BUY Order" or "Place SELL Order"
   - Wait for confirmation message
   - Your position will appear in "Open Positions"

4. **Close Position**
   - Go to "Open Positions" section
   - Click "Close" button next to your trade
   - Confirm the closure

---

## 🎉 Congratulations!

Your MT5 Web Trading Dashboard is now fully set up and running!

### 📚 Next Steps:

- Read the [README.md](README.md) for detailed features
- Practice with a demo account first
- Customize the dashboard to your needs
- Set up MongoDB for trade logging (optional)

### 🆘 Need Help?

- Check the [Troubleshooting](#troubleshooting) section above
- Review [README.md](README.md) documentation
- Open an issue on GitHub

---

## ⚠️ Important Reminders

1. **Always use a demo account for testing**
2. **Never share your MT5 credentials**
3. **Keep .env files private (never commit to Git)**
4. **Practice risk management**
5. **Trading involves substantial risk**

---

**Happy Trading! 🚀**
