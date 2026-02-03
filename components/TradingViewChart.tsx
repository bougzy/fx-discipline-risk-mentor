
import React, { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  theme?: 'dark' | 'light';
  autosize?: boolean;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol, 
  theme = 'dark', 
  autosize = true 
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": autosize,
      "symbol": `FX:${symbol}`,
      "interval": "60",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com",
      "hide_top_toolbar": false,
      "save_image": false,
      "container_id": "tradingview_widget"
    });
    
    container.current.appendChild(script);
  }, [symbol, theme, autosize]);

  return (
    <div className="tradingview-widget-container h-full w-full bg-slate-950 overflow-hidden rounded-xl border border-slate-800 shadow-inner" ref={container}>
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
};

export default TradingViewChart;
