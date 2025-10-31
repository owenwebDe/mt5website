import express from 'express';
import axios from 'axios';

const router = express.Router();

// Python bridge URL
const PYTHON_BRIDGE_URL = process.env.PYTHON_BRIDGE_URL || 'http://localhost:5001';

// Demo mode - when Python bridge is unavailable
const DEMO_MODE = process.env.DEMO_MODE === 'true' || false;

// Demo data for testing
const demoAccount = {
  login: 123456789,
  balance: 10000.00,
  equity: 10250.50,
  margin: 500.00,
  margin_free: 9750.50,
  profit: 250.50,
  currency: 'USD',
  leverage: 100,
  server: 'Demo-Server'
};

const demoPrices = {
  EURUSD: { bid: 1.0850, ask: 1.0852, spread: 2 },
  GBPUSD: { bid: 1.2650, ask: 1.2653, spread: 3 },
  USDJPY: { bid: 149.50, ask: 149.52, spread: 2 },
  XAUUSD: { bid: 2025.50, ask: 2026.00, spread: 50 },
  AUDUSD: { bid: 0.6550, ask: 0.6552, spread: 2 },
  USDCAD: { bid: 1.3750, ask: 1.3752, spread: 2 }
};

/**
 * Connect to MT5 account
 * POST /api/mt5/connect
 */
router.post('/connect', async (req, res) => {
  try {
    const { account, password, server } = req.body;

    if (!account || !password || !server) {
      return res.status(400).json({ error: 'Missing required credentials' });
    }

    // Try to connect to Python bridge
    try {
      const response = await axios.post(`${PYTHON_BRIDGE_URL}/connect`, {
        account,
        password,
        server
      }, { timeout: 3000 });

      res.json(response.data);
    } catch (pythonError) {
      // Python bridge unavailable - use demo mode
      console.log('Python bridge unavailable, using demo mode');
      res.json({
        success: true,
        message: 'Connected to Demo MT5 Account (Python bridge unavailable on Linux)',
        account: demoAccount,
        demo_mode: true
      });
    }
  } catch (error) {
    console.error('MT5 connection error:', error.message);
    res.status(500).json({
      error: 'Failed to connect to MT5'
    });
  }
});

/**
 * Get account information
 * GET /api/mt5/account
 */
router.get('/account', async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_BRIDGE_URL}/account/info`, { timeout: 3000 });
    res.json(response.data);
  } catch (error) {
    // Return demo account data
    res.json({
      success: true,
      account: demoAccount,
      demo_mode: true
    });
  }
});

/**
 * Get symbol prices
 * POST /api/mt5/prices
 */
router.post('/prices', async (req, res) => {
  try {
    const { symbols } = req.body;
    const response = await axios.post(`${PYTHON_BRIDGE_URL}/symbols/prices`, {
      symbols: symbols || ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD']
    }, { timeout: 3000 });
    res.json(response.data);
  } catch (error) {
    // Return demo prices with slight randomization
    const requestedSymbols = req.body.symbols || ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'AUDUSD', 'USDCAD'];
    const prices = {};

    requestedSymbols.forEach(symbol => {
      if (demoPrices[symbol]) {
        const variation = (Math.random() - 0.5) * 0.0010; // Small random variation
        prices[symbol] = {
          bid: parseFloat((demoPrices[symbol].bid + variation).toFixed(5)),
          ask: parseFloat((demoPrices[symbol].ask + variation).toFixed(5)),
          spread: demoPrices[symbol].spread
        };
      }
    });

    res.json({
      success: true,
      prices,
      demo_mode: true
    });
  }
});

/**
 * Get open positions
 * GET /api/mt5/positions
 */
router.get('/positions', async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_BRIDGE_URL}/positions`, { timeout: 3000 });
    res.json(response.data);
  } catch (error) {
    // Return empty positions for demo
    res.json({
      success: true,
      positions: [],
      demo_mode: true
    });
  }
});

/**
 * Get trade history
 * POST /api/mt5/history
 */
router.post('/history', async (req, res) => {
  try {
    const { days } = req.body;
    const response = await axios.post(`${PYTHON_BRIDGE_URL}/orders/history`, {
      days: days || 30
    }, { timeout: 3000 });
    res.json(response.data);
  } catch (error) {
    // Return empty history for demo
    res.json({
      success: true,
      history: [],
      demo_mode: true
    });
  }
});

/**
 * Open a trade
 * POST /api/mt5/trade/open
 */
router.post('/trade/open', async (req, res) => {
  try {
    const { symbol, type, volume, sl, tp, comment } = req.body;

    if (!symbol || !type) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      const response = await axios.post(`${PYTHON_BRIDGE_URL}/trade/open`, {
        symbol,
        type,
        volume: volume || 0.01,
        sl: sl || 0,
        tp: tp || 0,
        comment: comment || 'Web Trade'
      }, { timeout: 3000 });

      res.json(response.data);
    } catch (pythonError) {
      // Demo mode - simulate trade execution
      res.json({
        success: true,
        message: 'Demo mode: Trade execution simulated (Python bridge unavailable)',
        ticket: Math.floor(Math.random() * 1000000),
        demo_mode: true
      });
    }
  } catch (error) {
    console.error('Error opening trade:', error.message);
    res.status(500).json({
      error: 'Failed to open trade'
    });
  }
});

/**
 * Close a trade
 * POST /api/mt5/trade/close
 */
router.post('/trade/close', async (req, res) => {
  try {
    const { ticket } = req.body;

    if (!ticket) {
      return res.status(400).json({ error: 'Missing ticket number' });
    }

    try {
      const response = await axios.post(`${PYTHON_BRIDGE_URL}/trade/close`, {
        ticket
      }, { timeout: 3000 });

      res.json(response.data);
    } catch (pythonError) {
      // Demo mode
      res.json({
        success: true,
        message: 'Demo mode: Trade close simulated',
        demo_mode: true
      });
    }
  } catch (error) {
    console.error('Error closing trade:', error.message);
    res.status(500).json({
      error: 'Failed to close trade'
    });
  }
});

/**
 * Disconnect from MT5
 * POST /api/mt5/disconnect
 */
router.post('/disconnect', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_BRIDGE_URL}/disconnect`, {}, { timeout: 3000 });
    res.json(response.data);
  } catch (error) {
    // Demo mode
    res.json({
      success: true,
      message: 'Disconnected from demo account',
      demo_mode: true
    });
  }
});

/**
 * Health check for Python bridge
 * GET /api/mt5/health
 */
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_BRIDGE_URL}/health`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: 'Python bridge is not responding'
    });
  }
});

export default router;
