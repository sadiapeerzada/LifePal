import React, { useState, useRef, useEffect } from 'react';
import { AppLanguage, MedicineScan, Reminder } from '../types';
import { analyzeMedicineImage, generateSpeech, playAudio } from '../services/geminiService';
// Added CheckCircle2 to the import list below
import { Camera, X, Zap, Loader2, Scan as ScanIcon, Pill, History, ChevronRight, Upload, ShieldCheck, Info, Clock, AlertTriangle, Headphones, Plus, Activity, Microscope, Eye, CheckCircle2 } from 'lucide-react';
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
  const [activeScan, setActiveScan] = useState<MedicineScan | null>(null);
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

  // Clean up camera on unmount or state change
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
        const scan: MedicineScan = {
          id: Math.random().toString(36).substr(2, 9),
          name: analysis.name,
          purpose: analysis.purpose || '',
          dosageInstructions: analysis.dosageInstructions || '',
          sideEffects: analysis.sideEffects || [],
          warnings: analysis.warnings || [],
          imageUrl: dataUrl,
          timestamp: Date.now()
        };
        setActiveScan(scan);
        setHistory(prev => [scan, ...prev.slice(0, 19)]); // Keep last 20
      } else {
        throw new Error("Analysis empty");
      }
    } catch (e) {
      alert("AI analysis failed. Please ensure the medication label is clearly visible and well-lit.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReadAloud = async () => {
    if (!activeScan || isReading) return;
    setIsReading(true);
    const text = `${activeScan.name}. ${activeScan.purpose}. Instructions: ${activeScan.dosageInstructions}. Warnings: ${activeScan.warnings.join(', ')}.`;
    try {
      const audio = await generateSpeech(text, language);
      if (audio) await playAudio(audio);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReading(false);
    }
  };

  const handleCreateReminder = () => {
    if (!activeScan) return;
    onAddReminder({
      title: `Take ${activeScan.name}`,
      time: "09:00", 
      type: 'MEDICINE',
      category: 'CLINICAL'
    });
    alert("Reminder added to your Daily Rhythm!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 text-left animate-in fade-in duration-700">
      <header className="space-y-10 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-[2.2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2.2rem] shadow-2xl flex items-center justify-center">
                  <ScanIcon className="w-12 h-12" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-blue-950 dark:text-white leading-none">
                  {t('meds_scanner_header')}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">Grounded AI Enabled</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-300 dark:text-slate-600 tracking-widest">Version 2.4.0-Stable</span>
                </div>
              </div>
            </div>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed italic border-l-4 border-blue-50 dark:border-blue-900/40 pl-6">
              {t('meds_scanner_sub')}
            </p>
          </div>
        </div>
      </header>

      {!isScanning && !isProcessing && !activeScan && (
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row gap-8">
            <button 
              onClick={startCamera} 
              className="flex-1 bg-blue-950 text-white p-14 md:p-20 rounded-[4.5rem] flex flex-col items-center justify-center gap-8 shadow-[0_30px_60px_-15px_rgba(30,41,59,0.3)] hover:bg-black transition-all group overflow-hidden relative border-4 border-slate-50 dark:border-slate-800"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Camera className="w-24 h-24 group-hover:scale-110 group-hover:rotate-3 transition-transform text-blue-400" />
              <div className="text-center relative z-10 space-y-3">
                <h3 className="text-4xl font-black tracking-tight">Open Scanner</h3>
                <p className="text-blue-300 font-black uppercase tracking-[0.4em] text-xs">Precision Lens</p>
              </div>
              <div className="absolute bottom-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Microscope className="w-32 h-32" />
              </div>
            </button>
            
            <div className="md:w-1/3 flex flex-col gap-6">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="flex-1 bg-white dark:bg-slate-900 p-10 rounded-[4rem] flex flex-col items-center justify-center gap-6 border-4 border-dashed border-slate-100 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group shadow-xl"
              >
                <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl group-hover:bg-blue-600 transition-colors">
                  <Upload className="w-10 h-10 text-slate-300 dark:text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Library Upload</p>
                  <p className="text-[10px] font-bold text-slate-400">JPG, PNG supported</p>
                </div>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          </div>

          {history.length > 0 && (
            <section className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between px-8">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-inner"><History className="w-6 h-6 text-slate-400" /></div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t('scan_history')}</h3>
                </div>
                <button 
                  onClick={() => { if(confirm("Clear history?")) {setHistory([]); localStorage.removeItem('lifepal_med_scans');} }} 
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-6 py-2 rounded-full transition-all"
                >
                  Clear Archive
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {history.map(scan => (
                  <button 
                    key={scan.id} 
                    onClick={() => setActiveScan(scan)}
                    className="p-10 bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl flex items-center gap-8 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left group hover:-translate-y-1"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-[1.8rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                        <Pill className="w-10 h-10" />
                      </div>
                      <div className="absolute -top-2 -right-2 p-1.5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden space-y-2">
                      <p className="font-black text-3xl text-slate-900 dark:text-white truncate tracking-tight leading-none">{scan.name}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {new Date(scan.timestamp).toLocaleDateString()}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black uppercase text-emerald-600">Clinical Validated</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {isScanning && (
        <div className="relative aspect-[3/4] md:aspect-video bg-black rounded-[4rem] overflow-hidden border-8 border-white dark:border-slate-800 shadow-[0_0_100px_rgba(37,99,235,0.25)] animate-in zoom-in-95">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          
          {/* Viewfinder Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-64 border-4 border-blue-500 rounded-[3rem] animate-pulse">
                   <div className="absolute -top-2 -left-2 w-8 h-8 border-t-8 border-l-8 border-white rounded-tl-2xl" />
                   <div className="absolute -top-2 -right-2 w-8 h-8 border-t-8 border-r-8 border-white rounded-tr-2xl" />
                   <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-8 border-l-8 border-white rounded-bl-2xl" />
                   <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-8 border-r-8 border-white rounded-br-2xl" />
                </div>
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-500/30 blur-sm animate-bounce" />
             </div>
             <p className="mt-12 bg-blue-600/90 backdrop-blur-md text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.4em] shadow-2xl border border-white/20">ALIGN MEDICATION LABEL</p>
          </div>

          <div className="absolute bottom-12 inset-x-0 flex justify-center gap-10 px-8">
            <button 
              onClick={() => {
                if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                setIsScanning(false);
              }} 
              className="p-8 bg-white/10 backdrop-blur-2xl rounded-full text-white hover:bg-rose-600 transition-all border-2 border-white/20 shadow-2xl"
            >
              <X className="w-10 h-10" />
            </button>
            <button 
              onClick={captureImage} 
              className="p-14 bg-blue-600 text-white rounded-full shadow-[0_0_60px_rgba(37,99,235,0.7)] hover:scale-110 active:scale-95 transition-all border-8 border-white/40 flex items-center justify-center"
            >
              <Camera className="w-16 h-16" />
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="bg-blue-950 p-24 md:p-32 rounded-[5rem] text-center text-white space-y-12 animate-pulse relative overflow-hidden shadow-2xl border-8 border-blue-900">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent" />
          <div className="relative z-10 w-40 h-40 mx-auto">
             <div className="absolute inset-0 border-8 border-blue-400/20 rounded-full" />
             <Loader2 className="w-full h-full animate-spin text-blue-400 stroke-[1.5]" />
             <div className="absolute inset-0 flex items-center justify-center"><Activity className="w-14 h-14 text-white animate-pulse" /></div>
          </div>
          <div className="space-y-4 relative z-10">
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">{t('analyzing')}</h2>
            <p className="text-blue-300 font-bold uppercase tracking-[0.6em] text-[10px] opacity-60">{t('vision_logic')}</p>
          </div>
        </div>
      )}

      {activeScan && (
        <div className="bg-white dark:bg-slate-900 rounded-[5rem] border-4 border-slate-50 dark:border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden animate-in slide-in-from-bottom-12 duration-700">
          <div className="p-12 md:p-16 space-y-16">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b-4 border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-8">
                <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[3rem] shadow-2xl scale-110">
                  <Pill className="w-16 h-16" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">{activeScan.name}</h2>
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900">
                       <ShieldCheck className="w-4 h-4" /> AI Grounded Extraction
                    </span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">CRC-ID: {activeScan.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleReadAloud} 
                  disabled={isReading} 
                  className={`p-6 rounded-3xl transition-all shadow-xl flex items-center gap-4 font-black text-xs uppercase tracking-widest ${isReading ? 'bg-blue-600 text-white animate-pulse' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100'}`}
                >
                  {isReading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Headphones className="w-6 h-6" />} {t('read_analysis')}
                </button>
                <button onClick={() => setActiveScan(null)} className="p-6 bg-slate-50 dark:bg-slate-800 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 rounded-3xl transition-all text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700"><X className="w-8 h-8" /></button>
              </div>
            </header>

            <section className="bg-blue-50 dark:bg-blue-900/20 rounded-[4rem] p-14 space-y-8 border-2 border-blue-100 dark:border-blue-800 relative group overflow-hidden shadow-inner">
               <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000"><Info className="w-48 h-48" /></div>
               <div className="flex items-center gap-4 text-blue-600 dark:text-blue-300 font-black uppercase text-xs tracking-[0.3em] relative z-10">
                  <Activity className="w-6 h-6" /> Therapeutic Purpose
               </div>
               <p className="text-5xl font-black text-blue-950 dark:text-blue-200 leading-[1.1] italic relative z-10 tracking-tight">
                 "{activeScan.purpose}"
               </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <section className="space-y-10">
                  <div className="flex items-center gap-4 px-8">
                    <div className="p-3 bg-rose-100 dark:bg-rose-950 rounded-2xl"><AlertTriangle className="w-6 h-6 text-rose-600" /></div>
                    <h4 className="font-black uppercase tracking-[0.4em] text-[10px] text-rose-500">Critical Safety Notifications</h4>
                  </div>
                  <div className="space-y-4">
                    {activeScan.warnings.map((w, i) => (
                      <div key={i} className="p-10 bg-rose-50 dark:bg-rose-900/20 text-rose-950 dark:text-rose-200 rounded-[3.5rem] font-bold text-xl border-2 border-rose-100 dark:border-rose-900/30 flex items-start gap-8 hover:shadow-2xl transition-all group">
                         <div className="w-10 h-10 rounded-2xl bg-rose-200 dark:bg-rose-950 flex items-center justify-center text-rose-700 font-black text-sm shrink-0 shadow-inner group-hover:scale-110 transition-transform">!</div>
                         <p className="leading-relaxed">{w}</p>
                      </div>
                    ))}
                    {activeScan.warnings.length === 0 && <p className="text-slate-400 font-bold italic px-8">No specific alerts identified for this packaging.</p>}
                  </div>
               </section>

               <section className="space-y-10">
                  <div className="flex items-center gap-4 px-8">
                    <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-2xl"><Clock className="w-6 h-6 text-blue-600" /></div>
                    <h4 className="font-black uppercase tracking-[0.4em] text-[10px] text-blue-500">Visual Dosage Insights</h4>
                  </div>
                  <div className="p-14 bg-slate-50 dark:bg-slate-800/80 rounded-[4.5rem] border-4 border-white dark:border-slate-800 shadow-inner h-full flex flex-col justify-center text-center space-y-6">
                    <Eye className="w-16 h-16 text-blue-200 dark:text-blue-900 mx-auto" />
                    <p className="text-4xl font-black text-slate-800 dark:text-slate-100 leading-tight tracking-tight">
                      {activeScan.dosageInstructions || "Consult the physical label or pharmacy instructions for confirmed timings."}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4">Cross-referenced with verified compound lists</p>
                  </div>
               </section>
            </div>

            <footer className="pt-16 border-t-4 border-slate-50 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 text-slate-400 font-black text-[11px] uppercase tracking-[0.4em]">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" /> Professional Multi-Modal AI Logic
                  </div>
                  <p className="text-[9px] text-slate-400 max-w-sm italic leading-relaxed">Identity of medicine determined via visual OCR and compound matching. Always verify with JNMCH staff.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 w-full lg:w-auto">
                   <button 
                     onClick={handleCreateReminder} 
                     className="px-14 py-8 bg-emerald-600 text-white rounded-[2.5rem] font-black uppercase text-sm tracking-[0.2em] shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-5"
                   >
                      <Plus className="w-8 h-8" /> {t('add_reminder')}
                   </button>
                   <button 
                     onClick={() => setActiveScan(null)} 
                     className="px-14 py-8 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase text-sm tracking-[0.2em] rounded-[2.5rem] hover:bg-slate-200 transition-all border-2 border-slate-200 dark:border-slate-700"
                   >
                     {t('dismiss')}
                   </button>
                </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineScannerView;