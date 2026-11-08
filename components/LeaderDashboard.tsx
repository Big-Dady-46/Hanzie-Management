'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  FolderKanban, CheckCircle2, Clock, Users, ArrowUpRight, 
  DollarSign, TrendingUp, Sparkles, ChevronDown, Check, X,
  Layers, CheckSquare, RefreshCw
} from 'lucide-react';

export default function LeaderDashboard() {
  const { 
    projects, 
    tasks, 
    users, 
    payroll, 
    attendance, 
    leaves,
    approveUser, 
    rejectUser,
    setActiveTab,
    currentUser
  } = useApp();

  // Metrics matching Image 1
  const activeProjectsCount = projects.filter(p => p.status === 'in_progress' || p.status === 'review').length;
  const avgCompletion = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + p.progressPercentage, 0) / projects.length) 
    : 85;

  const totalMembersCount = users.filter(u => u.status === 'active' && u.role !== 'client').length;
  const pendingUsers = users.filter(u => u.status === 'pending_approval');

  // Workload members matching Image 1
  const workloadData = [
    { name: 'John', height: '65%' },
    { name: 'Sarah', height: '35%' },
    { name: 'Ana', height: '48%' },
    { name: 'Mike', height: '75%' },
    { name: 'Lisa', height: '44%' },
    { name: 'David', height: '50%' },
    { name: 'Liam', height: '90%' },
    { name: 'Alex', height: '55%' },
  ];

  return (
    <div className="space-y-6">
      {/* PENDING APPROVALS ALERT (If any new signup occurs) */}
      {pendingUsers.length > 0 && (
        <div className="bg-[#fff9eb] border border-[#fde68a] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              !
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-900">
                {pendingUsers.length} New Signup Waiting for Your Leader Confirmation
              </h3>
              <p className="text-[11px] text-amber-700">
                Newly registered staff/clients cannot enter until you confirm them.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingUsers.slice(0, 2).map(u => (
              <button
                key={u.id}
                onClick={() => approveUser(u.id, u.role, u.department, 120000)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs"
              >
                Approve {u.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TOP 4 STAT CARDS (EXACT REPLICA OF REFERENCE IMAGE 1: Project Pro) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Projects (Soft Pastel Purple #f4f2ff) */}
        <div className="bg-[#f4f2ff] rounded-2xl p-5 border border-[#eae5ff] flex flex-col justify-between h-32 hover:shadow-xs transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#7c4dff] text-white flex items-center justify-center shadow-xs">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Active Projects</div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {activeProjectsCount || 15}
            </div>
          </div>
        </div>

        {/* Card 2: Completion Rate (Soft Pastel Yellow #fffbf0) */}
        <div className="bg-[#fffbf0] rounded-2xl p-5 border border-[#faeec7] flex flex-col justify-between h-32 hover:shadow-xs transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center shadow-xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Completion Rate</div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {avgCompletion}%
            </div>
          </div>
        </div>

        {/* Card 3: Tasks Due Today (Soft Pastel Pink #fff2f5) */}
        <div className="bg-[#fff2f5] rounded-2xl p-5 border border-[#fcdbe2] flex flex-col justify-between h-32 hover:shadow-xs transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#f43f5e] text-white flex items-center justify-center shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Tasks Due Today</div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              12
            </div>
          </div>
        </div>

        {/* Card 4: Team Members (Soft Pastel Mint #f0fbf6) */}
        <div className="bg-[#f0fbf6] rounded-2xl p-5 border border-[#cbf2de] flex flex-col justify-between h-32 hover:shadow-xs transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#10b981] text-white flex items-center justify-center shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Team Members</div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {totalMembersCount < 10 ? `0${totalMembersCount}` : totalMembersCount}
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Team Workload & Task Status (EXACT REPLICA OF IMAGE 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Team Workload (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm font-bold text-slate-800 mb-6">
            Team Workload
          </h3>

          <div className="flex items-end justify-between gap-3 h-48 px-2">
            {workloadData.map((w, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-slate-50 rounded-t-md h-36 flex items-end justify-center p-1">
                  <div
                    className="w-full bg-[#6bb6ff] rounded-t-md transition-all duration-300 group-hover:bg-[#4ea6fc]"
                    style={{ height: w.height }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-2">
                  {w.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Task Status (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Task Status
          </h3>

          <div className="grid grid-cols-2 gap-3.5">
            {/* To Do */}
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6366f1] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">To Do</p>
                <p className="text-[11px] text-slate-400 font-medium">12 Projects</p>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">In Progress</p>
                <p className="text-[11px] text-slate-400 font-medium">20 Projects</p>
              </div>
            </div>

            {/* Revisions */}
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f43f5e] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Revisions</p>
                <p className="text-[11px] text-slate-400 font-medium">08 Projects</p>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#10b981] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Completed</p>
                <p className="text-[11px] text-slate-400 font-medium">22 Projects</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span>Current Sprint Cycle: 62 Total Tasks</span>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Open Tasks &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Timeline / Gantt Chart (EXACT REPLICA OF IMAGE 1) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-slate-800">
            Timeline / Gantt Chart
          </h3>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium cursor-pointer">
            <span>Status</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-semibold border-b border-slate-100 pb-3">
                <th className="pb-3 pl-1 font-semibold">Project</th>
                <th className="pb-3 font-semibold">Start Date</th>
                <th className="pb-3 font-semibold">End Date</th>
                <th className="pb-3 pr-1 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {[
                { id: 'C-108822', name: 'Apex Freight ERP & Dispatch Portal', start: '12-05-2025', end: '29-08-2025', status: 'In Progress', statusColor: 'bg-[#fff9e6] text-[#b45309]' },
                { id: 'C-108823', name: 'Lumina Health AI Diagnostic App', start: '22-06-2025', end: '11-10-2025', status: 'Pending', statusColor: 'bg-[#fff0f3] text-[#be123c]' },
                { id: 'C-108824', name: 'Nova AI Content Studio', start: '15-08-2025', end: '25-11-2025', status: 'Completed', statusColor: 'bg-[#ecfdf5] text-[#047857]' },
                { id: 'C-108825', name: 'Zenith Real Estate Marketplace', start: '10-10-2025', end: '28-02-2026', status: 'In Progress', statusColor: 'bg-[#fff9e6] text-[#b45309]' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 pl-1">
                    <div className="font-bold text-slate-800">{row.id}</div>
                    <span className="text-[11px] text-slate-400 font-normal">{row.name}</span>
                  </td>
                  <td className="py-4 text-slate-500 font-mono text-[11px]">{row.start}</td>
                  <td className="py-4 text-slate-500 font-mono text-[11px]">{row.end}</td>
                  <td className="py-4 pr-1 text-right">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${row.statusColor}`}>
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
