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

  // 1-Click Instant Admin Login
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
    }, 250);
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
    <div className="min-h-screen w-full bg-[#07090e] bg-[radial-gradient(ellipse_100%_100%_at_50%_-10%,rgba(212,175,55,0.18),rgba(7,9,14,0.98))] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#b8860b] via-[#f1d282] to-[#d4af37] text-slate-950 font-black text-2xl shadow-[0_0_35px_rgba(212,175,55,0.45)] border border-amber-200/80 mb-3">
            H
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hanzie Management
          </h1>
          <p className="text-xs text-amber-400 font-mono tracking-wider uppercase mt-1">
            Enterprise Cloud Workspace
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full bg-[#0f1422]/95 backdrop-blur-2xl border border-amber-500/25 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative">
          
          {/* Segmented Auth Tabs */}
          <div className="flex bg-[#070a12] p-1.5 rounded-2xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setFeedback(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setFeedback(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* 1-Click Fast Admin Login Banner */}
          {mode === 'signin' && (
            <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-amber-300">Default Admin Credentials</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">admin@gmail.com &bull; Hanzie46@</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstantAdminLogin}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shrink-0 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] disabled:opacity-50 cursor-pointer"
              >
                ⚡ 1-Click
              </button>
            </div>
          )}

          {/* Feedback Banner */}
          {feedback && (
            <div className={`p-3.5 rounded-2xl mb-5 text-xs font-semibold flex items-start gap-2.5 border ${
              feedback.type === 'success'
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/50'
                : 'bg-rose-950/50 text-rose-300 border-rose-500/50'
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
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full bg-[#070a12] border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Account Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#070a12] border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black py-3.5 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.45)] flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                <span>{isLoading ? 'Verifying...' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bilal Ahmed"
                    className="w-full bg-[#070a12] border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. bilal@hanzie.com"
                    className="w-full bg-[#070a12] border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Set Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    className="w-full bg-[#070a12] border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selector Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Select Your Workspace Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {roleList.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-sm'
                            : 'bg-[#070a12] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <span className="text-xs font-bold block truncate">{r.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Contact Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#070a12] border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
                  />
                </div>
              </div>

              {/* Submit Sign Up */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black py-3.5 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.45)] flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Bottom Status Pill */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Persistent Storage'}</span>
            </span>
            <span className="font-mono text-slate-500">v2.4 Production</span>
          </div>

        </div>
      </div>
    </div>
  );
}
