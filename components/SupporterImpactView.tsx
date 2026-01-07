import React, { useState, useEffect } from 'react';
import { UserProfile, AppLanguage } from '../types';
import { 
  Users, ShieldCheck, Heart, MapPin, MessageSquare, 
  Sparkles, CheckCircle2, ChevronRight, Globe, Info, 
  ExternalLink, ArrowRight, Activity, Award, Shield, 
  UsersRound, Landmark, Navigation2, Droplets, Gift, Wallet, Phone, Sparkle
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  profile: UserProfile;
}

const SupporterImpactView: React.FC<Props> = ({ profile }) => {
  const [selectedImpactArea, setSelectedImpactArea] = useState<string | null>(null);
  const t = (key: string) => TRANSLATIONS[profile.language]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;

  const [impactStats, setImpactStats] = useState({
    patients: 0,
    interactions: 0,
    checkins: 0,
    sessions: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setImpactStats({
        patients: 1240,
        interactions: 8500,
        checkins: 3200,
        sessions: 4100
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: t('impact_patients_supported'), value: `${impactStats.patients.toLocaleString()}+`, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/30" },
    { label: t('impact_care_interactions'), value: `${impactStats.interactions.toLocaleString()}+`, icon: <Activity />, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { label: t('impact_mental_health'), value: `${impactStats.checkins.toLocaleString()}+`, icon: <Heart />, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/30" },
    { label: t('impact_navigation'), value: `${impactStats.sessions.toLocaleString()}+`, icon: <Globe />, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/30" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24 px-4 md:px-0">
      <header className="space-y-6 text-center py-12 relative overflow-hidden">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full font-black text-[10px] uppercase tracking-[0.25em] shadow-inner mb-4">
           <Shield className="w-4 h-4" /> Non-Monetary Social Good • Trusted Care Coordination
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]">{t('impact_hub_header')}</h1>
        <p className="text-slate-600 dark:text-slate-300 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
          {t('impact_hub_sub')}
        </p>
      </header>

      {/* Impact Statement Paragraph */}
      <section className="bg-indigo-50 dark:bg-blue-950/40 p-12 rounded-[4rem] border-2 border-indigo-100 dark:border-blue-900 relative group overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-[5s]"><Sparkles className="w-64 h-64 text-blue-600" /></div>
         <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-black text-indigo-950 dark:text-white flex items-center gap-4">
               <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> {t('impact_kindness_title')}
            </h2>
            <p className="text-2xl text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed italic border-l-8 border-indigo-300 dark:border-indigo-600 pl-8">
               For thousands of families across Aligarh and Western Uttar Pradesh, cancer is as much a financial crisis as it is a medical one. Lower-income patients often face the heartbreaking choice between continuing life-saving chemotherapy or putting food on the table. Your donations act as a clinical lifeline—directly settling pharmacy bills and surgical costs that would otherwise go unpaid. Every unit of blood, every warm blanket, and every rupee gifted is a profound act of defiance against despair, ensuring that dignity and world-class care are never a luxury, but a human right for every brave hero fighting this battle.
            </p>
         </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl space-y-6 hover:border-indigo-100 dark:hover:border-indigo-800 transition-all group">
            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl w-fit group-hover:scale-110 transition-transform`}>
              {React.cloneElement(s.icon as React.ReactElement<any>, { className: 'w-8 h-8' })}
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{s.value}</p>
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-slate-950 text-white p-12 rounded-[4rem] shadow-2xl space-y-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-10"><Heart className="w-64 h-64 text-rose-500" /></div>
         
         <div className="relative z-10 space-y-4 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">{t('impact_hero_ways')}</h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
               Cancer care isn't just about medicine. It's about resources, blood, and dignity. Here is exactly how your specific contribution saves lives today.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all group">
               <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Wallet className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-black mb-3">{t('impact_sponsor_title')}</h3>
               <p className="text-slate-300 font-medium leading-relaxed mb-6">
                  {t('impact_sponsor_desc')}
               </p>
               <a href="https://aligscare.org/donate" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-black text-emerald-400 uppercase text-xs tracking-widest hover:text-emerald-300 transition-colors">
                  {t('give_aid')} <ArrowRight className="w-4 h-4" />
               </a>
            </div>

            <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all group">
               <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Droplets className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-black mb-3">{t('impact_gift_life')}</h3>
               <p className="text-slate-300 font-medium leading-relaxed mb-6">
                  {t('impact_gift_life_desc')}
               </p>
               <a href="https://bloodlinks.in/details_bank?id=1206" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-black text-rose-400 uppercase text-xs tracking-widest hover:text-rose-300 transition-colors">
                  {t('finder_header')} <ArrowRight className="w-4 h-4" />
               </a>
            </div>

            <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all group">
               <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Gift className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-black mb-3">{t('impact_share_warmth')}</h3>
               <p className="text-slate-300 font-medium leading-relaxed mb-6">
                  {t('impact_share_warmth_desc')}
               </p>
               <a href="tel:0571-2700921" className="flex items-center gap-3 font-black text-amber-400 uppercase text-xs tracking-widest hover:text-amber-300 transition-colors">
                  {t('companion')} <Phone className="w-4 h-4" />
               </a>
            </div>
         </div>
      </section>

      {/* Area Contributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white dark:bg-slate-900 p-10 md:p-12 rounded-[4rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl space-y-8">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('impact_active_zones')}</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed">
              Supporter participation helps us scale our reach. Select an area to see how your commitment fuels progress.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <ImpactAreaCard 
                  title="Emotional Well-being" 
                  desc="Scaling AI companionship for lonely pediatric wards." 
                  icon={<Sparkles />} 
                  selected={selectedImpactArea === 'Emotional'}
                  onClick={() => setSelectedImpactArea('Emotional')}
               />
               <ImpactAreaCard 
                  title="Patient Navigation" 
                  desc="Simplifying complex paperwork for first-time patients." 
                  icon={<Navigation2 />} 
                  selected={selectedImpactArea === 'Navigation'}
                  onClick={() => setSelectedImpactArea('Navigation')}
               />
               <ImpactAreaCard 
                  title="Awareness & Education" 
                  desc="Distributing expert-verified oncology news to rural clinics." 
                  icon={<Globe />} 
                  selected={selectedImpactArea === 'Awareness'}
                  onClick={() => setSelectedImpactArea('Awareness')}
               />
               <ImpactAreaCard 
                  title="Care Coordination" 
                  desc="Building backup care networks for overwhelmed caregivers." 
                  icon={<UsersRound />} 
                  selected={selectedImpactArea === 'Coordination'}
                  onClick={() => setSelectedImpactArea('Coordination')}
               />
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-slate-100 dark:bg-slate-950 p-10 rounded-[3.5rem] shadow-xl space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10"><Award className="w-24 h-24" /></div>
             <h3 className="text-2xl font-black tracking-tight leading-none text-slate-900 dark:text-white">{t('impact_milestones')}</h3>
             <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed">
               Recognizing your time and commitment to social care through active participation.
             </p>
             <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                   <Award className="w-8 h-8 text-amber-500 dark:text-amber-400" />
                   <div>
                      <p className="font-black text-sm text-slate-800 dark:text-white">Awareness Ally</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase">Commitment Milestone</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                   <ShieldCheck className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                   <div>
                      <p className="font-black text-sm text-slate-800 dark:text-white">Trusted ALIG Contributor</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase">Verified Member</p>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ImpactAreaCard = ({ title, desc, icon, selected, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-8 rounded-[2.5rem] border-4 text-left transition-all group flex flex-col justify-between h-48 ${selected ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-700 shadow-xl' : 'border-slate-50 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-900'}`}
  >
     <div className={`p-3 rounded-xl w-fit ${selected ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600'} transition-all`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
     </div>
     <div className="space-y-1">
        <h4 className={`font-black text-xl leading-none ${selected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-900 dark:text-white'}`}>{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">{desc}</p>
     </div>
  </button>
);

export default SupporterImpactView;
