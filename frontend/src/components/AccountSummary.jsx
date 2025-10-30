import { Wallet, TrendingUp, Activity, BarChart3 } from 'lucide-react';

function AccountSummary({ accountData }) {
  if (!accountData) return null;

  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const profitClass = accountData.profit >= 0 ? 'positive' : 'negative';
  const marginLevelClass = accountData.margin_level > 100 ? 'text-accent-green' : 'text-accent-red';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Balance */}
      <div className="card">
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 bg-accent-cyan bg-opacity-10 rounded-lg">
            <Wallet className="w-5 h-5 text-accent-cyan" />
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Balance</span>
        </div>
        <p className="text-2xl font-bold font-mono">
          {formatCurrency(accountData.balance, accountData.currency)}
        </p>
        <p className="text-xs text-gray-400 mt-1">Account Balance</p>
      </div>

      {/* Equity */}
      <div className="card">
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 bg-accent-green bg-opacity-10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-accent-green" />
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Equity</span>
        </div>
        <p className="text-2xl font-bold font-mono">
          {formatCurrency(accountData.equity, accountData.currency)}
        </p>
        <p className="text-xs text-gray-400 mt-1">Current Equity</p>
      </div>

      {/* Profit */}
      <div className="card">
        <div className="flex items-start justify-between mb-2">
          <div className={`p-2 ${accountData.profit >= 0 ? 'bg-accent-green' : 'bg-accent-red'} bg-opacity-10 rounded-lg`}>
            <Activity className={`w-5 h-5 ${accountData.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`} />
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Profit/Loss</span>
        </div>
        <p className={`text-2xl font-bold font-mono ${profitClass}`}>
          {accountData.profit >= 0 ? '+' : ''}{formatCurrency(accountData.profit, accountData.currency)}
        </p>
        <p className="text-xs text-gray-400 mt-1">Unrealized P&L</p>
      </div>

      {/* Margin Level */}
      <div className="card">
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 bg-accent-yellow bg-opacity-10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-accent-yellow" />
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Margin</span>
        </div>
        <p className={`text-2xl font-bold font-mono ${marginLevelClass}`}>
          {formatNumber(accountData.margin_level || 0)}%
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Free: {formatCurrency(accountData.margin_free || 0, accountData.currency)}
        </p>
      </div>
    </div>
  );
}

export default AccountSummary;
