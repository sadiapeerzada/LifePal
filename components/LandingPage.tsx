import React from 'react';
import { Heart, ArrowRight, ShieldCheck, Sparkles, Activity, Scan, Navigation2, CheckCircle2, Zap, ShieldAlert, Users, Globe, MessageSquareHeart, ShieldPlus, PlayCircle } from 'lucide-react';
import { AppLanguage } from '../types';
import LanguageToggle from './LanguageToggle';
import { TRANSLATIONS } from '../constants';
import { Link } from 'react-router-dom';

interface Props {
  onStart: () => void;
  currentLang: AppLanguage;
  onSelectLang: (lang: AppLanguage) => void;
}

const LandingPage: React.FC<Props> = ({ onStart, currentLang, onSelectLang }) => {
  // Robust translation helper with English fallback
  const t = (key: string) => {
    return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden selection:bg-blue-100 font-sans text-left transition-colors duration-500">
      <div className="absolute top-0 right-0 w-full h-screen bg-[radial-gradient(circle_at_70%_30%,_rgba(37,99,235,0.03),_transparent_60%)] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <nav className="max-w-7xl mx-auto px-10 py-10 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-[1.2rem] text-white shadow-xl">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400">LifePal</span>
        </div>
        <div className="flex items-center gap-6">
          <LanguageToggle current={currentLang} onSelect={onSelectLang} />
          <button onClick={onStart} className="px-8 py-3.5 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 hover:scale-105 transition-all shadow-xl">{t('welcome')}</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-10 pt-12 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-inner">
            <Sparkles className="w-3.5 h-3.5" /> {t('unified_sanctuary')}
          </div>
          <h1 className="text-8xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
            Cancer Care <br/> with <span className="text-blue-600 italic underline decoration-blue-200 dark:text-blue-400 dark:decoration-blue-900/30">Heart.</span>
          </h1>
          <p className="text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
            {t('clinical_logic_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <button 
              onClick={onStart} 
              className="px-14 py-7 bg-blue-600 text-white font-black rounded-[2.5rem] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-2 transition-all flex items-center justify-center gap-4 text-2xl"
            >
              {t('continue')} <ArrowRight className="w-8 h-8" />
            </button>
            <div className="flex items-center gap-4 px-6 border-l-2 border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 leading-tight">Verified by <br/> Alig Care Hub</p>
            </div>
          </div>
        </div>

        <div className="relative animate-in zoom-in-95 duration-1000">
          <div className="bg-blue-50 dark:bg-blue-900/10 aspect-square rounded-[6rem] overflow-hidden relative shadow-2xl border-8 border-white dark:border-slate-900">
             <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-90" alt="Healing and Compassion" />
             <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
          </div>
          <div className="absolute -top-10 -right-10 bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl border border-blue-50 dark:border-slate-700 space-y-4 max-w-[280px] animate-bounce duration-[6000ms]">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 w-fit rounded-2xl shadow-inner"><Zap className="w-8 h-8" /></div>
            <p className="font-black text-lg text-slate-900 dark:text-white tracking-tighter">Zero Platform Fee</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">Every rupee donated reaches the hospital account directly.</p>
          </div>
        </div>
      </div>

      <section className="bg-blue-600 py-32 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at:20%_80%,_rgba(255,255,255,0.1),_transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-10 relative z-10 space-y-24">
          <div className="text-center space-y-6">
            <h2 className="text-6xl font-black tracking-tight">{t('unified_sanctuary')}</h2>
            <p className="text-blue-100 text-2xl font-medium max-w-3xl mx-auto">We've unified every bit of support you need into one seamless experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureItem icon={<Navigation2 />} title={t('navigator_header')} desc={t('navigator_sub')} />
            <FeatureItem icon={<Scan />} title={t('doc_intel')} desc={t('doc_intel_sub')} />
            <FeatureItem icon={<Activity />} title={t('symptom_log')} desc={t('symptom_log_sub')} />
            <FeatureItem icon={<MessageSquareHeart />} title={t('companion')} desc={t('buddy_desc')} />
            <FeatureItem icon={<ShieldPlus />} title={t('skills_hub')} desc="Master survival and caregiving skills from experts." />
            <FeatureItem icon={<Globe />} title={t('trust')} desc="100% transparent fundraising with direct hospital credit." />
          </div>
        </div>
      </section>

      <footer className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-1000">
           <div className="flex items-center gap-3 font-black text-2xl text-blue-600 dark:text-blue-400"><Heart className="w-8 h-8 fill-current" /> LifePal</div>
           <div className="font-black text-3xl tracking-tighter text-slate-800 dark:text-slate-200 italic">ALIG CARE</div>
           <div className="font-black text-2xl tracking-tighter text-slate-800 dark:text-slate-200">JNMCH AMU</div>
        </div>
        <div className="space-y-4">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">End-to-End Privacy • Institutional Trust • Zero Platform Fees</p>
          <Link to="/transparency" className="inline-block text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Transparency & Ethics Center</Link>
        </div>
      </footer>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: any) => (
  <div className="p-10 bg-white/10 rounded-[4rem] border border-white/20 space-y-6 hover:bg-white/20 transition-all cursor-default backdrop-blur-md">
    <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-lg">{React.cloneElement(icon, { className: 'w-7 h-7' })}</div>
    <h3 className="text-2xl font-black text-left">{title}</h3>
    <p className="text-blue-50 font-medium leading-relaxed text-left">{desc}</p>
  </div>
);

export default LandingPage;