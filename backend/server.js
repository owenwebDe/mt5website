import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import mt5Routes from './routes/mt5.js';

// Import socket handlers
import { initializeLiveData, cleanupLiveData } from './sockets/liveData.js';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mt5_trading';

if (process.env.MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('✓ MongoDB connected successfully'))
    .catch((err) => console.error('✗ MongoDB connection error:', err.message));
} else {
  console.log('⚠ MongoDB URI not provided, running without database');
}

// Routes
app.use('/api/mt5', mt5Routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MT5 Web Trading Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      mt5: '/api/mt5/*'
    }
  });
});

// Initialize WebSocket handlers
initializeLiveData(io);

// Python bridge process
let pythonProcess = null;
const PYTHON_PORT = process.env.PYTHON_PORT || 5001;

function startPythonBridge() {
  console.log('Starting Python MT5 bridge...');

  const pythonScript = path.join(__dirname, 'python', 'mt5_bridge.py');

  pythonProcess = spawn('python', [pythonScript, PYTHON_PORT], {
    stdio: 'inherit'
  });

  pythonProcess.on('error', (error) => {
    console.error('Failed to start Python bridge:', error.message);
    console.error('Make sure Python and required packages are installed:');
    console.error('pip install -r backend/python/requirements.txt');
  });

  pythonProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Python bridge exited with code ${code}`);
    }
  });

  console.log(`✓ Python MT5 bridge started on port ${PYTHON_PORT}`);
}

// Start Python bridge on server startup
if (process.env.ENABLE_PYTHON_BRIDGE !== 'false') {
  startPythonBridge();
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Start server
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('MT5 Web Trading Dashboard Backend');
  console.log('='.repeat(50));
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ WebSocket server ready`);
  console.log(`✓ API available at http://localhost:${PORT}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  console.log('\nShutting down gracefully...');

  // Close HTTP server
  httpServer.close(() => {
    console.log('✓ HTTP server closed');
  });

  // Close MongoDB connection
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close(() => {
      console.log('✓ MongoDB connection closed');
    });
  }

  // Cleanup WebSocket intervals
  cleanupLiveData();

  // Kill Python process
  if (pythonProcess) {
    pythonProcess.kill();
    console.log('✓ Python bridge stopped');
  }

  process.exit(0);
}

export default app;
