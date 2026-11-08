'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Briefcase, CheckCircle2, Clock, DollarSign, Send, 
  Sparkles, ShieldCheck, ChevronRight, MessageSquare, AlertCircle
} from 'lucide-react';

export default function ClientDashboard() {
  const { 
    currentUser, 
    projects 
  } = useApp();

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
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSent(false);
    }, 3500);
  };

  return (
    <div className="space-y-7">
      {/* Top Welcome Card with generous padding */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Client Transparency Portal
            </span>
            <span className="text-xs text-slate-400">Strictly Isolated to Your Project</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Welcome, {currentUser.name}! 🌟
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time milestones delivery, deliverables review, and payment receipts from Hanzei.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Engineering Partner</span>
            <div className="font-extrabold text-sm text-[#2563eb]">Hanzei Technologies</div>
          </div>
          <div className="icon-round-blue">
            <Briefcase className="w-5 h-5 drop-shadow-sm" />
          </div>
        </div>
      </div>

      {!selectedProject ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
          <p className="text-slate-500 text-sm">No active project assigned to your client account yet.</p>
        </div>
      ) : (
        <>
          {/* Main Project Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-bold text-[#0f172a] mt-3">
                  {selectedProject.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 max-w-xl leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Progress Gauge */}
              <div className="bg-[#f8fafc] border border-slate-200/60 p-6 rounded-3xl flex items-center gap-6 min-w-[300px]">
                <div className="relative w-18 h-18 flex items-center justify-center">
                  <svg className="w-18 h-18 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#2563eb]"
                      strokeDasharray={`${selectedProject.progressPercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-base font-black text-[#0f172a]">
                    {selectedProject.progressPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Overall Completion</span>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full capitalize inline-block mt-1.5 ${
                    selectedProject.status === 'completed' ? 'bg-[#ecfdf5] text-[#059669]' :
                    selectedProject.status === 'in_progress' ? 'bg-[#fff9ea] text-[#b45309]' : 'bg-blue-50 text-blue-700'
                  }`}>
                    Status: {selectedProject.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Transparency Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Contract Budget
                </span>
                <span className="text-2xl font-black text-[#0f172a]">
                  PKR {selectedProject.totalBudget.toLocaleString()}
                </span>
              </div>
              <div className="p-6 rounded-2xl bg-[#eafaf2] border border-[#d2f5e3]">
                <span className="text-xs font-semibold text-[#065f46] uppercase tracking-wider block mb-1">
                  Verified Payments
                </span>
                <span className="text-2xl font-black text-[#065f46]">
                  PKR {selectedProject.paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="p-6 rounded-2xl bg-[#fff0f3] border border-[#fcdce3]">
                <span className="text-xs font-semibold text-[#9f1239] uppercase tracking-wider block mb-1">
                  Pending Balance
                </span>
                <span className="text-2xl font-black text-[#9f1239]">
                  PKR {(selectedProject.totalBudget - selectedProject.paidAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Milestones & Direct Communication */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">
                    Project Deliverables & Milestones Roadmap
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Live deliverables checklist for {selectedProject.name}</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {selectedProject.milestones.filter(m => m.completed).length} / {selectedProject.milestones.length} Delivered
                </span>
              </div>

              <div className="space-y-3.5">
                {selectedProject.milestones.map((milestone, idx) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      milestone.completed 
                        ? 'bg-[#ecfdf5]/70 border-[#a7f3d0]' 
                        : 'bg-[#f8fafc] border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        milestone.completed 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-white border border-slate-200 text-slate-400'
                      }`}>
                        {milestone.completed ? '✓' : idx + 1}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${
                          milestone.completed ? 'text-slate-900 line-through text-slate-400' : 'text-slate-800'
                        }`}>
                          {milestone.title}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Target Due: {milestone.dueDate}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      milestone.completed 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {milestone.completed ? 'Delivered & Accepted' : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Feedback Form */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-[#0f172a]">Direct Note to Lead</h3>
                </div>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  Have a revision, question, or note regarding your build? Message the Hanzei Lead directly.
                </p>

                {feedbackSent && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your note was delivered to Abdul Hannan!</span>
                  </div>
                )}

                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Enter your inquiry or revision note..."
                    rows={4}
                    className="w-full text-xs border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full btn-2d-primary py-3 text-xs flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 drop-shadow-xs" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400">
                  Protected by Hanzei NDA Agreement
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
