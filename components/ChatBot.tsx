
import React, { useState, useRef, useEffect } from 'react';
import { UserRole, PatientAgeGroup, AppLanguage, EmotionalState, ChatMessage, ChatAction } from '../types';
import { getGeminiResponse } from '../services/geminiService';
import { historyService } from '../services/historyService';
import { Send, MessageSquareHeart, Mic, MicOff, Sparkles, Headphones, ChevronRight, Wind, MapPin, BookOpen, Smile, Palette, Ghost, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MoodCheckIn from './MoodCheckIn';

interface Props {
  role: UserRole;
  ageGroup?: PatientAgeGroup;
  gender?: 'BOY' | 'GIRL';
  isChild?: boolean;
  language: AppLanguage;
  mood?: EmotionalState;
}

const ChatBot: React.FC<Props> = ({ role, ageGroup, gender, isChild, language, mood }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSTTActive, setIsSTTActive] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [buddyCustomization, setBuddyCustomization] = useState({ name: 'Buddy', color: 'indigo' });
  const [showCustomizer, setShowCustomizer] = useState(false);
  
  const navigate = useNavigate();
  const sessionId = useRef(`session_${role}_${Date.now()}`).current;
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Theme mapping for AI agent
  let themeStyles = isChild 
    ? (buddyCustomization.color === 'pink' ? 'from-pink-400 to-rose-500' : 'from-blue-400 to-indigo-600')
    : (gender === 'GIRL' ? 'from-rose-500 to-pink-600' : 'from-blue-600 to-indigo-700');
    
  if (role === UserRole.SURVIVOR) themeStyles = 'from-amber-500 to-orange-600';

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = language === AppLanguage.HINDI ? 'hi-IN' : 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
        setIsSTTActive(false);
      };
      recognitionRef.current.onend = () => setIsSTTActive(false);
    }
  }, [language]);

  const toggleSTT = () => {
    if (isSTTActive) recognitionRef.current?.stop();
    else { setIsSTTActive(true); recognitionRef.current?.start(); }
  };

  const handleActionClick = (action: ChatAction) => {
    switch (action.action) {
      case 'OPEN_BREATHING':
        setIsMoodModalOpen(true);
        break;
      case 'OPEN_NAVIGATOR':
        navigate('/navigator');
        break;
      case 'OPEN_JOURNAL':
        navigate('/journal');
        break;
      case 'OPEN_MOOD':
        setIsMoodModalOpen(true);
        break;
      case 'OPEN_MAPS':
        navigate('/finder');
        break;
      default:
        console.log("Unknown action:", action.action);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    await historyService.saveMessage(sessionId, userMsg);
    
    setInput('');
    setIsTyping(true);
    
    try {
      const responseText = await getGeminiResponse(
        isChild ? `[YOU ARE BUDDY AI, A MAGIC FRIEND] ${userMsg.text}` : userMsg.text, 
        role, ageGroup, language, useThinking, mood, messages.slice(-10)
      );
      
      let text = responseText;
      let actions: ChatAction[] | undefined;

      try {
        if (responseText.trim().startsWith('{') && responseText.trim().endsWith('}')) {
           const parsed = JSON.parse(responseText);
           if (parsed.text) {
             text = parsed.text;
             actions = parsed.actions;
           }
        }
      } catch (e) {}

      const aiMsg: ChatMessage = { role: 'model', text, actions, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
      await historyService.saveMessage(sessionId, aiMsg);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "The intelligence engine is busy. Please try again in a moment.", timestamp: Date.now() }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-950 relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-50 dark:border-slate-800 transition-all duration-500 ${isChild ? 'child-font' : ''}`}>
      <MoodCheckIn isOpen={isMoodModalOpen} onClose={() => setIsMoodModalOpen(false)} onSelect={() => setIsMoodModalOpen(false)} isChild={isChild || false} />
      
      <div className="p-8 border-b-2 border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${themeStyles} shadow-xl text-white transition-all`}>
            {isChild ? <Ghost className="w-8 h-8" /> : <MessageSquareHeart className="w-8 h-8" />}
          </div>
          <div className="text-left">
            <h3 className="font-black text-2xl text-slate-900 dark:text-white leading-none tracking-tight">
              {role === UserRole.SURVIVOR ? 'Resilience Agent' : isChild ? `${buddyCustomization.name} AI` : 'LifePal Guide'}
            </h3>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">
               {isChild ? 'Your Magic Bestie' : 'AI Grounded Response'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isChild && (
            <button onClick={() => setShowCustomizer(true)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-full hover:text-indigo-600 transition-all">
              <Palette className="w-5 h-5" />
            </button>
          )}
          <button onClick={() => setUseThinking(!useThinking)} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${useThinking ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Deep Logic</button>
        </div>
      </div>

      {showCustomizer && (
        <div className="absolute inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in">
           {/* Fix: Added X component from lucide-react */}
           <button onClick={() => setShowCustomizer(false)} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-rose-500 transition-all"><X /></button>
           <h3 className="text-4xl font-black mb-8">Customize Buddy</h3>
           <div className="space-y-10 w-full max-w-sm">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Buddy's Name</label>
                <input value={buddyCustomization.name} onChange={e => setBuddyCustomization({...buddyCustomization, name: e.target.value})} className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl font-black text-2xl border-4 border-transparent focus:border-indigo-400 outline-none" />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Magic Color</label>
                <div className="flex gap-4 justify-center">
                   <button onClick={() => setBuddyCustomization({...buddyCustomization, color: 'indigo'})} className={`w-14 h-14 rounded-2xl bg-indigo-500 border-4 transition-all ${buddyCustomization.color === 'indigo' ? 'border-indigo-200 scale-110 shadow-lg' : 'border-transparent opacity-60'}`} />
                   <button onClick={() => setBuddyCustomization({...buddyCustomization, color: 'pink'})} className={`w-14 h-14 rounded-2xl bg-pink-500 border-4 transition-all ${buddyCustomization.color === 'pink' ? 'border-pink-200 scale-110 shadow-lg' : 'border-transparent opacity-60'}`} />
                </div>
              </div>
              <button onClick={() => setShowCustomizer(false)} className="w-full py-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black rounded-3xl text-xl shadow-xl">Looks Good!</button>
           </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-6">
            {isChild ? (
              <Ghost className="w-32 h-32 text-indigo-300 animate-bounce duration-[4000ms]" />
            ) : (
              <Sparkles className="w-20 h-20 text-slate-300 dark:text-blue-500 animate-pulse" />
            )}
            <p className="text-3xl font-black text-slate-400 dark:text-slate-500 tracking-tighter leading-none whitespace-pre-wrap">
              {isChild ? `Hi Hero! I'm ${buddyCustomization.name}.\nWhat magic shall we talk about?` : (role === UserRole.SURVIVOR ? "Focused guidance on \nsurvivorship and resilience." : "Your companion in \nevery step of care.")}
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4`}>
            <div className={`max-w-[85%] p-6 shadow-xl ${
              msg.role === 'user' 
                ? `bg-gradient-to-br ${themeStyles} text-white rounded-[2.5rem] rounded-tr-lg border-2 border-white/10` 
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] rounded-tl-lg'
            }`}>
              <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  {msg.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(action)}
                      className="px-5 py-3 bg-slate-50 dark:bg-slate-700 text-blue-600 dark:text-blue-300 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-slate-600 border-2 border-slate-200 dark:border-slate-600 transition-all flex items-center gap-2"
                    >
                      {action.action.includes('BREATHING') && <Wind className="w-4 h-4" />}
                      {action.action.includes('NAVIGATOR') && <MapPin className="w-4 h-4" />}
                      {action.action.includes('JOURNAL') && <BookOpen className="w-4 h-4" />}
                      {action.action.includes('MOOD') && <Smile className="w-4 h-4" />}
                      {action.label} <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 px-4">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-3 p-6 bg-slate-50 dark:bg-slate-800 rounded-full shadow-lg w-fit">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 border-t-2 border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-full border-2 border-slate-100 dark:border-slate-700 focus-within:border-blue-500 transition-all">
          <button 
            onClick={toggleSTT} 
            className={`p-4 rounded-full transition-all ${isSTTActive ? 'bg-rose-500 text-white animate-pulse shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
          >
            {isSTTActive ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSend()} 
            placeholder={isSTTActive ? "Listening..." : "How can I help you today?"} 
            className="flex-1 bg-transparent border-none focus:ring-0 p-4 text-slate-900 dark:text-white font-bold text-xl placeholder:text-slate-300" 
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim() || isTyping} 
            className={`p-5 rounded-full bg-gradient-to-br ${themeStyles} text-white shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20`}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
