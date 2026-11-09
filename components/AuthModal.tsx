'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Lock, Mail, User as UserIcon, Phone, CheckCircle2, 
  AlertCircle, Sparkles, X, ChevronRight, ArrowRight
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import CustomDropdown from '@/components/CustomDropdown';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { users, switchUser, signupUser } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('developer');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    let department = 'Development';
    if (role === 'designer') department = 'Design';
    if (role === 'qa') department = 'Quality Assurance';
    if (role === 'support_cleaner') department = 'Office & Maintenance';
    if (role === 'client') department = 'Clients';

    const result = signupUser({
      name,
      email,
      phone,
      role,
      department,
    });

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setName('');
      setEmail('');
      setPhone('');
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#cca43b] via-[#e5c07b] to-[#d4af37] text-slate-900 font-extrabold text-sm flex items-center justify-center border border-amber-200 shadow-xs">
              H
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0f172a]">Hanzei OS Access</h3>
              <p className="text-xs text-[#94a3b8]">Software House Management</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#f1f4f9] p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => { setMode('login'); setFeedback(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Instant Persona Login
          </button>
          <button
            onClick={() => { setMode('signup'); setFeedback(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            New Sign Up
          </button>
        </div>

        {feedback && (
          <div className={`p-4 rounded-2xl mb-5 text-xs font-semibold flex items-start gap-3 ${
            feedback.type === 'success' 
              ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]' 
              : 'bg-[#fff0f3] text-[#9f1239] border border-[#fecdd3]'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{feedback.message}</span>
          </div>
        )}

        {/* MODE: ACTIVE REAL USERS LIST */}
        {mode === 'login' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select User Account to Sign In:
            </span>

            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  onClose();
                }}
                className="w-full p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:bg-amber-50/50 text-left flex items-center justify-between transition-all hover:border-amber-300"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                  <span className="text-[11px] font-semibold text-slate-500 capitalize">{u.role.replace('_', ' ')} &bull; {u.department}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        )}

        {/* MODE: SIGN UP NEW USER */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Daniyal Khan"
                className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="daniyal@example.com"
                className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Applying Role / Field</label>
              <CustomDropdown
                fullWidth
                value={role}
                onChange={(v) => setRole(v as any)}
                options={[
                  { value: 'developer', label: 'Developer' },
                  { value: 'designer', label: 'UI/UX Designer' },
                  { value: 'qa', label: 'QA Engineer' },
                  { value: 'support_cleaner', label: 'Office Staff / Cleaner' },
                  { value: 'client', label: 'Client' },
                ]}
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fff9ea] text-xs text-[#92400e] border border-[#faeed0] font-medium leading-relaxed">
              Notice: Account requires confirmation by Leader (Abdul Hannan) before login is unlocked.
            </div>

            <button
              type="submit"
              className="w-full btn-gold py-2.5"
            >
              Submit Registration for Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
