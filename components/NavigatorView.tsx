import React, { useState } from 'react';
import { CareContext, NavigationPlan, UserRole, AppLanguage, SavedResource } from '../types';
import { getCareNavigationPlan, getSimplifiedExplanation, generateSpeech, playAudio } from '../services/geminiService';
import { 
  Sparkles, Map as MapIcon, ChevronRight, Building2, 
  CheckCircle2, ArrowRight, Loader2, Hospital, 
  Heart, ExternalLink, Zap, Headphones, Info, Bookmark, 
  BookmarkCheck, ShieldCheck, Globe, Activity, Search,
  Clock, ShieldAlert, Lock, Key, AlertCircle, MapPin, Landmark, Pill, Orbit, Navigation2
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';

function SelectField({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] px-2">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all" 
      />
    </div>
  );
}

const NavigatorView: React.FC<{ role: UserRole, language: AppLanguage, savedResources: SavedResource[], onToggleSave: (res: Omit<SavedResource, 'timestamp'>) => void }> = ({ role, language, savedResources, onToggleSave }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quotaError, setQuotaError] = useState(false);
  const [plan, setPlan] = useState<NavigationPlan | null>(null);
  const [context, setContext] = useState<CareContext>({
    role, ageGroup: 'Adult', location: 'Aligarh', cancerType: '', financialStatus: 'STRETCHED', priority: 'FUNDING'
  });

  const t = (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;

  const handleGenerate = async () => {
    if (!context.cancerType) {
        alert("Please enter a clinical identifier (cancer type).");
        return;
    }
    setLoading(true);
    setQuotaError(false);
    
    try {
      // Switched to Flash in geminiService to prevent Vercel 10s timeouts
      const result = await getCareNavigationPlan(context);
      setPlan(result);
      setStep(4);
    } catch (error) {
      console.error("[Navigator Error]:", error);
      setQuotaError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24 px-4 md:px-0">
      <header className="space-y-10 relative group">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-7 bg-gradient-to-br from-blue-950 to-indigo-900 text-white rounded-[2.5rem] shadow-2xl flex items-center justify-center transform group-hover:rotate-3 transition-transform">
                  <Navigation2 className="w-12 h-12" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-blue-950 dark:text-white leading-none">
                  {t('navigator_header')}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-100 dark:border-emerald-800">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Protocol Logic v4.2</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-300 dark:text-slate-600 tracking-widest flex items-center gap-2">
                    <Orbit className="w-3 h-3" /> Multi-Institutional Mapping Enabled
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed italic border-l-4 border-indigo-50 dark:border-indigo-900/40 pl-6">
              {t('navigator_sub')}
            </p>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-blue-950 via-indigo-400 to-transparent rounded-full opacity-10" />
      </header>

      {quotaError ? (
        <section className="bg-rose-50 dark:bg-rose-900/10 p-16 rounded-[4rem] border-4 border-rose-100 dark:border-rose-900/30 text-center space-y-10 shadow-2xl animate-in zoom-in-95">
           <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto shadow-xl"><AlertCircle className="w-12 h-12 text-rose-600" /></div>
           <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Sanctuary Sync Issue</h2>
           <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto text-xl">We couldn't generate your path right now. Please check your internet or retry with a shorter cancer type description.</p>
           <button onClick={() => setQuotaError(false)} className="px-14 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:scale-105 transition-all">Retry Pathfinding</button>
        </section>
      ) : step < 4 ? (
        <div className="bg-white dark:bg-slate-900 p-12 md:p-16 rounded-[4.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(30,41,59,0.15)] space-y-16 animate-in slide-in-from-bottom-8 duration-700">
            {step === 1 && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <SelectField label={t('nav_clinical_id')} value={context.cancerType} onChange={(v: string) => setContext({...context, cancerType: v})} placeholder="e.g. Metastatic Lymphoma" />
                  <SelectField label={t('nav_location')} value={context.location} onChange={(v: string) => setContext({...context, location: v})} placeholder="Aligarh, India" />
                </div>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                       <Zap className="w-5 h-5 text-amber-500" />
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('nav_priority')}</label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {(['FUNDING', 'INFORMATION', 'EMOTIONAL', 'LOGISTICS'] as const).map(p => (
                            <button 
                                key={p}
                                onClick={() => setContext({...context, priority: p})}
                                className={`p-6 rounded-[2rem] border-4 font-black text-xs uppercase tracking-widest transition-all ${context.priority === p ? 'bg-blue-950 border-blue-950 text-white shadow-2xl scale-105' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-blue-200'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6">
                   <button 
                    onClick={() => handleGenerate()} 
                    disabled={loading || !context.cancerType} 
                    className="w-full py-10 bg-blue-950 text-white font-black rounded-[3rem] flex items-center justify-center gap-6 text-2xl shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] hover:bg-black active:scale-[0.98] transition-all disabled:opacity-30"
                   >
                     {loading ? (
                       <div className="flex items-center gap-4">
                         <Loader2 className="animate-spin w-10 h-10" />
                         <span className="animate-pulse">Building Your Map...</span>
                       </div>
                     ) : (
                       <>
                         <MapIcon className="w-10 h-10 text-blue-400" /> 
                         <span>{t('nav_launch')}</span>
                       </>
                     )}
                   </button>
                   <p className="text-center text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.5em] mt-8">Grounded in Gemini Flash v3.1 Logic (Rapid Response Mode)</p>
                </div>
              </div>
            )}
        </div>
      ) : (
        <div className="space-y-16 animate-in slide-in-from-bottom-12 duration-1000">
           <section className="bg-white dark:bg-slate-900 p-14 md:p-20 rounded-[5rem] border-4 border-slate-50 dark:border-slate-800 shadow-[0_60px_100px_-30px_rgba(0,0,0,0.15)] space-y-12 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000"><Activity className="w-64 h-64" /></div>
              <div className="flex items-center gap-6 text-blue-950 dark:text-blue-400 relative z-10">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-3xl"><Activity className="w-12 h-12" /></div>
                <h2 className="text-5xl font-black tracking-tighter dark:text-white">{t('nav_strategy')}</h2>
              </div>
              <p className="text-3xl font-black text-slate-800 dark:text-blue-100 leading-[1.1] bg-slate-50 dark:bg-blue-950/40 p-12 rounded-[4rem] border-4 border-white dark:border-blue-900 shadow-inner italic relative z-10">
                "{plan?.roadmap}"
              </p>
           </section>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 {/* Recommended Schemes */}
                 <section className="space-y-10">
                    <div className="flex items-center gap-5 px-8">
                       <div className="p-3 bg-emerald-100 dark:bg-emerald-950 rounded-2xl"><Landmark className="w-8 h-8 text-emerald-600" /></div>
                       <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t('nav_institutional')}</h3>
                    </div>
                    <div className="space-y-6">
                       {plan?.schemes.map((s, i) => {
                          const isSaved = savedResources.some(r => r.link === s.url || r.title === s.name);
                          return (
                          <div key={i} className="p-10 bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all flex flex-col gap-8 group hover:-translate-y-1">
                             <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                   <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight uppercase">{s.name}</h4>
                                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900 inline-block">{s.reason}</p>
                                </div>
                                <button 
                                    onClick={() => onToggleSave({ id: `nav-scheme-${i}`, type: 'SCHEME', title: s.name, description: s.description, link: s.url })} 
                                    className={`p-5 rounded-[1.8rem] transition-all ${isSaved ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/30' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 shadow-sm'}`}
                                >
                                   {isSaved ? <BookmarkCheck className="w-8 h-8" /> : <Bookmark className="w-8 h-8" />}
                                </button>
                             </div>
                             <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed line-clamp-4">"{s.description}"</p>
                             <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-auto py-6 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center gap-4 font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl group-hover:shadow-emerald-100/50 dark:group-hover:shadow-none">
                                {t('back')} <ExternalLink className="w-5 h-5 text-emerald-400" />
                             </a>
                          </div>
                       )})}
                    </div>
                 </section>

                 {/* Clinical Points of Entry */}
                 <section className="space-y-10">
                    <div className="flex items-center gap-5 px-8">
                       <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-2xl"><Hospital className="w-8 h-8 text-blue-600" /></div>
                       <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t('nav_strategic_facilities')}</h3>
                    </div>
                    <div className="space-y-6">
                       {plan?.hospitals.map((h, i) => {
                          const isSaved = savedResources.some(r => r.title === h.name);
                          return (
                          <div key={i} className="p-10 bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col gap-8 group hover:-translate-y-1">
                             <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                   <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight uppercase">{h.name}</h4>
                                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900 inline-block">{h.type} • {h.location}</p>
                                </div>
                                <button 
                                    onClick={() => onToggleSave({ id: `nav-hosp-${i}`, type: 'GROUP', title: h.name, description: `Type: ${h.type}, Location: ${h.location}` })} 
                                    className={`p-5 rounded-[1.8rem] transition-all ${isSaved ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/30' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 shadow-sm'}`}
                                >
                                   {isSaved ? <BookmarkCheck className="w-8 h-8" /> : <Bookmark className="w-8 h-8" />}
                                </button>
                             </div>
                             <div className="flex gap-4">
                                <a href={`https://www.google.com/maps/search/${encodeURIComponent(h.name + ' ' + h.location)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-6 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center gap-4 font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-[0_15px_40px_-10px_rgba(37,99,235,0.4)]">
                                   <MapPin className="w-5 h-5" /> {t('finder')}
                                </a>
                             </div>
                          </div>
                       )})}
                    </div>
                 </section>
              </div>

              {/* Next Steps List */}
              <section className="bg-blue-950 text-white p-14 md:p-20 rounded-[5rem] shadow-[0_80px_120px_-40px_rgba(15,23,42,0.6)] space-y-14 relative overflow-hidden border-8 border-blue-900">
                 <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 transition-transform duration-[10s] group-hover:rotate-45"><Activity className="w-96 h-96" /></div>
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/20"><ChevronRight className="w-10 h-10 text-blue-400" /></div>
                    <h3 className="text-5xl font-black tracking-tighter">Clinical Action Points</h3>
                 </div>
                 <div className="space-y-6 relative z-10">
                    {plan?.nextSteps.map((step, i) => (
                       <div key={i} className="flex items-center gap-10 p-10 bg-white/5 rounded-[3.5rem] border border-white/10 group hover:bg-white/10 transition-all">
                          <div className="w-16 h-16 rounded-[1.8rem] bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg group-hover:scale-110 transition-transform">{i+1}</div>
                          <p className="text-2xl md:text-3xl font-bold text-blue-50 leading-tight tracking-tight">{step}</p>
                       </div>
                    ))}
                 </div>
                 <div className="pt-10 flex flex-col sm:flex-row gap-6 relative z-10">
                    <button onClick={() => window.print()} className="px-14 py-8 bg-white text-blue-950 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-4">
                      <Clock className="w-6 h-6" /> Export Treatment Plan
                    </button>
                    <button onClick={() => setStep(1)} className="px-14 py-8 bg-blue-900/50 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] hover:bg-blue-800 transition-all border border-white/10">
                      Generate New Roadmap
                    </button>
                 </div>
              </section>

              <div className="flex flex-col items-center gap-4 pt-12">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">End of Precision Navigation Log</p>
                  <div className="w-1 h-20 bg-gradient-to-b from-slate-100 to-transparent rounded-full" />
              </div>
        </div>
      )}
    </div>
  );
};

export default NavigatorView;
