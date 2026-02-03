
import React, { useState } from 'react';
import { LESSONS, STRATEGIES } from '../constants';
import { UserStage, Lesson, Strategy } from '../types';

interface AcademyProps {
  currentStage: UserStage;
  onDeployStrategy: (strat: Strategy) => void;
}

export const Academy: React.FC<AcademyProps> = ({ currentStage, onDeployStrategy }) => {
  const [selectedTab, setSelectedTab] = useState<'lectures' | 'strategies'>('lectures');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', ...new Set(LESSONS.map(l => l.category))];
  const filteredLessons = filter === 'All' ? LESSONS : LESSONS.filter(l => l.category === filter);

  return (
    <div className="space-y-12">
      {/* Detail View Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/95 backdrop-blur-3xl">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 md:p-16 space-y-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full tracking-widest">{activeLesson.category}</span>
                    <span className="text-[10px] font-black text-slate-600 uppercase mono">REF: {activeLesson.id}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none">{activeLesson.title}</h2>
                </div>
                <button onClick={() => setActiveLesson(null)} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 transition-all hover:rotate-90">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {activeLesson.content.split('\n\n').map((paragraph, idx) => (
                  <div key={idx} className={`relative p-8 md:p-10 rounded-[2rem] overflow-hidden group transition-all border ${paragraph.startsWith('PRO USE CASE') ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-slate-950/60 border-slate-800/80'}`}>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-2 h-2 rounded-full ${paragraph.startsWith('PRO USE CASE') ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'bg-slate-700'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${paragraph.startsWith('PRO USE CASE') ? 'text-indigo-400' : 'text-slate-500'}`}>
                          {paragraph.startsWith('PRO USE CASE') ? 'The Institutional Why' : 'Layman Perspective'}
                        </span>
                      </div>
                      <p className={`text-lg md:text-xl leading-relaxed ${paragraph.startsWith('PRO USE CASE') ? 'text-indigo-100 font-bold' : 'text-slate-300 font-medium'}`}>
                        {paragraph.replace('PRO USE CASE: ', '').replace('LAYMAN TERMS: ', '')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
                <button onClick={() => setActiveLesson(null)} className="w-full md:w-auto px-16 py-6 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] transition-all shadow-[0_15px_40px_rgba(99,102,241,0.4)]">Master Concept</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-slate-900 pb-12">
        <div className="space-y-8">
          <div className="flex gap-10">
            <button onClick={() => setSelectedTab('lectures')} className={`text-base font-black uppercase tracking-widest transition-all ${selectedTab === 'lectures' ? 'text-indigo-400 border-b-2 border-indigo-400 pb-2 -mb-[49px]' : 'text-slate-600 hover:text-slate-400 pb-2'}`}>Curriculum</button>
            <button onClick={() => setSelectedTab('strategies')} className={`text-base font-black uppercase tracking-widest transition-all ${selectedTab === 'strategies' ? 'text-indigo-400 border-b-2 border-indigo-400 pb-2 -mb-[49px]' : 'text-slate-600 hover:text-slate-400 pb-2'}`}>Blueprints</button>
          </div>
          {selectedTab === 'lectures' && (
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === cat ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{cat}</button>
              ))}
            </div>
          )}
        </div>
        <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Mastery Index</p>
            <p className="text-4xl font-black text-white leading-none tracking-tighter">18 <span className="text-slate-700">/ 18</span></p>
        </div>
      </div>

      {selectedTab === 'lectures' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} onClick={() => setActiveLesson(lesson)} className="group p-10 bg-slate-900 border border-slate-800 border-t-indigo-600/30 rounded-[2.5rem] transition-all hover:translate-y-[-10px] cursor-pointer hover:border-indigo-500/40 hover:shadow-2xl overflow-hidden relative">
              <div className="flex justify-between items-start mb-10">
                <span className="text-[9px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl tracking-[0.2em]">Module {lesson.id.split('-')[1]}</span>
                <span className="mono text-[10px] text-slate-700 font-bold">{lesson.category}</span>
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tighter text-slate-100 group-hover:text-white transition-colors leading-[0.9]">{lesson.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-12 h-20 overflow-hidden line-clamp-3 font-medium">{lesson.content.split('\n\n')[0].replace('LAYMAN TERMS: ', '')}</p>
              <div className="flex items-center justify-between pt-8 border-t border-slate-800/40">
                <div className="flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-5 transition-all">Initiate Module</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {STRATEGIES.map((strat, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:border-indigo-500/40 transition-all shadow-xl group">
              <div className="lg:col-span-4 bg-slate-950 p-12 border-r border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full mb-8 inline-block tracking-[0.2em] border border-emerald-400/20">Alpha Protocol</span>
                  <h3 className="text-4xl font-black tracking-tighter mb-6 text-white leading-none">{strat.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium italic opacity-80">"{strat.context}"</p>
                </div>
                <div className="space-y-4 mt-12">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]"><span>Expectancy</span><span className="text-indigo-400">{strat.expectancy}</span></div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div className="h-full bg-indigo-500 w-[65%] shadow-lg animate-pulse"></div></div>
                </div>
              </div>
              <div className="lg:col-span-8 p-12 space-y-16 bg-gradient-to-br from-slate-900 to-slate-950">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Execution Protocol</h4>
                    <p className="text-base text-slate-300 leading-relaxed font-medium">{strat.entry}</p>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Logical Invalidation</h4>
                    <p className="text-base text-rose-300 leading-relaxed font-black italic">{strat.invalidation}</p>
                  </div>
                </div>
                <div className="pt-12 border-t border-slate-800/60 flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-[0.2em]">Institutional Edge</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium italic">{strat.logic}</p>
                  </div>
                  <button 
                    onClick={() => onDeployStrategy(strat as Strategy)}
                    className="w-full md:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    Deploy to Live Terminal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
