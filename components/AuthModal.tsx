'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Lock, Mail, User as UserIcon, Phone, CheckCircle2, 
  AlertCircle, Sparkles, X, ChevronRight, ArrowRight
} from 'lucide-react';
import { UserRole } from '@/lib/types';

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl">
              H
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Hanzei OS Access</h3>
              <p className="text-xs text-slate-400">Software House Management System</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
          <button
            onClick={() => { setMode('login'); setFeedback(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Instant Role Login
          </button>
          <button
            onClick={() => { setMode('signup'); setFeedback(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            New Registration
          </button>
        </div>

        {feedback && (
          <div className={`p-3.5 rounded-2xl mb-4 text-xs font-semibold flex items-start gap-2.5 ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* MODE: INSTANT ROLE LOGIN */}
        {mode === 'login' && (
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Select Demo Persona to Experience:
            </span>

            {[
              { id: 'usr_leader', name: 'Abdul Hannan', role: 'Leader / CEO', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
              { id: 'usr_dev_1', name: 'Hamza Malik', role: 'Senior Developer', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { id: 'usr_des_1', name: 'Zainab Fatima', role: 'UI/UX Designer', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { id: 'usr_cleaner_1', name: 'Muhammad Rafiq', role: 'Office Caretaker / Cleaner', color: 'bg-teal-50 border-teal-200 text-teal-700' },
              { id: 'usr_client_1', name: 'Eleyas Hasan', role: 'Client (Apex Logistics)', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { id: 'usr_pending_1', name: 'Farhan Siddiqui', role: 'Pending User (Awaiting Approval)', color: 'bg-amber-50 border-amber-200 text-amber-700' },
            ].map((persona) => (
              <button
                key={persona.id}
                onClick={() => {
                  switchUser(persona.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all hover:scale-[1.01] ${persona.color}`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{persona.name}</h4>
                  <span className="text-[11px] font-semibold text-slate-500">{persona.role}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        )}

        {/* MODE: SIGN UP NEW USER */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Daniyal Khan"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
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
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
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
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Applying Role / Field</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50"
              >
                <option value="developer">Developer</option>
                <option value="designer">UI/UX Designer</option>
                <option value="qa">QA Engineer</option>
                <option value="support_cleaner">Office Staff / Cleaner</option>
                <option value="client">Client</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 text-[11px] text-amber-800 border border-amber-200">
              Notice: Account requires confirmation by Leader (Abdul Hannan) before login is unlocked.
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all"
            >
              Submit Registration for Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

