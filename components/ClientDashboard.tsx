'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Briefcase, CheckCircle2, Clock, DollarSign, Send, 
  Sparkles, ShieldCheck, ChevronRight, MessageSquare, AlertCircle, Check
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
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="clean-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-200 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
              Client Portal
            </span>
            <span className="text-xs text-slate-400">Isolated Project Access</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Welcome, {currentUser.name}!
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time milestones delivery, deliverables review, and commercial ledger from Hanzei.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Engineering Partner</span>
            <div className="font-bold text-sm text-amber-700">Hanzei Technologies</div>
          </div>
          <div className="icon-badge-gold">
            <Briefcase className="w-5 h-5 text-amber-700" />
          </div>
        </div>
      </div>

      {!selectedProject ? (
        <div className="clean-card p-12 text-center">
          <p className="text-slate-500 text-sm">No active project assigned to your client account yet.</p>
        </div>
      ) : (
        <>
          {/* Main Project Overview Card */}
          <div className="clean-card p-6 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedProject.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Progress Gauge with Gold Accent */}
              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-xl flex items-center gap-5 min-w-[280px]">
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-500"
                      strokeDasharray={`${selectedProject.progressPercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-slate-900">
                    {selectedProject.progressPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-700 block">Overall Progress</span>
                  <span className="text-[11px] font-medium text-slate-500 capitalize block mt-0.5">
                    Status: {selectedProject.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Transparency Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Contract Budget
                </span>
                <span className="text-xl font-bold text-slate-900">
                  PKR {selectedProject.totalBudget.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Verified Payments
                </span>
                <span className="text-xl font-bold text-amber-700">
                  PKR {selectedProject.paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Pending Balance
                </span>
                <span className="text-xl font-bold text-slate-900">
                  PKR {(selectedProject.totalBudget - selectedProject.paidAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Milestones & Direct Communication */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deliverables Checklist */}
            <div className="lg:col-span-2 clean-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Deliverables & Milestones Roadmap
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Live deliverables checklist</p>
                </div>
                <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                  {selectedProject.milestones.filter(m => m.completed).length} / {selectedProject.milestones.length} Delivered
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedProject.milestones.map((milestone, idx) => (
                  <div
                    key={milestone.id}
                    className="p-3.5 rounded-xl border border-slate-200/90 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                        milestone.completed 
                          ? 'bg-gradient-to-tr from-[#cca43b] to-[#d4af37] text-white shadow-xs' 
                          : 'border border-slate-300 text-slate-400'
                      }`}>
                        {milestone.completed ? '✓' : idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800">
                          {milestone.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Target: {milestone.dueDate}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      milestone.completed 
                        ? 'bg-amber-50 text-amber-900 border border-amber-200' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {milestone.completed ? 'Delivered & Accepted' : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Feedback Form with Frosted 2D Glass Button */}
            <div className="clean-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Direct Note to Lead</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Have a revision or question? Message the Hanzei Lead directly.
                </p>

                {feedbackSent && (
                  <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Your note was delivered to Abdul Hannan!</span>
                  </div>
                )}

                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Enter your inquiry or revision note..."
                    rows={4}
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full btn-gold"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-slate-100 text-center mt-4">
                <span className="text-[10px] text-slate-400">
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
