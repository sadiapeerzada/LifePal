
import React, { useState, useEffect } from 'react';
import { UserRole, AppLanguage, HarmonyMetric, HarmonyInsight, UserProfile } from '../types';
import { analyzeHarmonyData } from '../services/geminiService';
import { 
  Activity, Smartphone, Watch, Zap, Heart, Moon, Footprints, 
  Clock, Sparkles, Loader2, RefreshCw, ChevronRight, CheckCircle2,
  BrainCircuit, Wind, Flame, Droplets, ShieldCheck, Lock, Star
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdateMetrics: (data: HarmonyMetric) => void;
  onUpdateInsight: (insight: HarmonyInsight) => void;
  currentMetrics?: HarmonyMetric;
  currentInsight?: HarmonyInsight;
}

const HarmonyView: React.FC<Props> = ({ profile, onUpdateMetrics, onUpdateInsight, currentMetrics, currentInsight }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate fetching from a wearable device via secure BLE/Health API
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockData: HarmonyMetric = {
      steps: Math.floor(Math.random() * 8000) + 1000,
      sleepHours: (Math.random() * 4) + 4,
      heartRate: Math.floor(Math.random() * 30) + 60,
      activeMinutes: Math.floor(Math.random() * 45) + 10,
      lastSynced: Date.now()
    };
    
    onUpdateMetrics(mockData);
    setIsSyncing(false);
    await handleAnalyze(mockData);
  };

  const handleAnalyze = async (data: HarmonyMetric) => {
    setIsAnalyzing(true);
    const result = await analyzeHarmonyData(data, profile);
    onUpdateInsight(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-[2rem] shadow-inner">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">AI Harmony</h1>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
            Connect your wearable to sync your lifestyle rhythms. LifePal monitors your activity and prescribes AI-driven habits for recovery.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/50">
            <Lock className="w-3 h-3" /> Secure Health Vault
          </div>
        </div>
      </header>

      {!currentMetrics && !isSyncing ? (
        <div className="bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-slate-50 dark:border-slate-800 shadow-2xl p-16 flex flex-col items-center text-center space-y-10 transition-colors">
           <div className="relative">
              <div className="w-40 h-40 bg-orange-50 dark:bg-orange-900/10 rounded-full flex items-center justify-center animate-pulse">
                <Watch className="w-20 h-20 text-orange-200 dark:text-orange-800" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-4 bg-orange-600 text-white rounded-3xl shadow-xl">
                 <Smartphone className="w-6 h-6" />
              </div>
           </div>
           <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">Connect Device</h2>
              <p className="text-slate-400 font-medium max-w-sm mx-auto">Sync with Apple Health, Google Fit, or your clinical wearable to begin monitoring.</p>
           </div>
           <button 
            onClick={handleSync}
            className="px-12 py-6 bg-orange-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-orange-100 dark:shadow-none hover:scale-105 transition-all flex items-center gap-4"
           >
             <RefreshCw className="w-6 h-6" /> Sync Daily Rhythms
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in zoom-in-95">
           {/* Metric Cards */}
           <div className="lg:col-span-2 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MetricDisplay icon={<Footprints />} label="Daily Steps" value={currentMetrics?.steps || 0} unit="steps" target={6000} color="bg-blue-600" />
                <MetricDisplay icon={<Moon />} label="Rest/Sleep" value={parseFloat((currentMetrics?.sleepHours || 0).toFixed(1))} unit="hours" target={8} color="bg-indigo-600" />
                <MetricDisplay icon={<Heart />} label="Avg Heart Rate" value={currentMetrics?.heartRate || 0} unit="bpm" target={70} color="bg-rose-600" />
                <MetricDisplay icon={<Clock />} label="Active Time" value={currentMetrics?.activeMinutes || 0} unit="mins" target={30} color="bg-emerald-600" />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex-1 py-8 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] text-slate-300 dark:text-slate-600 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:border-orange-200 hover:text-orange-400 transition-all disabled:opacity-50"
                >
                  {isSyncing ? <Loader2 className="animate-spin" /> : <RefreshCw />} Re-sync Device
                </button>
                <div className="md:w-1/3 bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-8 flex flex-col items-center justify-center border-2 border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Synced</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300">{currentMetrics ? new Date(currentMetrics.lastSynced).toLocaleTimeString() : 'Never'}</p>
                </div>
              </div>
           </div>

           {/* AI Analysis Sidebar */}
           <div className="space-y-8">
              {isAnalyzing || isSyncing ? (
                <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl flex flex-col items-center justify-center text-center space-y-8 h-full min-h-[500px]">
                   <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center animate-spin border-4 border-t-orange-500 border-white/5">
                      <Sparkles className="w-10 h-10 text-orange-400" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase tracking-tight">AI Analyzing...</h3>
                      <p className="text-slate-400 font-medium">Correlating your active minutes with rest patterns for healing insights.</p>
                   </div>
                </div>
              ) : currentInsight ? (
                <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl space-y-10 animate-in slide-in-from-right-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <ShieldCheck className="w-32 h-32 rotate-12" />
                   </div>
                   <div className="flex items-center gap-4 relative z-10">
                      <div className="p-4 bg-orange-600 rounded-3xl shadow-lg"><BrainCircuit className="w-8 h-8" /></div>
                      <h3 className="text-3xl font-black tracking-tight">AI Insights</h3>
                   </div>
                   
                   <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 relative z-10">
                      <p className="text-xl text-slate-300 font-medium leading-relaxed italic">"{currentInsight.health_summary}"</p>
                   </div>
                   
                   <div className="space-y-6 pt-6 border-t border-white/10 relative z-10">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Daily Recommendations</h4>
                      <div className="space-y-4">
                         <InsightCard icon={<Moon />} title="Sleep Recommendation" text={currentInsight.sleep_insight} color="text-indigo-400" />
                         <InsightCard icon={<Footprints />} title="Activity Goal" text={currentInsight.activity_insight} color="text-blue-400" />
                         <InsightCard icon={<Wind />} title="Recovery Insight" text={currentInsight.recovery_insight} color="text-emerald-400" />
                         <InsightCard icon={<Star />} title="Daily Motivation" text={currentInsight.daily_motivation} color="text-amber-400" />
                      </div>
                   </div>

                   <div className="pt-4 relative z-10">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Clinical Data Integrity Guard Active
                    </div>
                    <button className="w-full py-6 bg-white text-slate-900 font-black rounded-[2rem] flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all shadow-xl">
                        Accept Lifestyle Plan <ChevronRight className="w-5 h-5" />
                    </button>
                   </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[4rem] p-12 flex flex-col items-center justify-center h-full min-h-[500px] text-center space-y-4">
                   <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-300 dark:text-slate-600">
                      <Activity className="w-12 h-12" />
                   </div>
                   <p className="text-slate-400 dark:text-slate-600 font-black uppercase text-sm tracking-widest">Sync data for <br/> AI Personalization</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

const InsightCard = ({ icon, title, text, color }: { icon: React.ReactNode, title: string, text: string, color: string }) => (
  <div className="flex gap-4 items-start group">
    <div className={`mt-1 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color} shrink-0 group-hover:bg-white/10 transition-all border border-white/10`}>
       {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
    </div>
    <div className="space-y-1">
      <p className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{title}</p>
      <p className="font-bold text-slate-300 leading-relaxed text-sm">{text}</p>
    </div>
  </div>
);

const MetricDisplay = ({ icon, label, value, unit, target, color }: any) => {
  const progress = Math.min((value / target) * 100, 100);
  return (
    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl space-y-8 group transition-all hover:shadow-2xl hover:border-blue-50 dark:hover:border-blue-900">
       <div className="flex items-center justify-between">
          <div className={`p-4 ${color} text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
             {React.cloneElement(icon, { className: 'w-6 h-6' })}
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
             <p className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
               {value} <span className="text-sm text-slate-300 dark:text-slate-600 font-black uppercase">{unit}</span>
             </p>
          </div>
       </div>
       <div className="space-y-4">
          <div className="w-full h-3.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700 p-0.5">
             <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.1)]`} style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
             <span className="text-slate-400">Current Progress</span>
             <span className={progress >= 100 ? 'text-emerald-500' : 'text-blue-600 dark:text-blue-400'}>
               {progress >= 100 ? 'Daily Goal Met! ✨' : `Target: ${target} ${unit}`}
             </span>
          </div>
       </div>
    </div>
  );
};

export default HarmonyView;
