'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { 
  Lock, Mail, User as UserIcon, Phone, ShieldCheck, 
  Eye, EyeOff, ArrowRight, CheckCircle2, 
  AlertCircle, KeyRound, Check, Laptop, Palette, Bug, UserCheck, Users, Sparkles
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

  // Canvas Live Background Animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate floating luminous particles & golden nodes
    const particleCount = Math.min(width > 768 ? 65 : 35, 70);
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      alphaSpeed: number;
    }[] = [];

    const colors = ['#f59e0b', '#d97706', '#fbbf24', '#fef08a', '#e2e8f0'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45 - 0.15,
        radius: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.2,
        alphaSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint constellation lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.14;
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaSpeed;

        if (p.alpha <= 0.15 || p.alpha >= 0.85) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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

  const roleList: { id: UserRole; title: string; subtitle: string; icon: any }[] = [
    { id: 'developer', title: 'Developer', subtitle: 'Engineering', icon: Laptop },
    { id: 'designer', title: 'UI/UX Designer', subtitle: 'Design & Assets', icon: Palette },
    { id: 'qa', title: 'QA Engineer', subtitle: 'Testing & Bugs', icon: Bug },
    { id: 'support_cleaner', title: 'Support / Staff', subtitle: 'Operations', icon: UserCheck },
    { id: 'client', title: 'Client Portal', subtitle: 'Project Tracking', icon: Users },
  ];

  return (
    <div className="min-h-screen w-full bg-[#06080e] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      
      {/* LIVE INTERACTIVE CANVAS BACKGROUND */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Radiant Atmospheric Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-amber-600/15 via-yellow-500/10 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-1/4 -right-20 w-[550px] h-[550px] bg-gradient-to-bl from-amber-500/12 via-orange-600/8 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-400/[0.04] rounded-full blur-[180px] pointer-events-none" />

      {/* Subtle Digital Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.12) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Main Container */}
      <div className="w-full max-w-[440px] z-10 flex flex-col items-center my-auto py-6">
        
        {/* Loading Screen Signature Logo */}
        <div className="flex flex-col items-center justify-center mb-6 select-none">
          {/* Top Roof with Chimney */}
          <div className="w-[190px] h-7">
            <svg viewBox="0 0 380 90" fill="none" className="w-full h-full drop-shadow-[0_2px_10px_rgba(217,119,6,0.5)]">
              <defs>
                <linearGradient id="liveRoofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="35%" stopColor="#fde047" />
                  <stop offset="65%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>
              <path
                d="M 20 85 L 145 14 L 205 38 L 205 24 L 245 24 L 245 54 L 325 85"
                stroke="url(#liveRoofGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 28 85 L 145 22 L 200 44 L 200 30 L 238 30 L 238 58 L 318 85"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeOpacity="0.65"
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
                  className="text-3xl sm:text-4xl font-bold tracking-wider leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#f59e0b] to-[#b45309] drop-shadow-[0_2px_12px_rgba(245,158,11,0.55)]"
                  style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
                >
                  {char}
                </span>
                {char === 'I' && (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-700 shadow-[0_0_8px_#fbbf24]" />
                )}
              </div>
            ))}
          </div>

          {/* Underline & Z Swoosh */}
          <div className="w-[200px] h-3.5 -mt-1">
            <svg viewBox="0 0 420 40" fill="none" className="w-full h-full drop-shadow-[0_1px_8px_rgba(217,119,6,0.35)]">
              <defs>
                <linearGradient id="liveSwooshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ca8a04" />
                  <stop offset="40%" stopColor="#fde047" />
                  <stop offset="80%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
              </defs>
              <line x1="75" y1="8" x2="215" y2="8" stroke="url(#liveSwooshGrad)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 215 8 Q 285 10 345 22 Q 390 28 415 14" stroke="url(#liveSwooshGrad)" strokeWidth="4" strokeLinecap="round" />
              <line x1="80" y1="7" x2="210" y2="7" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.75" strokeLinecap="round" />
              <path d="M 218 7 Q 285 9 345 21" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.75" strokeLinecap="round" />
            </svg>
          </div>

          {/* Monospace Subtitle */}
          <div className="mt-1 text-[11px] font-mono tracking-[0.35em] uppercase text-slate-400 font-medium">
            SOFTWARE HOUSE
          </div>
        </div>

        {/* ULTRA-LUXURY TRANSLUCENT FROSTED GLASS AUTH CARD */}
        <div className="w-full bg-white/[0.08] backdrop-blur-md border border-white/20 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_35px_rgba(212,175,55,0.1)] relative transition-all">
          
          {/* Subtle Top Glowing Line Accent */}
          <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

          {/* Segmented Auth Tabs */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/15 mb-6 backdrop-blur-sm shadow-inner">
            <button
              type="button"
              onClick={() => { setMode('signin'); setFeedback(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold shadow-[0_2px_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-300 hover:text-white font-medium'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setFeedback(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold shadow-[0_2px_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-300 hover:text-white font-medium'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div className={`p-3.5 rounded-2xl mb-5 text-xs font-normal flex items-start gap-2.5 border transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-rose-950/50 text-rose-300 border-rose-500/40 shadow-sm'
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
                <label className="block text-xs font-normal text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. admin@gmail.com"
                    className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:bg-black/60 focus:ring-1 focus:ring-amber-400/30 transition-all font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:bg-black/60 focus:ring-1 focus:ring-amber-400/30 transition-all font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.5)] text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
                <label className="block text-xs font-normal text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bilal Ahmed"
                    className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:bg-black/60 focus:ring-1 focus:ring-amber-400/30 transition-all font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. bilal@hanzie.com"
                    className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:bg-black/60 focus:ring-1 focus:ring-amber-400/30 transition-all font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:bg-black/60 focus:ring-1 focus:ring-amber-400/30 transition-all font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Redesigned Workspace Role Cards */}
              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1.5">
                  Select Workspace Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roleList.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            : 'bg-black/30 border-white/15 text-slate-300 hover:bg-white/10 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-amber-400/30 text-amber-300' : 'bg-white/10 text-slate-400'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-medium block truncate leading-tight">
                              {r.title}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {r.subtitle}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-slate-300 mb-1">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:bg-black/60 focus:ring-1 focus:ring-amber-400/30 transition-all font-normal"
                  />
                </div>
              </div>

              {/* Submit Sign Up */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.5)] text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                <span>{isLoading ? 'Creating Your Account...' : 'Create Account & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Bottom Live DB Indicator */}
          <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-normal">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>{isSupabaseConfigured ? 'Supabase PostgreSQL Cloud Active' : 'Persistent Cloud Storage'}</span>
            </span>
            <span className="font-mono text-slate-500">v2.5 Encrypted</span>
          </div>

        </div>
      </div>
    </div>
  );
}
