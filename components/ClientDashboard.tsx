'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Briefcase, CheckCircle2, Clock, DollarSign, Send, 
  Sparkles, ShieldCheck, ChevronRight, MessageSquare, Check,
  Calendar, User, ArrowUpRight, TrendingUp, Layers, FileCheck,
  CheckCircle, Lock
} from 'lucide-react';

export default function ClientDashboard() {
  const { 
    currentUser, 
    projects,
    tasks 
  } = useApp();

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [quickTopic, setQuickTopic] = useState<string>('');

  // Filter projects for the client, fallback to all projects for preview
  const clientProjects = currentUser.role === 'client' 
    ? projects.filter(p => 
        p.clientEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
        p.clientId === currentUser.clientId ||
        currentUser.assignedProjectIds?.includes(p.id)
      )
    : projects;

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    clientProjects[0]?.id || projects[0]?.id || ''
  );

  const selectedProject = clientProjects.find(p => p.id === selectedProjectId) || clientProjects[0] || projects[0];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = quickTopic ? `[${quickTopic}] ${feedbackText}` : feedbackText;
    if (!message.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackText('');
      setQuickTopic('');
      setFeedbackSent(false);
    }, 4000);
  };

  if (!selectedProject) {
    return (
      <div className="clean-card p-12 text-center">
        <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Active Project Contract Found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Your client account is active. Once an engineering contract is initiated by Abdul Hannan, your live dashboard will appear here.
        </p>
      </div>
    );
  }

  const balance = selectedProject.totalBudget - selectedProject.paidAmount;
  const paidPct = selectedProject.totalBudget > 0 
    ? Math.round((selectedProject.paidAmount / selectedProject.totalBudget) * 100) 
    : 0;

  const completedMilestones = selectedProject.milestones.filter(m => m.completed);
  const totalMilestonesCount = selectedProject.milestones.length;
  const milestonePct = totalMilestonesCount > 0 
    ? Math.round((completedMilestones.length / totalMilestonesCount) * 100) 
    : 0;

  // Filter tasks for this project
  const projectTasks = tasks.filter(t => t.projectId === selectedProject.id || t.projectName?.toLowerCase() === selectedProject.name?.toLowerCase());
  const completedTasks = projectTasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP EXECUTIVE WELCOME & WORKSPACE HEADER */}
      <div className="clean-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-slate-200" />
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full">
              VIP Client Workspace
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Verified Enterprise Contract
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}!
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Live velocity digest, milestone acceptance roadmap, and direct engineering channel with Hanzei Technologies.
          </p>
        </div>

        {/* Project Switcher + Partner Card */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {clientProjects.length > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
              {clientProjects.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    p.id === selectedProject.id
                      ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200/80 px-3.5 py-2 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/20 shadow-2xs shrink-0">
              H
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Hanzei Technologies</div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Lead: Abdul Hannan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP 4 EXECUTIVE STAT CARDS (Overview Style — Clean White & Font-Bold) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sprint Progress */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Overall Progress</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {selectedProject.progressPercentage}%
            </div>
            <p className="text-[11px] text-amber-700/80 font-semibold mt-0.5">
              Handover: <span className="font-mono">{selectedProject.deadline}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Milestones Delivered */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Milestones Accepted</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-900 tracking-tight font-mono">
              {completedMilestones.length} <span className="text-sm font-normal text-slate-400">/ {totalMilestonesCount}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {milestonePct}% deliverables verified
            </p>
          </div>
        </div>

        {/* Card 3: Payments Cleared */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Revenue Cleared</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-800 tracking-tight font-mono">
              PKR {(selectedProject.paidAmount / 1000).toFixed(0)}K
            </div>
            <p className="text-[11px] text-emerald-700/80 font-semibold mt-0.5">
              {balance <= 0 ? 'Settled in Full ✓' : `PKR ${(balance / 1000).toFixed(0)}K remaining`}
            </p>
          </div>
        </div>

        {/* Card 4: Active Sprint Tasks */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sprint Workstream</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Layers className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {projectTasks.length > 0 ? projectTasks.length : selectedProject.milestones.length} <span className="text-sm font-normal text-slate-400">Items</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {completedTasks.length} tasks marked complete
            </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION: 12-COL OVERVIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Deliverables & Sprint Roadmap (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Contract Info & Linear Progress */}
          <div className="clean-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    {selectedProject.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md capitalize">
                    {selectedProject.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedProject.name}
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sprint Health</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  On Schedule
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedProject.description}
            </p>

            {/* Progress Gauge Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Milestone Delivery Velocity</span>
                <span className="font-bold text-slate-900 font-mono">{selectedProject.progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedProject.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Milestones Roadmap & Acceptance Checklist */}
          <div className="clean-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Milestones Roadmap & Acceptance Checklist
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sequential delivery verification and handover timeline
                </p>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-md">
                {completedMilestones.length} / {totalMilestonesCount} Verified
              </span>
            </div>

            <div className="space-y-2.5">
              {selectedProject.milestones.map((milestone, idx) => {
                const isCompleted = milestone.completed;
                const prevCompleted = idx === 0 || selectedProject.milestones[idx - 1].completed;
                const isActive = !isCompleted && prevCompleted;

                return (
                  <div
                    key={milestone.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-slate-50/60 border-slate-200/80'
                        : isActive
                        ? 'bg-amber-50/30 border-amber-300 shadow-2xs'
                        : 'bg-white border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Step Indicator Dot */}
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : isActive
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate ${
                          isCompleted ? 'text-slate-700 line-through decoration-slate-300' : 'text-slate-900'
                        }`}>
                          {milestone.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>Target: {milestone.dueDate}</span>
                          {isActive && (
                            <span className="text-amber-700 font-bold font-sans">
                              • Current Sprint Focus
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shrink-0 ${
                      isCompleted 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : isActive
                        ? 'bg-amber-100/80 text-amber-950 border border-amber-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {isCompleted ? 'Delivered & Accepted ✓' : isActive ? 'In Progress' : 'Queued'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Engineering Sprint Tasks (Transparency) */}
          <div className="clean-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Live Sprint Workstream & Deliverables
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct visibility into technical tasks underway by Hanzei engineers
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {projectTasks.length} Tracked Items
              </span>
            </div>

            {projectTasks.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {projectTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        task.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <span className="font-semibold text-slate-800 truncate">{task.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 hidden sm:inline">
                        Assignee: <strong className="text-slate-600">{task.assignedToName}</strong>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        task.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : task.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                All sprint deliverables are mapped into the active milestones roadmap above.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Financials & Direct Note to Lead (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Contract Financials Transparency Card */}
          <div className="clean-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Billing & Financial Ledger
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified contract disbursements & receipts
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                VERIFIED ✓
              </span>
            </div>

            {/* 3 Metric Mini Boxes with White Background & Clean Border */}
            <div className="grid grid-cols-1 gap-2.5">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Agreed Contract Budget
                  </span>
                  <span className="text-base font-bold text-slate-900 mt-0.5 block font-mono">
                    PKR {selectedProject.totalBudget.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">Total</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                    Payments Cleared
                  </span>
                  <span className="text-base font-bold text-emerald-800 mt-0.5 block font-mono">
                    PKR {selectedProject.paidAmount.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {paidPct}%
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Pending Milestone Balance
                  </span>
                  <span className="text-base font-bold text-slate-800 mt-0.5 block font-mono">
                    {balance <= 0 ? 'Settled in Full ✓' : `PKR ${balance.toLocaleString()}`}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {balance <= 0 ? 'Cleared' : 'On Handover'}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>All payments backed by official SECP tax invoices & digital receipts.</span>
            </div>
          </div>

          {/* Direct Note to Lead Abdul Hannan */}
          <div className="clean-card p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Direct Note to Lead (Abdul Hannan)
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need a revision, feature adjustment, or have an urgent query? Message the lead directly.
              </p>
            </div>

            {/* Quick Topic Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Design Revision', 'Scope Inquiry', 'Milestone Review', 'General Note'].map(topic => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setQuickTopic(quickTopic === topic ? '' : topic)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors ${
                    quickTopic === topic
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            {feedbackSent && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your message was delivered to Abdul Hannan! Expect a prompt reply.</span>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Type your feedback, scope questions, or revision requests here..."
                rows={3}
                className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-medium transition-colors"
                required
              />

              <button
                type="submit"
                className="w-full btn-gold text-xs py-2.5 shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Note to Lead</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center">
              Guaranteed response within 2 business hours • Mon to Sat (09:00 AM - 06:00 PM PKT)
            </div>
          </div>

          {/* Hanzei Enterprise Assurances */}
          <div className="clean-card p-5 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 border border-slate-200 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Contract Safeguards & Assurances
            </span>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Intellectual Property & Source Code Ownership</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Enterprise NDA Protected & Zero-Knowledge Client Data</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Continuous Automated Testing & 30-Day Post-Launch Warranty</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
