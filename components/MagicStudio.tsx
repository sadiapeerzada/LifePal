import React, { useState, useEffect } from 'react';
import { generateImage, ensureApiKey } from '../services/geminiService';
import { Sparkles, X, Wand2, Download, Loader2, Heart, Star, Rocket, Palette, Key, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onEarnSticker: (sticker: string) => void;
}

const MagicStudio: React.FC<Props> = ({ isOpen, onClose, onEarnSticker }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMagic = async (preset?: string) => {
    const finalPrompt = preset || prompt;
    if (!finalPrompt.trim()) return;
    
    setLoading(true);
    await ensureApiKey();
    // Optimized prompt for better quality Magic Art
    const url = await generateImage(`Ultra high quality Pixar style digital art for children: ${finalPrompt}. Vibrant colors, glowing magical atmosphere, friendly and uplifting.`, "1K");
    if (url) {
      setImageUrl(url);
      onEarnSticker('🎨');
    } else {
      alert("Magic took a break. Please check your internet or try again!");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] border-8 border-white/10">
        <button onClick={onClose} className="absolute top-8 right-8 p-4 bg-slate-100 hover:bg-rose-600 text-slate-400 hover:text-white rounded-full transition-all z-20 shadow-lg">
          <X className="w-8 h-8" />
        </button>

        <div className="md:w-1/3 bg-slate-50 dark:bg-slate-800 p-12 flex flex-col justify-center space-y-10 border-r-4 border-slate-100 dark:border-slate-700 overflow-y-auto">
          <div className="space-y-4">
            <div className="p-5 bg-indigo-100 text-indigo-600 rounded-[2rem] w-fit shadow-inner">
               <Wand2 className="w-12 h-12" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Magic Studio</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xl">Imagine your bravery! What does your hero world look like?</p>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-2">Hero Presets</label>
             <div className="grid grid-cols-1 gap-3">
                <PresetButton icon={<Rocket />} label="Space Explorer" onClick={() => handleMagic("A brave hero astronaut floating in a colorful candy nebula galaxy")} />
                <PresetButton icon={<Heart />} label="Guardian Dragon" onClick={() => handleMagic("A giant friendly fluffy dragon protecting a brave child hero in a cloud castle")} />
                <PresetButton icon={<Star />} label="Magic Forest" onClick={() => handleMagic("A glowing magical enchanted forest with sparkling butterflies and hero light")} />
             </div>
          </div>

          <div className="space-y-4 pt-4 border-t-2 border-slate-100 dark:border-slate-700">
             <textarea 
               value={prompt}
               onChange={e => setPrompt(e.target.value)}
               placeholder="Describe your own magic here..."
               className="w-full p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-400 h-40 font-bold text-lg shadow-inner transition-all dark:text-white"
             />
             <button 
               onClick={() => handleMagic()}
               disabled={loading || (!prompt && !loading)}
               className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
             >
               {loading ? <Loader2 className="animate-spin w-8 h-8" /> : <Sparkles className="w-8 h-8" />} Create Magic
             </button>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center p-12 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)] pointer-events-none" />
           
           {loading ? (
             <div className="text-center space-y-10 animate-pulse">
                <div className="w-48 h-48 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-2xl relative border-8 border-indigo-50 dark:border-slate-700">
                   <div className="absolute inset-0 border-8 border-indigo-200 dark:border-indigo-900 rounded-full animate-ping opacity-20" />
                   <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                      <Sparkles className="w-16 h-16 animate-spin duration-[3000ms]" />
                   </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Casting Spells...</h3>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.5em]">Gemini Magic Art Engine</p>
                </div>
             </div>
           ) : imageUrl ? (
             <div className="space-y-12 w-full flex flex-col items-center animate-in zoom-in-95 duration-700">
                <div className="relative group">
                   <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[4.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                   <img src={imageUrl} className="max-w-full max-h-[55vh] rounded-[4rem] shadow-2xl border-8 border-white dark:border-slate-800 relative z-10" alt="Generated Magic" />
                   <div className="absolute -bottom-8 -right-8 p-6 bg-yellow-400 text-white rounded-[2rem] shadow-2xl scale-125 rotate-12 z-20 border-4 border-white animate-bounce">
                      <Star className="w-10 h-10 fill-current" />
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                   <button onClick={() => setImageUrl(null)} className="px-10 py-5 bg-white dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 hover:border-rose-100 dark:hover:border-rose-900 transition-all shadow-xl">Try New Spell</button>
                   <a href={imageUrl} download="hero-masterpiece.png" className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-sm tracking-widest flex items-center gap-4 hover:bg-black transition-all shadow-2xl">
                      <Download className="w-5 h-5" /> Save Masterpiece
                   </a>
                </div>
             </div>
           ) : (
             <div className="text-center space-y-8 opacity-20 group">
                <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
                   <Palette className="w-40 h-40 text-indigo-400 group-hover:scale-110 transition-transform duration-[2000ms] absolute inset-0" />
                   <Sparkles className="w-20 h-20 text-yellow-400 absolute animate-pulse" />
                </div>
                <p className="text-5xl font-black tracking-tighter uppercase leading-none text-slate-900 dark:text-white">Your Magic <br/> Appears Here</p>
                <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Describe it on the left!</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const PresetButton = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="w-full p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] flex items-center gap-5 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
    <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl transition-all shadow-inner">{icon}</div>
    <span className="font-black text-slate-700 dark:text-slate-200 tracking-tight text-lg">{label}</span>
  </button>
);

export default MagicStudio;