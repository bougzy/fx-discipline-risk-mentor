
import React, { useState, useEffect } from 'react';
import { RISK_LIMITS } from '../constants';

interface RiskCalculatorProps {
  balance: number;
  onValidRisk: (posSize: number, riskAmount: number) => void;
  entryPrice: number;
  stopLoss: number;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({ 
  balance, 
  onValidRisk, 
  entryPrice, 
  stopLoss 
}) => {
  const [riskPercent, setRiskPercent] = useState(0.5); // Default 0.5%
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entryPrice || !stopLoss) return;

    const pipsAtRisk = Math.abs(entryPrice - stopLoss) * 10000;
    if (pipsAtRisk <= 0) {
      setError("Invalid Stop Loss");
      return;
    }

    const maxAllowedRisk = balance * RISK_LIMITS.MAX_TRADE_RISK;
    const currentRiskAmount = balance * (riskPercent / 100);

    if (currentRiskAmount > maxAllowedRisk) {
      setError(`Risk exceeds platform limit of ${(RISK_LIMITS.MAX_TRADE_RISK * 100)}%`);
    } else {
      setError(null);
      // Simplified Forex Lot sizing: (Risk Amount / (Pips * ValuePerPip))
      // Assuming 10 USD per pip for standard lot, approx sizing
      const lotSize = Number((currentRiskAmount / (pipsAtRisk * 10)).toFixed(2));
      onValidRisk(lotSize, currentRiskAmount);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskPercent, entryPrice, stopLoss, balance]);

  return (
    <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-medium text-slate-400">Risk Per Trade (%)</label>
        <span className="mono text-lg font-bold text-indigo-400">{riskPercent}%</span>
      </div>
      <input 
        type="range" 
        min="0.1" 
        max="1.5" 
        step="0.1" 
        value={riskPercent} 
        onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
      <div className="mt-3 flex justify-between text-xs text-slate-500 font-medium">
        <span>Account: ${balance.toLocaleString()}</span>
        <span>Max Risk: ${(balance * RISK_LIMITS.MAX_TRADE_RISK).toFixed(2)}</span>
      </div>
      {error && (
        <div className="mt-4 p-2 bg-red-900/20 border border-red-900/50 text-red-400 text-xs rounded">
          {error}
        </div>
      )}
    </div>
  );
};
