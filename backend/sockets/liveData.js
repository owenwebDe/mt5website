import axios from 'axios';

const PYTHON_BRIDGE_URL = process.env.PYTHON_BRIDGE_URL || 'http://localhost:5001';

// Default symbols to track
const DEFAULT_SYMBOLS = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'USDCHF', 'AUDUSD'];

// Store active intervals
const activeIntervals = new Map();

/**
 * Initialize WebSocket handlers for live data streaming
 * @param {Server} io - Socket.io server instance
 */
export function initializeLiveData(io) {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle client requesting live prices
    socket.on('subscribe:prices', async (data) => {
      const symbols = data?.symbols || DEFAULT_SYMBOLS;
      console.log(`Client ${socket.id} subscribed to prices:`, symbols);

      // Clear any existing interval for this socket
      if (activeIntervals.has(socket.id)) {
        clearInterval(activeIntervals.get(socket.id));
      }

      // Function to fetch and emit prices
      const fetchPrices = async () => {
        try {
          const response = await axios.post(`${PYTHON_BRIDGE_URL}/symbols/prices`, {
            symbols
          });

          if (response.data && response.data.prices) {
            socket.emit('prices:update', response.data.prices);
          }
        } catch (error) {
          console.error('Error fetching prices:', error.message);
          socket.emit('prices:error', {
            error: 'Failed to fetch prices'
          });
        }
      };

      // Fetch immediately
      await fetchPrices();

      // Set up interval to fetch prices every 1 second
      const interval = setInterval(fetchPrices, 1000);
      activeIntervals.set(socket.id, interval);
    });

    // Handle client requesting account updates
    socket.on('subscribe:account', async () => {
      console.log(`Client ${socket.id} subscribed to account updates`);

      const fetchAccountInfo = async () => {
        try {
          const response = await axios.get(`${PYTHON_BRIDGE_URL}/account/info`);
          socket.emit('account:update', response.data);
        } catch (error) {
          console.error('Error fetching account info:', error.message);
          socket.emit('account:error', {
            error: 'Failed to fetch account information'
          });
        }
      };

      // Fetch immediately
      await fetchAccountInfo();

      // Set up interval to fetch account info every 2 seconds
      const accountInterval = setInterval(fetchAccountInfo, 2000);
      activeIntervals.set(`${socket.id}:account`, accountInterval);
    });

    // Handle client requesting positions updates
    socket.on('subscribe:positions', async () => {
      console.log(`Client ${socket.id} subscribed to positions updates`);

      const fetchPositions = async () => {
        try {
          const response = await axios.get(`${PYTHON_BRIDGE_URL}/positions`);
          socket.emit('positions:update', response.data);
        } catch (error) {
          console.error('Error fetching positions:', error.message);
          socket.emit('positions:error', {
            error: 'Failed to fetch positions'
          });
        }
      };

      // Fetch immediately
      await fetchPositions();

      // Set up interval to fetch positions every 2 seconds
      const positionsInterval = setInterval(fetchPositions, 2000);
      activeIntervals.set(`${socket.id}:positions`, positionsInterval);
    });

    // Handle unsubscribe from prices
    socket.on('unsubscribe:prices', () => {
      console.log(`Client ${socket.id} unsubscribed from prices`);
      if (activeIntervals.has(socket.id)) {
        clearInterval(activeIntervals.get(socket.id));
        activeIntervals.delete(socket.id);
      }
    });

    // Handle unsubscribe from account
    socket.on('unsubscribe:account', () => {
      console.log(`Client ${socket.id} unsubscribed from account updates`);
      const key = `${socket.id}:account`;
      if (activeIntervals.has(key)) {
        clearInterval(activeIntervals.get(key));
        activeIntervals.delete(key);
      }
    });

    // Handle unsubscribe from positions
    socket.on('unsubscribe:positions', () => {
      console.log(`Client ${socket.id} unsubscribed from positions updates`);
      const key = `${socket.id}:positions`;
      if (activeIntervals.has(key)) {
        clearInterval(activeIntervals.get(key));
        activeIntervals.delete(key);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);

      // Clear all intervals for this socket
      if (activeIntervals.has(socket.id)) {
        clearInterval(activeIntervals.get(socket.id));
        activeIntervals.delete(socket.id);
      }

      const accountKey = `${socket.id}:account`;
      if (activeIntervals.has(accountKey)) {
        clearInterval(activeIntervals.get(accountKey));
        activeIntervals.delete(accountKey);
      }

      const positionsKey = `${socket.id}:positions`;
      if (activeIntervals.has(positionsKey)) {
        clearInterval(activeIntervals.get(positionsKey));
        activeIntervals.delete(positionsKey);
      }
    });

    // Handle trade executed event (sent from frontend after successful trade)
    socket.on('trade:executed', () => {
      console.log(`Trade executed by client ${socket.id}, broadcasting update`);
      // Broadcast to all clients that a trade was executed
      io.emit('positions:refresh');
    });
  });

  console.log('WebSocket live data handlers initialized');
}

/**
 * Cleanup function to clear all intervals
 */
export function cleanupLiveData() {
  activeIntervals.forEach((interval) => {
    clearInterval(interval);
  });
  activeIntervals.clear();
  console.log('All live data intervals cleared');
}
