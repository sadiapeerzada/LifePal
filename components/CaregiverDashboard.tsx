import React, { useState } from 'react';
import { UserProfile, EmotionalState, CareNetworkMember, EmergencyPlan, MoodEntry } from '../types';
import { 
  Users, ShieldAlert, Heart, Battery, BrainCircuit, 
  Calendar, CheckCircle2, ChevronRight, Plus, Phone, 
  BookOpen, Sparkles, MessageCircle, AlertTriangle, Pill, Clock,
  Smile, Frown, Zap, Coffee, TrendingUp, Info, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CareFocusCard } from '../App';
import MoodCheckIn from './MoodCheckIn';

interface Props {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  t: (key: string) => string;
  searchQuery?: string;
}

const CaregiverDashboard: React.FC<Props> = ({ profile, onUpdate, t, searchQuery }) => {
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isPatientMoodModalOpen, setIsPatientMoodModalOpen] = useState(false);

  // Logic for Capacity Meter
  const capacityLevels = {
    [EmotionalState.OKAY]: { percent: 85, color: 'bg-emerald-500', text: 'Full Capacity', desc: 'You are doing great. Remember to stay hydrated.' },
    [EmotionalState.LOW]: { percent: 45, color: 'bg-indigo-500', text: 'Low Energy', desc: 'Please consider handing off one task today.' },
    [EmotionalState.ANXIOUS]: { percent: 30, color: 'bg-amber-500', text: 'High Stress', desc: 'Take a 10-minute quiet break right now.' },
    [EmotionalState.TIRED]: { percent: 15, color: 'bg-rose-500', text: 'Exhausted', desc: 'Rest is medically necessary for you too.' },
    [EmotionalState.OVERWHELMED]: { percent: 5, color: 'bg-slate-900', text: 'At Capacity', desc: 'Contact your backup team immediately.' },
  };

  const currentCapacity = capacityLevels[profile.currentMood || EmotionalState.OKAY];

  const handleAddTeamMember = (member: Omit<CareNetworkMember, 'id'>) => {
    const newMember = { ...member, id: Math.random().toString(36).substr(2, 9) };
    onUpdate({ careNetwork: [...(profile.careNetwork || []), newMember] });
    setShowNetworkModal(false);
  };

  const handleMoodUpdate = (mood: EmotionalState) => {
    onUpdate({ currentMood: mood, lastMoodUpdate: Date.now() });
    setIsMoodModalOpen(false);
  };

  const handlePatientMoodUpdate = (mood: EmotionalState, note?: string) => {
    const newEntry: MoodEntry = { date: Date.now(), state: mood, note };
    onUpdate({ moodHistory: [newEntry, ...(profile.moodHistory || [])] });
    setIsPatientMoodModalOpen(false);
  };

  const getMoodIcon = (state: EmotionalState) => {
    switch (state) {
      case EmotionalState.OKAY: return <Smile className="w-5 h-5 text-emerald-500" />;
      case EmotionalState.LOW: return <Frown className="w-5 h-5 text-indigo-500" />;
      case EmotionalState.ANXIOUS: return <Zap className="w-5 h-5 text-amber-500" />;
      case EmotionalState.TIRED: return <Coffee className="w-5 h-5 text-blue-500" />;
      case EmotionalState.OVERWHELMED: return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default: return <Smile className="w-5 h-5 text-slate-400" />;
    }
  };

  const getMoodBg = (state: EmotionalState) => {
    switch (state) {
      case EmotionalState.OKAY: return 'bg-emerald-50 dark:bg-emerald-900/20';
      case EmotionalState.LOW: return 'bg-indigo-50 dark:bg-indigo-900/20';
      case EmotionalState.ANXIOUS: return 'bg-amber-50 dark:bg-amber-900/20';
      case EmotionalState.TIRED: return 'bg-blue-50 dark:bg-blue-900/20';
      case EmotionalState.OVERWHELMED: return 'bg-rose-50 dark:bg-rose-900/20';
      default: return 'bg-slate-50 dark:bg-slate-800';
    }
  };

  const recentMoods = [...(profile.moodHistory || [])]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full shadow-inner">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">The Anchor Hub</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xl font-medium max-w-2xl">
            Coordinating care for <span className="text-blue-600 font-black">Hero Patient</span>. You aren't alone in this journey.
          </p>
        </div>
        
        <button 
          onClick={() => setShowEmergencyModal(true)}
          className="px-8 py-5 bg-rose-600 text-white rounded-full font-black shadow-2xl flex items-center gap-4 text-lg hover:bg-rose-700 hover:scale-105 transition-all border-4 border-rose-500"
        >
          <ShieldAlert className="w-7 h-7" /> Emergency Mode
        </button>
      </header>

      <CareFocusCard t={t} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-10">
          <section className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border-4 border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Your Capacity</h3>
                <div className={`p-3 rounded-2xl ${currentCapacity.color} text-white shadow-lg`}>
                  <Battery className="w-6 h-6" />
                </div>
             </div>
             <div className="space-y-6">
                <div className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-700 p-1.5">
                   <div className={`h-full ${currentCapacity.color} rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${currentCapacity.percent}%` }} />
                </div>
                <div className="space-y-2">
                   <p className="text-3xl font-black text-black dark:text-white tracking-tight">{currentCapacity.text}</p>
                   <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">"{currentCapacity.desc}"</p>
                </div>
                <button 
                  onClick={() => setIsMoodModalOpen(true)}
                  className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all border-2 border-dashed border-slate-200 dark:border-slate-700"
                >
                   <Plus className="w-4 h-4" /> Update My Capacity Level
                </button>
             </div>
          </section>

          <section className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-10 rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden border-4 border-slate-100 dark:border-slate-800">
             <div className="absolute top-0 right-0 p-4 opacity-5"><Users className="w-24 h-24" /></div>
             <div className="flex items-center justify-between relative z-10">
                <h3 className="text-2xl font-black tracking-tight">Care Network</h3>
                <button onClick={() => setShowNetworkModal(true)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all">
                  <Plus className="w-5 h-5" />
                </button>
             </div>
             <div className="space-y-4 relative z-10">
                {profile.careNetwork?.map(member => (
                   <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 transition-all group">
                      <div className="flex items-center gap-4">
                         <div className={`w-3 h-3 rounded-full ${member.onDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}`} />
                         <div>
                            <p className="font-black text-sm text-slate-900 dark:text-white">{member.name}</p>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{member.role}</p>
                         </div>
                      </div>
                      <a href={`tel:${member.phone}`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                         <Phone className="w-4 h-4" />
                      </a>
                   </div>
                ))}
                {(!profile.careNetwork || profile.careNetwork.length === 0) && (
                   <p className="text-slate-400 font-bold italic py-4">No team members added yet.</p>
                )}
             </div>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-10">
           <section className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-4 border-slate-100 dark:border-slate-800 shadow-xl space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-3xl"><Calendar className="w-8 h-8" /></div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Daily Command</h3>
                </div>
                <Link to="/reminders" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:underline">Full Schedule</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 px-2 flex items-center gap-2">
                       <Pill className="w-4 h-4" /> Clinical Priorities
                    </h4>
                    <div className="space-y-3">
                       {profile.reminders?.filter(r => r.category === 'CLINICAL' && !r.completed).slice(0, 3).map(r => (
                          <div key={r.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-slate-100 dark:border-slate-700 flex items-center gap-4">
                             <Clock className="w-5 h-5 text-blue-400" />
                             <div className="flex-1">
                                <p className="font-black text-slate-800 dark:text-white leading-none">{r.title}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase mt-1">{r.time}</p>
                             </div>
                          </div>
                       ))}
                       {(!profile.reminders || profile.reminders.filter(r => r.category === 'CLINICAL' && !r.completed).length === 0) && (
                         <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-xs font-bold text-slate-400">No pending clinical tasks.</p>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 px-2 flex items-center gap-2">
                       <Heart className="w-4 h-4" /> Supporting the Anchor
                    </h4>
                    <div className="space-y-3">
                       <CaregiverTipCard title="Nutritional Strategy" desc="Prepare high-protein soft foods for post-chemo days." icon={<Sparkles />} />
                       <CaregiverTipCard title="Legal/Financial" desc="Review Ayushman Bharat eligibility docs this evening." icon={<BookOpen />} />
                    </div>
                 </div>
              </div>
           </section>

           <section className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-4 border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl"><TrendingUp className="w-8 h-8" /></div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Patient Mood Trends</h3>
                </div>
                <button 
                  onClick={() => setIsPatientMoodModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                >
                   <Plus className="w-4 h-4" /> Log Patient Mood
                </button>
              </div>
              
              <div className="relative pt-10">
                {/* Visual Timeline Connector */}
                <div className="absolute left-10 top-0 bottom-0 w-1 bg-slate-50 dark:bg-slate-800 hidden md:block" />

                <div className="space-y-6">
                   {recentMoods.length > 0 ? recentMoods.map((entry, idx) => (
                      <div key={idx} className={`relative flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-[3rem] border-2 border-transparent transition-all hover:shadow-xl hover:border-slate-50 dark:hover:border-slate-800 ${getMoodBg(entry.state)}`}>
                         <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-lg flex items-center justify-center shrink-0">
                            {getMoodIcon(entry.state)}
                         </div>
                         <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                               <p className="font-black text-2xl text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{entry.state}</p>
                               <span className="px-4 py-1.5 bg-white/50 dark:bg-black/20 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  {new Date(entry.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                               </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg italic">
                               "{entry.note || 'No specific observation note for this cycle.'}"
                            </p>
                         </div>
                      </div>
                   )) : (
                      <div className="py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                         <Smile className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
                         <p className="text-2xl font-black text-slate-300 dark:text-slate-600 italic">No patient mood history recorded yet.</p>
                      </div>
                   )}
                </div>
              </div>
              
              {recentMoods.length > 0 && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-8 rounded-[3rem] border-2 border-indigo-100 dark:border-indigo-800 flex items-start gap-6">
                   <Info className="w-8 h-8 text-indigo-500 shrink-0 mt-1" />
                   <div className="space-y-2">
                     <h4 className="font-black text-indigo-900 dark:text-white uppercase text-xs tracking-widest">Caregiver Strategy</h4>
                     <p className="text-lg text-indigo-800 dark:text-indigo-100 font-medium leading-relaxed">
                       Consistency in mood tracking helps the JNMCH team adjust palliative cycles. Use these trends as a discussion point for your next clinical visit.
                     </p>
                   </div>
                </div>
              )}
           </section>

           <section className="bg-indigo-600 text-white p-12 rounded-[4rem] shadow-2xl flex flex-col md:flex-row items-center gap-10 border-8 border-indigo-500 overflow-hidden relative">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="p-6 bg-white/10 rounded-[3rem] border border-white/20 shadow-inner shrink-0 backdrop-blur-md">
                 <BrainCircuit className="w-16 h-16 text-white" />
              </div>
              <div className="space-y-6 flex-1 text-center md:text-left relative z-10">
                 <h3 className="text-4xl font-black tracking-tighter leading-none">AI Care Mentor</h3>
                 <p className="text-xl font-bold text-indigo-100 italic">
                    "I noticed the patient had high nausea scores yesterday. Today, prioritize small, cold snacks over heavy meals."
                 </p>
                 <Link to="/companion" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all">
                    Consult Mentor <MessageCircle className="w-5 h-5" />
                 </Link>
              </div>
           </section>
        </div>
      </div>

      <MoodCheckIn 
        isOpen={isMoodModalOpen} 
        onClose={() => setIsMoodModalOpen(false)} 
        onSelect={handleMoodUpdate} 
        isChild={false} 
      />

      <MoodCheckIn 
        isOpen={isPatientMoodModalOpen} 
        onClose={() => setIsPatientMoodModalOpen(false)} 
        onSelect={handlePatientMoodUpdate} 
        isChild={false} 
      />

      {showNetworkModal && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl p-10 space-y-8">
              <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Expand Care Team</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddTeamMember({
                  name: formData.get('name') as string,
                  phone: formData.get('phone') as string,
                  role: formData.get('role') as any,
                  onDuty: false
                });
              }} className="space-y-4">
                 <input name="name" required placeholder="Member Name" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold outline-none focus:border-blue-400 text-slate-900 dark:text-white" />
                 <input name="phone" required placeholder="Phone Number" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold outline-none focus:border-blue-400 text-slate-900 dark:text-white" />
                 <select name="role" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold outline-none focus:border-blue-400 text-slate-900 dark:text-white">
                    <option value="LOGISTICS">Logistics (Driving/Errands)</option>
                    <option value="CLINICAL">Clinical (Meds/Reports)</option>
                    <option value="EMOTIONAL">Emotional Support</option>
                    <option value="BACKUP">Backup Primary Care</option>
                 </select>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowNetworkModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black rounded-2xl">Cancel</button>
                    <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg">Add Member</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {showEmergencyModal && (
        <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-rose-600/90 backdrop-blur-2xl animate-in zoom-in-95">
           <div className="relative w-full max-w-xl bg-white rounded-[4rem] shadow-2xl p-12 space-y-10 border-8 border-white/20">
              <div className="text-center space-y-4">
                 <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse">
                    <AlertTriangle className="w-12 h-12" />
                 </div>
                 <h2 className="text-5xl font-black tracking-tighter text-slate-900">Emergency Protocol</h2>
                 <p className="text-slate-600 font-medium text-lg leading-relaxed px-6">Follow these steps exactly. We have alerted your care network.</p>
              </div>

              <div className="space-y-4">
                 <EmergencyStep text="Check Airway & Breathing" />
                 <EmergencyStep text="Grab the 'RED' Medical Folder (Reports + IDs)" />
                 <EmergencyStep text="Take all active medications in a bag" />
                 <EmergencyStep text="Call JNMCH Oncology Desk: 0571-2700921" />
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                 <a href="tel:112" className="w-full py-6 bg-rose-600 text-white font-black text-2xl rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 hover:bg-rose-700 transition-all border-b-8 border-rose-800">
                    <Phone className="w-8 h-8" /> CALL 112 NOW
                 </a>
                 <button onClick={() => setShowEmergencyModal(false)} className="w-full py-5 bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs rounded-2xl">
                    False Alarm / Safe Now
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const CaregiverTipCard = ({ title, desc, icon }: any) => (
  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-900/30 rounded-[2.5rem] flex items-start gap-5 transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/20 group">
     <div className="p-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
     </div>
     <div>
        <p className="font-black text-slate-900 dark:text-white leading-tight mb-1">{title}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{desc}</p>
     </div>
  </div>
);

const EmergencyStep = ({ text }: { text: string }) => (
  <div className="flex gap-6 items-center p-6 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 group transition-all hover:border-rose-200 hover:bg-rose-50/50">
     <div className="w-8 h-8 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:border-rose-500 group-hover:text-rose-600 transition-all shrink-0">
        <CheckCircle2 className="w-4 h-4" />
     </div>
     <p className="text-xl font-black text-slate-800">{text}</p>
  </div>
);

export default CaregiverDashboard;
