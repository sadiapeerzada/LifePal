
import React, { useState } from 'react';
import { EmotionalState } from '../types';
import { Heart, Smile, Frown, Zap, Coffee, X, Wind, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onSelect: (mood: EmotionalState, note?: string) => void;
  onClose: () => void;
  isChild: boolean;
}

const MoodCheckIn: React.FC<Props> = ({ isOpen, onSelect, onClose, isChild }) => {
  const [step, setStep] = useState<'MOOD' | 'FOLLOW_UP'>('MOOD');
  const [selectedMood, setSelectedMood] = useState<EmotionalState | null>(null);

  if (!isOpen) return null;

  const moods = [
    { state: EmotionalState.OKAY, label: 'Okay', icon: <Smile className="w-8 h-8" />, color: 'bg-emerald-100 text-emerald-600' },
    { state: EmotionalState.LOW, label: 'Low', icon: <Frown className="w-8 h-8" />, color: 'bg-indigo-100 text-indigo-600' },
    { state: EmotionalState.ANXIOUS, label: 'Anxious', icon: <Zap className="w-8 h-8" />, color: 'bg-amber-100 text-amber-600' },
    { state: EmotionalState.TIRED, label: 'Tired', icon: <Coffee className="w-8 h-8" />, color: 'bg-blue-100 text-blue-600' },
  ];

  const handleMoodClick = (state: EmotionalState) => {
    setSelectedMood(state);
    if (state === EmotionalState.LOW || state === EmotionalState.ANXIOUS) {
      setStep('FOLLOW_UP');
    } else {
      onSelect(state);
      setStep('MOOD');
    }
  };

  const handleFollowUpChoice = (choice: string) => {
    // We log the mood and append the preference to the internal note or just finish the interaction
    // The prompt says no analytics, so we just satisfy the user preference by finishing the flow.
    if (selectedMood) {
      onSelect(selectedMood, `User preferred: ${choice}`);
    }
    setStep('MOOD');
    setSelectedMood(null);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300 ${isChild ? 'child-font' : ''}`}>
        <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-50 text-slate-300 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {step === 'MOOD' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-inner">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900">
                {isChild ? 'How are you, Hero?' : 'How are you feeling today?'}
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                {isChild 
                  ? 'Your Buddy wants to check in on your bravery power!' 
                  : 'Share your state so we can adjust our support to your pace.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {moods.map((m) => (
                <button
                  key={m.state}
                  onClick={() => handleMoodClick(m.state)}
                  className="group flex flex-col items-center justify-center p-8 bg-white border-4 border-slate-50 rounded-[2.5rem] transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-100"
                >
                  <div className={`p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110 ${m.color}`}>
                    {m.icon}
                  </div>
                  <span className="font-black text-slate-800 uppercase tracking-widest text-xs">{m.label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="w-full text-center text-xs font-black text-slate-300 uppercase tracking-[0.3em] hover:text-slate-500 transition-colors"
            >
              Not right now
            </button>
          </div>
        ) : (
          <div className="space-y-10 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-10 h-10 text-blue-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  I'm here with you.
                </h3>
                <p className="text-slate-500 font-medium px-4">
                  Would you like to try something calming, or would you prefer some information right now?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => handleFollowUpChoice('Something Calming')}
                className="group p-6 bg-white border-4 border-blue-50 rounded-[2.5rem] flex items-center gap-6 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100 transition-all text-left"
              >
                <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Wind className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900 text-lg">Something calming</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Breathing & Soft visuals</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-blue-500 transition-colors" />
              </button>

              <button 
                onClick={() => handleFollowUpChoice('Information')}
                className="group p-6 bg-white border-4 border-slate-50 rounded-[2.5rem] flex items-center gap-6 hover:border-slate-800 hover:shadow-xl transition-all text-left"
              >
                <div className="p-4 bg-slate-100 text-slate-500 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900 text-lg">Information</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Resources & Guidance</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-slate-800 transition-colors" />
              </button>
            </div>

            <button 
              onClick={() => { setStep('MOOD'); setSelectedMood(null); }}
              className="w-full text-center text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors"
            >
              ← Back to mood choices
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodCheckIn;
