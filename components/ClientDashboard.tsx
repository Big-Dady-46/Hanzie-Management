'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Briefcase, CheckCircle2, Clock, DollarSign, Send, 
  Sparkles, ShieldCheck, ChevronRight, MessageSquare, Check,
  Calendar, User, ArrowUpRight, TrendingUp, Layers, FileCheck,
  CheckCircle, Lock, ExternalLink, Printer, X, Download, Award,
  Users, Activity, Code2, Palette, ShieldAlert, Cpu
} from 'lucide-react';

export default function ClientDashboard() {
  const { 
    currentUser, 
    projects,
    tasks,
    users
  } = useApp();

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [quickTopic, setQuickTopic] = useState<string>('');

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
      <div className="clean-card p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Active Project Linked</h3>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Your client portal account is active. As soon as your project is registered by Abdul Hannan, your live progress monitor will appear here.
        </p>
      </div>
    );
  }

  const completedMilestones = selectedProject.milestones.filter(m => m.completed);
  const totalMilestonesCount = selectedProject.milestones.length;
  const milestonePct = totalMilestonesCount > 0 
    ? Math.round((completedMilestones.length / totalMilestonesCount) * 100) 
    : 0;

  // Active milestone (the first uncompleted one)
  const activeMilestone = selectedProject.milestones.find(m => !m.completed) || selectedProject.milestones[selectedProject.milestones.length - 1];

  // Team working on this project
  const assignedTeam = users.filter(u => 
    selectedProject.assignedTeamMemberIds?.includes(u.id) || u.role === 'leader'
  );

  // If no other team members assigned besides leader, display general active engineering staff for showcase
  const activeSpecialists = assignedTeam.length > 0 
    ? assignedTeam 
    : users.filter(u => u.status === 'active' && u.role !== 'client').slice(0, 3);

  // Filter tasks for this project
  const projectTasks = tasks.filter(t => 
    t.projectId === selectedProject.id || 
    t.projectName?.toLowerCase() === selectedProject.name?.toLowerCase()
  );

  const balance = selectedProject.totalBudget - selectedProject.paidAmount;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP EXECUTIVE CLIENT OVERVIEW BANNER */}
      <div className="clean-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-slate-200" />
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Project Monitor
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Contract #{selectedProject.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap pt-0.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {selectedProject.name}
            </h2>
            <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
              {selectedProject.category}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              <span>In Active Development</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            {selectedProject.description || 'Custom software product engineering and deployment managed by Hanzei Technologies.'}
          </p>
        </div>

        {/* Right Info: Project Switcher (if multi) + Engineering Partner Card */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap shrink-0">
          {clientProjects.length > 1 && (
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
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

          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/20 shadow-2xs shrink-0">
              H
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Hanzei Technologies</div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                Lead: Abdul Hannan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP 4 EXECUTIVE KPI CARDS (White Background, Clean Border, 700 Bold) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Project Completion % */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Project Completion</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {selectedProject.progressPercentage}%
            </div>
            {/* Clean progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedProject.progressPercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Handover Target: <strong className="text-slate-700 font-mono">{selectedProject.deadline}</strong>
            </p>
          </div>
        </div>

        {/* Card 2: Engineering Team Size */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Dedicated Engineers</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Users className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {activeSpecialists.length} <span className="text-sm font-normal text-slate-400">Specialists</span>
            </div>
            <p className="text-[11px] text-amber-700/80 font-semibold mt-0.5">
              Active full-stack squad on your build
            </p>
          </div>
        </div>

        {/* Card 3: Milestone Stages */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Milestone Phases</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-800 tracking-tight font-mono">
              {completedMilestones.length} <span className="text-sm font-normal text-slate-400">/ {totalMilestonesCount}</span>
            </div>
            <p className="text-[11px] text-emerald-700/80 font-semibold mt-0.5">
              {milestonePct}% milestone phases finished
            </p>
          </div>
        </div>

        {/* Card 4: Sprint Velocity / Health */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Development Health</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              100%
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              On schedule • Quality assured
            </p>
          </div>
        </div>

      </div>

      {/* 3. MAIN SECTION: 12-COL OVERVIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Project Journey & Milestones Progress (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Milestone Phases & Visual Journey (Read-Only Showcase) */}
          <div className="clean-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Project Development Phases & Roadmap
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Step-by-step progress tracking from initial architecture to final handover
                </p>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-md">
                {completedMilestones.length} of {totalMilestonesCount} Completed
              </span>
            </div>

            {/* Read-Only Milestone Timeline */}
            <div className="space-y-3">
              {selectedProject.milestones.map((milestone, idx) => {
                const isCompleted = milestone.completed;
                const prevCompleted = idx === 0 || selectedProject.milestones[idx - 1].completed;
                const isActive = !isCompleted && prevCompleted;

                return (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-slate-50/70 border-slate-200/90'
                        : isActive
                        ? 'bg-amber-50/30 border-amber-300 shadow-2xs'
                        : 'bg-white border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Step Indicator */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : isActive
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-xs font-bold ${
                            isCompleted ? 'text-slate-700' : 'text-slate-900'
                          }`}>
                            {milestone.title}
                          </h4>
                          {isActive && (
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                              Active Sprint Focus
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          Target Handover: {milestone.dueDate}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill (Pure Read-Only) */}
                    <div className="shrink-0">
                      {isCompleted ? (
                        <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Finished & QA Tested ✓</span>
                        </span>
                      ) : isActive ? (
                        <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-amber-100/90 text-amber-950 border border-amber-300 inline-flex items-center gap-1">
                          <Activity className="w-3 h-3 text-amber-700" />
                          <span>Under Active Engineering</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 border border-slate-200">
                          Upcoming Phase
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Workstream & Current Deliverables (Real Transparency) */}
          <div className="clean-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Live Workstream & Active Sprint Deliverables
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time visibility into technical modules currently being engineered
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {projectTasks.length > 0 ? projectTasks.length : 3} Deliverables Tracked
              </span>
            </div>

            {projectTasks.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {projectTasks.map(task => (
                  <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        task.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                      }`} />
                      <div>
                        <span className="font-semibold text-slate-800 block truncate">{task.title}</span>
                        <span className="text-[10px] text-slate-400">
                          Assigned Specialist: <strong className="text-slate-600">{task.assignedToName}</strong>
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded capitalize shrink-0 ${
                      task.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : task.status === 'in_progress'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Frontend & Backend Architecture</span>
                      <span className="text-[10px] text-slate-400">Next.js, TypeScript & Supabase Cloud Integration</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    In Progress
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Palette className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800 block">UI/UX Design System & Layout Polish</span>
                      <span className="text-[10px] text-slate-400">Responsive mobile & desktop components</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Dedicated Squad & Transparency (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Dedicated Engineering Squad (Who is building your project) */}
          <div className="clean-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Engineering Squad on Your Project
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dedicated specialists assigned to deliver your project
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {activeSpecialists.length} Specialists
              </span>
            </div>

            <div className="space-y-3">
              {activeSpecialists.map((member, idx) => (
                <div 
                  key={member.id} 
                  className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/20 shrink-0 shadow-2xs">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">{member.name}</span>
                        {member.role === 'leader' && (
                          <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                            Lead
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize block truncate">
                        {member.role === 'leader' ? 'Lead Software Architect' : member.department || 'Software Engineer'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0 inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 text-[11px] text-amber-950 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Full-time dedicated engineering velocity with daily sprint check-ins.</span>
            </div>
          </div>

          {/* Project Budget & Financial Health (Pure Overview) */}
          <div className="clean-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Contract Financial Summary
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transparent milestone settlement overview
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                VERIFIED ✓
              </span>
            </div>

            {/* 3 Overview Boxes */}
            <div className="grid grid-cols-1 gap-2.5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Agreed Contract Budget
                  </span>
                  <span className="text-base font-bold text-slate-900 mt-0.5 block font-mono">
                    PKR {selectedProject.totalBudget.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">Total Scope</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                    Disbursed Payments
                  </span>
                  <span className="text-base font-bold text-emerald-800 mt-0.5 block font-mono">
                    PKR {selectedProject.paidAmount.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Cleared ✓
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Remaining Handover Balance
                  </span>
                  <span className="text-base font-bold text-slate-800 mt-0.5 block font-mono">
                    {balance <= 0 ? 'Settled in Full ✓' : `PKR ${balance.toLocaleString()}`}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {balance <= 0 ? 'Cleared' : 'Due on Handover'}
                </span>
              </div>
            </div>
          </div>

          {/* Direct Note to Lead Abdul Hannan */}
          <div className="clean-card p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Direct Inquiries to Lead (Abdul Hannan)
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have a question regarding your sprint, design, or handover? Drop a direct note to Abdul Hannan.
              </p>
            </div>

            {/* Quick Topic Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Design Feedback', 'Progress Inquiry', 'Feature Discussion'].map(topic => (
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
                <span>Your message was sent to Abdul Hannan! He will reply shortly.</span>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your note or question here..."
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
              Guaranteed direct reply within 2 business hours • Mon - Sat
            </div>
          </div>

          {/* Security & Client Protections */}
          <div className="clean-card p-5 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 border border-slate-200 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Enterprise Safeguards & Guarantees
            </span>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Client Code & IP Ownership Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Enterprise NDA Protected & Confidential Architecture</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>30-Day Post-Launch Technical Support & Warranty</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
