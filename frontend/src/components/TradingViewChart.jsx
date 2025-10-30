import { useEffect, useRef } from 'react';

function TradingViewChart({ symbol = 'EURUSD' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    // Create TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `FX:${symbol}`,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#0B0E11',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart',
          backgroundColor: '#14181C',
          gridColor: '#2A2F35',
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: [
            'MASimple@tv-basicstudies'
          ]
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol]);

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Chart</h3>
        <div className="text-sm text-gray-400">
          {symbol} • 15min
        </div>
      </div>
      <div
        id="tradingview_chart"
        ref={containerRef}
        className="rounded-lg overflow-hidden bg-dark-hover"
        style={{ height: '500px' }}
      />
    </div>
  );
}

export default TradingViewChart;
