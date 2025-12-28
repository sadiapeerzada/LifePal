
import React from 'react';
import { AppLanguage } from '../types';
import { Languages } from 'lucide-react';

interface Props {
  current: AppLanguage;
  onSelect: (lang: AppLanguage) => void;
}

const LanguageToggle: React.FC<Props> = ({ current, onSelect }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
      <button 
        onClick={() => onSelect(AppLanguage.ENGLISH)}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${current === AppLanguage.ENGLISH ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        EN
      </button>
      <button 
        onClick={() => onSelect(AppLanguage.HINDI)}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${current === AppLanguage.HINDI ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        हिन्दी
      </button>
      <button 
        onClick={() => onSelect(AppLanguage.URDU)}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${current === AppLanguage.URDU ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        اردو
      </button>
      <button 
        onClick={() => onSelect(AppLanguage.TELUGU)}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${current === AppLanguage.TELUGU ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        తెలుగు
      </button>
      <div className="ml-1 pr-2">
        <Languages className="w-3.5 h-3.5 text-slate-400" />
      </div>
    </div>
  );
};

export default LanguageToggle;
