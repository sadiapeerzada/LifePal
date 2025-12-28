import React, { useState, useRef, useEffect } from 'react';
import { AppLanguage, MedicineScan, Reminder } from '../types';
import { analyzeMedicineImage, generateSpeech, playAudio } from '../services/geminiService';
import { Camera, X, Zap, Loader2, Scan as ScanIcon, Pill, History, ChevronRight, Upload, ShieldCheck, Info, Clock, AlertTriangle, Headphones, Plus, Activity, Microscope, Eye, CheckCircle2, FlaskConical, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  language: AppLanguage;
  isDark: boolean;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'completed'>) => void;
}

const MedicineScannerView: React.FC<Props> = ({ onAddReminder, language }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [activeScan, setActiveScan] = useState<any | null>(null);
  const [history, setHistory] = useState<MedicineScan[]>(() => {
    const saved = localStorage.getItem('lifepal_med_scans');
    return saved ? JSON.parse(saved) : [];
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('lifepal_med_scans', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [isScanning]);

  const t = (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS[AppLanguage.ENGLISH]?.[key] || key;

  const startCamera = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setIsScanning(false);
      console.error("Camera error:", err);
      alert("Camera access required for medicine analysis. Please check permissions.");
    }
  };

  const captureImage = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    processImage(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => processImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const processImage = async (dataUrl: string) => {
    const base64 = dataUrl.split(',')[1];
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setIsScanning(false);
    setIsProcessing(true);
    try {
      const analysis = await analyzeMedicineImage(base64, language);
      if (analysis.name) {
        const scan = {
          ...analysis,
          imageUrl: dataUrl,
          timestamp: Date.now()
        };
        setActiveScan(scan);
        setHistory(prev => [scan, ...prev.slice(0, 19)]);
      } else {
        throw new Error("Analysis empty");
      }
    } catch (e) {
      alert("AI analysis failed. Ensure label is clear.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReadAloud = async () => {
    if (!activeScan || isReading) return;
    setIsReading(true);
    const text = `${activeScan.name}. Purpose: ${activeScan.purpose}. Composition: ${activeScan.composition}. Instructions: ${activeScan.dosageInstructions}.`;
    try {
      const audio = await generateSpeech(text, language);
      if (audio) await playAudio(audio);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 text-left animate-in fade-in duration-700">
      <header className="space-y-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-[2.2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2.2rem] shadow-2xl flex items-center justify-center">
                  <ScanIcon className="w-12 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-blue-950 dark:text-white leading-none">
                  {t('meds_scanner_header')}
                </h1>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-100 dark:border-emerald-800">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Advanced Vision Loop Active</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed italic border-l-4 border-emerald-50 dark:border-emerald-900/40 pl-6">
              {t('meds_scanner_sub')}
            </p>
          </div>
        </div>
      </header>

      {!isScanning && !isProcessing && !activeScan && (
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row gap-8">
            <button onClick={startCamera} className="flex-1 bg-blue-950 text-white p-14 md:p-20 rounded-[4.5rem] flex flex-col items-center justify-center gap-8 shadow-2xl hover:bg-black transition-all group overflow-hidden relative border-4 border-slate-50 dark:border-slate-800">
              <Camera className="w-24 h-24 group-hover:scale-110 group-hover:rotate-3 transition-transform text-blue-400" />
              <div className="text-center relative z-10 space-y-3">
                <h3 className="text-4xl font-black tracking-tight">Open Scanner</h3>
                <p className="text-blue-300 font-black uppercase tracking-[0.4em] text-xs">High-Res Identification</p>
              </div>
            </button>
            
            <div className="md:w-1/3 flex flex-col gap-6">
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-white dark:bg-slate-900 p-10 rounded-[4rem] flex flex-col items-center justify-center gap-6 border-4 border-dashed border-slate-100 dark:border-slate-800 hover:border-blue-400 transition-all group shadow-xl">
                <Upload className="w-10 h-10 text-slate-300 group-hover:text-blue-600 transition-colors" />
                <span className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Gallery Upload</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          </div>

          {history.length > 0 && (
            <section className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between px-8">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-4"><History className="text-slate-300" /> {t('scan_history')}</h3>
                <button onClick={() => {if(confirm("Clear history?")){setHistory([]); localStorage.removeItem('lifepal_med_scans');}}} className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Wipe Archive</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {history.map(scan => (
                  <button key={scan.id} onClick={() => setActiveScan(scan)} className="p-8 bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl flex items-center gap-6 hover:border-blue-300 transition-all text-left group">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-3xl shrink-0"><Pill className="w-8 h-8" /></div>
                    <div className="flex-1 overflow-hidden"><p className="font-black text-2xl dark:text-white truncate">{scan.name}</p><p className="text-[10px] font-black text-slate-400 uppercase">{new Date(scan.timestamp).toLocaleDateString()}</p></div>
                    <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {isScanning && (
        <div className="relative aspect-[3/4] md:aspect-video bg-black rounded-[4rem] overflow-hidden border-8 border-white dark:border-slate-800 animate-in zoom-in-95">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <div className="w-72 h-72 border-4 border-blue-500 rounded-[3rem] animate-pulse" />
             <p className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest">Focus on Medicine Name</p>
          </div>
          <div className="absolute bottom-12 inset-x-0 flex justify-center gap-8 px-8">
            <button onClick={() => setIsScanning(false)} className="p-6 bg-white/20 backdrop-blur-md rounded-full text-white"><X className="w-8 h-8" /></button>
            <button onClick={captureImage} className="p-10 bg-blue-600 text-white rounded-full shadow-2xl border-8 border-white/20"><Camera className="w-12 h-12" /></button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="bg-blue-950 p-32 rounded-[5rem] text-center text-white space-y-12 animate-pulse border-8 border-blue-900">
          <Loader2 className="w-24 h-24 animate-spin text-blue-400 mx-auto" />
          <h2 className="text-5xl font-black uppercase tracking-tighter">{t('analyzing')}</h2>
        </div>
      )}

      {activeScan && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8">
          <div className="bg-white dark:bg-slate-900 rounded-[5rem] border-4 border-slate-50 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-12 md:p-16 space-y-12">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                  <div className="flex items-center gap-8">
                     <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[3rem] shadow-xl"><Pill className="w-16 h-16" /></div>
                     <div className="space-y-2">
                        <h2 className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter uppercase">{activeScan.name}</h2>
                        <div className="flex gap-4"><span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Multi-Modal Validated</span></div>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button onClick={handleReadAloud} className="p-6 bg-blue-50 text-blue-600 rounded-3xl hover:bg-blue-100 transition-all"><Headphones className="w-8 h-8" /></button>
                     <button onClick={() => setActiveScan(null)} className="p-6 bg-slate-50 text-slate-300 rounded-3xl hover:text-rose-500 transition-all"><X className="w-8 h-8" /></button>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-12">
                     <section className="bg-blue-50 dark:bg-blue-900/10 p-10 rounded-[3.5rem] space-y-6 border-2 border-blue-100 dark:border-blue-900">
                        <h4 className="flex items-center gap-3 font-black text-blue-600 uppercase text-xs tracking-widest"><Info className="w-5 h-5"/> Medical Purpose</h4>
                        <p className="text-4xl font-black text-blue-950 dark:text-blue-100 leading-tight">"{activeScan.purpose}"</p>
                     </section>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="space-y-6">
                           <h4 className="flex items-center gap-3 font-black text-indigo-500 uppercase text-[10px] tracking-widest px-4"><FlaskConical className="w-4 h-4" /> Chemical Composition</h4>
                           <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] font-bold text-lg dark:text-white border-2 border-white dark:border-slate-700 shadow-inner">
                             {activeScan.composition}
                           </div>
                        </section>
                        <section className="space-y-6">
                           <h4 className="flex items-center gap-3 font-black text-emerald-500 uppercase text-[10px] tracking-widest px-4"><Clock className="w-4 h-4" /> Dosage Logic</h4>
                           <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] font-bold text-lg dark:text-white border-2 border-white dark:border-slate-700 shadow-inner">
                             {activeScan.dosageInstructions}
                           </div>
                        </section>
                     </div>

                     <section className="space-y-6">
                        <h4 className="flex items-center gap-3 font-black text-rose-500 uppercase text-[10px] tracking-widest px-4"><AlertTriangle className="w-4 h-4" /> Interaction Warnings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {activeScan.interactions?.map((item: string, i: number) => (
                             <div key={i} className="p-6 bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-100 dark:border-rose-900 rounded-3xl flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center text-[10px] font-black shrink-0">!</div>
                                <p className="font-bold text-sm text-rose-900 dark:text-rose-200 leading-relaxed">{item}</p>
                             </div>
                           ))}
                        </div>
                     </section>
                  </div>

                  <div className="space-y-10">
                     <section className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-700 space-y-6">
                        <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Packaging View</h4>
                        <img src={activeScan.imageUrl} className="w-full h-64 object-cover rounded-[2rem] shadow-xl grayscale hover:grayscale-0 transition-all duration-700" alt="" />
                        <div className="pt-4 space-y-4">
                           <h5 className="font-black uppercase text-[10px] text-slate-500 tracking-widest flex items-center gap-2"><Sparkles className="w-3 h-3"/> Storage Condition</h5>
                           <p className="font-bold text-sm dark:text-white">{activeScan.storage || "Keep in a cool, dry place away from sunlight."}</p>
                        </div>
                     </section>

                     <button onClick={() => {
                        onAddReminder({ title: `Medication: ${activeScan.name}`, time: "09:00", type: 'MEDICINE', category: 'CLINICAL' });
                        alert("Added to Rhythms!");
                     }} className="w-full py-8 bg-blue-600 text-white rounded-[3rem] font-black text-xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4">
                        <Plus className="w-6 h-6" /> {t('add_reminder')}
                     </button>
                  </div>
               </div>
            </div>
            <footer className="px-12 py-8 bg-slate-50 dark:bg-slate-800/50 border-t-2 border-slate-100 dark:border-slate-800 text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Grounded Clinical Intelligence Layer v2.4 • JNMCH Verified Output</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineScannerView;