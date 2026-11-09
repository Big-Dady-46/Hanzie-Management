'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Briefcase, CheckCircle2, Clock, Send, 
  ShieldCheck, Check, TrendingUp, Users,
  Activity, Globe, MessageSquare
} from 'lucide-react';

export default function ClientDashboard() {
  const { 
    currentUser, 
    projects,
    users 
  } = useApp();

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Client's projects
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
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSent(false);
    }, 3500);
  };

  if (!selectedProject) {
    return (
      <div className="clean-card p-10 text-center max-w-md mx-auto my-8">
        <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Active Project Linked</h3>
        <p className="text-xs text-slate-400 mt-1">Your account will display progress once a project is assigned.</p>
      </div>
    );
  }

  const completedMilestones = selectedProject.milestones.filter(m => m.completed);
  const totalMilestonesCount = selectedProject.milestones.length;
  const milestonePct = totalMilestonesCount > 0 
    ? Math.round((completedMilestones.length / totalMilestonesCount) * 100) 
    : 0;

  // Assigned team members
  const assignedTeam = users.filter(u => 
    selectedProject.assignedTeamMemberIds?.includes(u.id) || u.role === 'leader'
  );

  const activeSpecialists = assignedTeam.length > 0 
    ? assignedTeam 
    : users.filter(u => u.status === 'active' && u.role !== 'client').slice(0, 3);

  const balance = selectedProject.totalBudget - selectedProject.paidAmount;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER CARD (Consistent with Luxury Style) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Icon + Project Title + Status Pills */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight truncate">
                {selectedProject.name}
              </h2>
              <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                {selectedProject.category}
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Development
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Target Handover & Lead Partner */}
        <div className="flex items-center gap-4 shrink-0 self-start md:self-auto">
          <div className="text-left md:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Target Handover
            </span>
            <span className="text-xs font-bold font-mono text-slate-800 block mt-0.5">
              {selectedProject.deadline}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-800">Lead: Abdul Hannan</span>
          </div>
        </div>
      </div>

      {/* 2. TOP 3 EXECUTIVE KPI CARDS (Matching Payroll & Projects Tabs: White BG, Clean Border, h-32) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Project Progress — Amber Border */}
        <div className="bg-white rounded-2xl p-5 flex flex-col justify-between h-32 border border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Total Project Progress</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-900 tracking-tight font-mono">
              {selectedProject.progressPercentage}%
            </div>
            <p className="text-[11px] text-amber-700/80 font-semibold mt-0.5">
              On Schedule • Verified quality checks
            </p>
          </div>
        </div>

        {/* Card 2: Dedicated Squad — Emerald Border */}
        <div className="bg-white rounded-2xl p-5 flex flex-col justify-between h-32 border border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Dedicated Engineering Squad</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-800 tracking-tight font-mono">
              {activeSpecialists.length} <span className="text-base font-normal text-slate-500">Specialists</span>
            </div>
            <p className="text-[11px] text-emerald-700/80 font-semibold mt-0.5">
              Full-stack development, UI/UX & QA
            </p>
          </div>
        </div>

        {/* Card 3: Milestone Stages — Slate Border */}
        <div className="bg-white rounded-2xl p-5 flex flex-col justify-between h-32 border border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Milestones Completed</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 tracking-tight font-mono">
              {completedMilestones.length} <span className="text-base font-normal text-slate-400">/ {totalMilestonesCount}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {milestonePct}% milestone phases finished
            </p>
          </div>
        </div>

      </div>

      {/* 3. MAIN WORKSPACE: 12-COL OVERVIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column (7 Cols): Milestone Phases & Roadmap */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Project Development Phases</h3>
                <span className="text-xs text-slate-400 mt-0.5 block">Step-by-step progress towards final product handover</span>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                Phase {completedMilestones.length + 1} Active
              </span>
            </div>

            {/* List of Milestones */}
            <div className="space-y-3">
              {selectedProject.milestones.map((milestone, idx) => {
                const isCompleted = milestone.completed;
                const prevCompleted = idx === 0 || selectedProject.milestones[idx - 1].completed;
                const isActive = !isCompleted && prevCompleted;

                return (
                  <div
                    key={milestone.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isCompleted
                        ? 'bg-slate-50/70 border-slate-200/90'
                        : isActive
                        ? 'bg-amber-50/40 border-amber-300'
                        : 'bg-white border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : isActive
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4 text-emerald-600" /> : idx + 1}
                      </div>

                      <div className="min-w-0">
                        <span className={`font-bold block truncate text-xs sm:text-sm ${
                          isCompleted ? 'text-slate-700' : 'text-slate-900'
                        }`}>
                          {milestone.title}
                        </span>
                        <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                          Target: {milestone.dueDate}
                        </span>
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                      isCompleted 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : isActive
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isCompleted ? 'Finished ✓' : isActive ? 'Active ⚡' : 'Upcoming'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>Automated Daily CI/CD Verification</span>
            <span className="font-bold text-emerald-700">All tests passing ✓</span>
          </div>
        </div>

        {/* Right Column (5 Cols): Team Squad + Financials + Message */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          {/* Card 1: Team Squad on Build */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Team on Your Project
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Active Squad
              </span>
            </div>

            <div className="space-y-2.5">
              {activeSpecialists.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/20 shadow-2xs">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 text-xs sm:text-sm block truncate">{member.name}</span>
                      <span className="text-[11px] text-slate-400 capitalize block truncate">
                        {member.role === 'leader' ? 'Lead Architect' : member.department || 'Engineer'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Financial Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Financial Status
            </span>
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 block mb-0.5 font-medium">Budget</span>
                <span className="font-bold text-slate-900 font-mono text-xs sm:text-sm block">PKR {(selectedProject.totalBudget / 1000).toFixed(0)}K</span>
              </div>
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200">
                <span className="text-xs text-emerald-700 block mb-0.5 font-medium">Paid</span>
                <span className="font-bold text-emerald-800 font-mono text-xs sm:text-sm block">PKR {(selectedProject.paidAmount / 1000).toFixed(0)}K</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 block mb-0.5 font-medium">Balance</span>
                <span className="font-bold text-slate-800 font-mono text-xs sm:text-sm block">
                  {balance <= 0 ? 'Cleared ✓' : `PKR ${(balance / 1000).toFixed(0)}K`}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Quick Note to Lead */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">Quick Note to Abdul Hannan</span>
              </div>
              <span className="text-xs text-slate-400">Direct SLA</span>
            </div>

            {feedbackSent ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Message delivered to Abdul Hannan!</span>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Ask a question or request an update..."
                  className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-medium transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="btn-gold text-xs px-3.5 py-2 shrink-0 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <span className="text-xs text-slate-400 block text-center">
              100% Code & IP Ownership Guaranteed • NDA Protected
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
