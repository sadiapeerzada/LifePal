import React, { useState } from 'react';
import { SCHEMES, TRANSLATIONS } from '../constants';
import { Scheme, AppLanguage, UserRole } from '../types';
import { getSimplifiedExplanation, generateSpeech, playAudio } from '../services/geminiService';
import { 
  ShieldCheck, ExternalLink, Zap, Headphones, Loader2, 
  Search, BookOpen, ChevronRight, FileText, CheckCircle2,
  Info, Landmark, Wallet, AlertCircle
} from 'lucide-react';

interface Props {
  language: AppLanguage;
  role: UserRole;
  searchQuery?: string;
}

const GovernmentSchemesView: React.FC<Props> = ({ language, role, searchQuery = '' }) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [explainingId, setExplainingId] = useState<string | null>(null);
  const [simplifiedTexts, setSimplifiedTexts] = useState<Record<string, string>>({});
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const t = (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;

  const effectiveSearch = searchQuery || internalSearchTerm;

  const filteredSchemes = SCHEMES.filter(s => 
    s.name.toLowerCase().includes(effectiveSearch.toLowerCase()) || 
    s.description.toLowerCase().includes(effectiveSearch.toLowerCase())
  );

  const handleExplainSimply = async (scheme: Scheme) => {
    setExplainingId(scheme.id);
    const context = `Scheme Name: ${scheme.name}. Description: ${scheme.description}. Eligibility: ${scheme.eligibility.join(', ')}. Steps: ${scheme.steps.join(', ')}.`;
    try {
      const res = await getSimplifiedExplanation(context, role, language);
      setSimplifiedTexts(prev => ({ ...prev, [scheme.id]: res }));
    } catch (e) {
      console.error(e);
    } finally {
      setExplainingId(null);
    }
  };

  const handleReadAloud = async (scheme: Scheme) => {
    setSpeakingId(scheme.id);
    const textToRead = simplifiedTexts[scheme.id] || `${scheme.name}. ${scheme.description}`;
    try {
      const audio = await generateSpeech(textToRead, language);
      if (audio) await playAudio(audio);
    } catch (e) {
      console.error(e);
    } finally {
      setSpeakingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24 px-4 md:px-0">
      <header className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full shadow-inner">
            <Landmark className="w-8 h-8" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-emerald-600 dark:text-emerald-400 leading-none">{t('schemes_header')}</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
          {t('schemes_sub')}
        </p>
        
        {!searchQuery && (
          <div className="relative max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={internalSearchTerm}
              onChange={(e) => setInternalSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-full outline-none focus:border-emerald-400 shadow-xl shadow-slate-100/20 dark:shadow-none transition-all font-bold dark:text-white"
              placeholder={t('search_placeholder')}
            />
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-12">
        {filteredSchemes.map(scheme => (
          <div key={scheme.id} className="bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-slate-50 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all hover:shadow-emerald-100/50 dark:hover:shadow-none">
            <div className="lg:w-1/3 bg-slate-50 dark:bg-slate-800/50 p-10 space-y-8 border-r-2 border-slate-100 dark:border-slate-800">
              <div className="space-y-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${scheme.type === 'GOVERNMENT' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                  {scheme.type} Relief
                </span>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{scheme.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{scheme.description}</p>
              </div>

              <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 space-y-4">
                <h4 className="font-black text-emerald-900 dark:text-emerald-400 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" /> AI Assistant
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => handleExplainSimply(scheme)}
                    disabled={explainingId === scheme.id}
                    className="w-full p-4 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 border border-emerald-100 dark:border-emerald-900"
                  >
                    {explainingId === scheme.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />} Explain Simply
                  </button>
                  <button 
                    onClick={() => handleReadAloud(scheme)}
                    disabled={speakingId === scheme.id}
                    className="w-full p-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3"
                  >
                    {speakingId === scheme.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Headphones className="w-4 h-4" />} Read Aloud
                  </button>
                </div>
              </div>

              <a 
                href={scheme.officialUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-5 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all"
              >
                Visit Official Portal <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <div className="flex-1 p-10 md:p-12 space-y-12 bg-white dark:bg-slate-900">
              {simplifiedTexts[scheme.id] && (
                <section className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[3rem] border-2 border-amber-100 dark:border-amber-900/30 space-y-4 animate-in slide-in-from-top-4">
                  <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-widest">
                    <BookOpen className="w-4 h-4" /> AI Clarity View
                  </div>
                  <p className="text-xl text-amber-900 dark:text-amber-200 font-bold leading-relaxed italic">
                    {simplifiedTexts[scheme.id]}
                  </p>
                </section>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="space-y-6">
                  <h3 className="text-xl font-black flex items-center gap-3 text-slate-800 dark:text-white">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Who can apply?
                  </h3>
                  <ul className="space-y-3">
                    {scheme.eligibility.map((item, i) => (
                      <li key={i} className="flex gap-4 items-start text-slate-500 dark:text-slate-400 font-bold">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xl font-black flex items-center gap-3 text-slate-800 dark:text-white">
                    <FileText className="w-6 h-6 text-blue-500" /> Papers needed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {scheme.documents.map((doc, i) => (
                      <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm border border-slate-100 dark:border-slate-700">
                        {doc}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <section className="space-y-8">
                <h3 className="text-xl font-black flex items-center gap-3 text-slate-800 dark:text-white">
                  <Info className="w-6 h-6 text-indigo-500" /> How to apply (Steps)
                </h3>
                <div className="space-y-4">
                  {scheme.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-6 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-600 transition-all shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Verified Institutional Data
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovernmentSchemesView;
