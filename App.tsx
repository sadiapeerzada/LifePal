
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, NavLink, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { UserRole, PatientAgeGroup, UserProfile, AppLanguage, AppTheme, ScannedDoc, EmotionalState, MoodEntry, Reminder, ChildVideo, CaregiverJournalEntry, SavedResource, ResourceType, DonationRecord, SOSContact, SymptomLog } from './types';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RoleSelection from './components/RoleSelection';
import ChatBot from './components/ChatBot';
import LanguageToggle from './components/LanguageToggle';
import SOSDialog from './components/SOSDialog';
import NavigatorView from './components/NavigatorView';
import TransparencyPage from './components/TransparencyPage';
import SupporterImpactView from './components/SupporterImpactView';
import RemindersView from './components/RemindersView';
import DocIntelView from './components/DocIntelView';
import MedicineScannerView from './components/MedicineScannerView';
import GovernmentSchemesView from './components/GovernmentSchemesView';
import MapsGroundingView from './components/MapsGroundingView';
import OncoLinkNewsView from './components/OncoLinkNewsView';
import SymptomTrackerView from './components/SymptomTrackerView';
import SkillsHubView from './components/SkillsHubView';
import SettingsView from './components/SettingsView';
import CaregiverJournalView from './components/CaregiverJournalView';
import MagicStudio from './components/MagicStudio';
import SurvivorsHubView from './components/SurvivorsHubView';
import CaregiverDashboard from './components/CaregiverDashboard';
import SavedHubView from './components/SavedHubView';
import AdvancedToolsView from './components/AdvancedToolsView';
import DonationView from './components/DonationView';
import EmergencyProtocolView from './components/EmergencyProtocolView';
import { 
  Heart, Home, MessageCircle, Navigation2, ShieldCheck, Zap, Scan, 
  Sun, Moon, ChevronRight, BookOpen, Users, LogOut, User, Camera, Bell, 
  HandHeart, Sparkles, Star, Trophy, Video, PlayCircle, Wind, Droplets, Flame, X, 
  Gamepad2, Clapperboard, CheckCircle2, Circle, MessageCircleHeart, FileText, Plus, Trash2, Filter,
  ShieldPlus, HelpingHand, Info, ExternalLink, Lock, Bookmark, BookmarkCheck, LayoutGrid, Pill,
  Wallet, Landmark, Wand2, MapPin, Stethoscope, Calendar, History, Footprints, Globe, Thermometer, GraduationCap, Settings, Book, Search, Palette,
  UtensilsCrossed, Bed, Shield, Smile, Brain, FileText as FileTextIcon, Lightbulb, UserRound, Tv, Utensils, Volume2, Waves, HeartPulse,
  ArrowRight, BookMarked, PenTool, UsersRound, MessageSquare, Cloud, Flower, Ghost, Bookmark as BookmarkIcon, Apple, Shield as ShieldIcon,
  LayoutDashboard, Activity, Timer, Cpu, Award, Rocket, Ghost as GhostIcon, Music, Coffee, Gem, HandMetal, Gift, RefreshCw, BellRing, Pause, VolumeX, Maximize, Box, RefreshCcw, Crown, Microscope, Wand,
  Medal, Target, Diamond, Orbit, Map, Component, RefreshCcw as RefreshIcon,
  Loader2, ShieldAlert, AlertTriangle
} from 'lucide-react';
import { CHILD_VIDEOS, TRANSLATIONS, SCHEMES } from './constants';
import { getGeminiResponse, fetchHeroCinemaVideos } from './services/geminiService';

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string; isRTL: boolean }> = ({ to, icon, label, isRTL }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `flex items-center gap-4 w-full p-4 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-300'}`}
  >
    <div className={isRTL ? 'order-last' : ''}>{icon}</div>
    <span className={`hidden md:block text-[10px] font-black uppercase tracking-widest ${isRTL ? 'order-first text-right flex-1' : ''}`}>{label}</span>
  </NavLink>
);

const FeatureCard: React.FC<{ to: string; icon: React.ReactNode; title: string; desc: string; color: string; t: (k: string) => string }> = ({ to, icon, title, desc, color, t }) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    cyan: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    violet: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20',
    pink: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20',
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20',
    yellow: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
  };
  return (
    <Link to={to} className="group relative z-30 bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col gap-6 cursor-pointer isolate text-left">
      <div className={`p-5 rounded-[1.8rem] w-fit transition-transform group-hover:scale-110 group-hover:rotate-3 ${colorMap[color] || 'text-slate-600 bg-slate-50 dark:bg-slate-800'}`}>
        {React.cloneElement(icon as any, { className: 'w-8 h-8' } as any)}
      </div>
      <div className="space-y-2 relative z-10">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed line-clamp-2">{desc}</p>
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between relative z-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-600 transition-colors">Explorer</span>
        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};

const HeroActionCard: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; color: string; onClick?: () => void; to?: string }> = ({ title, subtitle, icon, color, onClick, to }) => {
  const content = (
    <>
      <div className={`p-4 rounded-2xl ${color} shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-left flex-1 overflow-hidden">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 truncate">{subtitle}</p>
        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight truncate">{title}</h3>
      </div>
      <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-blue-50 transition-all ml-auto shrink-0" />
    </>
  );
  const className = "bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl flex items-center gap-6 group hover:-translate-y-1 transition-all hover:shadow-2xl relative z-30 cursor-pointer isolate overflow-hidden";
  if (to) return <Link to={to} className={className}>{content}</Link>;
  return <button onClick={onClick} className={className}>{content}</button>;
};

const MatchingGame: React.FC<{ onClose: () => void; onWin: (xp: number) => void; t: (k: string) => string }> = ({ onClose, onWin, t }) => {
  const emojis = ['🌟', '🚀', '🎨', '💖', '🍭', '🦁', '🌈', '🍦'];
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setTimeout(() => {
             onWin(200);
          }, 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[2300] flex items-center justify-center p-4 bg-indigo-950/90 backdrop-blur-xl animate-in fade-in">
       <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[4rem] p-10 text-center shadow-[0_0_100px_rgba(99,102,241,0.4)] border-8 border-indigo-400">
          <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white rounded-full transition-all shadow-lg"><X /></button>
          <h2 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 uppercase mb-4 tracking-tighter">{t('memory_quest')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-black uppercase text-xs tracking-widest">Moves: {moves} | Matches: {matched.length / 2} / {emojis.length}</p>
          <div className="grid grid-cols-4 gap-4">
             {cards.map((card, i) => (
               <button 
                key={i} 
                onClick={() => handleFlip(i)}
                className={`aspect-square rounded-[1.8rem] text-4xl flex items-center justify-center transition-all duration-500 transform ${flipped.includes(i) || matched.includes(i) ? 'bg-indigo-100 dark:bg-indigo-900/40 rotate-0 scale-100' : 'bg-indigo-600 rotate-180 scale-95 shadow-xl'}`}
               >
                 {(flipped.includes(i) || matched.includes(i)) ? card : <Star className="text-white/40 w-10 h-10" />}
               </button>
             ))}
          </div>
       </div>
    </div>
  );
};

const QuestBadge: React.FC<{ icon: React.ReactElement; title: string; xp: number; color: string; isCompleted: boolean; onComplete: () => void }> = ({ icon, title, xp, color, isCompleted, onComplete }) => {
  const themes: Record<string, string> = {
    amber: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 text-amber-600',
    blue: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 text-blue-600',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 text-indigo-600',
    rose: 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 text-rose-600',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 text-yellow-600',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 text-emerald-600',
    violet: 'bg-violet-50 dark:bg-violet-900/10 border-violet-100 text-violet-100',
    pink: 'bg-pink-50 dark:bg-pink-900/10 border-pink-100 text-pink-600',
  };
  return (
    <button 
      onClick={onComplete} disabled={isCompleted}
      className={`w-full p-6 rounded-[2.5rem] border-4 flex items-center justify-between transition-all group ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 opacity-60 grayscale-[0.5]' : `bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1`}`}
    >
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : themes[color] || themes.blue}`}>
          {React.cloneElement(icon as any, { className: 'w-6 h-6' } as any)}
        </div>
        <div className="text-left space-y-1 overflow-hidden">
          <p className={`font-black text-lg truncate ${isCompleted ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-slate-800 dark:text-white'}`}>{title}</p>
          <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${isCompleted ? 'bg-emerald-200 text-emerald-700' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600'}`}>+{xp} XP Reward</div>
        </div>
      </div>
      {isCompleted ? <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0"><CheckCircle2 className="w-6 h-6" /></div> : <div className="w-10 h-10 rounded-full border-4 border-slate-100 dark:border-slate-800 group-hover:border-blue-400 transition-colors shrink-0" />}
    </button>
  );
};

export const CareFocusCard = ({ t }: { t: (key: string) => string }) => {
  const focuses = [
    { title: 'Hydration Check', desc: 'A sip of water supports clinical recovery', icon: <Droplets /> },
    { title: 'Moment of Presence', desc: 'Close your eyes for 60 seconds of calm', icon: <Wind /> },
    { title: 'Natural Light', desc: 'Step toward a window for fresh perspective', icon: <Sun /> },
  ];
  const [focus, _setFocus] = useState(focuses[new Date().getDate() % focuses.length]);
  const [isCompleted, setIsCompleted] = useState(false);
  return (
    <div className={`bg-blue-50 dark:bg-gradient-to-br dark:from-blue-900 dark:to-blue-950 p-10 rounded-[3.5rem] shadow-xl flex flex-col md:flex-row items-center gap-8 group relative overflow-hidden border-2 border-white dark:border-blue-800/30 isolate animate-in slide-in-from-bottom-4`}>
      <div className={`w-20 h-20 bg-white/50 dark:bg-white/10 backdrop-blur-md text-blue-600 dark:text-white rounded-3xl flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 transition-transform relative z-10`}>
        {isCompleted ? <CheckCircle2 className="w-10 h-10 text-emerald-500" /> : React.cloneElement(focus.icon as any, { className: 'w-10 h-10' } as any)}
      </div>
      <div className={`space-y-2 flex-1 text-center md:text-left relative z-10`}>
        <span className={`text-[10px] font-black uppercase text-blue-500 dark:text-blue-300 tracking-[0.2em]`}>{t('daily_sanctuary_focus')}</span>
        <h3 className={`text-3xl font-black text-blue-950 dark:text-white leading-tight ${isCompleted ? 'line-through opacity-70' : ''}`}>{focus.title}</h3>
        <p className={`text-blue-800 dark:text-blue-100 font-medium italic text-lg leading-relaxed opacity-90`}>{focus.desc}</p>
      </div>
      <button onClick={() => setIsCompleted(true)} disabled={isCompleted} className={`px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl relative z-10 ${isCompleted ? 'bg-emerald-500 text-white cursor-default' : 'bg-blue-950 dark:bg-white text-white dark:text-blue-950 hover:bg-blue-800'}`}>
        {isCompleted ? t('completed') : t('mark_complete')}
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('lifepal_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!profile);
  const [documents, setDocuments] = useState<ScannedDoc[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);
  const [journal, setJournal] = useState<CaregiverJournalEntry[]>([]);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Global Modal States for Child
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<ChildVideo | null>(null);
  const [isMysteryModalOpen, setIsMysteryModalOpen] = useState(false);
  const [revealedTreasure, setRevealedTreasure] = useState<{type: string, content: string} | null>(null);
  const [mysteryUnlocked, setMysteryUnlocked] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  useEffect(() => { setGlobalSearch(''); }, [location.pathname]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('lifepal_profile', JSON.stringify(profile));
      document.documentElement.classList.toggle('dark', profile.theme === AppTheme.DARK);
    }
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => setProfile(prev => prev ? { ...prev, ...updates } : null);
  const handleToggleSave = (res: Omit<SavedResource, 'timestamp'>) => {
    if (!profile) return;
    const exists = profile.savedResources?.some(r => r.id === res.id);
    updateProfile({ savedResources: exists ? (profile.savedResources || []).filter(r => r.id !== res.id) : [...(profile.savedResources || []), { ...res, timestamp: Date.now() }] });
  };
  const handleLogin = (_email: string) => { setIsAuthenticated(true); if (!profile) navigate('/role'); else navigate('/'); };
  const handleLogout = () => { localStorage.removeItem('lifepal_profile'); setIsAuthenticated(false); setProfile(null); navigate('/'); };

  const addXP = (amount: number, sticker?: string) => {
    const currentXP = profile?.xp || 0;
    const oldLevel = profile?.level || 1;
    const newXP = currentXP + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    let newStickers = profile?.stickers || [];
    if (sticker && !newStickers.includes(sticker)) newStickers = [...newStickers, sticker];
    if (newLevel > oldLevel) setShowLevelUp(true);
    updateProfile({ xp: newXP, level: newLevel, stickers: newStickers });
  };

  const openMysteryBox = () => {
    const treasures = [
      { type: 'STICKER', content: '🦖' },
      { type: 'MESSAGE', content: "You are stronger than you know!" },
      { type: 'FACT', content: "Octopuses have three hearts!" },
      { type: 'BADGE', content: "🏅 Bravery Medal Unlocked!" },
      { type: 'STICKER', content: '🐉' },
      { type: 'MESSAGE', content: "Every step forward is a victory." },
      { type: 'FACT', content: "Honey never spoils. Archaeologists found edible honey in 3000-year-old tombs!" },
      { type: 'STICKER', content: '🌈' },
      { type: 'MESSAGE', content: "You're a legendary hero!" },
      { type: 'STICKER', content: '🍦' }
    ];
    const pick = treasures[Math.floor(Math.random() * treasures.length)];
    setRevealedTreasure(pick);
    setMysteryUnlocked(true);
    addXP(500, pick.type === 'STICKER' ? pick.content : undefined);
    setTimeout(() => {
        setIsMysteryModalOpen(false);
        setRevealedTreasure(null);
    }, 4500);
  };

  const t = (key: string) => {
    const currentLanguage = (profile as UserProfile | null)?.language || AppLanguage.ENGLISH;
    const dict = (TRANSLATIONS as any)[currentLanguage] || (TRANSLATIONS as any)[AppLanguage.ENGLISH];
    return dict?.[key] || key;
  };
  const isRTL = profile?.language === AppLanguage.URDU;

  if (!isAuthenticated) return (
    <Routes>
      <Route path="/" element={<LandingPage onStart={() => navigate('/login')} currentLang={profile?.language || AppLanguage.ENGLISH} onSelectLang={l => updateProfile({ language: l })} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/transparency" element={<TransparencyPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  if (isAuthenticated && !profile) return (
    <Routes>
      <Route path="/role" element={<RoleSelection language={AppLanguage.ENGLISH} onSelect={(r, a, g) => {
        setProfile({ id: Math.random().toString(36).substr(2,9), name: 'Hero', role: r, ageGroup: a, gender: g, language: AppLanguage.ENGLISH, theme: AppTheme.LIGHT, xp: 0, level: 1, stickers: [], reminders: [], savedResources: [], emergencyContacts: [] });
        navigate('/');
      }} />} />
    </Routes>
  );

  const safeProfile = profile!;

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 transition-colors duration-500" dir={isRTL ? 'rtl' : 'ltr'}>
      <SOSDialog isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} isChild={safeProfile.role === UserRole.CHILD} contacts={safeProfile.emergencyContacts || []} onUpdateContacts={c => updateProfile({ emergencyContacts: c })} />
      <MagicStudio isOpen={isStudioOpen} onClose={() => setIsStudioOpen(false)} onEarnSticker={(s) => addXP(100, s)} />
      {isGameOpen && <MatchingGame onClose={() => setIsGameOpen(false)} onWin={addXP} t={t} />}
      
      {showLevelUp && (
        <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in">
           <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[4rem] p-12 text-center border-8 border-yellow-400 shadow-2xl animate-in zoom-in">
              <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <Trophy className="w-16 h-16 text-yellow-500" />
              </div>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase mb-4">{t('level_up')}</h2>
              <p className="text-2xl font-bold text-slate-500 mb-10">{t('reached_level')} <span className="text-yellow-500">{safeProfile.level}</span>!</p>
              <button onClick={() => setShowLevelUp(false)} className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl text-xl shadow-xl hover:bg-blue-700 transition-all">{t('continue_quest')}</button>
           </div>
        </div>
      )}

      {/* Global Video Modal - Smoothed Transitions & Backdrop */}
      {isVideoModalOpen && currentVideo && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[4rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] border-4 border-slate-800 animate-in zoom-in-95 duration-500 ring-4 ring-white/5">
              <button onClick={() => setIsVideoModalOpen(false)} className="absolute top-6 right-6 z-[2010] p-4 bg-black/50 hover:bg-rose-600 rounded-full text-white backdrop-blur-md transition-all shadow-2xl border border-white/10 active:scale-90"><X className="w-8 h-8" /></button>
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                 <iframe 
                    key={currentVideo.youtubeId}
                    src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1&playsinline=1`} 
                    title={currentVideo.title} 
                    className="w-full h-full border-0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen 
                 />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent p-12 pt-32 pointer-events-none transition-opacity duration-700">
                 <div className="flex items-center gap-8 text-left">
                    <div className="p-6 bg-rose-500/20 rounded-[2.5rem] border border-rose-500/30 backdrop-blur-md shrink-0"><Tv className="w-12 h-12 text-rose-500" /></div>
                    <div className="space-y-2">
                       <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none drop-shadow-lg">{currentVideo.title}</h3>
                       <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-3xl opacity-90 line-clamp-2">{currentVideo.description}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Global Mystery Box Modal - Enhanced Reveal Logic */}
      {isMysteryModalOpen && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-6 md:p-10 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[4.5rem] shadow-[0_0_100px_rgba(245,158,11,0.25)] p-12 text-center border-8 border-amber-400 flex flex-col items-center animate-in zoom-in-90 duration-500 overflow-hidden">
              {!revealedTreasure ? (
                <div className="space-y-12 py-6 w-full flex flex-col items-center">
                   <div className="relative w-56 h-56 flex items-center justify-center">
                      <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
                      <Box className="w-full h-full text-amber-500 drop-shadow-[0_20px_40px_rgba(245,158,11,0.3)] animate-bounce duration-[2000ms]" />
                      <Sparkles className="absolute top-4 right-4 w-14 h-14 text-yellow-400 animate-pulse" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{t('mystery_box_title')}</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-2xl font-bold max-w-md mx-auto leading-tight">{t('mystery_box_desc')}</p>
                   </div>
                   <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                      <button onClick={() => setIsMysteryModalOpen(false)} className="flex-1 py-7 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-[2.5rem] uppercase tracking-widest text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">{t('later')}</button>
                      <button onClick={openMysteryBox} className="flex-1 py-7 bg-amber-500 text-white font-black rounded-[2.5rem] uppercase tracking-widest text-xl shadow-2xl shadow-amber-200 dark:shadow-none hover:bg-amber-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">{t('open_now')} <Sparkles className="w-6 h-6" /></button>
                   </div>
                </div>
              ) : (
                <div className="space-y-10 py-10 animate-in zoom-in duration-1000 w-full flex flex-col items-center">
                   <div className="relative w-64 h-64 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full border-4 border-amber-200 dark:border-amber-700 shadow-inner">
                      {revealedTreasure.type === 'STICKER' ? (
                        <div className="text-9xl animate-pulse filter drop-shadow-[0_10px_20px_rgba(245,158,11,0.4)]">{revealedTreasure.content}</div>
                      ) : revealedTreasure.type === 'BADGE' ? (
                        <div className="text-7xl animate-bounce">{revealedTreasure.content}</div>
                      ) : (
                        <div className="p-8 text-center"><p className="text-3xl font-black text-amber-600 dark:text-amber-400 italic leading-tight">{revealedTreasure.content}</p></div>
                      )}
                      <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-10" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-6xl md:text-7xl font-black text-amber-600 dark:text-amber-400 uppercase tracking-tighter animate-bounce leading-none">
                        {revealedTreasure.type === 'STICKER' ? t('new_sticker') : 'Found It!'}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-2xl font-bold italic max-w-md mx-auto">{t('bravery_sparkle')}</p>
                   </div>
                   <div className="w-full p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-[3rem] border-4 border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center gap-5 text-emerald-600 dark:text-emerald-400 font-black text-2xl shadow-lg">
                      <Trophy className="w-10 h-10" /> +500 {t('xp_awarded')}
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      <nav className={`w-20 md:w-72 border-r dark:border-slate-800 flex flex-col z-[100] bg-white dark:bg-slate-900 shrink-0 ${isRTL ? 'order-last' : ''}`}>
        <div className="p-8 border-b dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-950 rounded-xl text-white shadow-lg"><Heart className="w-6 h-6 fill-current" /></div>
          <span className="text-2xl font-black hidden md:block text-blue-950 dark:text-blue-400 tracking-tighter">LifePal</span>
        </div>
        <div className="flex-1 p-6 space-y-2 overflow-y-auto">
          <SidebarLink to="/" icon={<Home className="w-5 h-5" />} label={t('dashboard')} isRTL={isRTL} />
          <SidebarLink to="/companion" icon={<MessageCircle className="w-5 h-5" />} label={t('companion')} isRTL={isRTL} />
          {safeProfile.role !== UserRole.DONOR && (
            <>
              {safeProfile.role === UserRole.CAREGIVER && <SidebarLink to="/journal" icon={<Book className="w-5 h-5" />} label="Care Journal" isRTL={isRTL} />}
              <SidebarLink to="/symptoms" icon={<Thermometer className="w-5 h-5" />} label={t('symptom_log')} isRTL={isRTL} />
              <SidebarLink to="/navigator" icon={<MessageCircleHeart className="w-5 h-5" />} label={t('navigator')} isRTL={isRTL} />
              <SidebarLink to="/med-scanner" icon={<Camera className="w-5 h-5" />} label={t('med_scanner')} isRTL={isRTL} />
              <SidebarLink to="/vault" icon={<Scan className="w-5 h-5" />} label={t('doc_intel')} isRTL={isRTL} />
              <SidebarLink to="/reminders" icon={<Bell className="w-5 h-5" />} label={safeProfile.role === UserRole.CHILD ? t('hero_tasks') : 'Reminders'} isRTL={isRTL} />
            </>
          )}
          <SidebarLink to="/insights" icon={<Globe className="w-5 h-5" />} label={t('insights')} isRTL={isRTL} />
          <SidebarLink to="/saved" icon={<BookmarkIcon className="w-5 h-5" />} label={t('saved_sanctuary')} isRTL={isRTL} />
          <SidebarLink to="/skills" icon={<GraduationCap className="w-5 h-5" />} label={t('skills_hub')} isRTL={isRTL} />
          <SidebarLink to="/schemes" icon={<Landmark className="w-5 h-5" />} label={t('schemes')} isRTL={isRTL} />
          {safeProfile.role === UserRole.DONOR ? <SidebarLink to="/impact" icon={<HandHeart className="w-5 h-5" />} label={t('impact_hub')} isRTL={isRTL} /> : <SidebarLink to="/finder" icon={<MapPin className="w-5 h-5" />} label={t('finder')} isRTL={isRTL} />}
          {safeProfile.role !== UserRole.DONOR && <SidebarLink to="/emergency" icon={<ShieldAlert className="w-5 h-5" />} label={t('emergency_prep')} isRTL={isRTL} />}
        </div>
        <div className="p-6 border-t dark:border-slate-800">
           <SidebarLink to="/settings" icon={<Settings className="w-5 h-5" />} label={t('settings')} isRTL={isRTL} />
           <button onClick={handleLogout} className="mt-4 p-4 text-rose-50 font-black flex items-center gap-4 hover:bg-rose-50 rounded-xl transition-all w-full text-rose-500"><LogOut /> <span className="hidden md:block">LOGOUT</span></button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col overflow-hidden relative isolate">
        <header className="h-20 border-b flex items-center justify-between px-12 bg-white dark:bg-slate-900 z-40 relative">
          <div className="relative group flex-1 max-w-xl">
            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input type="text" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} placeholder={t('search_placeholder')} className={`w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-2 font-bold text-sm outline-none focus:border-blue-900 transition-all`} />
          </div>
          <button onClick={() => setIsSOSOpen(true)} className="px-6 py-2 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase shadow-lg ml-6">{t('emergency_sos')}</button>
        </header>
        <div className="flex-1 overflow-y-auto p-12 relative animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={
              safeProfile.role === UserRole.CHILD ? <HeroKidDashboard 
                profile={safeProfile} 
                onQuestComplete={addXP} 
                t={t} 
                onOpenStudio={() => setIsStudioOpen(true)} 
                onOpenGame={() => setIsGameOpen(true)}
                searchQuery={globalSearch}
                onOpenVideo={(v: ChildVideo) => { setCurrentVideo(v); setIsVideoModalOpen(true); }}
                onOpenMystery={() => setIsMysteryModalOpen(true)}
                mysteryUnlocked={mysteryUnlocked}
              /> 
              : safeProfile.role === UserRole.CAREGIVER ? <CaregiverDashboard profile={safeProfile} onUpdate={updateProfile} t={t} searchQuery={globalSearch} />
              : safeProfile.role === UserRole.SURVIVOR ? <SurvivorsHubView role={safeProfile.role} language={safeProfile.language} documents={documents} />
              : safeProfile.role === UserRole.DONOR ? <SupporterImpactView profile={safeProfile} />
              : <DashboardHub t={t} searchQuery={globalSearch} />
            } />
            <Route path="/vault" element={<DocIntelView documents={documents} onUpdate={setDocuments} language={safeProfile.language} isDark={safeProfile.theme === AppTheme.DARK} />} />
            <Route path="/med-scanner" element={<MedicineScannerView language={safeProfile.language} isDark={safeProfile.theme === AppTheme.DARK} onAddReminder={r => updateProfile({ reminders: [...(safeProfile.reminders || []), { ...r, id: Math.random().toString(36).substr(2,9), completed: false }] })} />} />
            <Route path="/reminders" element={<RemindersView reminders={safeProfile.reminders || []} onUpdate={r => updateProfile({ reminders: r })} isChild={safeProfile.role === UserRole.CHILD} onHabitXP={addXP} />} />
            <Route path="/insights" element={<OncoLinkNewsView profile={safeProfile} onToggleSave={handleToggleSave} searchQuery={globalSearch} />} />
            <Route path="/finder" element={<MapsGroundingView onToggleSave={handleToggleSave} savedResources={safeProfile.savedResources || []} searchQuery={globalSearch} />} />
            <Route path="/navigator" element={<NavigatorView role={safeProfile.role} language={safeProfile.language} savedResources={safeProfile.savedResources || []} onToggleSave={handleToggleSave} />} />
            <Route path="/schemes" element={<GovernmentSchemesView language={safeProfile.language} role={safeProfile.role} searchQuery={globalSearch} />} />
            <Route path="/skills" element={<SkillsHubView language={safeProfile.language} searchQuery={globalSearch} />} />
            <Route path="/journal" element={<CaregiverJournalView entries={journal} onAdd={e => setJournal([e, ...journal])} searchQuery={globalSearch} />} />
            <Route path="/saved" element={<SavedHubView profile={safeProfile} onToggleSave={handleToggleSave} searchQuery={globalSearch} />} />
            <Route path="/symptoms" element={<SymptomTrackerView logs={symptoms} onAdd={s => setSymptoms([s, ...symptoms])} language={safeProfile.language} searchQuery={globalSearch} profile={safeProfile} />} />
            <Route path="/settings" element={<SettingsView profile={safeProfile} onUpdate={updateProfile} onLogout={handleLogout} />} />
            <Route path="/companion" element={<ChatBot role={safeProfile.role} language={safeProfile.language} gender={safeProfile.gender} isChild={safeProfile.role === UserRole.CHILD} />} />
            <Route path="/emergency" element={<EmergencyProtocolView language={safeProfile.language} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const DashboardHub = ({ t, searchQuery }: any) => {
  const modules = [
    { title: t('navigator_header'), desc: t('navigator_sub'), icon: <Navigation2 />, to: '/navigator', color: 'blue' },
    { title: t('doc_intel_header'), desc: t('doc_intel_sub'), icon: <Scan />, to: '/vault', color: 'cyan' },
    { title: t('meds_scanner_header'), desc: t('meds_scanner_sub'), icon: <Pill />, to: '/med-scanner', color: 'emerald' },
    { title: t('insights_header'), desc: t('insights_sub'), icon: <Globe />, to: '/insights', color: 'amber' },
    { title: t('symptom_log_header'), desc: t('symptom_log_sub'), icon: <Thermometer />, to: '/symptoms', color: 'rose' },
    { title: t('skills_hub_header'), desc: t('skills_hub_sub'), icon: <GraduationCap />, to: '/skills', color: 'pink' },
    { title: t('schemes_header'), desc: t('schemes_sub'), icon: <Landmark />, to: '/schemes', color: 'indigo' },
    { title: t('finder_header'), desc: t('finder_sub'), icon: <MapPin />, to: '/finder', color: 'yellow' },
  ];
  const filtered = searchQuery ? modules.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())) : modules;
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header className="space-y-4 text-left"><h1 className="text-6xl font-black text-blue-950 dark:text-white leading-tight">{t('unified_sanctuary')}</h1><p className="text-xl text-slate-500 max-w-2xl">{t('clinical_logic_desc')}</p></header>
      <CareFocusCard t={t} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-30">{filtered.map((m, i) => <FeatureCard key={i} {...m} t={t} />)}</div>
    </div>
  );
};

const HeroKidDashboard = ({ profile: safeProfile, t, onOpenStudio, onQuestComplete, _searchQuery, onOpenVideo, onOpenMystery, mysteryUnlocked, onOpenGame }: any) => {
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [magicFact, setMagicFact] = useState('Tap the button to discover a hero secret!');
  const [loadingFact, setLoadingFact] = useState(false);
  const [videos, setVideos] = useState<ChildVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const isGirl = safeProfile?.gender === 'GIRL';
  const progressPercent = Math.min((completedQuests.length / 24) * 100, 100);
  
  // XP Level Bar Logic
  const currentXP = safeProfile?.xp || 0;
  const xpIntoCurrentLevel = currentXP % 1000;
  const levelProgress = (xpIntoCurrentLevel / 1000) * 100;

  const quests = [
    { id: 'q1', icon: <Sun />, title: "Gaze at the Sky", xp: 150, color: "amber" },
    { id: 'q2', icon: <Droplets />, title: "Magic Potion", xp: 100, color: "blue" },
    { id: 'q3', icon: <ShieldIcon />, title: "Armor Check", xp: 125, color: "indigo" },
    { id: 'q4', icon: <Wind />, title: "Golden Breath", xp: 175, color: "emerald" },
    { id: 'q5', icon: <Smile />, title: "Victory Smile", xp: 50, color: "pink" },
    { id: 'q6', icon: <Apple />, title: "Power Fruit", xp: 200, color: "rose" },
    { id: 'q7', icon: <Music />, title: "Hero Song", xp: 100, color: "violet" },
    { id: 'q8', icon: <Wand2 />, title: "Sketch Your World", xp: 200, color: "indigo" },
    { id: 'q9', icon: <HeartPulse />, title: "Heart Leap", xp: 150, color: "rose" },
    { id: 'q10', icon: <Cloud />, title: "Cloud Counting", xp: 100, color: "blue" },
    { id: 'q11', icon: <Coffee />, title: "Dragon's Tea", xp: 80, color: "amber" },
    { id: 'q12', icon: <Zap />, title: "Sparkle Step", xp: 250, color: "yellow" },
    { id: 'q13', icon: <Star />, title: "Wishing Star", xp: 300, color: "violet" },
    { id: 'q14', icon: <Flame />, title: "Phoenix Rise", xp: 400, color: "rose" },
    { id: 'q15', icon: <GhostIcon />, title: "Buddy Hug", xp: 150, color: "emerald" },
    { id: 'q16', icon: <Gem />, title: "Treasure Hunt", xp: 500, color: "blue" },
    { id: 'q17', icon: <Wind />, title: "Bubble Breath", xp: 100, color: "emerald" },
    { id: 'q18', icon: <Moon />, title: "Moonwalk", xp: 120, color: "indigo" },
    { id: 'q19', icon: <MessageCircle />, title: "Secret Whisper", xp: 90, color: "blue" },
    { id: 'q20', icon: <Palette />, title: "Color Hunt", xp: 150, color: "pink" },
    { id: 'q21', icon: <Cpu />, title: "Robot Dance", xp: 110, color: "amber" },
    { id: 'q22', icon: <Microscope />, title: "Nature Watch", xp: 130, color: "emerald" },
    { id: 'q23', icon: <Sparkles />, title: "Starry Night", xp: 200, color: "violet" },
    { id: 'q24', icon: <Book />, title: "Kindness Note", xp: 250, color: "rose" },
  ];

  const loadVideos = async () => {
    setLoadingVideos(true);
    const discovered = await fetchHeroCinemaVideos(safeProfile?.language || AppLanguage.ENGLISH);
    setVideos(discovered.length > 0 ? discovered : CHILD_VIDEOS);
    setLoadingVideos(false);
  };

  useEffect(() => {
    loadVideos();
  }, [safeProfile?.language]);

  const fetchFact = async () => {
    setLoadingFact(true);
    try {
        const res = await getGeminiResponse("Tell a fun, magical, or interesting random fact for a child hero. Keep it 2 sentences and uplifting.", UserRole.CHILD, PatientAgeGroup.CHILD, safeProfile?.language || AppLanguage.ENGLISH);
        setMagicFact(res);
    } catch (e) {
        setMagicFact("Did you know that stars twinkle to say hello to heroes like you?");
    } finally {
        setLoadingFact(false);
    }
  };

  const handleQuestAction = (id: string, xp: number) => {
    if (completedQuests.includes(id)) return;
    setCompletedQuests([...completedQuests, id]);
    onQuestComplete(xp);
  };

  const stickerIcons = [
    '🌟', '🚀', '🎨', '💖', '🍭', '🦁', '🛸', '🌈', '🍦', '💎', 
    '🔥', '🌊', '🍄', '🦖', '🦄', '🪐', '🐳', '⚡', '🏹', '🎁',
    '🚁', '🚜', '🏰', '🏔️', '🐚', '🍀', '🧁', '🎈', '🎁', '🧸'
  ];
  const rareStickers = [
    { icon: <Crown className="w-full h-full text-amber-500" />, type: 'LEGENDARY', label: 'Victory Crown' },
    { icon: <Orbit className="w-full h-full text-indigo-400" />, type: 'RARE', label: 'Star Fall' },
    { icon: <Diamond className="w-full h-full text-blue-300" />, type: 'RARE', label: 'Crystal Heart' },
    { icon: <Sparkles className="w-full h-full text-pink-400" />, type: 'RARE', label: 'Magic Mist' },
    { icon: <Target className="w-full h-full text-emerald-400" />, type: 'RARE', label: 'Focus Eye' },
    { icon: <Medal className="w-full h-full text-yellow-500" />, type: 'RARE', label: 'Hero Badge' },
    { icon: <Wand className="w-full h-full text-purple-400" />, type: 'RARE', label: 'Spark Stick' },
    { icon: <Wand className="w-full h-full text-purple-400" />, type: 'RARE', label: 'Spark Stick' },
    { icon: <Map className="w-full h-full text-amber-600" />, type: 'RARE', label: 'Hidden Path' },
    { icon: <Component className="w-full h-full text-slate-400" />, type: 'RARE', label: 'Robot Heart' },
    { icon: <GhostIcon className="w-full h-full text-blue-400" />, type: 'LEGENDARY', label: 'Buddy Spirit' }
  ];

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto relative text-left isolate animate-in fade-in duration-500 child-font">
      <header className={`relative z-10 bg-gradient-to-br ${isGirl ? 'from-rose-500 via-pink-600 to-fuchsia-700 shadow-rose-200' : 'from-indigo-600 via-blue-600 to-cyan-700 shadow-blue-200'} rounded-[4rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white/20 flex flex-col md:flex-row items-center gap-12 text-white overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />
        
        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-white/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-48 h-48 bg-white/20 backdrop-blur-md rounded-full p-2 border-4 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.3)] overflow-hidden flex items-center justify-center transition-transform hover:scale-110 duration-700">
            <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${isGirl ? 'Misty' : 'Felix'}&backgroundColor=${isGirl ? 'fb7185' : '60a5fa'}`} className="w-full h-full object-cover rounded-full scale-110" alt="Hero" />
          </div>
        </div>

        <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
          <div className="space-y-2">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full font-black uppercase text-[10px] tracking-[0.2em] border border-white/20">{t('hero_quest_banner')}</span>
            <h1 className="text-6xl md:text-8xl font-black leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.2)] tracking-tighter">
              {t('hero_welcome').replace('HQ!', '').replace('HQ', '')}<span className="text-yellow-300">HQ</span>!
            </h1>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-3 bg-black/20 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/10">
                 <Trophy className="w-6 h-6 text-yellow-300" />
                 <span className="font-black text-2xl">{t('hero_level')} {safeProfile?.level || 1}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
                <p className="text-white/90 font-bold text-lg">{1000 - ((safeProfile?.xp || 0) % 1000)} {t('magic_energy_needed')}</p>
              </div>
            </div>
            
            {/* New XP Progress Bar for Tasks */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/70">
                <span>Power Level Status</span>
                <span>{Math.round(levelProgress)}% to Next Level</span>
              </div>
              <div className="w-full h-6 bg-black/20 backdrop-blur-md rounded-full border-2 border-white/10 overflow-hidden shadow-inner p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${levelProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-30">
         <HeroActionCard title={t('memory_quest')} subtitle={t('train_brain')} icon={<Gamepad2 className="w-10 h-10 text-white" />} color="bg-blue-500" onClick={onOpenGame} />
         <HeroActionCard title={t('magic_studio')} subtitle={t('open_studio')} icon={<Wand2 className="w-10 h-10 text-white" />} color="bg-purple-500" onClick={onOpenStudio} />
         <HeroActionCard title={t('buddy_chat')} subtitle={t('buddy_desc')} icon={<Ghost className="w-10 h-10 text-white" />} color="bg-emerald-500" to="/companion" />
         <HeroActionCard title={t('mystery_box')} subtitle={mysteryUnlocked ? t('unlocked') : t('tap_to_open')} icon={<Box className={`w-10 h-10 text-white ${!mysteryUnlocked ? 'animate-bounce' : ''}`} />} color="bg-amber-500" onClick={onOpenMystery} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-30">
         <section className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border-4 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group text-left">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-amber-500 flex items-center gap-3 uppercase"><Award className="w-8 h-8" /> {t('sticker_vault')}</h2>
                    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase text-slate-400 tracking-widest">{safeProfile?.stickers?.length || 0} / 40 {t('collected')}</div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
                {[...stickerIcons, ...rareStickers].map((sticker, i) => {
                    const isEarned = (safeProfile?.level || 1) > i || (mysteryUnlocked && i === 39);
                    const isRare = i >= 30;
                    return (
                    <div key={i} className={`aspect-square rounded-[1.5rem] flex items-center justify-center border-4 transition-all duration-500 relative ${isEarned ? (isRare ? 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 border-indigo-200 dark:border-indigo-700 shadow-indigo-100 scale-105' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 scale-100 shadow-md group-hover:rotate-3') : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-40 grayscale scale-95'}`}>
                        {isEarned ? (
                        <>
                            <div className={`text-2xl sm:text-3xl filter drop-shadow-sm ${isRare ? 'animate-pulse' : ''}`}>
                            {typeof sticker === 'string' ? sticker : sticker.icon}
                            </div>
                            {isRare && <div className={`absolute -top-1 -right-1 ${typeof sticker !== 'string' && (sticker as any).type === 'LEGENDARY' ? 'bg-amber-500' : 'bg-indigo-500'} text-[6px] font-black text-white px-1.5 py-0.5 rounded-full shadow-lg`}>{typeof sticker === 'string' ? 'RARE' : (sticker as any).type}</div>}
                        </>
                        ) : <Lock className="text-slate-300 dark:text-slate-700 w-4 h-4" />}
                    </div>
                    );
                })}
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group text-left">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700"><Sparkles className="w-32 h-32" /></div>
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3"><Lightbulb className="w-8 h-8 text-yellow-300" /> {t('magic_fact')}</h3>
                        <button onClick={fetchFact} disabled={loadingFact} className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all shadow-inner">
                            <RefreshIcon className={`w-6 h-6 ${loadingFact ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <p className="text-2xl font-bold italic leading-relaxed">{magicFact}</p>
                </div>
            </div>
         </section>
         
         <section className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border-4 border-slate-200 dark:border-slate-800 shadow-xl flex flex-col text-left">
            <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-black uppercase text-slate-900 dark:text-white"><Zap className="text-amber-500 inline mr-2 w-8 h-8" /> {t('hero_tasks')}</h2><p className="text-3xl font-black text-emerald-500">{Math.round(progressPercent)}%</p></div>
            <div className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden border-4 border-white dark:border-slate-700 shadow-inner"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 shadow-lg" style={{ width: `${progressPercent}%` }} /></div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[500px] custom-scrollbar">{quests.map(q => <QuestBadge key={q.id} {...q} isCompleted={completedQuests.includes(q.id)} onComplete={() => handleQuestAction(q.id, q.xp)} />)}</div>
         </section>
      </div>

      <section className={`bg-gradient-to-br ${isGirl ? 'from-fuchsia-600 to-pink-500 shadow-fuchsia-200' : 'from-blue-600 to-indigo-700 shadow-blue-200'} rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border-8 border-white/20 transition-all group text-left`}>
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-[5s]"><Tv className="w-80 h-80 text-white" /></div>
        <div className="relative z-10 flex flex-col gap-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h2 className="text-6xl md:text-7xl font-black text-white flex items-center gap-6 uppercase tracking-tighter"><Clapperboard className="w-16 h-16 text-yellow-300 animate-pulse" /> {t('hero_cinema')}</h2>
                    <p className="text-white/80 text-2xl font-bold max-w-2xl">{t('cinema_banner')}</p>
                </div>
                <button onClick={loadVideos} disabled={loadingVideos} className="px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all shadow-xl group/btn active:scale-95">
                    {loadingVideos ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCcw className="w-6 h-6 group-hover/btn:rotate-180 transition-transform duration-700" />} {t('sync')} Magic
                </button>
            </div>

            {loadingVideos ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-full">
                 {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-video bg-white/5 rounded-[3rem] animate-pulse border-2 border-white/5 shadow-inner" />
                 ))}
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-full">
                {videos.map((video) => (
                    <button key={video.id} onClick={() => onOpenVideo(video)} className="group relative flex flex-col bg-white/10 backdrop-blur-xl rounded-[3.5rem] p-4 shadow-2xl hover:shadow-black/30 transition-all hover:-translate-y-3 isolate text-left border border-white/20 overflow-hidden outline-none focus:ring-4 ring-yellow-300/50">
                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-inner">
                        <img src={video.thumbnail} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-500">
                            <div className="w-24 h-24 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 scale-90 group-hover:scale-110 group-active:scale-95">
                                <PlayCircle className={`w-14 h-14 ${isGirl ? 'text-pink-500 fill-pink-500' : 'text-blue-500 fill-blue-500'} shadow-sm`} />
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-4">
                        <h3 className="font-black text-white text-3xl md:text-4xl tracking-tight leading-none group-hover:text-yellow-300 transition-colors truncate">{video.title}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase text-white bg-black/20 px-5 py-2.5 rounded-2xl tracking-widest border border-white/10 backdrop-blur-md">{video.category || 'Discovery'}</span>
                        </div>
                    </div>
                    </button>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white/5 rounded-[4rem] border-4 border-white/10 border-dashed max-w-full flex flex-col items-center justify-center gap-6 group">
                 <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <Video className="w-12 h-12 text-white/40" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-white text-3xl font-black uppercase tracking-tighter">Seeking Brave Stories</p>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Searching the galaxy for hero movies...</p>
                 </div>
              </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default App;
