
import React from 'react';
import { UserProfile, UserStage, Trade } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  profile: UserProfile;
  trades: Trade[];
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, trades }) => {
  const behaviorData = [
    { name: 'Timing', score: 85, color: '#6366f1' },
    { name: 'Sizing', score: 92, color: '#8b5cf6' },
    { name: 'Emotion', score: profile.behavioralScore, color: '#ec4899' },
    { name: 'Rules', score: profile.ruleAdherenceRate, color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      {/* High-Density Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <p className="text-[9px] font-black text-slate-600 uppercase mb-1 tracking-widest">Mastery Index</p>
          <p className="text-xl font-black text-indigo-400 leading-none">{profile.experienceLevel}%</p>
          <div className="mt-3 w-full bg-slate-950 h-1 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]" style={{ width: `${profile.experienceLevel}%` }}></div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <p className="text-[9px] font-black text-slate-600 uppercase mb-1 tracking-widest">Rule Adherence</p>
          <p className="text-xl font-black mono text-emerald-400 leading-none">{profile.ruleAdherenceRate}%</p>
          <p className="text-[8px] text-slate-700 mt-2 font-black uppercase">Institutional Grade</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <p className="text-[9px] font-black text-slate-600 uppercase mb-1 tracking-widest">Account Equity</p>
          <p className="text-xl font-black mono text-slate-200 leading-none">${profile.currentCapital.toLocaleString()}</p>
          <p className="text-[8px] text-slate-700 mt-2 font-black uppercase">DD: {profile.maxDrawdown}%</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <p className="text-[9px] font-black text-slate-600 uppercase mb-1 tracking-widest">Behavioral</p>
          <p className="text-xl font-black mono text-indigo-300 leading-none">{profile.behavioralScore}</p>
          <p className="text-[8px] text-slate-700 mt-2 font-black uppercase">Patience: High</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Behavioral Analytics */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Behavioral Consistency</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviorData} layout="vertical" margin={{ left: -20, right: 10 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={9} width={80} fontWeight="900" />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {behaviorData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-slate-950 rounded-2xl border border-slate-800/50">
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
              "System Analysis: Entry precision remains exceptional. Focus on reducing leverage during 'Judas Swings' in the NY session."
            </p>
          </div>
        </div>

        {/* Recent Executions */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Recent Executions</h3>
          <div className="space-y-3">
            {trades.slice(0, 4).map((trade) => (
              <div key={trade.id} className="p-4 bg-slate-950 border border-slate-800/50 rounded-2xl flex justify-between items-center group">
                <div className="flex flex-col">
                  <span className="mono font-black text-xs text-slate-200">{trade.symbol}</span>
                  <span className="text-[9px] text-slate-600 font-black uppercase">{new Date(trade.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="text-right">
                   <p className={`font-black mono text-xs ${trade.outcome === 'PROFIT' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trade.outcome === 'PROFIT' ? '+' : '-'}${Math.abs(trade.profitAmount || 0).toFixed(2)}
                   </p>
                   <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${trade.type === 'LONG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{trade.type}</span>
                </div>
              </div>
            ))}
            {trades.length === 0 && <div className="text-center py-10 text-[10px] text-slate-700 font-black uppercase tracking-widest italic">No Live Data</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
