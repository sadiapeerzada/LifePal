import React, { useState } from 'react';
import { UserRole, PatientAgeGroup, AppLanguage } from '../types';
import { User, Heart, Baby, Sparkles, ChevronRight, HelpingHand, ArrowLeft, Sun } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  onSelect: (role: UserRole, ageGroup?: PatientAgeGroup, gender?: 'BOY' | 'GIRL') => void;
  language: AppLanguage;
}

const RoleSelection: React.FC<Props> = ({ onSelect, language }) => {
  const [choosingGender, setChoosingGender] = useState(false);
  const t = (key: string) => TRANSLATIONS[language]?.[key] || key;

  if (choosingGender) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-8 py-24 selection:bg-blue-50 overflow-x-hidden relative font-sans transition-colors duration-300">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-rose-50 dark:bg-rose-900/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl w-full text-center space-y-16 relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="space-y-6">
            <button onClick={() => setChoosingGender(false)} className="inline-flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-blue-600 transition-all">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <h1 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              Pick Your <span className="text-blue-600 italic">Hero!</span>
            </h1>
            <p className="text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
              Choose your high-definition companion to begin your victory quest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-2xl mx-auto">
            <button 
              onClick={() => onSelect(UserRole.CHILD, PatientAgeGroup.CHILD, 'BOY')}
              className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-4 border-blue-100 dark:border-blue-900 shadow-xl transition-all group hover:border-blue-500 hover:shadow-blue-200 hover:-translate-y-2 flex flex-col items-center gap-8"
            >
              <div className="w-48 h-48 rounded-full bg-blue-50 dark:bg-blue-900/30 p-1 border-4 border-blue-100 dark:border-blue-800 shadow-inner flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=Felix&backgroundColor=60a5fa" className="w-full h-full object-cover rounded-full scale-110" alt="Boy Hero" />
              </div>
              <h3 className="text-4xl font-black text-blue-600 tracking-tight">Boy Hero</h3>
            </button>

            <button 
              onClick={() => onSelect(UserRole.CHILD, PatientAgeGroup.CHILD, 'GIRL')}
              className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-4 border-rose-100 dark:border-rose-900 shadow-xl transition-all group hover:border-rose-500 hover:shadow-rose-200 hover:-translate-y-2 flex flex-col items-center gap-8"
            >
              <div className="w-48 h-48 rounded-full bg-rose-50 dark:bg-rose-900/30 p-1 border-4 border-rose-100 dark:border-rose-800 shadow-inner flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=Misty&backgroundColor=fb7185" className="w-full h-full object-cover rounded-full scale-110" alt="Girl Hero" />
              </div>
              <h3 className="text-4xl font-black text-rose-600 tracking-tight">Girl Hero</h3>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Split logic for two-tone heading
  const perspectiveText = t('select_perspective');
  const words = perspectiveText.split(' ');
  const lastWord = words.pop();
  const leadText = words.join(' ');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-8 py-24 selection:bg-blue-100 overflow-x-hidden relative font-sans transition-colors duration-300">
      <div className="absolute top-20 -left-40 w-96 h-96 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-rose-50 dark:bg-rose-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl w-full text-center space-y-16 relative z-10">
        <div className="space-y-6 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 dark:shadow-none">
            <Sparkles className="w-4 h-4" /> Your Journey Path
          </div>
          <h1 className="text-7xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
            {leadText} <span className="text-blue-600 italic underline decoration-blue-100 dark:decoration-blue-900">{lastWord}</span>
          </h1>
          <p className="text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
            {t('select_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          <RoleCard 
            title={t('role_patient')} 
            desc={t('role_patient_desc')} 
            icon={<User />}
            onClick={() => onSelect(UserRole.PATIENT, PatientAgeGroup.ADULT)}
            theme="blue"
          />
          <RoleCard 
            title={t('role_caregiver')} 
            desc={t('role_caregiver_desc')} 
            icon={<HelpingHand />}
            onClick={() => onSelect(UserRole.CAREGIVER, PatientAgeGroup.ADULT)}
            theme="indigo"
          />
          <RoleCard 
            title={t('role_hero')} 
            desc={t('role_hero_desc')} 
            icon={<Baby />}
            onClick={() => setChoosingGender(true)}
            theme="rose"
          />
          <RoleCard 
            title={t('role_survivor')} 
            desc={t('role_survivor_desc')} 
            icon={<Sun />}
            onClick={() => onSelect(UserRole.SURVIVOR, PatientAgeGroup.ADULT)}
            theme="amber"
          />
          <RoleCard 
            title={t('role_donor')} 
            desc={t('role_donor_desc')} 
            icon={<Heart />}
            onClick={() => onSelect(UserRole.DONOR)}
            theme="emerald"
          />
        </div>

        <p className="text-[10px] text-slate-300 dark:text-slate-600 font-black uppercase tracking-[0.5em] opacity-60 animate-pulse">End-to-End Privacy • Institutional Trust</p>
      </div>
    </div>
  );
};

const RoleCard = ({ title, desc, icon, onClick, theme }: any) => {
  const themeStyles = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800',
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 hover:border-rose-200 dark:hover:border-rose-800',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 hover:border-amber-200 dark:hover:border-amber-800',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800'
  }[theme as string] || '';

  return (
    <button 
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[3rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl transition-all group flex flex-col items-center text-center space-y-6 md:space-y-8 hover:shadow-2xl hover:-translate-y-2 ${themeStyles}`}
    >
      <div className={`p-6 rounded-[2rem] transition-transform group-hover:scale-110 group-hover:rotate-6 ${themeStyles}`}>
        {React.cloneElement(icon, { className: 'w-8 md:w-10 h-8 md:h-10' })}
      </div>
      <div className="flex-1 space-y-3">
        <h3 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-medium leading-relaxed">{desc}</p>
      </div>
      <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 md:w-5 h-4 md:h-5 text-slate-400" />
      </div>
    </button>
  );
};

export default RoleSelection;
