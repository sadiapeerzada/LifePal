import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  AlertTriangle, 
  HelpingHand, 
  Baby, 
  ArrowLeft,
  Lock,
  Search,
  CheckCircle2,
  FileText,
  Heart,
  Database,
  EyeOff,
  UserCheck,
  Stethoscope,
  Globe,
  ExternalLink,
  Smile
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { AppLanguage } from '../types';

interface Props {
  language?: AppLanguage;
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
  );
}

function TrustPoint({ icon, text, subtext }: { icon: React.ReactNode, text: string, subtext?: string }) {
  return (
    <li className="flex gap-4 items-start font-bold text-lg text-slate-500 leading-relaxed group">
      <div className="mt-1.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
        {icon}
      </div>
      <div className="pt-1.5">
        <p className="text-slate-900 dark:text-slate-100">{text}</p>
        {subtext && <p className="text-sm font-medium text-slate-400 mt-1">{subtext}</p>}
      </div>
    </li>
  );
}

const TransparencyPage: React.FC<Props> = ({ language = AppLanguage.ENGLISH }) => {
  const t = (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700 text-left">
      <Link to="/" className="inline-flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-5 h-5" /> {t('back')}
      </Link>

      <header className="space-y-6 text-center py-12">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white">
          {t('transparency_title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          {t('transparency_desc')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* AI Ethics & Usage */}
        <section className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 border-slate-50 dark:border-blue-900/30 shadow-xl flex flex-col gap-6 transition-all hover:shadow-2xl">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            <Cpu className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t('ai_ethics_title')}</h2>
          <ul className="space-y-6 flex-1">
            <TrustPoint 
              icon={<Search className="w-5 h-5" />} 
              text="Google Gemini API" 
              subtext="We use Gemini 3 Pro and Flash for clinical logic." 
            />
            <TrustPoint 
              icon={<Globe className="w-5 h-5" />} 
              text="Search Grounding" 
              subtext="Our AI uses Google Search to verify oncology updates in real-time." 
            />
          </ul>
        </section>

        {/* Data Sovereignty */}
        <section className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 border-slate-50 dark:border-indigo-900/30 shadow-xl flex flex-col gap-6 transition-all hover:shadow-2xl">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
            <Database className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t('data_sovereignty_title')}</h2>
          <ul className="space-y-6 flex-1">
            <TrustPoint 
              icon={<Lock className="w-5 h-5" />} 
              text="Local-First Storage" 
              subtext="Reports and logs are stored locally on your device's IndexDB." 
            />
          </ul>
        </section>

        {/* Financial Transparency */}
        <section className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 border-slate-50 dark:border-emerald-900/30 shadow-xl flex flex-col gap-6 transition-all hover:shadow-2xl">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
            <HelpingHand className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t('financial_transparency_title')}</h2>
          <ul className="space-y-6 flex-1">
            <TrustPoint 
              icon={<CheckCircle2 className="w-5 h-5" />} 
              text="Direct-to-Billing" 
              subtext="Donations are settled directly with JNMCH billing." 
            />
          </ul>
        </section>

        {/* Child Safety & Hero Mode */}
        <section className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 border-slate-50 dark:border-amber-900/30 shadow-xl flex flex-col gap-6 transition-all hover:shadow-2xl">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
            <Baby className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t('pediatric_sanctuary_title')}</h2>
          <ul className="space-y-6 flex-1">
            <TrustPoint 
              icon={<Smile className="w-5 h-5" />} 
              text="Metaphoric Language" 
              subtext="Whimsical metaphors like 'Magic Juice' replace scary medical terms." 
            />
          </ul>
        </section>
      </div>

      {/* Constraints & Medical Disclaimer */}
      <section className="bg-rose-100 dark:bg-rose-900 p-12 rounded-[4rem] shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10"><AlertTriangle className="w-40 h-40" /></div>
        <div className="relative z-10 space-y-6 text-center md:text-left">
           <h2 className="text-3xl font-black flex items-center justify-center md:justify-start gap-4 text-rose-900 dark:text-white">
             <Stethoscope className="w-8 h-8" /> {t('medical_guardrails')}
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-rose-200/50 dark:bg-white/10 rounded-3xl border border-rose-200 dark:border-white/20 backdrop-blur-md">
                 <p className="font-black text-rose-700 dark:text-rose-300 uppercase text-xs mb-2">{t('no_diagnosis_title')}</p>
                 <p className="text-sm font-medium leading-relaxed text-rose-800 dark:text-white">{t('no_diagnosis_desc')}</p>
              </div>
              <div className="p-6 bg-rose-200/50 dark:bg-white/10 rounded-3xl border border-rose-200 dark:border-white/20 backdrop-blur-md">
                 <p className="font-black text-rose-700 dark:text-rose-300 uppercase text-xs mb-2">{t('no_prescription_title')}</p>
                 <p className="text-sm font-medium leading-relaxed text-rose-800 dark:text-white">{t('no_prescription_desc')}</p>
              </div>
              <div className="p-6 bg-rose-200/50 dark:bg-white/10 rounded-3xl border border-rose-200 dark:border-white/20 backdrop-blur-md">
                 <p className="font-black text-rose-700 dark:text-rose-300 uppercase text-xs mb-2">{t('amu_grounded_title')}</p>
                 <p className="text-sm font-medium leading-relaxed text-rose-800 dark:text-white">{t('amu_grounded_desc')}</p>
              </div>
           </div>
        </div>
      </section>

      <footer className="bg-slate-100 dark:bg-slate-800 p-12 rounded-[4rem] border-2 border-slate-200 dark:border-slate-700 text-center space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 font-black text-xl text-slate-800 dark:text-white">
             <Heart className="w-6 h-6 fill-blue-600 text-blue-600" /> LifePal
          </div>
          <div className="w-px h-8 bg-slate-300 hidden md:block" />
          <div className="font-black text-xl italic tracking-tighter text-slate-800 dark:text-slate-200 uppercase">JNMCH AMU Response</div>
        </div>
      </footer>
    </div>
  );
};

export default TransparencyPage;