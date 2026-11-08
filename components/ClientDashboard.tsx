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
    projects, 
    tasks, 
    toggleMilestone 
  } = useApp();

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Filter projects strictly for this client
  const clientProjects = currentUser.role === 'client' 
    ? projects.filter(p => 
        p.clientEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
        p.clientId === currentUser.clientId ||
        currentUser.assignedProjectIds?.includes(p.id)
      )
    : projects; // If Leader is viewing the client portal, show all

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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              Client Portal & Transparency View
            </span>
            <span className="text-xs text-slate-400">Strictly Isolated to Your Contract</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome, {currentUser.name}! 🌟
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time development milestones, deliverables, payment receipts, and team progress transparently.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Software Partner</span>
            <div className="font-extrabold text-sm text-indigo-600">Hanzei Technologies</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {!selectedProject ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No active project assigned to your client account yet.</p>
        </div>
      ) : (
        <>
          {/* Main Project Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {selectedProject.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  {selectedProject.description}
                </p>
              </div>

              {/* Progress Gauge */}
              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex items-center gap-5 min-w-[280px]">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-600"
                      strokeDasharray={`${selectedProject.progressPercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-black text-slate-900">
                    {selectedProject.progressPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Overall Completion</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize inline-block mt-1 ${
                    selectedProject.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    selectedProject.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    Status: {selectedProject.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Transparency Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Contract Value
                </span>
                <span className="text-xl font-black text-slate-900">
                  PKR {selectedProject.totalBudget.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Payments Cleared & Verified
                </span>
                <span className="text-xl font-black text-emerald-800">
                  PKR {selectedProject.paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
                  Remaining Milestone Balance
                </span>
                <span className="text-xl font-black text-rose-800">
                  PKR {(selectedProject.totalBudget - selectedProject.paidAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Milestones & Direct Communication */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Milestone Roadmap */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Project Deliverables & Milestones Roadmap
                  </h3>
                  <p className="text-xs text-slate-500">Live progress breakdown for {selectedProject.name}</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {selectedProject.milestones.filter(m => m.completed).length} / {selectedProject.milestones.length} Delivered
                </span>
              </div>

              <div className="space-y-3">
                {selectedProject.milestones.map((milestone, idx) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      milestone.completed 
                        ? 'bg-emerald-50/40 border-emerald-200/80' 
                        : 'bg-white border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        milestone.completed 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {milestone.completed ? '✓' : idx + 1}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${
                          milestone.completed ? 'text-slate-900 line-through text-slate-400' : 'text-slate-800'
                        }`}>
                          {milestone.title}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          Target Due: {milestone.dueDate}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      milestone.completed 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {milestone.completed ? 'Delivered & Accepted' : 'In Development'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Client Feedback / Direct Query to Hanzei */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Direct Note to Lead</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Have a question, revision, or feedback regarding your deliverables? Message Abdul Hannan and the Hanzei engineering team directly.
                </p>

                {feedbackSent && (
                  <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your note was delivered to the Hanzei Lead!</span>
                  </div>
                )}

                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Enter your request, feedback, or inquiry..."
                    rows={4}
                    className="w-full text-xs border border-slate-200 rounded-2xl p-3.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Team</span>
                  </button>
                </form>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                <span className="text-[10px] text-slate-400">
                  Protected by Hanzei NDA & Client Privacy Agreement
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

