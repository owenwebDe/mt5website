import { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

function TradeHistory({ history }) {
  const [filter, setFilter] = useState('all'); // all, winning, losing

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!history || history.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Trade History</h3>
        <div className="text-center py-8 text-gray-500">
          No trade history available
        </div>
      </div>
    );
  }

  // Filter history
  const filteredHistory = history.filter((trade) => {
    if (filter === 'winning') return trade.profit > 0;
    if (filter === 'losing') return trade.profit < 0;
    return true;
  });

  // Calculate statistics
  const totalTrades = history.length;
  const winningTrades = history.filter(t => t.profit > 0).length;
  const losingTrades = history.filter(t => t.profit < 0).length;
  const totalProfit = history.reduce((sum, t) => sum + t.profit, 0);
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(1) : 0;

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold">Trade History</h3>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filter === 'all'
                ? 'bg-accent-cyan text-dark-bg font-medium'
                : 'bg-dark-hover text-gray-400 hover:bg-dark-border'
            }`}
          >
            All ({totalTrades})
          </button>
          <button
            onClick={() => setFilter('winning')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filter === 'winning'
                ? 'bg-accent-green text-dark-bg font-medium'
                : 'bg-dark-hover text-gray-400 hover:bg-dark-border'
            }`}
          >
            Wins ({winningTrades})
          </button>
          <button
            onClick={() => setFilter('losing')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filter === 'losing'
                ? 'bg-accent-red text-white font-medium'
                : 'bg-dark-hover text-gray-400 hover:bg-dark-border'
            }`}
          >
            Losses ({losingTrades})
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-dark-hover rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Total Trades</p>
          <p className="text-lg font-bold font-mono">{totalTrades}</p>
        </div>
        <div className="bg-dark-hover rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Win Rate</p>
          <p className={`text-lg font-bold font-mono ${winRate >= 50 ? 'positive' : 'negative'}`}>
            {winRate}%
          </p>
        </div>
        <div className="bg-dark-hover rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Total P&L</p>
          <p className={`text-lg font-bold font-mono ${totalProfit >= 0 ? 'positive' : 'negative'}`}>
            {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
          </p>
        </div>
        <div className="bg-dark-hover rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Avg Trade</p>
          <p className={`text-lg font-bold font-mono ${totalProfit >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(totalProfit / totalTrades)}
          </p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Ticket</th>
              <th>Symbol</th>
              <th>Type</th>
              <th className="text-right">Volume</th>
              <th className="text-right">Price</th>
              <th className="text-right">Profit</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((trade, index) => {
              const profitClass = trade.profit >= 0 ? 'positive' : 'negative';
              const isBuy = trade.type === 'BUY';

              return (
                <tr key={`${trade.ticket}-${index}`}>
                  <td className="text-sm text-gray-400">
                    {formatDateTime(trade.time)}
                  </td>
                  <td className="font-mono text-sm">#{trade.ticket}</td>
                  <td className="font-semibold">{trade.symbol}</td>
                  <td>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      isBuy
                        ? 'bg-accent-green bg-opacity-10 text-accent-green'
                        : 'bg-accent-red bg-opacity-10 text-accent-red'
                    }`}>
                      {isBuy ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {trade.type}
                    </span>
                  </td>
                  <td className="text-right font-mono">{trade.volume}</td>
                  <td className="text-right font-mono">{formatPrice(trade.price, trade.symbol)}</td>
                  <td className={`text-right font-mono font-semibold ${profitClass}`}>
                    {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filteredHistory.map((trade, index) => {
          const profitClass = trade.profit >= 0 ? 'positive' : 'negative';
          const isBuy = trade.type === 'BUY';

          return (
            <div key={`${trade.ticket}-${index}`} className="bg-dark-hover rounded-lg p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">{trade.symbol}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateTime(trade.time)}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  isBuy
                    ? 'bg-accent-green bg-opacity-10 text-accent-green'
                    : 'bg-accent-red bg-opacity-10 text-accent-red'
                }`}>
                  {isBuy ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {trade.type}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Ticket</p>
                  <p className="font-mono">#{trade.ticket}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Volume</p>
                  <p className="font-mono">{trade.volume}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Price</p>
                  <p className="font-mono">{formatPrice(trade.price, trade.symbol)}</p>
                </div>
              </div>

              {/* Profit */}
              <div className="pt-2 border-t border-dark-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Profit/Loss</span>
                  <span className={`text-lg font-mono font-semibold ${profitClass}`}>
                    {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No trades match the selected filter
        </div>
      )}
    </div>
  );
}

export default TradeHistory;
