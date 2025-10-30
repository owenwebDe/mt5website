# ⚡ Quick Start Guide

Get your MT5 Web Trading Dashboard running in 5 minutes!

---

## 🎯 Prerequisites

Before starting, make sure you have:

- ✅ **Node.js** installed (v18+) - [Download](https://nodejs.org/)
- ✅ **Python** installed (v3.8+) - [Download](https://www.python.org/)
- ✅ **MetaTrader 5** installed - [Download](https://www.metatrader5.com/)
- ✅ **MT5 Demo Account** or Live Account credentials

**Don't have these?** See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed installation instructions.

---

## 🚀 3-Step Installation

### Step 1: Run Setup Script

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

This will automatically:
- Install all backend dependencies
- Install all Python dependencies
- Install all frontend dependencies
- Create .env configuration files

⏱️ **Takes ~2-3 minutes**

---

### Step 2: Start the Application

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

You'll see two windows open:
- **Backend** on port 3001
- **Frontend** on port 5173

⏱️ **Takes ~10 seconds**

---

### Step 3: Login to MT5

1. Open your browser: `http://localhost:5173`
2. Enter your MT5 credentials:
   - **Account**: Your MT5 login number
   - **Password**: Your MT5 password
   - **Server**: Your broker's server (e.g., "MetaQuotes-Demo")
3. Click "Connect to MT5"

⏱️ **Takes ~5 seconds**

---

## 🎉 You're Done!

You should now see the trading dashboard with:
- ✅ Live prices updating
- ✅ Account balance and equity
- ✅ Market overview
- ✅ Order panel
- ✅ TradingView charts

---

## 📱 First Trade in 30 Seconds

1. **Select a Symbol**: Click on "EURUSD" in the market table
2. **Choose Action**: Click BUY or SELL button
3. **Set Volume**: Use default 0.01 (or change it)
4. **Execute**: Click "Place BUY/SELL Order"
5. **Confirm**: See your position in "Open Positions"

---

## 🆘 Troubleshooting

### Problem: Setup script fails

**Solution:**
```bash
# Install manually
cd backend
npm install

cd python
pip install -r requirements.txt

cd ../../frontend
npm install
```

---

### Problem: Can't connect to MT5

**Check:**
1. MetaTrader 5 is installed on your computer
2. You're using the correct server name
3. MT5 allows automated trading:
   - Open MT5 → Tools → Options → Expert Advisors
   - Check "Allow automated trading"

---

### Problem: Port already in use

**Solution:** Change port in `backend/.env`:
```env
PORT=4000
```

And in `frontend/.env`:
```env
VITE_API_URL=http://localhost:4000/api
VITE_BACKEND_URL=http://localhost:4000
```

---

## 📚 What's Next?

### Learn More
- 📖 [README.md](README.md) - Complete documentation
- 🔧 [FEATURES.md](FEATURES.md) - All features explained
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production
- 📋 [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup

### Practice Trading
1. Use a **demo account** first
2. Start with **micro lots** (0.01)
3. Practice **risk management**
4. Use **Stop Loss** orders

### Get MT5 Demo Account

If you don't have MT5 credentials:

1. Open MetaTrader 5 application
2. File → Open an Account
3. Choose a broker
4. Create Demo Account
5. Use those credentials to login

---

## 🎯 Key URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Trading dashboard |
| **Backend API** | http://localhost:3001 | REST API |
| **Health Check** | http://localhost:3001/health | Server status |
| **Python Bridge** | http://localhost:5001/health | MT5 bridge status |

---

## ⚡ Quick Commands

```bash
# Start everything
start.bat         # Windows
./start.sh        # Mac/Linux

# Install dependencies
setup.bat         # Windows
./setup.sh        # Mac/Linux

# Manual start - Backend only
cd backend
npm run dev

# Manual start - Frontend only
cd frontend
npm run dev
```

---

## 💡 Pro Tips

1. **Keep MT5 open** while using the dashboard
2. **Check spreads** before trading (green = good)
3. **Use demo first** to learn the interface
4. **Set Stop Loss** to manage risk
5. **Start small** with 0.01 lot sizes

---

## ⚠️ Important Notes

- ✅ Always use **demo account** for testing
- ✅ **Never share** your MT5 credentials
- ✅ Keep **.env files** private
- ✅ Practice **risk management**
- ✅ Trading involves **substantial risk**

---

## 🔥 Hotkeys & Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh data | Click refresh icon (top right) |
| Select symbol | Click any row in market table |
| Quick BUY | Select symbol → BUY button |
| Quick SELL | Select symbol → SELL button |
| Close position | Click "Close" in open positions |

---

## 📞 Need Help?

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
2. Review [README.md](README.md) troubleshooting section
3. Check backend logs in terminal
4. Check frontend console in browser (F12)
5. Verify MT5 is installed and configured

---

## 🎊 Success Checklist

Before you start trading, make sure:

- ✅ Backend is running (see terminal output)
- ✅ Frontend is running (browser shows dashboard)
- ✅ Python bridge is running (check backend logs)
- ✅ MT5 connection is successful (green indicator)
- ✅ Prices are updating (see live price changes)
- ✅ Account balance is displayed
- ✅ Charts are loading

---

## 🚀 You're All Set!

Your MT5 Web Trading Dashboard is ready to use!

**Happy Trading!** 📈💰

For advanced features and deployment, check out our comprehensive guides:
- [Full Documentation](README.md)
- [All Features](FEATURES.md)
- [Production Deployment](DEPLOYMENT.md)

---

**Made with ❤️ for traders**

*Remember: Past performance is not indicative of future results. Trade responsibly!*
