import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function SpreadTable({ prices, onSymbolSelect, selectedSymbol }) {
  if (!prices || Object.keys(prices).length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
        <div className="text-center py-8 text-gray-500">
          No price data available
        </div>
      </div>
    );
  }

  const formatPrice = (price, decimals = 5) => {
    return price.toFixed(decimals);
  };

  const getSpreadColor = (spread) => {
    if (spread < 1.0) return 'text-accent-green';
    if (spread < 2.0) return 'text-accent-yellow';
    return 'text-accent-red';
  };

  const getSpreadBgColor = (spread) => {
    if (spread < 1.0) return 'bg-accent-green bg-opacity-10';
    if (spread < 2.0) return 'bg-accent-yellow bg-opacity-10';
    return 'bg-accent-red bg-opacity-10';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Market Overview</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="text-right">Bid</th>
              <th className="text-right">Ask</th>
              <th className="text-right">Spread</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(prices).map((price) => {
              const decimals = price.symbol.includes('JPY') ? 3 : 5;
              const isSelected = selectedSymbol === price.symbol;

              return (
                <tr
                  key={price.symbol}
                  className={`cursor-pointer ${isSelected ? 'bg-dark-hover' : ''}`}
                  onClick={() => onSymbolSelect(price.symbol)}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{price.symbol}</span>
                      {isSelected && (
                        <span className="text-xs bg-accent-cyan bg-opacity-20 text-accent-cyan px-2 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-right font-mono">
                    <span className="text-accent-red">
                      {formatPrice(price.bid, decimals)}
                    </span>
                  </td>
                  <td className="text-right font-mono">
                    <span className="text-accent-green">
                      {formatPrice(price.ask, decimals)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded font-mono text-sm ${getSpreadBgColor(price.spread)} ${getSpreadColor(price.spread)}`}>
                      {price.spread.toFixed(1)} pips
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSymbolSelect(price.symbol);
                      }}
                      className="text-xs px-3 py-1 bg-dark-hover hover:bg-dark-border rounded transition-colors"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Spread Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 px-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-accent-green bg-opacity-20 rounded"></div>
          <span>Tight (&lt;1 pip)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-accent-yellow bg-opacity-20 rounded"></div>
          <span>Normal (1-2 pips)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-accent-red bg-opacity-20 rounded"></div>
          <span>Wide (&gt;2 pips)</span>
        </div>
      </div>
    </div>
  );
}

export default SpreadTable;
