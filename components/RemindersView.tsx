
import React, { useState } from 'react';
import { Reminder } from '../types';
import { 
  Bell, Plus, CheckCircle2, Circle, Clock, Trash2, Pill, Calendar, 
  Droplets, Moon, X, Trophy, HeartHandshake, Coffee, Cloud, Sparkles, MessageCircle, BookOpen, Stethoscope
} from 'lucide-react';

interface Props {
  reminders: Reminder[];
  onUpdate: (reminders: Reminder[]) => void;
  isChild: boolean;
  onHabitXP: (xp: number) => void;
}

const RemindersView: React.FC<Props> = ({ reminders, onUpdate, isChild, onHabitXP }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newType, setNewType] = useState<Reminder['type']>('MEDICINE');
  const [category, setCategory] = useState<'CLINICAL' | 'GENTLE'>('CLINICAL');

  const addReminder = () => {
    if (!newTitle || !newTime) return;
    onUpdate([...reminders, { 
      id: Math.random().toString(36).substr(2, 9), 
      title: newTitle, 
      time: newTime, 
      type: newType, 
      completed: false,
      category
    }]);
    setShowAdd(false);
    setNewTitle('');
    setNewTime('');
  };

  const toggleReminder = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder && !reminder.completed && isChild) {
      onHabitXP(50);
    }
    onUpdate(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const clinicalReminders = reminders.filter(r => r.category === 'CLINICAL');
  const gentleReminders = reminders.filter(r => r.category === 'GENTLE');

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 text-left pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter leading-none text-blue-600 dark:text-blue-400">{isChild ? "Hero Quests" : "Daily Rhythms"}</h1>
          <p className="text-slate-500 text-xl font-medium">
            {isChild ? "Finish tasks to earn magic XP!" : "Balanced support for your clinical path and emotional well-being."}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-2xl shadow-blue-100 flex items-center gap-4 text-lg hover:bg-blue-700 hover:scale-105 transition-all">
          <Plus className="w-6 h-6" /> {isChild ? "Add Quest" : "Add Rhythm"}
        </button>
      </header>

      {reminders.length === 0 ? (
        <div className="py-32 text-center bg-slate-50 dark:bg-slate-900 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
           <Bell className="w-20 h-20 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
           <p className="text-2xl font-black text-slate-300 dark:text-slate-600">Your path is clear today. Rest well!</p>
        </div>
      ) : (
        <div className="space-y-12">
          {clinicalReminders.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white px-4 flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-blue-600" /> Clinical Path
              </h3>
              <div className="space-y-4">
                {clinicalReminders.sort((a, b) => a.time.localeCompare(b.time)).map(r => (
                  <ReminderItem key={r.id} r={r} onToggle={toggleReminder} onRemove={(id: string) => onUpdate(reminders.filter(rem => rem.id !== id))} isChild={isChild} />
                ))}
              </div>
            </section>
          )}

          {gentleReminders.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white px-4 flex items-center gap-3">
                <Cloud className="w-6 h-6 text-indigo-400" /> Gentle Support
              </h3>
              <div className="space-y-4">
                {gentleReminders.sort((a, b) => a.time.localeCompare(b.time)).map(r => (
                  <ReminderItem key={r.id} r={r} onToggle={toggleReminder} onRemove={(id: string) => onUpdate(reminders.filter(rem => rem.id !== id))} isChild={isChild} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-10 space-y-10 animate-in zoom-in-95">
             <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add to your Rhythm</h3>
             
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setCategory('CLINICAL')}
                    className={`p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${category === 'CLINICAL' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 bg-slate-50 text-slate-400 dark:bg-slate-800'}`}
                  >
                    Clinical Task
                  </button>
                  <button 
                    onClick={() => setCategory('GENTLE')}
                    className={`p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${category === 'GENTLE' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 bg-slate-50 text-slate-400 dark:bg-slate-800'}`}
                  >
                    Gentle Rhythm
                  </button>
                </div>

                <div className="space-y-4">
                   <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-400 dark:text-white font-bold" placeholder="Task name..." />
                   <div className="flex gap-4">
                      <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="flex-1 p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black dark:text-white" />
                      <select 
                        value={newType} 
                        onChange={e => setNewType(e.target.value as any)}
                        className="w-40 p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black outline-none dark:text-white"
                      >
                         <option value="SUPPORT_GROUP">Group</option>
                         <option value="CHECKIN">Check-in</option>
                         <option value="JOURNAL">Journal</option>
                         <option value="MEDICINE">Clinical</option>
                         <option value="REST">Rest</option>
                      </select>
                   </div>
                </div>

                <button onClick={addReminder} className="w-full py-6 bg-blue-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                  Set Rhythm
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReminderItem = ({ r, onToggle, onRemove, isChild }: any) => (
  <div className={`p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 shadow-xl flex items-center gap-8 transition-all ${r.completed ? 'border-emerald-100 opacity-60' : 'border-blue-50 dark:border-slate-800 hover:border-blue-100 hover:shadow-2xl'}`}>
    <button onClick={() => onToggle(r.id)} className="shrink-0 transition-transform active:scale-90">
      {r.completed ? <CheckCircle2 className="w-12 h-12 text-emerald-500 fill-emerald-50" /> : <Circle className="w-12 h-12 text-slate-200 dark:text-slate-700" />}
    </button>
    <div className="flex-1 space-y-1 text-left">
      <h3 className={`text-2xl font-black leading-tight ${r.completed ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{r.title}</h3>
      <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">
        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {r.time}</span>
        <span className="flex items-center gap-1.5"><ReminderIcon type={r.type} /> {r.type.replace('_', ' ')}</span>
      </div>
    </div>
    {r.completed && isChild && <div className="p-4 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center gap-2 font-black text-xs uppercase"><Trophy className="w-4 h-4" /> +50 XP</div>}
    <button onClick={() => onRemove(r.id)} className="p-4 text-slate-200 dark:text-slate-700 hover:text-rose-600 transition-colors"><Trash2 className="w-6 h-6" /></button>
  </div>
);

const ReminderIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'MEDICINE': return <Pill className="w-3 h-3" />;
    case 'SUPPORT_GROUP': return <HeartHandshake className="w-3 h-3" />;
    case 'CHECKIN': return <Sparkles className="w-3 h-3" />;
    case 'JOURNAL': return <BookOpen className="w-3 h-3" />;
    case 'REST': return <Moon className="w-3 h-3" />;
    case 'WATER': return <Droplets className="w-3 h-3" />;
    default: return <Bell className="w-3 h-3" />;
  }
};

export default RemindersView;
