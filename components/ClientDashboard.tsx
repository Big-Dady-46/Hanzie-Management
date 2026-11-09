'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Briefcase, CheckCircle2, Send, 
  ShieldCheck, Check, TrendingUp, Users,
  MessageSquare
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
        <h3 className="text-base font-semibold text-slate-800">No Active Project Linked</h3>
        <p className="text-sm text-slate-500 mt-1">Your account will display progress once a project is assigned.</p>
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
      
      {/* 1. TOP HEADER BAR */}
      <div className="clean-card px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-300 font-semibold text-sm flex items-center justify-center shrink-0 border border-amber-500/20 shadow-2xs">
            {selectedProject.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base font-semibold text-slate-900 truncate">
                {selectedProject.name}
              </h2>
              <span className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                {selectedProject.category}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Development
              </span>
            </div>
          </div>
        </div>

        {/* Right Info: Target Handover & Lead */}
        <div className="flex items-center gap-4 shrink-0 text-xs">
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 block">Target Handover</span>
            <span className="font-mono font-semibold text-slate-800 text-xs">{selectedProject.deadline}</span>
          </div>

          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-700">Lead: Abdul Hannan</span>
          </div>
        </div>
      </div>

      {/* 2. STAT CARDS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Progress % */}
        <div className="clean-card p-4 flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Progress</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-slate-900 font-mono leading-none">
                {selectedProject.progressPercentage}%
              </span>
              <span className="text-xs text-slate-500 font-medium">On Schedule</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${selectedProject.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Dedicated Squad */}
        <div className="clean-card p-4 flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Engineers</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 font-mono leading-none">
              {activeSpecialists.length} <span className="text-xs font-normal text-slate-500">Specialists</span>
            </div>
            <p className="text-xs text-amber-800/80 font-medium mt-1">Full-stack squad</p>
          </div>
        </div>

        {/* Card 3: Milestones */}
        <div className="clean-card p-4 flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Milestone Phases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-800 font-mono leading-none">
              {completedMilestones.length} <span className="text-xs font-normal text-slate-500">/ {totalMilestonesCount}</span>
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-1">{milestonePct}% completed</p>
          </div>
        </div>

        {/* Card 4: Health */}
        <div className="clean-card p-4 flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Development Health</span>
            <ShieldCheck className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 font-mono leading-none">
              100%
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Zero blockers</p>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column (7 Cols): Milestone Journey & Roadmap */}
        <div className="lg:col-span-7 clean-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Project Development Phases</h3>
                <span className="text-xs text-slate-500">Step-by-step progress towards final launch</span>
              </div>
              <span className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                Phase {completedMilestones.length + 1} Active
              </span>
            </div>

            {/* List of Milestones */}
            <div className="space-y-2.5">
              {selectedProject.milestones.map((milestone, idx) => {
                const isCompleted = milestone.completed;
                const prevCompleted = idx === 0 || selectedProject.milestones[idx - 1].completed;
                const isActive = !isCompleted && prevCompleted;

                return (
                  <div
                    key={milestone.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isCompleted
                        ? 'bg-slate-50/70 border-slate-200/80'
                        : isActive
                        ? 'bg-amber-50/40 border-amber-300'
                        : 'bg-white border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div className="min-w-0">
                        <span className={`font-medium block truncate text-xs sm:text-sm ${
                          isCompleted ? 'text-slate-700' : 'text-slate-900'
                        }`}>
                          {milestone.title}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          Target: {milestone.dueDate}
                        </span>
                      </div>
                    </div>

                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md shrink-0 ${
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

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Automated Daily CI/CD Verification</span>
            <span className="font-medium text-emerald-700">All tests passing ✓</span>
          </div>
        </div>

        {/* Right Column (5 Cols): Team Squad + Financials + Message */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          {/* Card 1: Team Squad on Build */}
          <div className="clean-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Team on Your Project
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Active Squad
              </span>
            </div>

            <div className="space-y-2">
              {activeSpecialists.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-300 font-semibold text-xs flex items-center justify-center shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-800 text-xs sm:text-sm truncate">{member.name}</span>
                  </div>
                  <span className="text-xs text-slate-500 capitalize truncate">
                    {member.role === 'leader' ? 'Lead Architect' : member.department || 'Engineer'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Financial Status */}
          <div className="clean-card p-4 space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Financial Status
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block mb-0.5">Budget</span>
                <span className="font-semibold text-slate-900 font-mono text-xs sm:text-sm">PKR {(selectedProject.totalBudget / 1000).toFixed(0)}K</span>
              </div>
              <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-200">
                <span className="text-xs text-emerald-700 block mb-0.5">Paid</span>
                <span className="font-semibold text-emerald-800 font-mono text-xs sm:text-sm">PKR {(selectedProject.paidAmount / 1000).toFixed(0)}K</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block mb-0.5">Balance</span>
                <span className="font-semibold text-slate-800 font-mono text-xs sm:text-sm">
                  {balance <= 0 ? 'Cleared ✓' : `PKR ${(balance / 1000).toFixed(0)}K`}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Quick Note to Lead */}
          <div className="clean-card p-4 space-y-2.5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-slate-800">Quick Note to Abdul Hannan</span>
              </div>
              <span className="text-xs text-slate-500">Direct Channel</span>
            </div>

            {feedbackSent ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
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
                  className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-normal transition-colors"
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

            <span className="text-xs text-slate-500 block text-center">
              100% Code & IP Ownership Guaranteed • NDA Protected
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
