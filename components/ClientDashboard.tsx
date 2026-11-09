'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Briefcase, CheckCircle2, Clock, Send, 
  ShieldCheck, Check, TrendingUp, Layers, Users,
  Activity, Code2, Palette, MessageSquare
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
      <div className="clean-card p-8 text-center max-w-md mx-auto my-6">
        <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-800">No Active Project Linked</h3>
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
    <div className="space-y-3.5 animate-in fade-in duration-200 max-h-[580px] overflow-hidden">
      
      {/* 1. COMPACT TOP HEADER BAR (~50px) */}
      <div className="clean-card px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/20 shadow-2xs">
            {selectedProject.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {selectedProject.name}
              </h2>
              <span className="text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                {selectedProject.category}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Development
              </span>
            </div>
          </div>
        </div>

        {/* Right Info: Target & Lead */}
        <div className="flex items-center gap-3 shrink-0 text-xs">
          <div className="hidden sm:block text-right">
            <span className="text-[10px] text-slate-400 block leading-tight">Target Handover</span>
            <span className="font-mono font-bold text-slate-800 text-[11px]">{selectedProject.deadline}</span>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-slate-700">Lead: Abdul Hannan</span>
          </div>
        </div>
      </div>

      {/* 2. COMPACT 4 STAT CARDS ROW (~75px) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Card 1: Progress % */}
        <div className="clean-card p-3 flex flex-col justify-between h-[75px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500">Progress</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900 font-mono leading-none">
                {selectedProject.progressPercentage}%
              </span>
              <span className="text-[9px] text-slate-400">On Schedule</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${selectedProject.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Dedicated Squad */}
        <div className="clean-card p-3 flex flex-col justify-between h-[75px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500">Engineers</span>
            <Users className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 font-mono leading-none">
              {activeSpecialists.length} Specialists
            </div>
            <p className="text-[9px] text-amber-700 font-medium mt-1">Full-stack squad</p>
          </div>
        </div>

        {/* Card 3: Milestones */}
        <div className="clean-card p-3 flex flex-col justify-between h-[75px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500">Milestone Phases</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-800 font-mono leading-none">
              {completedMilestones.length} / {totalMilestonesCount}
            </div>
            <p className="text-[9px] text-emerald-700 font-medium mt-1">{milestonePct}% completed</p>
          </div>
        </div>

        {/* Card 4: Health */}
        <div className="clean-card p-3 flex flex-col justify-between h-[75px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500">Health</span>
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 font-mono leading-none">
              100%
            </div>
            <p className="text-[9px] text-slate-400 mt-1">Zero blockers</p>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE (~350px, Fits perfectly in 500px-550px height) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[360px]">
        
        {/* Left Column (7 Cols): Milestone Journey & Roadmap */}
        <div className="md:col-span-7 clean-card p-4 flex flex-col justify-between h-full overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Project Development Phases</h3>
                <span className="text-[10px] text-slate-400">Step-by-step progress towards final launch</span>
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Phase {completedMilestones.length + 1} Active
              </span>
            </div>

            {/* List of Milestones (Compact rows) */}
            <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1">
              {selectedProject.milestones.map((milestone, idx) => {
                const isCompleted = milestone.completed;
                const prevCompleted = idx === 0 || selectedProject.milestones[idx - 1].completed;
                const isActive = !isCompleted && prevCompleted;

                return (
                  <div
                    key={milestone.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 text-xs transition-colors ${
                      isCompleted
                        ? 'bg-slate-50/60 border-slate-200/80'
                        : isActive
                        ? 'bg-amber-50/40 border-amber-300 shadow-2xs'
                        : 'bg-white border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>

                      <div className="min-w-0">
                        <span className={`font-bold block truncate text-xs ${
                          isCompleted ? 'text-slate-700' : 'text-slate-900'
                        }`}>
                          {milestone.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          Due: {milestone.dueDate}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      isCompleted 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : isActive
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isCompleted ? 'Finished ✓' : isActive ? 'Active ⚡' : 'Upcoming'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Automated Daily CI/CD Builds</span>
            <span className="font-bold text-emerald-700">All tests passing ✓</span>
          </div>
        </div>

        {/* Right Column (5 Cols): Team Squad + Financials + Message */}
        <div className="md:col-span-5 flex flex-col justify-between gap-2.5 h-full overflow-hidden">
          
          {/* Top Mini Card: Squad on Build (~120px) */}
          <div className="clean-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Team on Your Project
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                Live
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {activeSpecialists.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-2 bg-slate-50/70 p-1.5 rounded-lg border border-slate-200/70">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded-md bg-slate-900 text-amber-300 font-bold text-[9px] flex items-center justify-center shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-800 text-[11px] truncate">{member.name}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 capitalize truncate">
                    {member.role === 'leader' ? 'Lead Architect' : member.department || 'Developer'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Mini Card: Financial Status (~80px) */}
          <div className="clean-card p-3 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Financial Status
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/80">
                <span className="text-[9px] text-slate-400 block">Budget</span>
                <span className="font-bold text-slate-900 font-mono text-[11px]">PKR {(selectedProject.totalBudget / 1000).toFixed(0)}K</span>
              </div>
              <div className="bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-200">
                <span className="text-[9px] text-emerald-700 block">Paid</span>
                <span className="font-bold text-emerald-800 font-mono text-[11px]">PKR {(selectedProject.paidAmount / 1000).toFixed(0)}K</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/80">
                <span className="text-[9px] text-slate-400 block">Balance</span>
                <span className="font-bold text-slate-800 font-mono text-[11px]">
                  {balance <= 0 ? 'Cleared ✓' : `PKR ${(balance / 1000).toFixed(0)}K`}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Card: Quick Note to Lead (~110px) */}
          <div className="clean-card p-3 space-y-1.5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3 text-amber-600" />
                <span className="text-[10px] font-bold text-slate-800">Quick Note to Abdul Hannan</span>
              </div>
              <span className="text-[9px] text-slate-400">Direct SLA</span>
            </div>

            {feedbackSent ? (
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Message delivered to Abdul Hannan!</span>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="flex gap-1.5">
                <input
                  type="text"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Ask a question or request an update..."
                  className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
                  required
                />
                <button
                  type="submit"
                  className="btn-gold text-xs px-3 py-1.5 shrink-0 shadow-2xs"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}

            <span className="text-[9px] text-slate-400 block text-center">
              100% Code & IP Ownership Guaranteed • NDA Protected
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
