import React, { useState } from 'react';
import { UserProfile, AppLanguage, AppTheme } from '../types';
import { 
  Bell, Languages, LogOut, FileJson, ArrowRight, X, Trash2, ShieldCheck, ToggleLeft, ToggleRight, Sun, Moon, HelpCircle, FileText, Activity, CheckCircle2, AlertTriangle, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
}

const SettingsView: React.FC<Props> = ({ profile, onUpdate, onLogout }) => {
  const notifications = profile.notificationSettings || {
    daily: true,
    updates: true,
    buddy: true,
    supportGroups: true,
    docUploads: true,
    campaignUpdates: true,
    emotionalCheckins: true,
    caregiverFollowups: true,
    emailEnabled: true
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    const newSettings = { ...notifications, [key]: !notifications[key] };
    onUpdate({ notificationSettings: newSettings });
  };
  
  const cycleLanguage = () => {
    const langs = [AppLanguage.ENGLISH, AppLanguage.HINDI, AppLanguage.URDU, AppLanguage.TELUGU];
    const nextIdx = (langs.indexOf(profile.language) + 1) % langs.length;
    onUpdate({ language: langs[nextIdx] });
  };

  const toggleTheme = () => {
    const newTheme = profile.theme === AppTheme.DARK ? AppTheme.LIGHT : AppTheme.DARK;
    if (newTheme === AppTheme.DARK) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
    onUpdate({ theme: newTheme });
  };

  const exportData = () => {
    const data = {
      profile: profile,
      exportedAt: new Date().toISOString(),
      source: "LifePal Sanctuary",
      clinical_logs: profile.moodHistory || [],
      reminders: profile.reminders || [],
      saved_resources: profile.savedResources || []
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifepal_sanctuary_export_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    const warning = profile.language === AppLanguage.HINDI 
      ? "चेतावनी: यह आपकी सभी जानकारी को स्थायी रूप से हटा देगा। क्या आप जारी रखना चाहते हैं?"
      : "CRITICAL WARNING: This will permanently delete all clinical logs, documents, settings, and hero progress. This action is irreversible. Proceed?";
    
    if (window.confirm(warning)) {
      // Complete wipe of all local storage keys
      localStorage.clear();
      
      // Trigger the global logout flow which clears React state and redirects
      onLogout();
      
      // Force a hard reload to ensure a clean slate across all context providers
      window.location.href = '/';
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 text-left pb-32 px-4 md:px-0 animate-in fade-in duration-500">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-blue-950 dark:text-white leading-none">Settings</h1>
        <p className="text-xl text-slate-700 dark:text-slate-400 font-medium">Manage your sanctuary preferences and clinical data.</p>
      </div>
      
      <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <SettingField label="Full Name" value={profile.name} onChange={(v: string) => onUpdate({name: v})} />
              <SettingField label="Cancer Type" value={profile.cancerType || ''} placeholder="e.g. Lymphoma" onChange={(v: string) => onUpdate({cancerType: v})} />
           </div>
           
           <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-400 mb-6">
                 <ShieldCheck className="w-6 h-6" />
                 <span className="font-black uppercase text-[10px] tracking-widest">Privacy Guard Active</span>
              </div>
              <p className="text-slate-900 dark:text-slate-300 font-medium leading-relaxed">
                Your data is stored 100% locally on this device. We do not sync clinical logs to our servers unless you manually vault them for institutional sharing.
              </p>
           </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <PreferenceCard icon={<Languages />} title="Display Language" current={profile.language.toUpperCase()} onClick={cycleLanguage} />
           <PreferenceCard 
             icon={profile.theme === AppTheme.DARK ? <Moon /> : <Sun />} 
             title="Appearance" 
             current={profile.theme === AppTheme.DARK ? "Dark Mode" : "Light Mode"} 
             onClick={toggleTheme} 
           />
      </div>

      <section className="space-y-6">
        <h3 className="text-xs font-black text-blue-950 dark:text-blue-400 uppercase tracking-widest px-4">Notification Preferences</h3>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 p-8 space-y-6 shadow-xl">
           <NotificationToggle label="Daily Reminders" desc="Clinical and habit nudges" active={notifications.daily || false} onToggle={() => toggleNotification('daily')} />
           <NotificationToggle label="App Updates" desc="New features and content" active={notifications.updates || false} onToggle={() => toggleNotification('updates')} />
           <NotificationToggle label="Buddy Messages" desc="Encouragement from your AI companion" active={notifications.buddy || false} onToggle={() => toggleNotification('buddy')} />
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xs font-black text-blue-950 dark:text-blue-400 uppercase tracking-widest px-4">About & Trust</h3>
        <Link to="/transparency" className="block p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl group hover:border-blue-100 transition-all">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="font-black text-slate-900 dark:text-white text-lg">Transparency & Ethics Center</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">How we handle your data</p>
                 </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-50 transition-colors" />
           </div>
        </Link>
      </section>

      <section className="space-y-6">
        <h3 className="text-xs font-black text-blue-950 dark:text-blue-400 uppercase tracking-widest px-4">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={exportData}
            className="p-8 bg-blue-950 text-white rounded-[2rem] shadow-xl flex items-center justify-between group hover:bg-black transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/20 rounded-xl"><FileJson className="w-6 h-6 text-blue-300" /></div>
              <div className="text-left">
                <p className="font-black text-lg">Export Data</p>
                <p className="text-[10px] font-bold text-blue-300 uppercase">Download JSON archive</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          <button 
            onClick={onLogout}
            className="p-8 bg-white border-4 border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-blue-950 dark:text-white rounded-[2rem] shadow-xl flex items-center justify-between group hover:border-rose-200 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl text-rose-500"><LogOut className="w-6 h-6" /></div>
              <div className="text-left">
                <p className="font-black text-lg">Log Out</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">End Session</p>
              </div>
            </div>
          </button>
        </div>
        
        <div className="pt-10">
          <button 
            onClick={clearAllData}
            className="w-full p-8 flex flex-col items-center justify-center gap-4 text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-[3rem] border-4 border-dashed border-rose-100 dark:border-rose-900 shadow-xl hover:bg-rose-600 hover:text-white transition-all group"
          >
            <Trash2 className="w-12 h-12 group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <span className="font-black uppercase text-xl tracking-tighter block">Reset Application & Delete Data</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">This action is permanent and clears all local logs.</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

const SettingField = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-400 font-bold text-slate-900 dark:text-white transition-all"
    />
  </div>
);

const PreferenceCard = ({ icon, title, current, onClick }: any) => (
  <button 
    onClick={onClick}
    className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-4 border-slate-50 dark:border-slate-800 shadow-xl flex items-center justify-between group hover:border-blue-100 dark:hover:border-blue-900 transition-all"
  >
    <div className="flex items-center gap-6">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div className="text-left">
        <p className="font-black text-slate-900 dark:text-white text-lg">{title}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{current}</p>
      </div>
    </div>
    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
    </div>
  </button>
);

const NotificationToggle = ({ label, desc, active, onToggle }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors">
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
        <Bell className="w-5 h-5" />
      </div>
      <div>
        <p className="font-black text-slate-900 dark:text-white text-sm">{label}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{desc}</p>
      </div>
    </div>
    <button onClick={onToggle} className={`text-3xl transition-colors ${active ? 'text-blue-600' : 'text-slate-300'}`}>
      {active ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
    </button>
  </div>
);

export default SettingsView;