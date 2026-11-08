'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  FolderKanban, CheckCircle2, Clock, Users, 
  ChevronDown, Layers, RefreshCw, Sparkles, ArrowRight
} from 'lucide-react';

export default function LeaderDashboard() {
  const { 
    projects, 
    tasks, 
    users, 
    currentUser,
    approveUser,
    setActiveTab
  } = useApp();

  const pendingUsers = users.filter(u => u.status === 'pending_approval');
  const activeStaffCount = users.filter(u => u.status === 'active' && u.role !== 'client').length;

  const workloadMembers = [
    { name: 'John', height: '65%', val: '22' },
    { name: 'Sarah', height: '35%', val: '12' },
    { name: 'Ana', height: '48%', val: '16' },
    { name: 'Mike', height: '75%', val: '24' },
    { name: 'Lisa', height: '44%', val: '15' },
    { name: 'David', height: '48%', val: '16' },
    { name: 'Liam', height: '90%', val: '28' },
    { name: 'Alex', height: '55%', val: '17' },
  ];

  return (
    <div className="space-y-6">
      {/* PENDING SIGNUPS ALERT */}
      {pendingUsers.length > 0 && (
        <div className="glass-card-gold p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl icon-badge-gold flex items-center justify-center font-bold text-amber-400">
              !
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300">
                {pendingUsers.length} User Signup Awaiting Confirmation
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Staff member {pendingUsers[0].name} ({pendingUsers[0].email}) requires leader authorization.
              </p>
            </div>
          </div>
          <button
            onClick={() => approveUser(pendingUsers[0].id, pendingUsers[0].role, pendingUsers[0].department, 120000)}
            className="btn-gold text-xs py-2 px-4"
          >
            Confirm & Activate
          </button>
        </div>
      )}

      {/* 1. TOP 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Projects */}
        <div className="glass-card p-5 flex flex-col justify-between h-32 hover:border-amber-400/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="section-label">Active Projects</span>
            <div className="w-8 h-8 rounded-lg icon-badge-gold flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100 tracking-tight font-mono">15</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Across engineering & design</p>
          </div>
        </div>

        {/* Card 2: Completion Rate */}
        <div className="glass-card p-5 flex flex-col justify-between h-32 hover:border-amber-400/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="section-label">Completion Rate</span>
            <div className="w-8 h-8 rounded-lg icon-badge-gold flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400 tracking-tight font-mono">85%</div>
            <p className="text-[11px] text-amber-400/80 font-medium mt-0.5">+4% from last sprint</p>
          </div>
        </div>

        {/* Card 3: Tasks Due Today */}
        <div className="glass-card p-5 flex flex-col justify-between h-32 hover:border-slate-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="section-label">Tasks Due Today</span>
            <div className="w-8 h-8 rounded-lg icon-badge-silver flex items-center justify-center">
              <Clock className="w-4 h-4 text-slate-300" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100 tracking-tight font-mono">12</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Assigned to active sprints</p>
          </div>
        </div>

        {/* Card 4: Team Members */}
        <div className="glass-card p-5 flex flex-col justify-between h-32 hover:border-slate-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="section-label">Team Members</span>
            <div className="w-8 h-8 rounded-lg icon-badge-silver flex items-center justify-center">
              <Users className="w-4 h-4 text-slate-300" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100 tracking-tight font-mono">08</div>
            <p className="text-[11px] text-slate-500 mt-0.5">{activeStaffCount} active staff online</p>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: TEAM WORKLOAD & TASK STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Team Workload (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Team Workload
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Weekly hours logged across engineering</p>
            </div>
            <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
              Weekly Report
            </span>
          </div>

          <div className="flex items-end justify-between gap-4 h-44 px-2 relative">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-slate-500 font-mono pointer-events-none select-none">
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>

            <div className="flex items-end justify-between w-full pl-7 pr-2 h-full">
              {workloadMembers.map((m, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="w-7 bg-white/[0.04] border border-white/[0.05] rounded-t-md h-36 flex items-end justify-center p-0.5 overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 rounded-t-sm transition-all duration-300 group-hover:from-amber-500 group-hover:to-amber-300 shadow-sm"
                      style={{ height: m.height }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 mt-2 group-hover:text-amber-400 transition-colors">
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Status (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100">
              Task Status
            </h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* To Do */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg icon-badge-silver flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">To Do</p>
                <p className="text-[11px] text-slate-500">12 Projects</p>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-amber-400/30 transition-colors rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg icon-badge-gold flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">In Progress</p>
                <p className="text-[11px] text-slate-500">20 Projects</p>
              </div>
            </div>

            {/* Revisions */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg icon-badge-silver flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Revisions</p>
                <p className="text-[11px] text-slate-500">08 Projects</p>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-amber-400/30 transition-colors rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg icon-badge-gold flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Completed</p>
                <p className="text-[11px] text-slate-500">22 Projects</p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 flex justify-between text-xs text-slate-500" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Sprint Storypoints: 128 pts</span>
            <span className="font-semibold text-amber-400">92% On-Time Delivery</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: TIMELINE / GANTT CHART */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Timeline / Gantt Chart
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Project development schedule and delivery milestones</p>
          </div>
          <div className="btn-silver text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer">
            <span>Filter</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="pb-3 pl-2 section-label">Project Name & ID</th>
                <th className="pb-3 section-label">Start Date</th>
                <th className="pb-3 section-label">End Date</th>
                <th className="pb-3 section-label">Team</th>
                <th className="pb-3 pr-2 text-right section-label">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {[
                { 
                  id: 'C-108822', 
                  name: 'Apex Freight ERP & Dispatch Portal', 
                  start: '12-05-2025', 
                  end: '29-08-2025', 
                  team: ['Hamza', 'Bilal', 'Zainab'], 
                  status: 'In Progress' 
                },
                { 
                  id: 'C-108823', 
                  name: 'Lumina Health AI Diagnostic App', 
                  start: '22-06-2025', 
                  end: '11-10-2025', 
                  team: ['Hamza', 'Zainab'], 
                  status: 'Pending' 
                },
                { 
                  id: 'C-108824', 
                  name: 'Nova AI Content Studio', 
                  start: '01-08-2025', 
                  end: '25-11-2025', 
                  team: ['Bilal', 'Ayesha'], 
                  status: 'Completed' 
                },
                { 
                  id: 'C-108825', 
                  name: 'Zenith Real Estate Marketplace', 
                  start: '15-09-2025', 
                  end: '28-02-2026', 
                  team: ['Ayesha', 'Zainab'], 
                  status: 'In Progress' 
                },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="font-semibold text-slate-200 text-xs">{row.name}</div>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 inline-block">{row.id}</span>
                  </td>
                  <td className="py-3.5 text-slate-400 font-mono text-[11px]">{row.start}</td>
                  <td className="py-3.5 text-slate-400 font-mono text-[11px]">{row.end}</td>
                  <td className="py-3.5">
                    <div className="flex items-center -space-x-1.5">
                      {row.team.map((m, i) => (
                        <div 
                          key={i} 
                          title={m}
                          className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#0d0f14] text-[9px] font-black flex items-center justify-center ring-2 ring-[#13161e]"
                        >
                          {m.charAt(0)}
                        </div>
                      ))}
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[8px] font-bold flex items-center justify-center ring-2 ring-[#13161e]">
                        +2
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                      row.status === 'Completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : row.status === 'In Progress'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
