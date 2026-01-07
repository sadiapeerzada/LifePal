import React from 'react';
import { 
  ShieldAlert, AlertTriangle, Phone, FileText, 
  CheckCircle2, Info, ArrowRight, ShieldCheck, 
  Stethoscope, Thermometer, UserCheck, Smartphone, Landmark
} from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../constants';

const EmergencyProtocolView: React.FC<{ language: AppLanguage }> = ({ language }) => {
  const t = (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24 px-4 md:px-0">
      <header className="space-y-6">
        <div className="flex items-center gap-5">
          <div className="p-5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-[2.5rem] shadow-xl ring-4 ring-white dark:ring-slate-900">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-rose-400 leading-none">{t('emergency_header')}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium tracking-tight">{t('emergency_sub')}</p>
          </div>
        </div>
      </header>

      <section className="bg-rose-600 text-white p-12 rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(225,29,72,0.4)] space-y-10 relative overflow-hidden border-8 border-rose-500">
         <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><AlertTriangle className="w-64 h-64" /></div>
         <div className="relative z-10 flex items-center gap-6">
            <div className="p-5 bg-white/20 rounded-[2.5rem] backdrop-blur-md border border-white/30"><Smartphone className="w-12 h-12" /></div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">{t('emergency_immediate_action')}</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
               <ActionStep num="1" text="Call Emergency: 112 (National) or 0571-2700921 (JNMCH Oncology)." />
               <ActionStep num="2" text="Check Vitality: Airway, Breathing, and Level of Consciousness." />
               <ActionStep num="3" text="Keep the patient calm and laying down. Do not offer food or water." />
            </div>
            <div className="bg-white/10 p-8 rounded-[3rem] border border-white/20 backdrop-blur-xl space-y-6">
               <h3 className="text-2xl font-black flex items-center gap-3"><Phone className="w-6 h-6" /> {t('emergency_key_numbers')}</h3>
               <div className="space-y-4">
                  <ContactLink label="JNMCH Emergency Desk" num="0571-2700921" />
                  <ContactLink label="AMU Medical Helpline" num="0571-2700021" />
                  <ContactLink label="National Ambulance" num="102" />
               </div>
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <section className="lg:col-span-7 bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl space-y-10">
            <div className="space-y-4">
               <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                  <FileText className="w-8 h-8 text-rose-500" /> {t('emergency_red_folder')}
               </h3>
               <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed italic">
                 Keep these items in a bright red folder near your front door. It avoids panic when seconds count.
               </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <CheckItem text="Last Oncology Report" />
               <CheckItem text="Current Med List (Photos in LifePal)" />
               <CheckItem text="Government ID (Aadhaar)" />
               <CheckItem text="Ayushman / Insurance Card" />
               <CheckItem text="Last Chemo Cycle Summary" />
               <CheckItem text="Attending Doctor's Name" />
               <CheckItem text="Hospital IPD Card" />
               <CheckItem text="LifePal Brief Export" />
            </div>
         </section>

         <section className="lg:col-span-5 space-y-8">
            <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-[3.5rem] shadow-inner space-y-8 border-2 border-slate-100 dark:border-transparent">
               <div className="flex items-center gap-4 text-rose-600">
                  <Thermometer className="w-8 h-8" />
                  <h3 className="text-2xl font-black tracking-tight uppercase leading-none">{t('emergency_prevention')}</h3>
               </div>
               <div className="space-y-6">
                  <RedFlag title="Fever (Neutropenic)" text="Any temp above 100.4°F (38°C) is a clinical emergency during chemo." />
                  <RedFlag title="Severe Breathlessness" text="Sudden onset or worsening of cough and chest pain." />
                  <RedFlag title="Confusion" text="Significant shifts in cognitive state or extreme lethargy." />
               </div>
            </div>
            
            <div className="bg-indigo-600 text-white p-10 rounded-[3.5rem] shadow-2xl space-y-6 group hover:bg-indigo-700 transition-all">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl"><ShieldCheck className="w-6 h-6" /></div>
                  <h4 className="text-xl font-black">Avoid Crises</h4>
               </div>
               <p className="text-indigo-100 font-medium leading-relaxed italic">"Regularly syncing your Med Scanner history and using the Symptom Tracker daily helps AI identify 'slow' shifts before they turn into emergencies."</p>
               <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl">{t('symptom_log')}</button>
            </div>
         </section>
      </div>

      <footer className="bg-slate-100 dark:bg-slate-800 p-12 rounded-[4rem] border-2 border-slate-200 dark:border-slate-700 text-center space-y-6">
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Clinical Coordination Protocol</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 opacity-50 grayscale">
          <div className="flex items-center gap-2 font-black text-xl text-slate-800 dark:text-white">
             <Landmark className="w-6 h-6" /> JNMCH EMERGENCY
          </div>
          <div className="w-px h-8 bg-slate-300 hidden md:block" />
          <div className="font-black text-xl italic tracking-tighter text-slate-800 dark:text-slate-200 uppercase">ALIG CARE RESPONSE</div>
        </div>
      </footer>
    </div>
  );
};

const ActionStep = ({ num, text }: { num: string, text: string }) => (
  <div className="flex gap-6 items-start p-6 bg-white/10 rounded-[2.5rem] border border-white/10 group hover:bg-white/20 transition-all">
     <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center font-black text-lg shrink-0 shadow-lg">{num}</div>
     <p className="text-xl font-bold leading-tight pt-1">{text}</p>
  </div>
);

const ContactLink = ({ label, num }: { label: string, num: string }) => (
  <a href={`tel:${num}`} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
     <div className="text-left">
        <p className="text-[10px] font-black uppercase tracking-widest text-rose-200">{label}</p>
        <p className="text-lg font-black">{num}</p>
     </div>
     <Phone className="w-5 h-5 text-rose-200" />
  </a>
);

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-slate-100 dark:border-slate-700 group hover:border-rose-200 dark:hover:border-rose-900 transition-all">
     <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-400 group-hover:border-rose-500 group-hover:text-rose-600 transition-all shrink-0">
        <CheckCircle2 className="w-4 h-4" />
     </div>
     <p className="font-black text-sm text-slate-700 dark:text-slate-300">{text}</p>
  </div>
);

const RedFlag = ({ title, text }: { title: string, text: string }) => (
  <div className="space-y-1 text-left px-4 group">
     <h4 className="font-black text-rose-600 dark:text-rose-400 uppercase text-xs tracking-widest flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-rose-600 group-hover:animate-ping" /> {title}
     </h4>
     <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed">{text}</p>
  </div>
);

export default EmergencyProtocolView;
