import React, { useState, useRef } from 'react';
import { generateImage, animateImage, analyzeVideo, ensureApiKey } from '../services/geminiService';
import { 
  Sparkles, Image as ImageIcon, Film, Video, Upload, 
  Loader2, Download, Zap, Wand2, PlayCircle, Eye, 
  ChevronRight, BrainCircuit, Scan, Clapperboard
} from 'lucide-react';

const AdvancedToolsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'IMAGE' | 'VEO' | 'VIDEO_INTEL'>('IMAGE');
  const [loading, setLoading] = useState(false);
  
  // Image Gen State
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Veo State
  const [veoPrompt, setVeoPrompt] = useState('');
  const [veoVideoUrl, setVeoVideoUrl] = useState<string | null>(null);
  const [veoBase64, setVeoBase64] = useState<string | null>(null);

  // Video Intel State
  const [intelPrompt, setIntelPrompt] = useState('Analyze this video and provide key takeaways.');
  const [intelResult, setIntelResult] = useState<string | null>(null);
  const [intelBase64, setIntelBase64] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateImage = async () => {
    if (!imagePrompt) return;
    setLoading(true);
    if (imageSize === "2K" || imageSize === "4K") await ensureApiKey();
    const url = await generateImage(imagePrompt, imageSize);
    setGeneratedImageUrl(url || null);
    setLoading(false);
  };

  const handleVeoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setVeoBase64((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = async () => {
    if (!veoBase64) return;
    setLoading(true);
    await ensureApiKey();
    const url = await animateImage(veoBase64, veoPrompt);
    setVeoVideoUrl(url);
    setLoading(false);
  };

  const handleIntelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setIntelBase64((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  };

  const handleAnalyzeVideo = async () => {
    if (!intelBase64) return;
    setLoading(true);
    const result = await analyzeVideo(intelBase64, intelPrompt);
    setIntelResult(result);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-24 text-left">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-[2rem] shadow-inner">
            <Wand2 className="w-8 h-8" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">AI Studio</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
          High-end Gemini capabilities for healing, creativity, and deeper understanding.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 border-b-2 border-slate-100 dark:border-slate-800 pb-4">
        <TabButton active={activeTab === 'IMAGE'} onClick={() => setActiveTab('IMAGE')} icon={<ImageIcon />} label="Image Gen" />
        <TabButton active={activeTab === 'VEO'} onClick={() => setActiveTab('VEO')} icon={<Clapperboard />} label="Animate Photos" />
        <TabButton active={activeTab === 'VIDEO_INTEL'} onClick={() => setActiveTab('VIDEO_INTEL')} icon={<Eye />} label="Video Intel" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-slate-50 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[600px] flex flex-col lg:flex-row transition-all">
        <div className="lg:w-1/3 bg-slate-50 dark:bg-slate-800/50 p-10 space-y-8 border-r-2 border-slate-100 dark:border-slate-800">
          {activeTab === 'IMAGE' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Imagine Comfort</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Create calming visuals for meditation or recovery using Gemini 3 Pro Image.</p>
              <textarea 
                value={imagePrompt} 
                onChange={e => setImagePrompt(e.target.value)} 
                placeholder="Describe a serene landscape..." 
                className="w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-purple-400 h-40 font-medium text-slate-900 dark:text-white"
              />
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Output Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as const).map(sz => (
                    <button key={sz} onClick={() => setImageSize(sz)} className={`py-3 rounded-xl font-black text-xs transition-all ${imageSize === sz ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>{sz}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleGenerateImage} disabled={loading || !imagePrompt} className="w-full py-5 bg-purple-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:bg-purple-700 transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />} Create Magic
              </button>
            </div>
          )}

          {activeTab === 'VEO' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Veo Animation</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Animate a photo of a loved one or a peaceful memory into a gentle video.</p>
              <div className="space-y-4">
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-8 border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-purple-300 hover:text-purple-400 transition-all">
                  <Upload className="w-10 h-10" />
                  <span className="font-black uppercase text-[10px] tracking-widest">{veoBase64 ? 'Photo Ready' : 'Choose Base Photo'}</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleVeoUpload} className="hidden" accept="image/*" />
                <textarea 
                  value={veoPrompt} 
                  onChange={e => setVeoPrompt(e.target.value)} 
                  placeholder="Gently animate the sky and trees..." 
                  className="w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-purple-400 h-32 font-medium text-slate-900 dark:text-white"
                />
              </div>
              <button onClick={handleGenerateVideo} disabled={loading || !veoBase64} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <Film />} Generate Video
              </button>
            </div>
          )}

          {activeTab === 'VIDEO_INTEL' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Video Intelligence</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Extract key medical information or therapy tips from shared videos.</p>
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-8 border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-300 hover:text-blue-400 transition-all">
                <Video className="w-10 h-10" />
                <span className="font-black uppercase text-[10px] tracking-widest">{intelBase64 ? 'Video Uploaded' : 'Upload MP4 Video'}</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleIntelUpload} className="hidden" accept="video/mp4" />
              <textarea 
                value={intelPrompt} 
                onChange={e => setIntelPrompt(e.target.value)} 
                className="w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-400 h-32 font-medium text-slate-900 dark:text-white"
              />
              <button onClick={handleAnalyzeVideo} disabled={loading || !intelBase64} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <Scan />} Analyze with Pro
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 p-10 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-800/30">
          {loading ? (
            <div className="text-center space-y-6 animate-pulse">
               <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                 <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
               </div>
               <div className="space-y-2">
                 <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase">Processing...</h4>
                 <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Gemini 3 Pro Engine Engaged</p>
               </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {activeTab === 'IMAGE' && generatedImageUrl && <img src={generatedImageUrl} className="max-w-full max-h-[500px] rounded-[3rem] shadow-[0_0_80px_rgba(147,51,234,0.1)] border-8 border-white dark:border-slate-800 animate-in zoom-in-95" alt="Generated" />}
              {activeTab === 'VEO' && veoVideoUrl && <video src={veoVideoUrl} controls autoPlay className="max-w-full max-h-[500px] rounded-[3rem] shadow-2xl border-8 border-white dark:border-slate-800" />}
              {activeTab === 'VIDEO_INTEL' && intelResult && (
                <div className="bg-white dark:bg-slate-800 p-12 rounded-[4rem] shadow-xl border-2 border-blue-50 dark:border-slate-700 w-full max-h-[500px] overflow-y-auto text-left space-y-6">
                  <div className="flex items-center gap-4 text-blue-600 dark:text-blue-400">
                    <BrainCircuit className="w-10 h-10" />
                    <h3 className="text-3xl font-black">AI Insights</h3>
                  </div>
                  <p className="text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">{intelResult}</p>
                </div>
              )}
              {(!generatedImageUrl && !veoVideoUrl && !intelResult) && (
                <div className="text-center space-y-4 opacity-20">
                  <Zap className="w-24 h-24 mx-auto text-slate-400 dark:text-slate-600" />
                  <p className="text-2xl font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Ready to Build</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`px-8 py-4 rounded-2xl flex items-center gap-3 transition-all font-black uppercase text-xs tracking-widest ${active ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
    {React.cloneElement(icon, { className: 'w-4 h-4' })} {label}
  </button>
);

export default AdvancedToolsView;