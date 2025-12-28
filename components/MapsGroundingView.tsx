import React, { useState, useEffect } from 'react';
import { findNearbyResources } from '../services/geminiService';
import { MapPin, Search, Loader2, Hospital, Building2, ExternalLink, Map as MapIcon, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { SavedResource } from '../types';

interface ResourceResult {
  text: string;
  links: { title: string; url: string }[];
}

interface Props {
  onToggleSave?: (res: Omit<SavedResource, 'timestamp'>) => void;
  savedResources?: SavedResource[];
  searchQuery?: string;
}

const MapsGroundingView: React.FC<Props> = ({ onToggleSave, savedResources = [], searchQuery = '' }) => {
  const [query, setQuery] = useState('oncology pharmacies');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResourceResult | null>(null);

  useEffect(() => {
    if (searchQuery && searchQuery.length > 3) {
        setQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const res = await findNearbyResources(query, pos.coords.latitude, pos.coords.longitude);
        setResults(res);
        setLoading(false);
      }, async () => {
        const res = await findNearbyResources(query);
        setResults(res);
        setLoading(false);
      });
    } else {
      const res = await findNearbyResources(query);
      setResults(res);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-24 text-left">
      <header className="space-y-6">
        <div className="flex items-center gap-5">
          <div className="p-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-[2.5rem] shadow-xl ring-4 ring-white dark:ring-slate-900">
            <MapPin className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Resource Finder</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium tracking-tight leading-relaxed max-w-2xl">
              Locate pharmacies, support groups, and oncology specialists near Aligarh using real-time Maps intelligence.
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-16 pr-8 py-8 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-[3rem] outline-none focus:border-blue-400 shadow-2xl transition-all font-black text-2xl text-slate-900 dark:text-white"
            placeholder="Search resources..."
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="px-14 py-8 bg-blue-600 text-white font-black rounded-[3rem] shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 text-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <MapIcon className="w-8 h-8" />} Map Logic
        </button>
      </div>

      {loading ? (
        <div className="py-40 text-center animate-pulse space-y-8">
          <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-blue-100 dark:border-blue-800">
             <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Scanning Aligarh...</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Accessing Real-time Grounding Data</p>
          </div>
        </div>
      ) : results ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-6">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-2xl border-4 border-slate-50 dark:border-slate-800 space-y-10">
            <div className="flex items-center gap-5 text-blue-600">
              <Hospital className="w-10 h-10" />
              <h3 className="text-4xl font-black tracking-tight dark:text-white">AI Curated Local Matches</h3>
            </div>
            <p className="text-2xl text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium italic p-8 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700">
              "{results.text}"
            </p>
          </div>

          {results.links.length > 0 && (
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] px-8 text-center">Verified Navigation Points</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.links.map((link, i) => {
                  const isSaved = savedResources.some(r => r.link === link.url);
                  return (
                    <div key={i} className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-50 dark:border-slate-800 flex items-center justify-between hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-2xl transition-all group">
                      <div className="flex items-center gap-8 flex-1 overflow-hidden">
                         <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl text-blue-600 shadow-inner shrink-0 group-hover:scale-110 transition-transform"><Building2 className="w-10 h-10" /></div>
                         <div className="overflow-hidden space-y-1 text-left">
                            <span className="font-black text-2xl text-slate-900 dark:text-white truncate block">{link.title}</span>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline flex items-center gap-2">View Location <ExternalLink className="w-4 h-4" /></a>
                         </div>
                      </div>
                      <button 
                        onClick={() => onToggleSave?.({ id: `map-${i}`, type: 'GROUP', title: link.title, description: 'Location identified via Alig Resource Finder', link: link.url })}
                        className={`p-6 rounded-3xl transition-all ${isSaved ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/30' : 'text-slate-300 dark:text-slate-700 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm'}`}
                      >
                        {isSaved ? <BookmarkCheck className="w-8 h-8" /> : <Bookmark className="w-8 h-8" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-48 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[6rem] opacity-20 space-y-8 bg-white/50 dark:bg-slate-900/50 transition-colors">
          <MapIcon className="w-32 h-32 mx-auto text-slate-200 dark:text-slate-700" />
          <p className="text-4xl font-black tracking-tighter text-slate-300 dark:text-slate-600 uppercase">Map Canvas Ready</p>
        </div>
      )}
    </div>
  );
};

export default MapsGroundingView;