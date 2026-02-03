
import React, { useState, useEffect } from 'react';
import { RiskCalculator } from './RiskCalculator';
import { SYMBOLS } from '../constants';
import { critiqueTradeLogic } from '../services/gemini';
import { UserStage, Strategy } from '../types';
import TradingViewChart from './TradingViewChart';

interface TradeTerminalProps {
  userStage: UserStage;
  accountBalance: number;
  currentPrice: number;
  onTradeSubmit: (trade: any) => void;
  prefill?: Strategy | null;
}

export const TradeTerminal: React.FC<TradeTerminalProps> = ({ 
  userStage, 
  accountBalance, 
  currentPrice,
  onTradeSubmit,
  prefill
}) => {
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [bias, setBias] = useState<'LONG' | 'SHORT'>('LONG');
  const [entry, setEntry] = useState<number>(currentPrice);
  const [sl, setSl] = useState<number>(currentPrice - 0.0030);
  const [tp, setTp] = useState<number>(currentPrice + 0.0060);
  const [logic, setLogic] = useState('');
  
  const [critique, setCritique] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [posSize, setPosSize] = useState(0);
  const [riskAmount, setRiskAmount] = useState(0);

  // Auto-sync entry price to current market when form is idle
  useEffect(() => {
    if (logic.length < 5 && !prefill) {
      setEntry(currentPrice);
    }
  }, [currentPrice]);

  // Handle Strategy Deployment from Academy
  useEffect(() => {
    if (prefill) {
      setBias(prefill.defaultBias || 'LONG');
      setLogic(`STRATEGY DEPLOYED: ${prefill.name}. ${prefill.context}`);
      const stopDistance = prefill.suggestedStopPips ? prefill.suggestedStopPips / 10000 : 0.0020;
      setEntry(currentPrice);
      setSl(prefill.defaultBias === 'LONG' ? currentPrice - stopDistance : currentPrice + stopDistance);
      setTp(prefill.defaultBias === 'LONG' ? currentPrice + (stopDistance * 2.5) : currentPrice - (stopDistance * 2.5));
    }
  }, [prefill, currentPrice]);

  const handleConsultMentor = async () => {
    if (!logic || logic.length < 20) {
      alert("Please provide institutional trade reasoning (min 20 chars).");
      return;
    }
    setIsAnalyzing(true);
    const feedback = await critiqueTradeLogic(logic, userStage, {
      symbol, bias, entryPrice: entry, stopLoss: sl, takeProfit: tp
    });
    setCritique(feedback || "Mentor logic evaluation complete.");
    setIsAnalyzing(false);
  };

  const handleExecute = () => {
    if (!critique) {
      alert("Mandatory: Socratic Mentorship validation required before risk exposure.");
      return;
    }
    onTradeSubmit({
      symbol, type: bias, entry, stopLoss: sl, takeProfit: tp,
      riskPercent: (riskAmount / accountBalance) * 100,
      logic, mentorCritique: critique
    });
    setCritique(null);
    setLogic('');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Real-time Visualization */}
      <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-950">
        <div className="absolute top-6 left-6 z-10 flex gap-3">
            <div className="px-4 py-2 glass border border-white/10 rounded-2xl text-[10px] font-black mono flex items-center gap-3 shadow-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                MARKET FEED: {symbol} @ {currentPrice}
            </div>
        </div>
        <TradingViewChart symbol={symbol} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step 1: Entry Specification (5 cols) */}
        <div className="lg:col-span-5 space-y-8 bg-slate-900/80 p-8 rounded-[2.5rem] border border-slate-800/60 shadow-xl backdrop-blur-md">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">1. Execution Params</h3>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{userStage} Protocol</span>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Target Asset</label>
              <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-sm font-black transition-all outline-none focus:border-indigo-500/50">
                {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Institutional Bias</label>
              <div className="flex bg-slate-950 border border-slate-800 p-1.5 rounded-2xl h-[52px]">
                <button onClick={() => setBias('LONG')} className={`flex-1 rounded-xl text-[10px] font-black uppercase transition-all ${bias === 'LONG' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shadow-inner' : 'text-slate-600'}`}>Buy</button>
                <button onClick={() => setBias('SHORT')} className={`flex-1 rounded-xl text-[10px] font-black uppercase transition-all ${bias === 'SHORT' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/20 shadow-inner' : 'text-slate-600'}`}>Sell</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Entry</label>
              <input type="number" step="0.0001" value={entry} onChange={(e) => setEntry(parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl mono text-xs font-bold focus:border-indigo-500/50 outline-none" />
            </div>
            <div className="space-y-2 text-rose-500">
              <label className="text-[10px] uppercase font-black text-rose-600/50 tracking-widest">Inval (SL)</label>
              <input type="number" step="0.0001" value={sl} onChange={(e) => setSl(parseFloat(e.target.value))} className="w-full bg-slate-950 border border-rose-900/20 p-4 rounded-2xl mono text-xs font-bold focus:border-rose-500/50 outline-none" />
            </div>
            <div className="space-y-2 text-emerald-500">
              <label className="text-[10px] uppercase font-black text-emerald-600/50 tracking-widest">Target (TP)</label>
              <input type="number" step="0.0001" value={tp} onChange={(e) => setTp(parseFloat(e.target.value))} className="w-full bg-slate-950 border border-emerald-900/20 p-4 rounded-2xl mono text-xs font-bold focus:border-emerald-500/50 outline-none" />
            </div>
          </div>

          <RiskCalculator balance={accountBalance} entryPrice={entry} stopLoss={sl} onValidRisk={(size, amt) => { setPosSize(size); setRiskAmount(amt); }} />

          <div className="space-y-3">
            <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest block">2. Trade Thesis (Must describe "The Why")</label>
            <textarea rows={4} value={logic} onChange={(e) => setLogic(e.target.value)} placeholder="Wait for liquidity sweep above PDH, looking for MSS on 1m chart..." className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-xs font-medium placeholder:text-slate-800 leading-relaxed outline-none focus:border-indigo-500/50 resize-none transition-all" />
          </div>
        </div>

        {/* Step 2: Mentor Critique (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex-1 flex flex-col shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-all"></div>
             
             <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-4 text-white">
                  <div className="relative w-2.5 h-2.5">
                    <div className="absolute inset-0 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"></div>
                    <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-75"></div>
                  </div>
                  System Mentor Validation
                </h2>
             </div>

            <div className="flex-1 bg-slate-950/40 border border-slate-800/40 p-8 rounded-3xl overflow-y-auto text-sm leading-loose text-slate-400 font-medium italic relative z-10">
              {!critique && !isAnalyzing && (
                 <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-30">
                   <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                   <p className="max-w-xs uppercase text-[9px] font-black tracking-widest leading-normal">Operational Status: Waiting for Trade Thesis. Institutional capital must be protected via logical verification.</p>
                 </div>
              )}
              {isAnalyzing && (
                <div className="space-y-8 animate-pulse">
                   <div className="h-4 bg-slate-800 rounded-full w-3/4"></div>
                   <div className="h-4 bg-slate-800 rounded-full w-1/2"></div>
                   <div className="h-px bg-slate-800"></div>
                   <div className="h-4 bg-slate-800 rounded-full w-full"></div>
                </div>
              )}
              {critique && (
                <div className="space-y-6">
                    <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded tracking-widest">Verification Analysis Complete</span>
                    <div className="text-slate-200 text-lg leading-relaxed font-semibold">
                      {critique}
                    </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-4 relative z-10">
              <button 
                disabled={isAnalyzing || logic.length < 10}
                onClick={handleConsultMentor}
                className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-white text-[10px] font-black rounded-2xl transition-all uppercase tracking-widest border border-slate-700 active:scale-95 shadow-lg"
              >
                {isAnalyzing ? "Processing..." : "Verify Thesis"}
              </button>
              
              <button 
                disabled={!critique || posSize <= 0}
                onClick={handleExecute}
                className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-10 text-white text-[10px] font-black rounded-2xl transition-all uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(99,102,241,0.3)] active:scale-95"
              >
                Execute Commitment ({posSize} Lots)
              </button>
            </div>
            
            <p className="mt-6 text-center text-[9px] text-slate-700 uppercase font-black tracking-[0.2em] relative z-10">
              Platform strictly enforces 1% max risk per execution cycle
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
