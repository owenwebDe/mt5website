import { useState } from 'react';
import axios from 'axios';
import { Lock, Server, User, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    account: '',
    password: '',
    server: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/mt5/connect`, formData);

      if (response.data.success) {
        onLoginSuccess(response.data);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error ||
        'Failed to connect to MT5. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-accent-green bg-opacity-10 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-accent-green"
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
          <h1 className="text-3xl font-bold text-white mb-2">
            MT5 Trading Dashboard
          </h1>
          <p className="text-gray-400">
            Connect to your MetaTrader 5 account
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Number */}
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-300 mb-2">
                Account Number
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  id="account"
                  name="account"
                  value={formData.account}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  placeholder="Enter your MT5 account number"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Server */}
            <div>
              <label htmlFor="server" className="block text-sm font-medium text-gray-300 mb-2">
                Server
              </label>
              <div className="relative">
                <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  id="server"
                  name="server"
                  value={formData.server}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  placeholder="e.g., MetaQuotes-Demo"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-accent-red bg-opacity-10 border border-accent-red rounded-lg">
                <AlertCircle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
                <p className="text-sm text-accent-red">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-green text-dark-bg font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner border-dark-bg"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                'Connect to MT5'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-dark-hover rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              Make sure MetaTrader 5 is installed on your system and the Python bridge is running.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Secure connection • Real-time trading • Mobile friendly
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
