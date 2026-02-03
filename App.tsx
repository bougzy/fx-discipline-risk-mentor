
import React, { useState, useEffect } from 'react';
import { UserProfile, UserStage, Trade, Strategy } from './types';
import { Dashboard } from './components/Dashboard';
import { TradeTerminal } from './components/TradeTerminal';
import { Academy } from './components/Academy';

const INITIAL_PROFILE: UserProfile = {
  id: 'u-1',
  name: 'Forex Apprentice',
  stage: UserStage.FUNDAMENTALS,
  experienceLevel: 42,
  totalTrades: 12,
  ruleAdherenceRate: 98,
  currentCapital: 10000,
  maxDrawdown: 1.2,
  dailyLossLimit: 300,
  behavioralScore: 88,
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'terminal' | 'education' | 'journal'>('dashboard');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(1.0850);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [prefilledStrategy, setPrefilledStrategy] = useState<Strategy | null>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallAction = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const volatility = 0.0001;
        const change = (Math.random() - 0.5) * volatility;
        return parseFloat((prev + change).toFixed(5));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    trades.forEach(trade => {
      if (trade.status === 'OPEN') {
        const isLong = trade.type === 'LONG';
        const hitSL = isLong ? currentPrice <= trade.stopLoss : currentPrice >= trade.stopLoss;
        const hitTP = isLong ? currentPrice >= trade.takeProfit : currentPrice <= trade.takeProfit;

        if (hitSL || hitTP) {
          const isProfit = hitTP;
          const profitAmt = (trade.riskPercent / 100) * profile.currentCapital * (isProfit ? 2.5 : -1.0);
          closeTrade(trade.id, currentPrice, isProfit ? 'PROFIT' : 'LOSS', profitAmt);
        }
      }
    });
  }, [currentPrice, trades, profile.currentCapital]);

  const closeTrade = (id: string, exitPrice: number, outcome: 'PROFIT' | 'LOSS', profitAmt: number) => {
    setTrades(prev => prev.map(t => t.id === id ? {
      ...t, status: 'CLOSED', exit: exitPrice, outcome, profitAmount: profitAmt
    } : t));
    setProfile(prev => ({ ...prev, currentCapital: prev.currentCapital + profitAmt, totalTrades: prev.totalTrades + 1 }));
  };

  const handleNewTrade = (tradeData: any) => {
    setTrades([{ ...tradeData, id: `t-${Date.now()}`, timestamp: Date.now(), status: 'OPEN', entry: currentPrice }, ...trades]);
    setActiveTab('journal');
    setPrefilledStrategy(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
      {/* PWA Helper Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-8">
             <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg"><svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></div>
             <h3 className="text-2xl font-black text-white">Mobile Setup</h3>
             <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left space-y-4">
                <p className="text-xs text-slate-400 font-medium leading-relaxed">1. Tap <span className="text-white font-bold">Share</span> icon.</p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">2. Tap <span className="text-white font-bold">"Add to Home Screen"</span>.</p>
             </div>
             <button onClick={() => setShowInstallGuide(false)} className="w-full py-5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl">Got It</button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 w-full md:top-0 md:left-0 md:w-72 md:h-screen bg-slate-900 border-t md:border-t-0 md:border-r border-slate-800 z-50">
        <div className="hidden md:flex p-10 items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white">RM</div>
          <h1 className="font-black text-lg tracking-tighter">RISK MASTER</h1>
        </div>
        <div className="flex md:flex-col p-2 md:p-6 gap-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} label="Stats" />
          <NavItem active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} label="Trade" />
          <NavItem active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} label="Learn" />
          <NavItem active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} label="Log" />
        </div>
        <div className="hidden md:block absolute bottom-0 w-full p-8 border-t border-slate-800/30">
           <button onClick={handleInstallAction} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" /></svg>
             {deferredPrompt ? 'Deploy App' : 'App Guide'}
           </button>
        </div>
      </nav>

      {/* Content */}
      <main className="md:ml-72 p-4 md:p-12 pb-24 md:pb-12 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{profile.stage}</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                  {activeTab === 'dashboard' ? 'Performance' : activeTab === 'terminal' ? 'Live Execution' : activeTab === 'education' ? 'Academy' : 'System Log'}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Market</p>
              <p className="mono text-lg font-black text-emerald-400">{currentPrice}</p>
            </div>
        </div>
        <div className="animate-in fade-in duration-500">
            {activeTab === 'dashboard' && <Dashboard profile={profile} trades={trades} />}
            {activeTab === 'terminal' && <TradeTerminal userStage={profile.stage} accountBalance={profile.currentCapital} currentPrice={currentPrice} onTradeSubmit={handleNewTrade} prefill={prefilledStrategy} />}
            {activeTab === 'education' && <Academy currentStage={profile.stage} onDeployStrategy={(s) => { setPrefilledStrategy(s); setActiveTab('terminal'); }} />}
            {activeTab === 'journal' && (
              <div className="overflow-x-auto rounded-[2rem] border border-slate-800 bg-slate-900 shadow-2xl">
                <table className="w-full text-left">
                  <thead className="text-[9px] uppercase bg-slate-950 text-slate-500 font-black tracking-widest border-b border-slate-800">
                    <tr><th className="px-6 py-5">Asset</th><th className="px-6 py-5">State</th><th className="px-6 py-5 text-right">P/L</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {trades.map(t => (
                      <tr key={t.id} className="hover:bg-slate-800/10 transition-colors">
                        <td className="px-6 py-5"><span className="font-black text-slate-100 text-xs">{t.symbol}</span></td>
                        <td className="px-6 py-5"><span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border bg-slate-950 text-slate-600 border-slate-800">{t.status}</span></td>
                        <td className={`px-6 py-5 text-right font-black mono text-xs ${t.status === 'OPEN' ? 'text-indigo-400 animate-pulse' : (t.outcome === 'PROFIT' ? 'text-emerald-400' : 'text-rose-400')}`}>
                          {t.status === 'OPEN' ? 'CALC...' : `$${(t.profitAmount || 0).toFixed(2)}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col md:flex-row items-center gap-1 md:gap-4 px-3 py-3 md:px-6 md:py-4 rounded-2xl transition-all duration-200 flex-1 md:flex-none border ${active ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20 shadow-lg' : 'text-slate-600 hover:bg-slate-800/30 border-transparent'}`}>
    <div className={active ? 'text-indigo-400' : 'text-slate-700'}>{icon}</div>
    <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
