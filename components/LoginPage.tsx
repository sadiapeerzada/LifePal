import React, { useState } from 'react';
import { Mail, Lock, LogIn, Chrome, UserCheck, Loader2 } from 'lucide-react';

interface Props {
  onLogin: (email: string, isGuest: boolean) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loadingType, setLoadingType] = useState<'GOOGLE' | 'GUEST' | 'EMAIL' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setLoadingType('EMAIL');
      setTimeout(() => onLogin(email, false), 1000);
    }
  };

  const handleGoogleLogin = () => {
    setLoadingType('GOOGLE');
    // Simulate OAuth handshake
    setTimeout(() => {
      onLogin('hero.user@gmail.com', false);
    }, 1800);
  };

  const handleGuestLogin = () => {
    setLoadingType('GUEST');
    setTimeout(() => onLogin('guest', true), 800);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6 selection:bg-blue-100 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-blue-50 dark:border-slate-800 p-10 md:p-12 space-y-8 animate-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-100 dark:shadow-none mx-auto mb-8 transition-transform hover:rotate-6">
            <LogIn className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Welcome Back.</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Step into your digital sanctuary.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 outline-none transition-all font-bold dark:text-white"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="password" 
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 outline-none transition-all font-bold dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!!loadingType}
            className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loadingType === 'EMAIL' ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
            {loadingType === 'EMAIL' ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]"><span className="bg-white dark:bg-slate-900 px-4 text-slate-300 font-black">Or Secure Entry</span></div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={!!loadingType}
            className="w-full flex items-center justify-center gap-4 p-5 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-100 active:scale-[0.98] transition-all font-black text-slate-700 dark:text-white shadow-sm disabled:opacity-50"
          >
            {loadingType === 'GOOGLE' ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-lg tracking-tight">
              {loadingType === 'GOOGLE' ? 'Connecting...' : 'Sign in with Google'}
            </span>
          </button>
          
          <button 
            onClick={handleGuestLogin}
            disabled={!!loadingType}
            className="w-full flex items-center justify-center gap-3 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-all font-black text-slate-500 dark:text-slate-400 disabled:opacity-50"
          >
            {loadingType === 'GUEST' ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCheck className="w-5 h-5" />}
            <span className="text-sm tracking-widest uppercase">Continue as Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;