import React, { useState } from 'react';
import { CaregiverJournalEntry } from '../types';
import { Book, Plus, History, X, Save, Lock, Eye, Calendar, Tag, ShieldCheck, Search } from 'lucide-react';

interface Props {
  entries: CaregiverJournalEntry[];
  onAdd: (entry: CaregiverJournalEntry) => void;
  searchQuery?: string;
}

const CaregiverJournalView: React.FC<Props> = ({ entries: allEntries, onAdd, searchQuery = '' }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [text, setText] = useState('');
  const [category, setCategory] = useState<CaregiverJournalEntry['category']>('MEDICAL');
  const [isPrivate, setIsPrivate] = useState(true);

  const entries = searchQuery 
    ? allEntries.filter(e => e.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : allEntries;

  const handleSave = () => {
    if (!text.trim()) return;
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      date: Date.now(),
      text,
      category,
      isPrivate
    });
    setText('');
    setShowAdd(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-inner">
              <Book className="w-8 h-8" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Care Journal</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-xl">
            A private clinical log for caregivers to track observations, medication changes, and emotional notes.
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl flex items-center gap-4 text-lg hover:scale-105 transition-all">
          <Plus className="w-6 h-6" /> Log Entry
        </button>
      </header>

      {searchQuery && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-indigo-50 flex items-center gap-4 animate-in slide-in-from-left-4">
          <Search className="w-5 h-5 text-indigo-500" />
          <p className="font-bold text-slate-600 dark:text-slate-400">
            Filtering journal for "<span className="text-indigo-600 dark:text-indigo-400">{searchQuery}</span>" — {entries.length} matches.
          </p>
        </div>
      )}

      <section className="space-y-6">
        {entries.length === 0 ? (
          <div className="py-32 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[4rem] space-y-6">
            <History className="w-20 h-20 text-slate-100 dark:text-slate-800 mx-auto" />
            <p className="text-2xl font-black text-slate-300 dark:text-slate-600 italic">No journal entries yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.sort((a,b) => b.date - a.date).map(entry => (
              <div key={entry.id} className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-50 dark:border-slate-800 shadow-xl flex gap-8 group transition-all hover:shadow-2xl">
                <div className="flex flex-col items-center gap-4 pt-1">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 text-xs text-center leading-tight">
                     {new Date(entry.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                   </div>
                   {entry.isPrivate ? <Lock className="w-4 h-4 text-indigo-400" /> : <Eye className="w-4 h-4 text-slate-300" />}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <Tag className="w-3 h-3" /> {entry.category}
                    </span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                       {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showAdd && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl p-12 space-y-10 border-4 border-white/10">
            <button onClick={() => setShowAdd(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-300"><X /></button>
            <div className="space-y-2">
              <h3 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">New Observation</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Log clinical notes or daily challenges for later review.</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {(['MEDICAL', 'LOGISTICS', 'EMOTIONAL', 'OTHER'] as const).map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`p-4 rounded-2xl border-2 font-black text-xs transition-all ${category === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-slate-50 dark:border-slate-700 text-slate-400 hover:border-indigo-100'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              <textarea 
                value={text} 
                onChange={e => setText(e.target.value)} 
                placeholder="What happened today?" 
                className="w-full p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-200 outline-none h-48 font-medium text-lg text-slate-900 dark:text-white"
              />

              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-6 h-6 text-indigo-500" />
                  <div>
                    <p className="font-black text-slate-800 dark:text-white">Private Entry</p>
                    <p className="text-xs text-slate-400 font-bold uppercase">Only visible to Caregivers</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`w-14 h-8 rounded-full transition-all relative ${isPrivate ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isPrivate ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <button onClick={handleSave} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                <Save className="w-6 h-6" /> Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverJournalView;
