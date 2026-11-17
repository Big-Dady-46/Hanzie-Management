'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { 
  Lock, Mail, User as UserIcon, Phone, ShieldCheck, 
  Sparkles, Eye, EyeOff, ArrowRight, CheckCircle2, 
  AlertCircle, Briefcase, Database, KeyRound, Zap,
  Layers, Activity, Users, Check, Clock, Laptop, Palette, Bug, UserCheck
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

  const roleList: { id: UserRole; title: string; desc: string; icon: any }[] = [
    { id: 'leader', title: 'Leader / CEO', desc: 'Full administration & payroll control', icon: ShieldCheck },
    { id: 'developer', title: 'Developer', desc: 'Sprint tasks, git workflow, hazari', icon: Laptop },
    { id: 'designer', title: 'UI/UX Designer', desc: 'Design systems, prototyping & assets', icon: Palette },
    { id: 'qa', title: 'QA Engineer', desc: 'Quality assurance, bugs & staging', icon: Bug },
    { id: 'support_cleaner', title: 'Support / Staff', desc: 'Office maintenance & day-to-day', icon: UserCheck },
    { id: 'client', title: 'Client Portal', desc: 'Project milestones & invoice ledger', icon: Users },
  ];

  return (
    <div className="min-h-screen w-full bg-[#07090e] bg-[radial-gradient(ellipse_100%_100%_at_50%_-10%,rgba(212,175,55,0.18),rgba(7,9,14,0.98))] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Dynamic Background Ambient Light Gradients */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Luxury Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        
        {/* LEFT COLUMN: Premium SaaS Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-4">
          {/* Logo & Headline */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Software House Operating System</span>
            </div>

            <div className="flex items-center gap-3.5 pt-2">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#b8860b] via-[#e6ca65] to-[#d4af37] text-slate-950 font-black text-2xl flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.45)] border border-amber-200">
                H
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Hanzie Management
                </h1>
                <p className="text-xs text-amber-400/90 font-mono uppercase tracking-widest">
                  Enterprise Cloud Workspace
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
              Complete operational control for modern software agencies: real-time team attendance, automatic monthly payroll, sprint kanban boards, and branded client portals.
            </p>
          </div>

          {/* Interactive Feature Bento Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-amber-500/40 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Hazari & Time-Tracker</h4>
              <p className="text-xs text-slate-400 mt-1">
                One-tap clock-in, break recording, and daily checkout reports.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-amber-500/40 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Automated Payroll</h4>
              <p className="text-xs text-slate-400 mt-1">
                Cycle calculation with deductions, allowances & instant vouchers.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-amber-500/40 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Sprint Kanban Tasks</h4>
              <p className="text-xs text-slate-400 mt-1">
                Multi-project tracking with drag status and priority tags.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-amber-500/40 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Database className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Live Supabase Sync</h4>
              <p className="text-xs text-slate-400 mt-1">
                Real-time cloud database syncing with persistent offline storage.
              </p>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/60">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[10px] border-2 border-slate-900">AH</div>
              <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-[10px] border-2 border-slate-900">HZ</div>
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px] border-2 border-slate-900">QA</div>
            </div>
            <span>Built by Abdul Hannan for High-Growth Software Agencies</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Luxury Auth Card */}
        <div className="col-span-1 lg:col-span-6 w-full max-w-lg mx-auto">
          <div className="bg-[#0f1422]/90 backdrop-blur-2xl border border-amber-500/25 rounded-[32px] p-6 sm:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative">
            
            {/* Mobile Header (Shown on small screens) */}
            <div className="flex lg:hidden items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#cca43b] to-[#d4af37] text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
                H
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Hanzie Management</h2>
                <p className="text-xs text-amber-400 font-mono">Enterprise Software House ERP</p>
              </div>
            </div>

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

            {/* 1-Click Fast Admin Login Banner (Always visible in Sign In mode) */}
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
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shrink-0 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] disabled:opacity-50"
                >
                  ⚡ 1-Click Login
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Account Password
                    </label>
                  </div>
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
                  <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Workspace'}</span>
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
                  <span>{isLoading ? 'Creating Your Account...' : 'Create Account & Access Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Bottom Status Pill */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Supabase PostgreSQL Cloud</span>
              </span>
              <span className="font-mono text-slate-500">v2.4 Production</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
