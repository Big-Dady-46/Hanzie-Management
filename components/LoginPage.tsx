'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { 
  Lock, Mail, User as UserIcon, Phone, ShieldCheck, 
  Sparkles, Eye, EyeOff, ArrowRight, CheckCircle2, 
  AlertCircle, KeyRound, Check, Laptop, Palette, Bug, UserCheck, Users
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const { loginUser, signupUser } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up fields
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('developer');
  const [phone, setPhone] = useState('');

  // UI state
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1-Click Fast Admin Login
  const handleInstantAdminLogin = () => {
    setIsLoading(true);
    setFeedback(null);
    setLoginEmail('admin@gmail.com');
    setLoginPassword('Hanzie46@');
    setTimeout(() => {
      const res = loginUser('admin@gmail.com', 'Hanzie46@');
      if (!res.success) {
        setFeedback({ type: 'error', message: res.message });
      }
      setIsLoading(false);
    }, 200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setFeedback({ type: 'error', message: 'Please enter both your email and password.' });
      setIsLoading(false);
      return;
    }

    const res = loginUser(loginEmail, loginPassword);
    if (!res.success) {
      setFeedback({ type: 'error', message: res.message });
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    if (!name.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setFeedback({ type: 'error', message: 'Full name, email, and password are required.' });
      setIsLoading(false);
      return;
    }

    let department = 'Development';
    if (role === 'designer') department = 'Design';
    if (role === 'qa') department = 'Quality Assurance';
    if (role === 'support_cleaner') department = 'Office & Maintenance';
    if (role === 'client') department = 'Clients';
    if (role === 'leader') department = 'Leadership';

    const res = signupUser({
      name,
      email: signupEmail,
      password: signupPassword,
      role,
      department,
      phone,
    });

    if (!res.success) {
      setFeedback({ type: 'error', message: res.message });
      setIsLoading(false);
    }
  };

  const roleList: { id: UserRole; title: string; icon: any }[] = [
    { id: 'leader', title: 'Leader (Admin)', icon: ShieldCheck },
    { id: 'developer', title: 'Developer', icon: Laptop },
    { id: 'designer', title: 'UI/UX Designer', icon: Palette },
    { id: 'qa', title: 'QA Engineer', icon: Bug },
    { id: 'support_cleaner', title: 'Support / Staff', icon: UserCheck },
    { id: 'client', title: 'Client Portal', icon: Users },
  ];

  return (
    <div className="min-h-screen w-full bg-[#080a10] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[420px] z-10 flex flex-col items-center">
        
        {/* Loading Screen Signature Logo (Identical to Loading Screen) */}
        <div className="flex flex-col items-center justify-center mb-6 select-none">
          {/* Top Roof with Chimney */}
          <div className="w-[190px] h-7">
            <svg viewBox="0 0 380 90" fill="none" className="w-full h-full drop-shadow-[0_2px_8px_rgba(217,119,6,0.4)]">
              <defs>
                <linearGradient id="loginRoofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="35%" stopColor="#fde047" />
                  <stop offset="65%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>
              <path
                d="M 20 85 L 145 14 L 205 38 L 205 24 L 245 24 L 245 54 L 325 85"
                stroke="url(#loginRoofGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 28 85 L 145 22 L 200 44 L 200 30 L 238 30 L 238 58 L 318 85"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeOpacity="0.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Letters H A N Z E I */}
          <div className="relative flex items-center justify-center py-0.5">
            {['H', 'A', 'N', 'Z', 'E', 'I'].map((char) => (
              <div key={char} className="relative inline-block mx-1">
                <span
                  className="text-3xl sm:text-4xl font-bold tracking-wider leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#f59e0b] to-[#b45309] drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]"
                  style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
                >
                  {char}
                </span>
                {char === 'I' && (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-700 shadow-[0_0_6px_#fbbf24]" />
                )}
              </div>
            ))}
          </div>

          {/* Underline & Z Swoosh */}
          <div className="w-[200px] h-3.5 -mt-1">
            <svg viewBox="0 0 420 40" fill="none" className="w-full h-full drop-shadow-[0_1px_6px_rgba(217,119,6,0.3)]">
              <defs>
                <linearGradient id="loginSwooshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ca8a04" />
                  <stop offset="40%" stopColor="#fde047" />
                  <stop offset="80%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
              </defs>
              <line x1="75" y1="8" x2="215" y2="8" stroke="url(#loginSwooshGrad)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 215 8 Q 285 10 345 22 Q 390 28 415 14" stroke="url(#loginSwooshGrad)" strokeWidth="4" strokeLinecap="round" />
              <line x1="80" y1="7" x2="210" y2="7" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
              <path d="M 218 7 Q 285 9 345 21" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
            </svg>
          </div>

          {/* Subtitle */}
          <div className="mt-1 text-[11px] font-mono tracking-[0.34em] uppercase text-slate-400 font-medium">
            SOFTWARE HOUSE
          </div>
        </div>

        {/* Refined Glass Auth Card */}
        <div className="w-full bg-[#0d101a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative">
          
          {/* Subtle Mode Switcher */}
          <div className="flex bg-[#070911] p-1 rounded-xl border border-white/5 mb-5">
            <button
              type="button"
              onClick={() => { setMode('signin'); setFeedback(null); }}
              className={`flex-1 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 font-normal'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 opacity-80" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setFeedback(null); }}
              className={`flex-1 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 font-normal'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 opacity-80" />
              <span>Create Account</span>
            </button>
          </div>

          {/* 1-Click Fast Admin Login Banner */}
          {mode === 'signin' && (
            <div className="mb-4.5 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-amber-300">Default Admin</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">admin@gmail.com &bull; Hanzie46@</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstantAdminLogin}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-amber-400/90 hover:bg-amber-300 text-slate-950 text-xs font-medium shrink-0 transition-all cursor-pointer disabled:opacity-50"
              >
                1-Click Login
              </button>
            </div>
          )}

          {/* Feedback Alert */}
          {feedback && (
            <div className={`p-3 rounded-xl mb-4 text-xs font-normal flex items-start gap-2 border ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{feedback.message}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-normal text-slate-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full bg-[#070911] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 font-normal transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#070911] border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 font-normal transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-medium py-2.5 sm:py-3 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                <span>{isLoading ? 'Verifying...' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-normal text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bilal Ahmed"
                    className="w-full bg-[#070911] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 font-normal transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-slate-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. bilal@hanzie.com"
                    className="w-full bg-[#070911] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 font-normal transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#070911] border border-white/10 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 font-normal transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selector Grid */}
              <div>
                <label className="block text-xs font-normal text-slate-400 mb-1">
                  Workspace Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {roleList.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`p-2 rounded-lg border text-left transition-all flex items-center justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-medium'
                            : 'bg-[#070911] border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200 font-normal'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                          <span className="text-[11px] truncate">{r.title}</span>
                        </div>
                        {isSelected && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-slate-400 mb-1">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#070911] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 font-normal transition-all"
                  />
                </div>
              </div>

              {/* Submit Sign Up */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-medium py-2.5 sm:py-3 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Bottom Status */}
          <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-normal">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isSupabaseConfigured ? 'Supabase Cloud Connected' : 'Persistent Cloud Storage'}</span>
            </span>
            <span className="font-mono text-slate-600">v2.4</span>
          </div>

        </div>
      </div>
    </div>
  );
}
