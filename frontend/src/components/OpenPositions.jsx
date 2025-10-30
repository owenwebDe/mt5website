import { useState } from 'react';
import axios from 'axios';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function OpenPositions({ positions, onPositionClosed }) {
  const [closingTicket, setClosingTicket] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPrice = (price, symbol) => {
    const decimals = symbol.includes('JPY') ? 3 : 5;
    return price.toFixed(decimals);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClosePosition = async (ticket) => {
    if (!confirm(`Are you sure you want to close position #${ticket}?`)) {
      return;
    }

    setClosingTicket(ticket);

    try {
      const response = await axios.post(`${API_URL}/mt5/trade/close`, {
        ticket
      });

      if (response.data.success) {
        alert(`Position closed successfully! Profit: ${formatCurrency(response.data.profit)}`);
        if (onPositionClosed) {
          onPositionClosed();
        }
      }
    } catch (error) {
      console.error('Error closing position:', error);
      alert(error.response?.data?.error || 'Failed to close position');
    } finally {
      setClosingTicket(null);
    }
  };

  if (!positions || positions.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Open Positions</h3>
        <div className="text-center py-8 text-gray-500">
          No open positions
        </div>
      </div>
    );
  }

  const totalProfit = positions.reduce((sum, pos) => sum + pos.profit, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Open Positions</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Total P&L:</span>
          <span className={`font-mono font-semibold ${totalProfit >= 0 ? 'positive' : 'negative'}`}>
            {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Symbol</th>
              <th>Type</th>
              <th className="text-right">Volume</th>
              <th className="text-right">Open Price</th>
              <th className="text-right">Current</th>
              <th className="text-right">SL</th>
              <th className="text-right">TP</th>
              <th className="text-right">Profit</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => {
              const profitClass = position.profit >= 0 ? 'positive' : 'negative';
              const isBuy = position.type === 'BUY';

              return (
                <tr key={position.ticket}>
                  <td className="font-mono text-sm">#{position.ticket}</td>
                  <td className="font-semibold">{position.symbol}</td>
                  <td>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      isBuy
                        ? 'bg-accent-green bg-opacity-10 text-accent-green'
                        : 'bg-accent-red bg-opacity-10 text-accent-red'
                    }`}>
                      {isBuy ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {position.type}
                    </span>
                  </td>
                  <td className="text-right font-mono">{position.volume}</td>
                  <td className="text-right font-mono">{formatPrice(position.price_open, position.symbol)}</td>
                  <td className="text-right font-mono">{formatPrice(position.price_current, position.symbol)}</td>
                  <td className="text-right font-mono text-sm text-gray-400">
                    {position.sl > 0 ? formatPrice(position.sl, position.symbol) : '-'}
                  </td>
                  <td className="text-right font-mono text-sm text-gray-400">
                    {position.tp > 0 ? formatPrice(position.tp, position.symbol) : '-'}
                  </td>
                  <td className={`text-right font-mono font-semibold ${profitClass}`}>
                    {position.profit >= 0 ? '+' : ''}{formatCurrency(position.profit)}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleClosePosition(position.ticket)}
                      disabled={closingTicket === position.ticket}
                      className="btn-close text-sm"
                    >
                      {closingTicket === position.ticket ? (
                        <div className="spinner mx-auto"></div>
                      ) : (
                        'Close'
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {positions.map((position) => {
          const profitClass = position.profit >= 0 ? 'positive' : 'negative';
          const isBuy = position.type === 'BUY';

          return (
            <div key={position.ticket} className="bg-dark-hover rounded-lg p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">{position.symbol}</p>
                  <p className="text-xs text-gray-500 font-mono">#{position.ticket}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  isBuy
                    ? 'bg-accent-green bg-opacity-10 text-accent-green'
                    : 'bg-accent-red bg-opacity-10 text-accent-red'
                }`}>
                  {isBuy ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {position.type}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Volume</p>
                  <p className="font-mono">{position.volume}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Open Price</p>
                  <p className="font-mono">{formatPrice(position.price_open, position.symbol)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Current Price</p>
                  <p className="font-mono">{formatPrice(position.price_current, position.symbol)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Profit/Loss</p>
                  <p className={`font-mono font-semibold ${profitClass}`}>
                    {position.profit >= 0 ? '+' : ''}{formatCurrency(position.profit)}
                  </p>
                </div>
              </div>

              {/* SL/TP */}
              {(position.sl > 0 || position.tp > 0) && (
                <div className="flex gap-3 text-xs">
                  {position.sl > 0 && (
                    <div>
                      <span className="text-gray-400">SL: </span>
                      <span className="font-mono">{formatPrice(position.sl, position.symbol)}</span>
                    </div>
                  )}
                  {position.tp > 0 && (
                    <div>
                      <span className="text-gray-400">TP: </span>
                      <span className="font-mono">{formatPrice(position.tp, position.symbol)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => handleClosePosition(position.ticket)}
                disabled={closingTicket === position.ticket}
                className="btn-close w-full"
              >
                {closingTicket === position.ticket ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    <span>Closing...</span>
                  </div>
                ) : (
                  'Close Position'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OpenPositions;
