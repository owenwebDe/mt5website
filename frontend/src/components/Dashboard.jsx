import { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import AccountSummary from './AccountSummary';
import SpreadTable from './SpreadTable';
import OrderPanel from './OrderPanel';
import OpenPositions from './OpenPositions';
import TradeHistory from './TradeHistory';
import TradingViewChart from './TradingViewChart';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function Dashboard({ socket, accountInfo, onLogout, isConnected }) {
  const [accountData, setAccountData] = useState(null);
  const [prices, setPrices] = useState({});
  const [positions, setPositions] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [loading, setLoading] = useState(true);

  // Subscribe to WebSocket events
  useEffect(() => {
    if (!socket) return;

    // Subscribe to account updates
    socket.emit('subscribe:account');
    socket.on('account:update', (data) => {
      setAccountData(data);
      setLoading(false);
    });

    // Subscribe to price updates
    socket.emit('subscribe:prices', {
      symbols: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'USDCHF', 'AUDUSD']
    });
    socket.on('prices:update', (data) => {
      setPrices(data);
    });

    // Subscribe to positions updates
    socket.emit('subscribe:positions');
    socket.on('positions:update', (data) => {
      setPositions(data.positions || []);
    });

    // Handle refresh requests
    socket.on('positions:refresh', () => {
      fetchPositions();
    });

    // Error handlers
    socket.on('account:error', (error) => {
      console.error('Account error:', error);
    });

    socket.on('prices:error', (error) => {
      console.error('Prices error:', error);
    });

    socket.on('positions:error', (error) => {
      console.error('Positions error:', error);
    });

    return () => {
      socket.emit('unsubscribe:account');
      socket.emit('unsubscribe:prices');
      socket.emit('unsubscribe:positions');
      socket.off('account:update');
      socket.off('prices:update');
      socket.off('positions:update');
      socket.off('positions:refresh');
      socket.off('account:error');
      socket.off('prices:error');
      socket.off('positions:error');
    };
  }, [socket]);

  // Fetch trade history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${API_URL}/mt5/positions`);
      setPositions(response.data.positions || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.post(`${API_URL}/mt5/history`, {
        days: 30
      });
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleTradeExecuted = () => {
    // Refresh positions after trade is executed
    fetchPositions();
    if (socket) {
      socket.emit('trade:executed');
    }
  };

  const handlePositionClosed = () => {
    // Refresh data after position is closed
    fetchPositions();
    fetchHistory();
  };

  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
  };

  const handleRefresh = () => {
    fetchPositions();
    fetchHistory();
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-border sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-green bg-opacity-10 rounded-lg">
                <svg
                  className="w-6 h-6 text-accent-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">MT5 Trading Dashboard</h1>
                <p className="text-xs text-gray-500">
                  {accountInfo?.name || 'Trading Account'} • {accountInfo?.server}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isConnected ? 'bg-accent-green bg-opacity-10' : 'bg-accent-red bg-opacity-10'
              }`}>
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-accent-green" />
                    <span className="text-xs text-accent-green font-medium hidden sm:inline">
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-accent-red" />
                    <span className="text-xs text-accent-red font-medium hidden sm:inline">
                      Disconnected
                    </span>
                  </>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="p-2 bg-dark-hover hover:bg-dark-border rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-accent-red bg-opacity-10 hover:bg-opacity-20 text-accent-red rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Summary */}
            <AccountSummary accountData={accountData} />

            {/* Market Overview and Order Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SpreadTable
                  prices={prices}
                  onSymbolSelect={handleSymbolSelect}
                  selectedSymbol={selectedSymbol}
                />
              </div>
              <div>
                <OrderPanel
                  selectedSymbol={selectedSymbol}
                  currentPrice={prices[selectedSymbol]}
                  onTradeExecuted={handleTradeExecuted}
                />
              </div>
            </div>

            {/* Chart */}
            <TradingViewChart symbol={selectedSymbol} />

            {/* Open Positions */}
            <OpenPositions
              positions={positions}
              onPositionClosed={handlePositionClosed}
            />

            {/* Trade History */}
            <TradeHistory history={history} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-dark-border mt-12">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 MT5 Web Trading Dashboard. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Account: {accountInfo?.account}</span>
              <span>•</span>
              <span>Leverage: 1:{accountData?.leverage || accountInfo?.leverage}</span>
              <span>•</span>
              <span>Currency: {accountData?.currency || accountInfo?.currency}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
