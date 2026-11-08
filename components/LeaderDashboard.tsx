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
    <div className="space-y-7">
      {/* PENDING SIGNUPS ALERT */}
      {pendingUsers.length > 0 && (
        <div className="bg-[#fff9ea] border border-[#faeed0] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="icon-round-amber">
              <span className="font-black text-sm">!</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#92400e]">
                {pendingUsers.length} New User Signup Awaiting Confirmation
              </p>
              <p className="text-xs text-[#b45309] mt-0.5">
                Staff members cannot access Hanzei until the Leader verifies their role and salary.
              </p>
            </div>
          </div>
          <button
            onClick={() => approveUser(pendingUsers[0].id, pendingUsers[0].role, pendingUsers[0].department, 120000)}
            className="btn-2d-emerald px-5 py-2.5 text-xs tracking-wide"
          >
            Confirm & Activate {pendingUsers[0].name}
          </button>
        </div>
      )}

      {/* 1. TOP 4 PASTEL STAT CARDS WITH PROPER CIRCULAR 2D ICONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active Projects */}
        <div className="bg-[#f3eefd] rounded-3xl p-7 border border-[#ede5fc] flex flex-col justify-between h-36 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
          <div className="icon-round-purple">
            <FolderKanban className="w-5 h-5 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#64748b] tracking-wide">Active Projects</span>
            <div className="text-3xl font-black text-[#0f172a] tracking-tight mt-1">
              15
            </div>
          </div>
        </div>

        {/* Card 2: Completion Rate */}
        <div className="bg-[#fff9ea] rounded-3xl p-7 border border-[#faeed0] flex flex-col justify-between h-36 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
          <div className="icon-round-amber">
            <Sparkles className="w-5 h-5 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#64748b] tracking-wide">Completion Rate</span>
            <div className="text-3xl font-black text-[#0f172a] tracking-tight mt-1">
              85%
            </div>
          </div>
        </div>

        {/* Card 3: Tasks Due Today */}
        <div className="bg-[#fff0f3] rounded-3xl p-7 border border-[#fcdce3] flex flex-col justify-between h-36 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
          <div className="icon-round-rose">
            <Clock className="w-5 h-5 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#64748b] tracking-wide">Tasks Due Today</span>
            <div className="text-3xl font-black text-[#0f172a] tracking-tight mt-1">
              12
            </div>
          </div>
        </div>

        {/* Card 4: Team Members */}
        <div className="bg-[#eafaf2] rounded-3xl p-7 border border-[#d2f5e3] flex flex-col justify-between h-36 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
          <div className="icon-round-green">
            <Users className="w-5 h-5 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#64748b] tracking-wide">Team Members</span>
            <div className="text-3xl font-black text-[#0f172a] tracking-tight mt-1">
              08
            </div>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: TEAM WORKLOAD & TASK STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Team Workload (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-base font-bold text-[#0f172a]">
                Team Workload
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Hours logged across active engineering projects</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Weekly
            </span>
          </div>

          <div className="flex items-end justify-between gap-4 h-52 px-2 relative">
            <div className="absolute left-0 top-0 bottom-7 flex flex-col justify-between text-[11px] text-[#94a3b8] font-mono pointer-events-none select-none">
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>

            <div className="flex items-end justify-between w-full pl-8 pr-2 h-full">
              {workloadMembers.map((m, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end group cursor-pointer">
                  <div className="w-8 bg-[#f8fafc] rounded-t-lg h-40 flex items-end justify-center p-0.5">
                    <div
                      className="w-full bg-[#52a7ff] rounded-t-md transition-all duration-300 group-hover:bg-[#2563eb] group-hover:scale-y-105"
                      style={{ height: m.height }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[#64748b] mt-3 group-hover:text-slate-900 transition-colors">
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Status (5 cols) with PROPER CIRCULAR ICONS */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[#0f172a]">
              Task Status
            </h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* To Do */}
            <div className="bg-[#f8fafc] border border-slate-100/80 rounded-2xl p-4 flex items-center gap-3.5 hover:bg-slate-100/70 transition-all cursor-pointer">
              <div className="icon-round-purple">
                <Layers className="w-5 h-5 drop-shadow-sm" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">To Do</p>
                <p className="text-xs text-[#94a3b8] mt-0.5 font-medium">12 Projects</p>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-[#f8fafc] border border-slate-100/80 rounded-2xl p-4 flex items-center gap-3.5 hover:bg-slate-100/70 transition-all cursor-pointer">
              <div className="icon-round-amber">
                <RefreshCw className="w-5 h-5 drop-shadow-sm" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">In Progress</p>
                <p className="text-xs text-[#94a3b8] mt-0.5 font-medium">20 Projects</p>
              </div>
            </div>

            {/* Revisions */}
            <div className="bg-[#f8fafc] border border-slate-100/80 rounded-2xl p-4 flex items-center gap-3.5 hover:bg-slate-100/70 transition-all cursor-pointer">
              <div className="icon-round-rose">
                <Clock className="w-5 h-5 drop-shadow-sm" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">Revisions</p>
                <p className="text-xs text-[#94a3b8] mt-0.5 font-medium">08 Projects</p>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-[#f8fafc] border border-slate-100/80 rounded-2xl p-4 flex items-center gap-3.5 hover:bg-slate-100/70 transition-all cursor-pointer">
              <div className="icon-round-green">
                <CheckCircle2 className="w-5 h-5 drop-shadow-sm" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">Completed</p>
                <p className="text-xs text-[#94a3b8] mt-0.5 font-medium">22 Projects</p>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 mt-5 flex justify-between text-xs text-[#94a3b8]">
            <span>Active Sprint Storypoints: 128 pts</span>
            <span className="font-semibold text-[#10b981]">92% On-Time Delivery</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: TIMELINE / GANTT CHART */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-[#0f172a]">
              Timeline / Gantt Chart
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Project development schedules and milestone delivery dates</p>
          </div>
          <div className="flex items-center gap-2 bg-[#f8fafc] border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs text-[#64748b] font-medium cursor-pointer hover:bg-slate-100 transition-colors">
            <span>Status Filter</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#94a3b8] border-b border-slate-100 pb-4">
                <th className="pb-4 pl-3 font-semibold uppercase tracking-wider text-[11px]">Project Name & ID</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Start Date</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">End Date</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Team</th>
                <th className="pb-4 pr-3 text-right font-semibold uppercase tracking-wider text-[11px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 font-medium text-[#1e293b]">
              {[
                { 
                  id: 'C-108822', 
                  name: 'Apex Freight ERP & Dispatch Portal', 
                  start: '12-05-2025', 
                  end: '29-08-2025', 
                  team: ['Hamza', 'Bilal', 'Zainab'], 
                  status: 'In Progress', 
                  statusStyle: 'bg-[#fff9ea] text-[#b45309] border border-[#fde68a]' 
                },
                { 
                  id: 'C-108823', 
                  name: 'Lumina Health AI Diagnostic App', 
                  start: '22-06-2025', 
                  end: '11-10-2025', 
                  team: ['Hamza', 'Zainab'], 
                  status: 'Pending', 
                  statusStyle: 'bg-[#fff0f3] text-[#e11d48] border border-[#fecdd3]' 
                },
                { 
                  id: 'C-108824', 
                  name: 'Nova AI Content Studio', 
                  start: '01-08-2025', 
                  end: '25-11-2025', 
                  team: ['Bilal', 'Ayesha'], 
                  status: 'Completed', 
                  statusStyle: 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]' 
                },
                { 
                  id: 'C-108825', 
                  name: 'Zenith Real Estate Marketplace', 
                  start: '15-09-2025', 
                  end: '28-02-2026', 
                  team: ['Ayesha', 'Zainab'], 
                  status: 'In Progress', 
                  statusStyle: 'bg-[#fff9ea] text-[#b45309] border border-[#fde68a]' 
                },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-5 pl-3">
                    <div className="font-bold text-[#0f172a] text-sm group-hover:text-blue-600 transition-colors">
                      {row.name}
                    </div>
                    <span className="text-xs text-[#94a3b8] font-mono mt-0.5 inline-block">
                      {row.id}
                    </span>
                  </td>
                  <td className="py-5 text-[#64748b] font-mono text-xs">{row.start}</td>
                  <td className="py-5 text-[#64748b] font-mono text-xs">{row.end}</td>
                  <td className="py-5">
                    <div className="flex items-center -space-x-1.5">
                      {row.team.map((m, i) => (
                        <div 
                          key={i} 
                          title={m}
                          className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center ring-2 ring-white"
                        >
                          {m.charAt(0)}
                        </div>
                      ))}
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                        +2
                      </div>
                    </div>
                  </td>
                  <td className="py-5 pr-3 text-right">
                    <span className={`text-xs font-bold px-3.5 py-1 rounded-full inline-block ${row.statusStyle}`}>
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
