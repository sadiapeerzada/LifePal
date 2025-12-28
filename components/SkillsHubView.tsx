import React, { useState } from 'react';
import { getClinicalTutorial } from '../services/geminiService';
import { AppLanguage } from '../types';
import { GraduationCap, ChevronRight, X, Loader2, Sparkles, ShieldAlert } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

const SKILLS = [
  { id: 'picc', title: 'PICC Line Care', desc: 'Hygiene and maintenance guide for peripherally inserted central catheters.' },
  { id: 'port', title: 'Chemo Port Hygiene', desc: 'Managing the access site and identifying signs of infection.' },
  { id: 'wound', title: 'Basic Wound Dressing', desc: 'Safe steps for cleaning and changing dressings at home.' },
  { id: 'mucositis', title: 'Oral Care (Mouth Sores)', desc: 'Protocols for managing mucositis and maintaining oral hygiene during chemo.' },
  { id: 'stoma', title: 'Ostomy/Stoma Care', desc: 'Step-by-step guidance for cleaning and changing ostomy appliances.' },
  { id: 'fatigue', title: 'Energy Conservation', desc: 'Practical pacing techniques to manage cancer-related fatigue.' },
  { id: 'neutropenic', title: 'Fever Vigilance', desc: 'Understanding neutropenic precautions and when to call the JNMCH emergency line.' },
  { id: 'lymph', title: 'Lymphedema Massage', desc: 'Gentle drainage techniques for post-surgery swelling management.' },
  { id: 'nausea', title: 'Acupressure for Nausea', desc: 'Traditional methods to manage treatment-induced sickness.' },
  { id: 'diet', title: 'Post-Chemo Soft Diet', desc: 'Nutritional strategies when appetite is low.' },
  { id: 'infection', title: 'Infection Prevention', desc: 'Critical hygiene protocols for immuno-compromised patients.' },
  { id: 'hydration', title: 'Hydration Tracking', desc: 'Strategies to maintain fluid balance and manage dehydration during treatment cycles.' },
  { id: 'pain', title: 'Pain Reporting', desc: 'Mastering the 1-10 scale and describing pain accurately to your oncology team.' },
  { id: 'mobility', title: 'Assisted Mobility', desc: 'Safe techniques for helping patients move from bed to chair to prevent falls.' },
  { id: 'sleep', title: 'Sleep Recovery', desc: 'Optimizing the bedroom environment and routine for better rest during recovery.' },
  { id: 'burnout', title: 'Anchor Resilience', desc: 'Mental health strategies for primary caregivers to prevent burnout.' }
];

const SkillsHubView: React.FC<{ language: AppLanguage, searchQuery?: string }> = ({ language, searchQuery = '' }) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [tutorial, setTutorial] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;

  const filteredSkills = SKILLS.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = async (skill: typeof SKILLS[0]) => {
    setSelectedSkill(skill.title);
    setLoading(true);
    const res = await getClinicalTutorial(skill.title, language);
    setTutorial(res);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24 px-4 md:px-0">
      <header className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full shadow-inner">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-purple-600 dark:text-purple-400 leading-none">{t('skills_hub_header')}</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
          {t('skills_hub_sub')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredSkills.map(skill => (
          <button 
            key={skill.id} 
            onClick={() => handleSelect(skill)}
            className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-purple-100 dark:hover:border-purple-900 transition-all text-left group flex items-start justify-between"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">{skill.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">"{skill.desc}"</p>
            </div>
            <ChevronRight className="w-10 h-10 text-slate-100 dark:text-slate-800 group-hover:text-purple-200 dark:group-hover:text-purple-900 transition-all" />
          </button>
        ))}
      </div>

      <section className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl flex flex-col md:flex-row items-center gap-10">
         <div className="p-8 bg-white/10 rounded-[2.5rem] shrink-0 border border-white/5">
            <ShieldAlert className="w-12 h-12 text-purple-400" />
         </div>
         <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">Clinical Safety First</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl">
              These tutorials are for informational purposes. Always observe a professional nurse at JNMCH performing these tasks before attempting them yourself.
            </p>
         </div>
      </section>

      {selectedSkill && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden flex flex-col border-4 border-white/10">
              <div className="p-10 border-b dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800 shrink-0">
                 <div className="flex items-center gap-4">
                    <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{selectedSkill}</h2>
                 </div>
                 <button onClick={() => setSelectedSkill(null)} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-all"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-10">
                {loading ? (
                  <div className="py-40 text-center space-y-6">
                    <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto" />
                    <p className="text-2xl font-black text-slate-300 uppercase tracking-widest">Compiling Step-by-Step Guide...</p>
                  </div>
                ) : (
                  <div className="space-y-12 animate-in slide-in-from-bottom-4">
                     <div className="bg-purple-50 dark:bg-purple-900/10 p-10 rounded-[3rem] border-4 border-purple-100 dark:border-purple-900/30 space-y-6">
                        <div className="flex items-center gap-4 text-purple-600 dark:text-purple-400">
                          <Sparkles className="w-8 h-8" />
                          <h3 className="text-2xl font-black">AI Guided Path</h3>
                        </div>
                        <p className="text-xl text-purple-900 dark:text-purple-200 font-medium leading-relaxed whitespace-pre-wrap">{tutorial}</p>
                     </div>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SkillsHubView;