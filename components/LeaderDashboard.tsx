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
      {/* PENDING SIGNUPS ALERT (Frosted Gold Banner) */}
      {pendingUsers.length > 0 && (
        <div className="clean-card p-5 bg-amber-50/60 border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-badge-gold">
              <span className="font-bold text-sm">!</span>
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                {pendingUsers.length} User Signup Awaiting Confirmation
              </p>
              <p className="text-xs text-amber-800/80 mt-0.5">
                Staff member {pendingUsers[0].name} ({pendingUsers[0].email}) requires leader authorization.
              </p>
            </div>
          </div>
          <button
            onClick={() => approveUser(pendingUsers[0].id, pendingUsers[0].role, pendingUsers[0].department, 120000)}
            className="btn-gold"
          >
            Confirm & Activate
          </button>
        </div>
      )}

      {/* 1. TOP 4 STAT CARDS (Luxury Gold & Silver System) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Projects */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Projects</span>
            <div className="icon-badge-gold">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">15</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Across engineering & design</p>
          </div>
        </div>

        {/* Card 2: Completion Rate */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completion Rate</span>
            <div className="icon-badge-gold">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700 tracking-tight">85%</div>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">+4% from last sprint</p>
          </div>
        </div>

        {/* Card 3: Tasks Due Today */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tasks Due Today</span>
            <div className="icon-badge-silver">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">12</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Assigned to active sprints</p>
          </div>
        </div>

        {/* Card 4: Team Members */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Team Members</span>
            <div className="icon-badge-silver">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">08</div>
            <p className="text-[11px] text-slate-400 mt-0.5">{activeStaffCount} active staff online</p>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: TEAM WORKLOAD & TASK STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Team Workload (7 cols) */}
        <div className="lg:col-span-7 clean-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Team Workload
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Weekly hours logged across engineering</p>
            </div>
            <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
              Weekly Report
            </span>
          </div>

          <div className="flex items-end justify-between gap-4 h-44 px-2 relative">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-slate-400 font-mono pointer-events-none select-none">
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>

            <div className="flex items-end justify-between w-full pl-7 pr-2 h-full">
              {workloadMembers.map((m, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="w-7 bg-slate-100 rounded-t-md h-36 flex items-end justify-center p-0.5">
                    <div
                      className="w-full bg-gradient-to-t from-[#b8860b] to-[#e5c07b] rounded-t-sm transition-all duration-300 group-hover:from-amber-700 group-hover:to-amber-400 shadow-xs"
                      style={{ height: m.height }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-2 group-hover:text-slate-900">
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Status (5 cols) */}
        <div className="lg:col-span-5 clean-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Task Status
            </h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* To Do */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
              <div className="icon-badge-silver w-8 h-8 min-w-8 min-h-8">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">To Do</p>
                <p className="text-[11px] text-slate-400">12 Projects</p>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
              <div className="icon-badge-gold w-8 h-8 min-w-8 min-h-8">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">In Progress</p>
                <p className="text-[11px] text-slate-400">20 Projects</p>
              </div>
            </div>

            {/* Revisions */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
              <div className="icon-badge-silver w-8 h-8 min-w-8 min-h-8">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Revisions</p>
                <p className="text-[11px] text-slate-400">08 Projects</p>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
              <div className="icon-badge-gold w-8 h-8 min-w-8 min-h-8">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Completed</p>
                <p className="text-[11px] text-slate-400">22 Projects</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between text-xs text-slate-400">
            <span>Sprint Storypoints: 128 pts</span>
            <span className="font-semibold text-amber-700">92% On-Time Delivery</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: TIMELINE / GANTT CHART */}
      <div className="clean-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Timeline / Gantt Chart
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Project development schedule and delivery milestones</p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-xs text-slate-600 font-medium">
            <span>Filter</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-200 pb-3">
                <th className="pb-3 pl-2 font-semibold uppercase tracking-wider text-[10px]">Project Name & ID</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Start Date</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">End Date</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Team</th>
                <th className="pb-3 pr-2 text-right font-semibold uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-800">
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
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="font-semibold text-slate-900 text-xs">{row.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block">{row.id}</span>
                  </td>
                  <td className="py-3.5 text-slate-500 font-mono text-[11px]">{row.start}</td>
                  <td className="py-3.5 text-slate-500 font-mono text-[11px]">{row.end}</td>
                  <td className="py-3.5">
                    <div className="flex items-center -space-x-1.5">
                      {row.team.map((m, i) => (
                        <div 
                          key={i} 
                          title={m}
                          className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold flex items-center justify-center ring-2 ring-white"
                        >
                          {m.charAt(0)}
                        </div>
                      ))}
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[8px] font-bold flex items-center justify-center ring-2 ring-white">
                        +2
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block ${
                      row.status === 'Completed' 
                        ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                        : 'bg-slate-100 text-slate-600'
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
