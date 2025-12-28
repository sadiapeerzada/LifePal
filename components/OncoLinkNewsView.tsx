
import React, { useState, useEffect } from 'react';
import { fetchOncoLinkNews } from '../services/geminiService';
import { AppLanguage, UserProfile, SavedResource } from '../types';
import { TRUSTED_RESOURCES, VERIFIED_GUIDES, TRANSLATIONS } from '../constants';
import { 
  ExternalLink, Loader2, Clock, 
  Globe, Bookmark, BookmarkCheck,
  Search, Tag, ShieldCheck, Newspaper, Microscope, HeartPulse, Landmark, RefreshCw
} from 'lucide-react';

interface OncoLinkItem {
  title: string;
  summary: string;
  url: string;
  category?: string;
  source?: string;
  date?: string;
}

interface Props {
  profile: UserProfile;
  onToggleSave: (res: Omit<SavedResource, 'timestamp'>) => void;
  searchQuery?: string;
}

const OncoLinkNewsView: React.FC<Props> = ({ profile, onToggleSave, searchQuery = '' }) => {
  const [activeTab, setActiveTab] = useState<'NEWS' | 'PORTALS' | 'GUIDES'>('NEWS');
  const [news, setNews] = useState<OncoLinkItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  
  const t = (key: string) => TRANSLATIONS[profile.language]?.[key] || key;
  const effectiveSearch = searchQuery || internalSearchTerm;

  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const data = await fetchOncoLinkNews(profile.language);
      setNews(Array.isArray(data) ? data : []);
    } catch (e) {
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [profile.language]);

  const filteredNews = news.filter(n => n.title.toLowerCase().includes(effectiveSearch.toLowerCase()));
  const filteredPortals = TRUSTED_RESOURCES.filter(p => p.title.toLowerCase().includes(effectiveSearch.toLowerCase()));
  const filteredGuides = VERIFIED_GUIDES.filter(a => a.title.toLowerCase().includes(effectiveSearch.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-32 px-6 md:px-0">
      <header className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/10 text-blue-900 dark:text-blue-400 rounded-[2.5rem] shadow-sm w-fit">
              <Globe className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">{t('insights_header')}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg md:text-2xl font-medium max-w-2xl leading-relaxed">
                {t('insights_sub')}
              </p>
            </div>
          </div>
          <button onClick={loadNews} disabled={loadingNews} className="p-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all shadow-xl group">
             <RefreshCw className={`w-8 h-8 text-blue-600 ${loadingNews ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          {!searchQuery && (
            <div className="relative flex-1 w-full max-w-2xl">
              <Search className={`absolute ${profile.language === AppLanguage.URDU ? 'right-8' : 'left-8'} top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6`} />
              <input 
                type="text" 
                value={internalSearchTerm}
                onChange={(e) => setInternalSearchTerm(e.target.value)}
                className={`w-full ${profile.language === AppLanguage.URDU ? 'pr-16 pl-8' : 'pl-16 pr-8'} py-6 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-[3rem] outline-none focus:border-blue-500 shadow-2xl shadow-blue-100/20 dark:shadow-none transition-all font-bold text-lg dark:text-white placeholder:text-slate-400`}
                placeholder={t('search_placeholder')}
              />
            </div>
          )}

          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-[2.5rem] flex gap-2 shadow-inner border-2 border-white dark:border-slate-700 w-full md:w-auto">
             <TabButton active={activeTab === 'NEWS'} onClick={() => setActiveTab('NEWS')} label={t('news_tab')} />
             <TabButton active={activeTab === 'GUIDES'} onClick={() => setActiveTab('GUIDES')} label={t('guides_tab')} />
             <TabButton active={activeTab === 'PORTALS'} onClick={() => setActiveTab('PORTALS')} label={t('portals_tab')} />
          </div>
        </div>
      </header>

      <div className="animate-in slide-in-from-bottom-8 duration-700">
        {activeTab === 'NEWS' && (
          <div className="space-y-10">
            {loadingNews ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-slate-100 dark:bg-slate-800 rounded-[3rem]" />)}
              </div>
            ) : filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((item, idx) => {
                  const isSaved = profile.savedResources?.some(r => r.link === item.url || r.title === item.title);
                  return (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all group flex flex-col justify-between h-full">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100 dark:border-blue-800">
                            <Tag className="w-3 h-3" /> {item.category || 'Necessary Insight'}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              onToggleSave({ 
                                id: `news-${idx}`, 
                                type: 'ARTICLE', 
                                title: item.title, 
                                description: item.summary, 
                                link: item.url 
                              });
                            }}
                            className={`p-3 rounded-2xl transition-all ${isSaved ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/30' : 'text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800'}`}
                          >
                            {isSaved ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
                          </button>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight tracking-tight line-clamp-3">{item.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed line-clamp-4">"{item.summary}"</p>
                        </div>
                      </div>
                      
                      <div className="pt-6 mt-auto border-t border-slate-50 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                           {item.source && <span className="flex items-center gap-1.5"><Newspaper className="w-3.5 h-3.5"/> {item.source}</span>}
                           {item.date && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {item.date}</span>}
                        </div>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-slate-900 text-white rounded-[1.8rem] shadow-lg flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all group-hover:shadow-blue-200">
                          Read Full Access <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState message="The Intelligence Engine is scanning for fresh, verified news. Check back shortly." onRetry={loadNews} />
            )}
          </div>
        )}

        {activeTab === 'PORTALS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPortals.length > 0 ? filteredPortals.map(portal => (
              <a key={portal.id} href={portal.url} target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-900 transition-all group flex flex-col sm:flex-row items-center overflow-hidden">
                <div className="w-full sm:w-48 h-48 sm:h-full shrink-0 grayscale group-hover:grayscale-0 transition-all duration-1000 overflow-hidden">
                    <img src={portal.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                </div>
                <div className="flex-1 p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors leading-tight">{portal.title}</h3>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg border border-slate-100 dark:border-slate-700">{portal.tag}</span>
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0 ml-2" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2 text-sm">{portal.description}</p>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-[8px] uppercase tracking-widest">
                       <ShieldCheck className="w-3 h-3" /> Institutional Authority
                    </div>
                </div>
              </a>
            )) : <EmptyState message="No matching verified portals found." />}
          </div>
        )}

        {activeTab === 'GUIDES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredGuides.length > 0 ? filteredGuides.map((article: any) => {
              const isSaved = profile.savedResources?.some(r => r.id === article.id);
              return (
                <div key={article.id} onClick={() => { 
                    if(article.link) window.open(article.link, '_blank');
                  }} 
                  className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group flex flex-col h-full"
                >
                  <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    <img src={article.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={article.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-900 dark:text-blue-300 shadow-sm z-10 border border-white/20">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{article.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed text-sm">"{article.summary}"</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 mt-auto border-t border-slate-50 dark:border-slate-800">
                      <div className="flex gap-2">
                        {article.tags.slice(0, 1).map((tag: string) => (
                          <span key={tag} className="text-[9px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">#{tag}</span>
                        ))}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave({ id: article.id, type: 'ARTICLE', title: article.title, description: article.summary, thumbnail: article.imageUrl, link: article.link });
                        }}
                        className={`p-3 rounded-xl transition-all ${isSaved ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/30' : 'text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800'}`}
                      >
                        {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )
            }) : <EmptyState message="No matching verified guides found." />}
          </div>
        )}
      </div>

      <section className="bg-slate-100 dark:bg-slate-900/50 p-12 rounded-[4rem] border-2 border-slate-200 dark:border-slate-800 text-center space-y-6">
         <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-2">
            <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
         </div>
         <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Institutional Grounding</h2>
         <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
           All insights are sourced exclusively from authorized oncology institutions (WHO, NCI, Macmillan, NHS) and grounded in real-time by Google Gemini.
         </p>
      </section>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex-1 md:flex-none px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xl' : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'}`}>
    {label}
  </button>
);

const EmptyState = ({ message, onRetry }: any) => (
  <div className="py-32 md:py-48 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[5rem] space-y-8 bg-slate-50/50 dark:bg-slate-900/50">
     <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full w-fit mx-auto text-slate-300 dark:text-slate-600">
        <Loader2 className="w-12 h-12" />
     </div>
     <div className="space-y-2">
       <p className="text-2xl font-black text-slate-400 dark:text-slate-500">Sanctuary Library Check</p>
       <p className="text-lg text-slate-400 dark:text-slate-500 font-medium max-w-md mx-auto">{message}</p>
     </div>
     {onRetry && <button onClick={onRetry} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">Retry Fetch</button>}
  </div>
);

export default OncoLinkNewsView;
