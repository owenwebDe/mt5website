# MT5 Web Trading Dashboard

A complete, professional, and mobile-friendly web-based trading terminal for MetaTrader 5 (MT5). This application allows you to trade forex markets directly from your browser with real-time price updates, position management, and comprehensive trading history.

![MT5 Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### Trading Capabilities
- ✅ **Real-time Price Updates** - Live bid/ask prices with 1-second refresh rate
- ✅ **Spread Monitoring** - Visual spread indicators with color-coded alerts
- ✅ **Order Placement** - Execute BUY/SELL orders with customizable lot sizes
- ✅ **Stop Loss & Take Profit** - Set SL/TP levels for risk management
- ✅ **Position Management** - View and close open positions in real-time
- ✅ **Trade History** - Complete trading history with profit/loss tracking

### User Interface
- 🎨 **Dark Mode Design** - Professional dark theme with neon accents
- 📱 **Mobile Responsive** - Fully optimized for mobile, tablet, and desktop
- 📊 **TradingView Charts** - Interactive charts with technical indicators
- 🔄 **Live Updates** - WebSocket-based real-time data streaming
- 💰 **Account Dashboard** - Balance, equity, margin, and P&L display

### Technical Features
- ⚡ **Fast Performance** - Optimized for speed and reliability
- 🔒 **Secure Connection** - Direct MT5 integration via Python bridge
- 🌐 **WebSocket Streaming** - Real-time bi-directional communication
- 📦 **MongoDB Integration** - Optional trade logging and user settings
- 🚀 **Easy Deployment** - Ready for Heroku, Render, or any Node.js host

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │ ◄─────► │   Node.js   │ ◄─────► │   Python    │
│  Frontend   │ WebSocket│   Backend   │   HTTP  │ MT5 Bridge  │
│             │         │ (Express)   │         │             │
└─────────────┘         └─────────────┘         └──────┬──────┘
                               │                        │
                               ▼                        ▼
                        ┌─────────────┐         ┌─────────────┐
                        │   MongoDB   │         │  MetaTrader │
                        │  (Optional) │         │      5      │
                        └─────────────┘         └─────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MetaTrader 5** Terminal - [Download](https://www.metatrader5.com/)
- **MongoDB** (Optional) - [Download](https://www.mongodb.com/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mt5-web-dashboard
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Python Dependencies

```bash
cd backend/python
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies

```bash
cd ../../frontend
npm install
```

### 5. Configure Environment Variables

**Backend Configuration:**

```bash
cd ../backend
cp .env.example .env
```

Edit `.env` file:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
PYTHON_PORT=5001
PYTHON_BRIDGE_URL=http://localhost:5001
ENABLE_PYTHON_BRIDGE=true
MONGODB_URI=mongodb://localhost:27017/mt5_trading  # Optional
```

**Frontend Configuration:**

```bash
cd ../frontend
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
VITE_BACKEND_URL=http://localhost:3001
```

### 6. Start the Application

**Terminal 1 - Start Backend (includes Python bridge):**

```bash
cd backend
npm run dev
```

The backend will automatically start the Python MT5 bridge on port 5001.

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 7. Connect to MT5

1. Open your browser and navigate to `http://localhost:5173`
2. Enter your MT5 credentials:
   - **Account Number**: Your MT5 login ID
   - **Password**: Your MT5 password
   - **Server**: Your broker's server name (e.g., "MetaQuotes-Demo")
3. Click "Connect to MT5"

## 📱 Usage Guide

### Trading

1. **Select a Symbol** - Click on any currency pair in the Market Overview table
2. **Choose Order Type** - Select BUY or SELL
3. **Set Volume** - Enter your desired lot size (default: 0.01)
4. **Optional: Set SL/TP** - Enter Stop Loss and Take Profit levels
5. **Place Order** - Click the "Place BUY/SELL Order" button

### Managing Positions

- **View Open Positions** - All active trades are displayed in the "Open Positions" section
- **Close Position** - Click the "Close" button next to any open position
- **Monitor P&L** - Real-time profit/loss updates for all positions

### Understanding Spreads

The spread table shows the difference between Bid and Ask prices:

- 🟢 **Green** - Tight spread (<1 pip) - Good for trading
- 🟡 **Yellow** - Normal spread (1-2 pips) - Acceptable
- 🔴 **Red** - Wide spread (>2 pips) - Consider waiting

## 🛠️ Development

### Project Structure

```
mt5-web-dashboard/
├── backend/
│   ├── server.js              # Main Express server
│   ├── routes/
│   │   └── mt5.js            # MT5 API routes
│   ├── sockets/
│   │   └── liveData.js       # WebSocket handlers
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── TradeLog.js       # Trade log model
│   ├── python/
│   │   ├── mt5_bridge.py     # Python MT5 bridge
│   │   └── requirements.txt  # Python dependencies
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx          # Main dashboard
│   │   │   ├── LoginForm.jsx          # Login component
│   │   │   ├── AccountSummary.jsx     # Account info display
│   │   │   ├── SpreadTable.jsx        # Market overview
│   │   │   ├── OrderPanel.jsx         # Order placement
│   │   │   ├── OpenPositions.jsx      # Active positions
│   │   │   ├── TradeHistory.jsx       # Trade history
│   │   │   └── TradingViewChart.jsx   # Chart widget
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

### Available Scripts

**Backend:**

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
```

**Frontend:**

```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
```

**Python Bridge:**

```bash
python mt5_bridge.py [port]  # Start Python bridge (optional port)
```

## 🔧 API Documentation

### Backend Endpoints

#### Authentication
- `POST /api/mt5/connect` - Connect to MT5 account
- `POST /api/mt5/disconnect` - Disconnect from MT5

#### Account Information
- `GET /api/mt5/account` - Get account information
- `GET /api/mt5/health` - Check Python bridge health

#### Market Data
- `POST /api/mt5/prices` - Get symbol prices
- `GET /api/mt5/positions` - Get open positions
- `POST /api/mt5/history` - Get trade history

#### Trading
- `POST /api/mt5/trade/open` - Open a new trade
- `POST /api/mt5/trade/close` - Close an existing trade

### WebSocket Events

#### Client → Server
- `subscribe:prices` - Subscribe to price updates
- `subscribe:account` - Subscribe to account updates
- `subscribe:positions` - Subscribe to position updates
- `unsubscribe:prices` - Unsubscribe from price updates
- `unsubscribe:account` - Unsubscribe from account updates
- `unsubscribe:positions` - Unsubscribe from position updates

#### Server → Client
- `prices:update` - Price update event
- `account:update` - Account update event
- `positions:update` - Positions update event
- `positions:refresh` - Request to refresh positions

## 🚀 Deployment

### Deploying to Heroku

1. **Install Heroku CLI**

```bash
npm install -g heroku
```

2. **Create Heroku App**

```bash
heroku create your-app-name
```

3. **Add Buildpacks**

```bash
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/python
```

4. **Set Environment Variables**

```bash
heroku config:set NODE_ENV=production
heroku config:set PYTHON_PORT=5001
heroku config:set FRONTEND_URL=https://your-app-name.herokuapp.com
```

5. **Deploy**

```bash
git push heroku main
```

### Deploying to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `cd backend && npm install && cd ../frontend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
4. Add environment variables in Render dashboard
5. Deploy

## 🐛 Troubleshooting

### Python Bridge Not Starting

**Issue**: Python bridge fails to start

**Solution**:
```bash
# Install Python dependencies manually
cd backend/python
pip install -r requirements.txt

# Test Python bridge independently
python mt5_bridge.py 5001
```

### MT5 Connection Failed

**Issue**: Cannot connect to MT5

**Solutions**:
- Ensure MetaTrader 5 is installed and running
- Check that you're using the correct server name
- Verify your MT5 account credentials
- Make sure MT5 allows automated trading (Tools → Options → Expert Advisors → Allow automated trading)

### WebSocket Connection Issues

**Issue**: Real-time updates not working

**Solutions**:
- Check if backend is running on the correct port
- Verify CORS settings in backend
- Check browser console for WebSocket errors
- Ensure firewall allows WebSocket connections

### MongoDB Connection Errors

**Issue**: Cannot connect to MongoDB

**Solutions**:
- MongoDB is optional - you can run without it
- To disable MongoDB, remove or comment out `MONGODB_URI` in `.env`
- If you want to use MongoDB, ensure it's installed and running:
  ```bash
  # Start MongoDB
  mongod
  ```

## 📊 Performance Optimization

- **Price Updates**: 1 second interval (configurable)
- **Account Updates**: 2 second interval (configurable)
- **Position Updates**: 2 second interval (configurable)
- **WebSocket Reconnection**: Automatic with exponential backoff

## 🔒 Security Considerations

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Add authentication middleware for multi-user deployments
- Regularly update dependencies

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [MetaTrader 5](https://www.metatrader5.com/) - Trading platform
- [TradingView](https://www.tradingview.com/) - Chart widgets
- [React](https://reactjs.org/) - Frontend framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Socket.io](https://socket.io/) - Real-time communication
- [Express](https://expressjs.com/) - Backend framework

## 📞 Support

For issues, questions, or contributions:

- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

## ⚠️ Disclaimer

This software is for educational and personal use only. Trading forex involves substantial risk of loss and is not suitable for all investors. Always practice proper risk management and never trade with money you cannot afford to lose.

---

**Made with ❤️ for the trading community**

*Happy Trading! 🚀*
