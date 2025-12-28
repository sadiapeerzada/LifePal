
import React, { useState, useRef } from 'react';
import { ScannedDoc, AppLanguage } from '../types';
import { analyzeMedicalDocument, uploadToAzureVault } from '../services/geminiService';
import { 
  Scan, Upload, FileText, CheckCircle2, AlertCircle, Sparkles, 
  Trash2, Search, Zap, Loader2, ShieldCheck, ChevronRight, X, ExternalLink, Lock
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  documents: ScannedDoc[];
  onUpdate: (docs: ScannedDoc[]) => void;
  language: AppLanguage;
  isDark: boolean;
}

const DocIntelView: React.FC<Props> = ({ documents, onUpdate, language, isDark }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ScannedDoc | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (key: string) => TRANSLATIONS[language]?.[key] || key;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setScanProgress(10);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setScanProgress(30);

      try {
        const mockMetadata = { id: Math.random().toString(36).substr(2, 9), name: file.name };
        await uploadToAzureVault(base64, mockMetadata);
        setScanProgress(60);

        const analysis = await analyzeMedicalDocument(base64, language);
        setScanProgress(90);

        const newDoc: ScannedDoc = {
          id: mockMetadata.id,
          name: file.name,
          type: analysis?.type || 'REPORT',
          date: new Date().toLocaleDateString(),
          summary: analysis?.summary || 'No summary available.',
          analysis: {
            terms: analysis?.terms || [],
            missingDocs: analysis?.missingDocs || [],
            isVerified: analysis?.isVerified || false
          },
          fileData: event.target?.result as string
        };

        onUpdate([newDoc, ...documents]);
        setScanProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setScanProgress(0);
          setSelectedDoc(newDoc);
        }, 800);

      } catch (error) {
        console.error("Scanning Error:", error);
        setIsUploading(false);
        alert("Failed to analyze document. Please try again.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl shadow-inner">
              <Scan className="w-8 h-8" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-none text-slate-900 dark:text-white">{t('doc_intel_header')}</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl">
            {t('doc_intel_sub')}
          </p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-10 py-5 bg-cyan-600 text-white rounded-[2rem] font-black shadow-2xl flex items-center gap-4 text-lg hover:scale-105 transition-all disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="animate-spin" /> : <Upload />} New Scan
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
      </header>

      {isUploading && (
        <div className="bg-slate-900 rounded-[4rem] p-20 text-center space-y-10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/10 animate-pulse" />
           <div className="relative z-10 space-y-6">
              <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                 <Sparkles className="w-12 h-12 text-white animate-spin" />
              </div>
              <h2 className="text-4xl font-black text-white">AI Intel at work...</h2>
              <div className="max-w-md mx-auto h-3 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${scanProgress}%` }} />
              </div>
              <p className="text-cyan-400 font-black text-xs uppercase tracking-[0.3em]">Extracting Clinical Context • Verifying Metadata</p>
           </div>
        </div>
      )}

      {!isUploading && documents.length === 0 ? (
        <div className="py-40 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[5rem] space-y-6">
           <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-200 dark:text-slate-600">
              <FileText className="w-12 h-12" />
           </div>
           <div>
              <p className="text-2xl font-black text-slate-300 dark:text-slate-600">Your vault is empty</p>
              <p className="text-slate-400 font-medium">Upload reports or prescriptions for instant AI summaries.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Recent Records</h3>
             <div className="space-y-4">
                {documents.map(doc => (
                   <button 
                    key={doc.id} 
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full p-6 rounded-[2.5rem] border-2 text-left transition-all flex items-center gap-5 ${selectedDoc?.id === doc.id ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-xl shadow-cyan-100 dark:shadow-none' : 'border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900'}`}
                   >
                      <div className={`p-3 rounded-2xl ${selectedDoc?.id === doc.id ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                         <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                         <h4 className="font-black text-slate-900 dark:text-white truncate">{doc.name}</h4>
                         <p className="text-[10px] font-black uppercase text-slate-400">{doc.type} • {doc.date}</p>
                      </div>
                      {doc.analysis?.isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                   </button>
                ))}
             </div>
          </div>

          <div className="lg:col-span-2">
             {selectedDoc ? (
               <div className="bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-slate-50 dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-right-4">
                  <div className="p-10 border-b dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                     <div className="flex items-center gap-5">
                        <div className="p-4 bg-cyan-600 text-white rounded-3xl">
                           <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                           <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{selectedDoc.name}</h2>
                           <p className="text-xs font-black uppercase text-cyan-600 tracking-widest mt-2 flex items-center gap-2">
                              <Lock className="w-3 h-3" /> Securely Vaulted in Private Cloud
                           </p>
                        </div>
                     </div>
                     <button onClick={() => onUpdate(documents.filter(d => d.id !== selectedDoc.id))} className="p-4 text-slate-200 hover:text-rose-600 transition-colors">
                        <Trash2 className="w-6 h-6" />
                     </button>
                  </div>
                  <div className="p-10 space-y-12">
                     <section className="space-y-6">
                        <h3 className="text-2xl font-black flex items-center gap-3 dark:text-white"><Zap className="text-amber-500" /> AI Summary</h3>
                        <p className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] italic">"{selectedDoc.summary}"</p>
                     </section>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <section className="space-y-6">
                           <h3 className="text-xl font-black flex items-center gap-3 dark:text-white"><Search className="text-blue-500" /> Term Clarifier</h3>
                           <div className="space-y-4">
                              {selectedDoc.analysis?.terms.map((t, i) => (
                                 <div key={i} className="p-5 border-2 border-slate-50 dark:border-slate-800 rounded-3xl space-y-1">
                                    <p className="font-black text-slate-900 dark:text-white text-sm">{t.term}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.explanation}</p>
                                 </div>
                              ))}
                              {selectedDoc.analysis?.terms.length === 0 && <p className="text-slate-400 text-sm font-bold italic p-4">No complex terms identified.</p>}
                           </div>
                        </section>

                        <section className="space-y-6">
                           <h3 className="text-xl font-black flex items-center gap-3 dark:text-white"><AlertCircle className="text-rose-500" /> Scheme Readiness</h3>
                           <div className="bg-rose-50 dark:bg-rose-900/10 rounded-[2.5rem] p-8 space-y-6 border border-rose-100 dark:border-rose-900/30">
                              <p className="text-xs font-black uppercase text-rose-600 tracking-widest">Action Items for Alig Care / PM-JAY</p>
                              {selectedDoc.analysis?.missingDocs.length ? (
                                 <ul className="space-y-3">
                                    {selectedDoc.analysis.missingDocs.map((doc, i) => (
                                       <li key={i} className="flex items-center gap-3 text-rose-900 dark:text-rose-200 font-bold text-sm">
                                          <div className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900 flex items-center justify-center text-[10px]">!</div>
                                          {doc}
                                       </li>
                                    ))}
                                 </ul>
                              ) : (
                                 <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-6 h-6" />
                                    <p className="font-black">All clinical identifiers present.</p>
                                 </div>
                              )}
                           </div>
                        </section>
                     </div>

                     <div className="pt-8 border-t dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3 text-slate-400 font-bold">
                           <ShieldCheck className="w-5 h-5" />
                           <span className="text-sm">Processed by Responsible AI</span>
                        </div>
                        <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                           Open Full Original Record <ExternalLink className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-600 font-bold italic">
                  Select a document to view AI insights
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocIntelView;
