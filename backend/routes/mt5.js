import express from 'express';
import axios from 'axios';

const router = express.Router();

// Python bridge URL
const PYTHON_BRIDGE_URL = process.env.PYTHON_BRIDGE_URL || 'http://localhost:5001';

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

    const response = await axios.post(`${PYTHON_BRIDGE_URL}/connect`, {
      account,
      password,
      server
    });

    res.json(response.data);
  } catch (error) {
    console.error('MT5 connection error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to connect to MT5'
    });
  }
});

/**
 * Get account information
 * GET /api/mt5/account
 */
router.get('/account', async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_BRIDGE_URL}/account/info`);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting account info:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to get account information'
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
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error getting prices:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to get prices'
    });
  }
});

/**
 * Get open positions
 * GET /api/mt5/positions
 */
router.get('/positions', async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_BRIDGE_URL}/positions`);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting positions:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to get positions'
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
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error getting history:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to get trade history'
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

    const response = await axios.post(`${PYTHON_BRIDGE_URL}/trade/open`, {
      symbol,
      type,
      volume: volume || 0.01,
      sl: sl || 0,
      tp: tp || 0,
      comment: comment || 'Web Trade'
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error opening trade:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to open trade'
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

    const response = await axios.post(`${PYTHON_BRIDGE_URL}/trade/close`, {
      ticket
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error closing trade:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to close trade'
    });
  }
});

/**
 * Disconnect from MT5
 * POST /api/mt5/disconnect
 */
router.post('/disconnect', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_BRIDGE_URL}/disconnect`);
    res.json(response.data);
  } catch (error) {
    console.error('Error disconnecting:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to disconnect'
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
