import React from 'react';
import { UserProfile, SavedResource, AppLanguage } from '../types';
import { Bookmark, Trash2, ExternalLink, ArrowRight, BookOpen, Globe, MapPin, Landmark, Info, ChevronRight, BookmarkCheck, Users, GraduationCap, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';

interface Props {
  profile: UserProfile;
  onToggleSave: (res: Omit<SavedResource, 'timestamp'>) => void;
  searchQuery?: string;
}

const SavedHubView: React.FC<Props> = ({ profile, onToggleSave, searchQuery = '' }) => {
  const allSaved = profile.savedResources || [];
  const t = (key: string) => TRANSLATIONS[profile.language]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;
  
  const saved = searchQuery 
    ? allSaved.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSaved;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24 px-4 md:px-0">
      <header className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-[2rem] shadow-inner">
            <Bookmark className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-rose-600 dark:text-rose-400 leading-none">{t('saved_sanctuary_header')}</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
          {t('saved_sanctuary_sub')}
        </p>
      </header>

      {searchQuery && (
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border-2 border-blue-50 dark:border-slate-800 flex items-center gap-4 animate-in slide-in-from-left-4">
          <Search className="w-5 h-5 text-blue-500" />
          <p className="font-bold text-slate-600 dark:text-slate-400">
            Showing {saved.length} results for "<span className="text-blue-600 dark:text-blue-400">{searchQuery}</span>" in your sanctuary.
          </p>
        </div>
      )}

      {saved.length === 0 ? (
        <div className="py-40 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[5rem] space-y-8">
           <div className="relative mx-auto w-32 h-32 opacity-20">
              <BookmarkCheck className="w-full h-full text-slate-300 dark:text-slate-600" />
           </div>
           <div className="space-y-3">
              <p className="text-3xl font-black text-slate-300 dark:text-slate-600 tracking-tighter uppercase">
                {searchQuery ? "No matches found" : "Vault is Empty"}
              </p>
              <p className="text-slate-400 dark:text-slate-500 font-medium text-lg">
                {searchQuery ? "Try adjusting your search terms or browse the hubs." : "Browse Insights Hub or Finder to add resources to your sanctuary."}
              </p>
           </div>
           {!searchQuery && (
             <Link to="/insights" className="inline-flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all">
                Discover Content <ArrowRight className="w-5 h-5" />
             </Link>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {saved.sort((a,b) => b.timestamp - a.timestamp).map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col group hover:shadow-2xl transition-all">
                 {item.thumbnail ? (
                   <div className="h-40 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[8px] font-black uppercase text-rose-600 tracking-widest shadow-sm">
                         {item.type}
                      </div>
                   </div>
                 ) : (
                   <div className="h-40 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-700">
                      <ResourceIcon type={item.type} className="w-16 h-16" />
                   </div>
                 )}
                 <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-rose-600 transition-colors line-clamp-2">{item.title}</h3>
                       <p className="text-slate-500 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed text-sm">{item.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                       {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                             Open Resource <ExternalLink className="w-4 h-4" />
                          </a>
                       )}
                       <button 
                        onClick={() => onToggleSave(item)}
                        className="w-full py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-400 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 hover:border-rose-100 dark:hover:border-rose-900 transition-all"
                       >
                          <Trash2 className="w-4 h-4" /> Remove from Saved
                       </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}
    </div>
  );
};

const ResourceIcon = ({ type, className }: { type: string, className?: string }) => {
  switch (type) {
    case 'ARTICLE': return <BookOpen className={className} />;
    case 'SCHEME': return <Landmark className={className} />;
    case 'GROUP': return <Users className={className} />;
    case 'VIDEO': return <Globe className={className} />;
    case 'SKILL': return <GraduationCap className={className} />;
    default: return <Info className={className} />;
  }
};

export default SavedHubView;
