import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function OrderPanel({ selectedSymbol, currentPrice, onTradeExecuted }) {
  const [orderType, setOrderType] = useState('BUY');
  const [volume, setVolume] = useState('0.01');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Clear message after 5 seconds
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_URL}/mt5/trade/open`, {
        symbol: selectedSymbol,
        type: orderType,
        volume: parseFloat(volume),
        sl: parseFloat(stopLoss) || 0,
        tp: parseFloat(takeProfit) || 0,
        comment: 'Web Trade'
      });

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: `${orderType} order placed successfully! Ticket: ${response.data.order}`
        });

        // Reset form
        setStopLoss('');
        setTakeProfit('');

        // Notify parent component
        if (onTradeExecuted) {
          onTradeExecuted();
        }
      }
    } catch (error) {
      console.error('Trade error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to place order. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const estimatedPrice = currentPrice
    ? orderType === 'BUY'
      ? currentPrice.ask
      : currentPrice.bid
    : null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Place Order</h3>

      {/* Selected Symbol Display */}
      {selectedSymbol && currentPrice && (
        <div className="bg-dark-hover rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold">{selectedSymbol}</span>
            <span className="text-xs text-gray-500">Current Price</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">BID</p>
              <p className="text-lg font-mono text-accent-red">
                {currentPrice.bid.toFixed(selectedSymbol.includes('JPY') ? 3 : 5)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">ASK</p>
              <p className="text-lg font-mono text-accent-green">
                {currentPrice.ask.toFixed(selectedSymbol.includes('JPY') ? 3 : 5)}
              </p>
            </div>
          </div>
        </div>
      )}

      {!selectedSymbol && (
        <div className="bg-accent-yellow bg-opacity-10 border border-accent-yellow rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-accent-yellow flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-yellow">
              Please select a symbol from the market overview to place an order.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Order Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOrderType('BUY')}
              className={`py-3 rounded-lg font-semibold transition-all ${
                orderType === 'BUY'
                  ? 'bg-accent-green text-dark-bg'
                  : 'bg-dark-hover text-gray-400 hover:bg-dark-border'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>BUY</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setOrderType('SELL')}
              className={`py-3 rounded-lg font-semibold transition-all ${
                orderType === 'SELL'
                  ? 'bg-accent-red text-white'
                  : 'bg-dark-hover text-gray-400 hover:bg-dark-border'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingDown className="w-5 h-5" />
                <span>SELL</span>
              </div>
            </button>
          </div>
        </div>

        {/* Volume */}
        <div>
          <label htmlFor="volume" className="block text-sm font-medium text-gray-300 mb-2">
            Volume (Lots)
          </label>
          <input
            type="number"
            id="volume"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            step="0.01"
            min="0.01"
            className="input w-full font-mono"
            required
            disabled={!selectedSymbol}
          />
          <p className="text-xs text-gray-500 mt-1">
            Standard lot = 100,000 units
          </p>
        </div>

        {/* Stop Loss */}
        <div>
          <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-300 mb-2">
            Stop Loss (Optional)
          </label>
          <input
            type="number"
            id="stopLoss"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            step="0.00001"
            className="input w-full font-mono"
            placeholder="0.00000"
            disabled={!selectedSymbol}
          />
        </div>

        {/* Take Profit */}
        <div>
          <label htmlFor="takeProfit" className="block text-sm font-medium text-gray-300 mb-2">
            Take Profit (Optional)
          </label>
          <input
            type="number"
            id="takeProfit"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            step="0.00001"
            className="input w-full font-mono"
            placeholder="0.00000"
            disabled={!selectedSymbol}
          />
        </div>

        {/* Estimated Execution Price */}
        {estimatedPrice && (
          <div className="bg-dark-hover rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Estimated Price:</span>
              <span className="font-mono font-semibold">
                {estimatedPrice.toFixed(selectedSymbol.includes('JPY') ? 3 : 5)}
              </span>
            </div>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`flex items-start gap-2 p-3 rounded-lg border ${
            message.type === 'success'
              ? 'bg-accent-green bg-opacity-10 border-accent-green'
              : 'bg-accent-red bg-opacity-10 border-accent-red'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${
              message.type === 'success' ? 'text-accent-green' : 'text-accent-red'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedSymbol}
          className={`w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            orderType === 'BUY'
              ? 'bg-accent-green text-dark-bg hover:bg-opacity-90'
              : 'bg-accent-red text-white hover:bg-opacity-90'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="spinner"></div>
              <span>Placing Order...</span>
            </div>
          ) : (
            `Place ${orderType} Order`
          )}
        </button>
      </form>
    </div>
  );
}

export default OrderPanel;
