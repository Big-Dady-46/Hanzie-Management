'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Briefcase, CheckCircle2, Clock, Send, MessageSquare, Layers } from 'lucide-react';

export default function ClientDashboard() {
  const { currentUser, projects } = useApp();

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const clientProjects = currentUser.role === 'client'
    ? projects.filter(p =>
        p.clientEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
        p.clientId === currentUser.clientId ||
        currentUser.assignedProjectIds?.includes(p.id)
      )
    : projects;

  const selectedProject = clientProjects[0] || projects[0];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => { setFeedbackText(''); setFeedbackSent(false); }, 3500);
  };

  const balance = selectedProject ? selectedProject.totalBudget - selectedProject.paidAmount : 0;
  const paidPct = selectedProject ? Math.round((selectedProject.paidAmount / selectedProject.totalBudget) * 100) : 0;

  return (
    <div className="space-y-5 fade-up">
      {/* Welcome Banner */}
      <div className="glass-card-gold p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              Isolated Client Workspace
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-full">
              Verified Portal
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Welcome, {currentUser.name}!</h2>
          <p className="text-xs text-slate-600 mt-1">Live delivery velocity · milestone acceptance · direct Hanzei contact</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="section-label block mb-0.5">Engineering Partner</span>
            <div className="text-sm font-extrabold text-amber-400">Hanzei Technologies</div>
            <span className="text-[10px] text-slate-700">Lead: Abdul Hannan</span>
          </div>
          <div className="icon-badge-gold w-12 h-12 rounded-2xl">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {!selectedProject ? (
        <div className="glass-card p-16 text-center">
          <p className="text-slate-600 text-sm">No active project assigned yet.</p>
        </div>
      ) : (
        <>
          {/* Project Overview */}
          <div className="glass-card-hover p-5 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 pb-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">{selectedProject.category}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {selectedProject.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 tracking-tight">{selectedProject.name}</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">{selectedProject.description}</p>
                <p className="text-xs text-slate-700 mt-2">Client: <strong className="text-slate-400">{selectedProject.clientName}</strong></p>
              </div>

              {/* Circular Progress */}
              <div
                className="p-4 rounded-2xl flex items-center gap-4 min-w-[200px]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <path strokeWidth="3.5" stroke="rgba(255,255,255,0.08)" fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path
                      strokeDasharray={`${selectedProject.progressPercentage}, 100`}
                      strokeWidth="3.5" strokeLinecap="round" stroke="#f5c842" fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-amber-400">
                    {selectedProject.progressPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-300 block">Sprint Progress</span>
                  <span className="text-[10px] text-slate-600 mt-0.5 block font-mono">Due: {selectedProject.deadline}</span>
                </div>
              </div>
            </div>

            {/* Financial Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Contract Budget', val: `PKR ${selectedProject.totalBudget.toLocaleString()}`, amber: false },
                { label: 'Payments Cleared', val: `PKR ${selectedProject.paidAmount.toLocaleString()}`, amber: true },
                { label: 'Balance Due', val: balance <= 0 ? 'Settled ✓' : `PKR ${balance.toLocaleString()}`, amber: false },
              ].map((kpi) => (
                <div key={kpi.label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="section-label mb-1.5">{kpi.label}</p>
                  <div className={`text-base font-bold ${kpi.amber ? 'text-amber-400' : 'text-slate-200'}`}>{kpi.val}</div>
                  {kpi.label === 'Payments Cleared' && (
                    <div className="mt-2">
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${paidPct}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-700 mt-1 block">{paidPct}% paid</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Milestones + Message */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Milestones */}
            <div className="lg:col-span-2 glass-card-hover p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-bold text-slate-200">Deliverables Roadmap</span>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                  {selectedProject.milestones.filter(m => m.completed).length}/{selectedProject.milestones.length} Done
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedProject.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl flex items-center justify-between"
                    style={{
                      background: m.completed ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.03)',
                      border: m.completed ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                        style={{
                          background: m.completed ? 'linear-gradient(135deg, #f5c842, #c88f00)' : 'rgba(255,255,255,0.05)',
                          color: m.completed ? '#1a0f00' : '#475569',
                          border: m.completed ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {m.completed ? '✓' : idx + 1}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${m.completed ? 'text-slate-400 line-through decoration-amber-600/40' : 'text-slate-300'}`}>
                          {m.title}
                        </p>
                        <p className="text-[10px] text-slate-700 font-mono mt-0.5">Due: {m.dueDate}</p>
                      </div>
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ml-2"
                      style={{
                        background: m.completed ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                        color: m.completed ? '#f5c842' : '#475569',
                      }}
                    >
                      {m.completed ? 'Delivered ✓' : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Message */}
            <div className="glass-card-gold p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-slate-200">Direct Note to Lead</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Revision, question, or update? Message the Hanzei Lead directly.
              </p>

              {feedbackSent && (
                <div className="mb-3 p-3 rounded-xl flex items-center gap-2 text-xs"
                  style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Delivered to Abdul Hannan!</span>
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-3 flex-1 flex flex-col">
                <textarea
                  value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Enter your note or revision..."
                  rows={5} className="dark-input w-full resize-none flex-1" required
                />
                <button type="submit" className="btn-gold w-full gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>

              <p className="text-[10px] text-slate-700 text-center mt-3">
                Lead reply guaranteed within 2 business hours.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
