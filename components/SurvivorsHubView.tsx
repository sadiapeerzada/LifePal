import React, { useState, useEffect } from 'react';
import { UserRole, AppLanguage, ScannedDoc } from '../types';
import ChatBot from './ChatBot';
import { getFollowupQuestions, generateVaultSummary } from '../services/geminiService';
import { 
  Sun, BrainCircuit, Activity, Heart, Microscope, Apple, Info, 
  ChevronRight, CheckCircle2, Stethoscope, ClipboardList, Loader2, Plus, Trash2,
  Bell, Compass, Wind, X, Zap, Sparkles
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface VigilanceLog {
  id: string;
  date: number;
  note: string;
  category: 'PHYSICAL' | 'EMOTIONAL' | 'ENERGY';
}

const SurvivorsHubView: React.FC<{ role: UserRole, language: AppLanguage, documents?: ScannedDoc[] }> = ({ role, language, documents = [] }) => {
  const [activeTab, setActiveTab] = useState<'AGENT' | 'VIGILANCE' | 'LIFESTYLE' | 'PLANNER'>('AGENT');
  const t = (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;
  
  const [statusInput, setStatusInput] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [logs, setLogs] = useState<VigilanceLog[]>(() => {
    const saved = localStorage.getItem('lifepal_survivor_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [showLogModal, setShowLogModal] = useState(false);
  const [newLogNote, setNewLogNote] = useState('');

  const [brief, setBrief] = useState<string | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('lifepal_survivor_logs', JSON.stringify(logs));
  }, [logs]);

  const handleGenerateQuestions = async () => {
    if (!statusInput.trim()) return;
    setLoadingQuestions(true);
    try {
      const res = await getFollowupQuestions(statusInput, language);
      setQuestions(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleGenerateBrief = async () => {
    if (documents.length === 0) {
      alert("Please upload medical reports in the 'Doc Intel' section first.");
      return;
    }
    setBriefLoading(true);
    try {
      const result = await generateVaultSummary(documents, language);
      setBrief(result);
    } finally {
      setBriefLoading(false);
    }
  };

  const handleAddLog = () => {
    if (!newLogNote.trim()) return;
    const log: VigilanceLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: Date.now(),
      note: newLogNote,
      category: 'PHYSICAL'
    };
    setLogs([log, ...logs]);
    setNewLogNote('');
    setShowLogModal(false);
  };

  const removeLog = (id: string) => setLogs(logs.filter(l => l.id !== id));

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24 px-4 md:px-0">
      <header className="space-y-6">
        <div className="flex items-center gap-5">
          <div className="p-5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-[2.5rem] shadow-xl ring-4 ring-white dark:ring-slate-900">
            <Sun className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-amber-400 leading-none">{t('survivors_hub_header')}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium tracking-tight">{t('survivors_hub_sub')}</p>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] flex flex-wrap gap-2 w-full border-2 border-slate-100 dark:border-slate-800 shadow-xl">
         <TabButton active={activeTab === 'AGENT'} onClick={() => setActiveTab('AGENT')} icon={<Compass />} label="Resilience AI" theme="amber" />
         <TabButton active={activeTab === 'PLANNER'} onClick={() => setActiveTab('PLANNER')} icon={<Stethoscope />} label="Visit Planner" theme="amber" />
         <TabButton active={activeTab === 'VIGILANCE'} onClick={() => setActiveTab('VIGILANCE')} icon={<Microscope />} label="Surveillance" theme="amber" />
         <TabButton active={activeTab === 'LIFESTYLE'} onClick={() => setActiveTab('LIFESTYLE')} icon={<Wind />} label="Thriving" theme="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
           {brief && (
             <div className="mb-10 bg-amber-600 text-white p-10 rounded-[3.5rem] shadow-2xl relative animate-in zoom-in-95 border-4 border-amber-500">
               <button onClick={() => setBrief(null)} className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X className="w-6 h-6"/></button>
               <div className="flex items-center gap-4 mb-6">
                 <div className="p-4 bg-white/20 rounded-2xl border border-white/20"><Zap className="w-8 h-8"/></div>
                 <h3 className="text-3xl font-black tracking-tight">Clinical Summary Brief</h3>
               </div>
               <p className="text-2xl font-bold leading-relaxed italic">"{brief}"</p>
               <p className="text-[10px] font-black uppercase text-amber-200 mt-8 tracking-[0.2em]">Validated for JNMCH Surveillance</p>
             </div>
           )}

           <div className="min-h-[700px] h-[700px] flex flex-col transition-all">
             {activeTab === 'AGENT' && (
               <ChatBot role={UserRole.SURVIVOR} language={language} />
             )}

             {activeTab === 'PLANNER' && (
               <section className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-4 border-slate-100 dark:border-slate-800 shadow-xl space-y-10 animate-in slide-in-from-bottom-6">
                  <div className="space-y-4 text-left">
                     <h3 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-5">
                        <ClipboardList className="w-10 h-10 text-amber-500" /> Visit Planner
                     </h3>
                     <p className="text-slate-600 dark:text-slate-400 font-medium text-xl leading-relaxed">
                        Prepare for your follow-up. Describe your current status, and I'll build a clinical question list for your doctor.
                     </p>
                  </div>

                  <div className="space-y-6">
                     <textarea 
                       value={statusInput}
                       onChange={e => setStatusInput(e.target.value)}
                       placeholder="How have you been feeling? Any new pains, fatigue, or concerns for your oncologist?"
                       className="w-full p-8 rounded-[3rem] bg-slate-50 dark:bg-slate-800 border-4 border-transparent focus:border-amber-400 outline-none h-56 font-bold text-xl transition-all text-slate-900 dark:text-white shadow-inner"
                     />
                     <button 
                       onClick={handleGenerateQuestions}
                       disabled={loadingQuestions || !statusInput.trim()}
                       className="w-full py-8 bg-amber-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-amber-700 transition-all flex items-center justify-center gap-5 disabled:opacity-50"
                     >
                        {loadingQuestions ? <Loader2 className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8" />} Build My Clinical List
                     </button>
                  </div>

                  {questions.length > 0 && (
                    <div className="space-y-8 pt-10 border-t-2 border-slate-100 dark:border-slate-800 animate-in fade-in">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 text-center">AI Tailored Questions</h4>
                       <div className="space-y-4">
                          {questions.map((q, i) => (
                            <div key={i} className="flex gap-6 items-start p-8 bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-900/30 rounded-[3rem] group hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                               <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg">{i + 1}</div>
                               <p className="text-xl text-slate-900 dark:text-slate-200 font-bold leading-relaxed">{q}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
               </section>
             )}

             {activeTab === 'VIGILANCE' && (
               <section className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-4 border-slate-100 dark:border-slate-800 shadow-xl space-y-10 animate-in slide-in-from-bottom-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-5">
                        <Microscope className="w-10 h-10 text-amber-600" /> Surveillance Log
                     </h3>
                     <button 
                       onClick={() => setShowLogModal(true)}
                       className="p-5 bg-amber-600 text-white rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-xl shadow-amber-100/20"
                     >
                        <Plus className="w-8 h-8" />
                     </button>
                  </div>

                  <div className="space-y-6">
                     {logs.map(log => (
                       <div key={log.id} className="p-8 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-800 rounded-[3rem] flex items-center justify-between group hover:border-amber-400 dark:hover:border-amber-600 transition-all shadow-sm">
                          <div className="flex gap-8 items-start">
                             <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-amber-500">
                                <Bell className="w-8 h-8" />
                             </div>
                             <div className="space-y-1 text-left">
                                <p className="font-black text-2xl text-slate-900 dark:text-white leading-tight">{log.note}</p>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{new Date(log.date).toLocaleDateString()} • {log.category}</p>
                             </div>
                          </div>
                          <button onClick={() => removeLog(log.id)} className="p-4 text-slate-200 dark:text-slate-700 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100">
                             <Trash2 className="w-6 h-6" />
                          </button>
                       </div>
                     ))}
                     {logs.length === 0 && (
                       <div className="py-24 text-center space-y-6 opacity-30">
                          <ClipboardList className="w-24 h-24 mx-auto text-slate-300 dark:text-slate-700" />
                          <p className="text-3xl font-black italic text-slate-400">No surveillance logs recorded yet.</p>
                       </div>
                     )}
                  </div>
               </section>
             )}

             {activeTab === 'LIFESTYLE' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-6">
                  <LifestyleCard title="Survivorship Diet" desc="Verified nutritional guidelines for maintaining long-term health post-cancer." icon={<Apple />} color="bg-emerald-100 text-emerald-600" />
                  <LifestyleCard title="Mindful Movement" desc="Restorative activities focused on rebuilding strength and joint mobility." icon={<Activity />} color="bg-blue-100 text-blue-600" />
                  <LifestyleCard title="Mental Resilience" desc="AI-guided cognitive strategies for managing scan anxiety and fear." icon={<BrainCircuit />} color="bg-indigo-100 text-indigo-600" />
                  <LifestyleCard title="Regional Circles" icon={<Heart />} desc="Connect with verified survivor networks in Aligarh and Western UP." color="bg-rose-100 text-rose-600" />
               </div>
             )}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
           <section className="bg-slate-50 dark:bg-slate-950 p-12 rounded-[4rem] shadow-2xl space-y-8 relative overflow-hidden ring-4 ring-white dark:ring-slate-800/50 border-2 border-slate-200 dark:border-transparent">
              <div className="absolute top-0 right-0 p-6 opacity-5"><Sun className="w-32 h-32" /></div>
              <h3 className="text-3xl font-black tracking-tight leading-none text-slate-900 dark:text-white">Resilience Plan</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed">
                The Hub is designed for vigilance without fear. We focus on evidence-based post-cancer thriving.
              </p>
              <div className="pt-6 space-y-5">
                 <div className="flex items-center gap-4 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    <CheckCircle2 className="w-6 h-6" /> Clinical Alignment
                 </div>
                 <div className="flex items-center gap-4 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    <CheckCircle2 className="w-6 h-6" /> Post-Cancer Certified
                 </div>
              </div>
           </section>

           <section className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
              <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-3 text-xl">
                 <Info className="w-6 h-6 text-amber-500" /> Quick Actions
              </h4>
              <div className="space-y-3">
                 <SidebarAction onClick={handleGenerateBrief} label={briefLoading ? "Analyzing Docs..." : "Generate Health Brief"} loading={briefLoading} />
                 <SidebarAction onClick={() => setActiveTab('AGENT')} label="Talk to Resilience AI" />
                 <SidebarAction onClick={() => setShowLogModal(true)} label="Log Surveillance Point" />
              </div>
           </section>
        </div>
      </div>

      {showLogModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl p-12 space-y-8 border-4 border-white/20">
              <div className="space-y-3 text-left">
                <h3 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">New Entry</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Record physical or emotional shifts.</p>
              </div>
              <div className="space-y-6">
                 <textarea 
                  value={newLogNote}
                  onChange={e => setNewLogNote(e.target.value)}
                  placeholder="What have you noticed? (e.g., persistent cough, new localized pain, fatigue changes)"
                  className="w-full p-8 bg-slate-50 dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 rounded-[2.5rem] font-bold text-lg outline-none focus:border-amber-400 h-48 text-slate-900 dark:text-white"
                 />
                 <div className="flex gap-4">
                    <button onClick={() => setShowLogModal(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-3xl uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                    <button onClick={handleAddLog} className="flex-1 py-5 bg-amber-600 text-white font-black rounded-3xl uppercase text-xs tracking-widest shadow-xl hover:bg-amber-700 transition-all">Save Entry</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, theme }: any) => {
  const activeStyles = theme === 'amber' 
    ? 'bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-400 shadow-xl border-2 border-amber-200 dark:border-amber-900/50' 
    : 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xl border-2 border-blue-50';
  
  return (
    <button onClick={onClick} className={`flex-1 py-5 px-8 rounded-[2.2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all ${active ? activeStyles : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'}`}>
      {React.cloneElement(icon, { className: 'w-6 h-6' })} {label}
    </button>
  );
};

const LifestyleCard = ({ title, desc, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 border-slate-100 dark:border-slate-800 shadow-xl space-y-8 group hover:shadow-2xl transition-all text-left">
    <div className={`p-6 rounded-[2rem] w-fit ${color} shadow-inner group-hover:scale-110 transition-transform`}>
       {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-10 h-10' })}
    </div>
    <div className="space-y-3">
       <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors">{title}</h3>
       <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed italic">"{desc}"</p>
    </div>
    <ChevronRight className="w-10 h-10 text-slate-100 dark:text-slate-800 group-hover:text-amber-300 transition-all ml-auto" />
  </div>
);

const SidebarAction = ({ label, onClick, loading }: { label: string, onClick?: () => void, loading?: boolean }) => (
  <button onClick={onClick} disabled={loading} className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl text-left font-black text-slate-700 dark:text-slate-300 text-sm hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:text-amber-600 transition-all flex items-center justify-between group disabled:opacity-50 border border-transparent hover:border-amber-200 dark:hover:border-amber-900/30">
     {label} {loading ? <Loader2 className="w-5 h-5 animate-spin text-amber-500"/> : <ChevronRight className="w-5 h-5 text-slate-200 dark:text-slate-700 group-hover:text-amber-500 transition-all" />}
  </button>
);

export default SurvivorsHubView;
