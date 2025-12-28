
import React, { useState } from 'react';
import { SymptomLog, AppLanguage, UserProfile } from '../types';
import { analyzeSymptomPatterns } from '../services/geminiService';
import { 
  Thermometer, Activity, Droplets, Utensils, AlertCircle, 
  Plus, History, BarChart3, ChevronRight, X, Save, Brain, Search, Sparkles, Loader2, Info, ShieldAlert, CheckCircle2
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  logs: SymptomLog[];
  onAdd: (log: SymptomLog) => void;
  language: AppLanguage;
  searchQuery?: string;
  profile: UserProfile;
}

const SymptomTrackerView: React.FC<Props> = ({ logs: allLogs, onAdd, language, searchQuery = '', profile }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState<SymptomLog['type']>('PAIN');
  const [severity, setSeverity] = useState(5);
  const [note, setNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  
  const t = (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;

  const logs = searchQuery
    ? allLogs.filter(log => 
        log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.note && log.note.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allLogs;

  const handleSave = () => {
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      date: Date.now(),
      severity,
      type: newType,
      note
    });
    setShowAdd(false);
    setNote('');
    setSeverity(5);
    setInsights(null); // Clear insights when new data is added
  };

  const handleGenerateInsights = async () => {
    // Only analyze if there's enough data (minimum 2 entries for pattern discovery)
    if (allLogs.length < 2) {
      alert("Please log at least 2 physical shifts for AI to find patterns.");
      return;
    }
    setIsAnalyzing(true);
    try {
      // Ensure we pass only relevant context to save tokens
      const recentLogs = allLogs.slice(0, 30); 
      const result = await analyzeSymptomPatterns(recentLogs, profile, language);
      setInsights(result);
    } catch (e) {
      console.error(e);
      alert("The pattern intelligence engine is busy. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">{t('symptom_log_header')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-xl">{t('symptom_log_sub')}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleGenerateInsights} 
            disabled={isAnalyzing || allLogs.length < 2} 
            className={`px-8 py-6 rounded-[2.5rem] font-black shadow-xl flex items-center gap-4 text-lg transition-all ${isAnalyzing ? 'bg-indigo-100 text-indigo-400' : 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-4 border-indigo-50 dark:border-indigo-900/30 hover:scale-105 active:scale-95'}`}
          >
            {isAnalyzing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8" />} {isAnalyzing ? t('generating_insights') : t('analyze_symptoms')}
          </button>
          <button onClick={() => setShowAdd(true)} className="px-10 py-6 bg-rose-600 text-white rounded-[2.5rem] font-black shadow-2xl flex items-center gap-5 text-xl hover:scale-105 transition-all">
            <Plus className="w-8 h-8" /> Log Shift
          </button>
        </div>
      </header>

      {insights && (
        <section className="bg-gradient-to-br from-indigo-600 to-violet-700 p-12 rounded-[4rem] text-white shadow-2xl space-y-8 relative overflow-hidden animate-in slide-in-from-top-6 duration-700">
           <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Brain className="w-64 h-64" /></div>
           <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-5">
                 <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md border border-white/20 shadow-inner"><Sparkles className="w-10 h-10 text-yellow-300" /></div>
                 <div>
                    <h2 className="text-4xl font-black tracking-tighter">{t('symptom_patterns_header')}</h2>
                    <p className="text-indigo-100 font-bold uppercase text-[10px] tracking-[0.3em]">{t('symptom_patterns_sub')}</p>
                 </div>
              </div>
              <button onClick={() => setInsights(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X className="w-6 h-6" /></button>
           </div>
           <div className="relative z-10 bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 shadow-inner">
              <div className="prose prose-invert max-w-none prose-p:text-xl prose-p:leading-relaxed prose-li:text-xl">
                 <p className="whitespace-pre-wrap font-medium">{insights}</p>
              </div>
           </div>
           <div className="relative z-10 flex items-center gap-4 px-6 text-indigo-100">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <p className="text-xs font-bold leading-relaxed italic opacity-80">This analysis is powered by Gemini 3 Flash and is for informational purposes only. It is not a medical diagnosis. Show this to your oncology team at JNMCH.</p>
           </div>
        </section>
      )}

      {searchQuery && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-4 border-slate-100 dark:border-slate-800 flex items-center gap-6 animate-in slide-in-from-left-4 shadow-xl">
          <Search className="w-6 h-6 text-rose-500" />
          <p className="font-black text-slate-800 dark:text-slate-200 text-lg">
            Filtering for "<span className="text-rose-600">{searchQuery}</span>" — {logs.length} entries.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <StatsCard icon={<AlertCircle className="text-rose-500" />} label="Avg Severity" value={logs.length ? (logs.reduce((a,b)=>a+b.severity,0)/logs.length).toFixed(1) : '0'} />
         <StatsCard icon={<History className="text-blue-500" />} label="Total Logs" value={logs.length.toString()} />
         <StatsCard icon={<BarChart3 className="text-emerald-500" />} label="Last Entry" value={logs.length ? new Date(logs[0].date).toLocaleDateString() : 'N/A'} />
      </div>

      <section className="space-y-6">
        <h3 className="text-3xl font-black flex items-center gap-4 text-slate-900 dark:text-white px-6">
          <History className="w-10 h-10 text-slate-200 dark:text-slate-800" /> Observation History
        </h3>
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl flex items-center justify-between transition-all hover:border-slate-100 dark:hover:border-slate-700">
               <div className="flex items-center gap-10">
                  <div className={`p-6 rounded-[2rem] ${log.severity > 7 ? 'bg-rose-100 text-rose-600' : log.severity > 4 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} shadow-inner`}>
                    <SeverityIcon type={log.type} />
                  </div>
                  <div className="space-y-1 text-left">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">{log.type} <span className="mx-2 opacity-10 text-slate-900 dark:text-white">|</span> Level {log.severity}</h4>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg leading-relaxed">"{log.note || 'No specific notes recorded.'}"</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-slate-300 dark:text-slate-600 tracking-[0.25em]">{new Date(log.date).toLocaleDateString()}</p>
               </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="py-32 text-center opacity-20">
               <Activity className="w-32 h-32 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
               <p className="text-3xl font-black italic text-slate-300 dark:text-slate-600">No physical shifts logged.</p>
            </div>
          )}
        </div>
      </section>

      {showAdd && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl animate-in fade-in">
           <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl p-12 space-y-10 border-4 border-white/10">
              <button onClick={() => setShowAdd(false)} className="absolute top-10 right-10 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-all"><X className="w-8 h-8" /></button>
              <div className="space-y-3 text-left">
                <h3 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">New Shift</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-xl">Categorizing your status helps AI find clinical patterns.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(['PAIN', 'NAUSEA', 'FATIGUE', 'APPETITE'] as const).map(t => (
                  <button key={t} onClick={() => setNewType(t)} className={`p-8 rounded-[2.5rem] border-4 transition-all flex flex-col items-center gap-4 font-black text-xs uppercase tracking-[0.3em] ${newType === t ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20 text-rose-600' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400'}`}>
                    <SeverityIcon type={t} /> {t}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end px-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Intensity Score</label>
                  <span className="text-4xl font-black text-rose-600">{severity}<span className="text-sm text-slate-300">/10</span></span>
                </div>
                <input type="range" min="1" max="10" value={severity} onChange={e => setSeverity(parseInt(e.target.value))} className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-rose-600" />
              </div>

              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add specific context (e.g., 'Happened after lunch', 'Improved with rest')..." className="w-full p-8 rounded-[3rem] bg-slate-50 dark:bg-slate-800 border-4 border-transparent focus:border-rose-300 outline-none h-40 font-bold text-xl text-slate-900 dark:text-white shadow-inner" />

              <button onClick={handleSave} className="w-full py-8 bg-rose-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-rose-700 transition-all flex items-center justify-center gap-5">
                <Save className="w-8 h-8" /> Securely Log Shift
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

const StatsCard = ({ icon, label, value }: any) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl space-y-6 text-center group hover:border-slate-100 dark:hover:border-slate-700 transition-all">
    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">{icon}</div>
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-2">{label}</p>
      <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{value}</p>
    </div>
  </div>
);

const SeverityIcon = ({ type }: { type: SymptomLog['type'] }) => {
  switch (type) {
    case 'PAIN': return <AlertCircle className="w-10 h-10" />;
    case 'NAUSEA': return <Droplets className="w-10 h-10" />;
    case 'FATIGUE': return <Activity className="w-10 h-10" />;
    case 'APPETITE': return <Utensils className="w-10 h-10" />;
    default: return <Brain className="w-10 h-10" />;
  }
};

export default SymptomTrackerView;
