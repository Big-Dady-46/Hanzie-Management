'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  FolderKanban, CheckCircle2, Clock, Users, 
  ChevronDown, Layers, RefreshCw, Sparkles
} from 'lucide-react';

export default function LeaderDashboard() {
  const { 
    projects, 
    tasks, 
    users, 
    currentUser,
    approveUser
  } = useApp();

  const pendingUsers = users.filter(u => u.status === 'pending_approval');
  const activeStaffCount = users.filter(u => u.status === 'active' && u.role !== 'client').length;

  const workloadMembers = [
    { name: 'John', height: '65%' },
    { name: 'Sarah', height: '35%' },
    { name: 'Ana', height: '48%' },
    { name: 'Mike', height: '75%' },
    { name: 'Lisa', height: '44%' },
    { name: 'David', height: '48%' },
    { name: 'Liam', height: '90%' },
    { name: 'Alex', height: '55%' },
  ];

  return (
    <div className="space-y-6">
      {/* PENDING SIGNUPS ALERT (Only shows if new signups are waiting for leader confirmation) */}
      {pendingUsers.length > 0 && (
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center font-bold text-xs">
              !
            </div>
            <div>
              <p className="text-xs font-bold text-[#92400e]">
                {pendingUsers.length} User Signup Waiting for Leader Confirmation
              </p>
              <p className="text-[11px] text-[#b45309]">
                Staff cannot access dashboard until you confirm their account.
              </p>
            </div>
          </div>
          <button
            onClick={() => approveUser(pendingUsers[0].id, pendingUsers[0].role, pendingUsers[0].department, 120000)}
            className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
          >
            Approve {pendingUsers[0].name}
          </button>
        </div>
      )}

      {/* 1. TOP 4 PASTEL CARDS (EXACT COLORS & STYLE FROM REFERENCE IMAGE 1: Project Pro) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Projects - Soft Pastel Lilac/Purple */}
        <div className="bg-[#f3eefd] rounded-2xl p-5 border border-[#ede5fc] flex flex-col justify-between h-32 hover:shadow-xs transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#7c4dff] text-white flex items-center justify-center shadow-xs">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-[#64748b]">Active Projects</span>
            <div className="text-3xl font-bold text-[#1e293b] tracking-tight mt-0.5">
              15
            </div>
          </div>
        </div>

        {/* Card 2: Completion Rate - Soft Pastel Warm Butter/Yellow */}
        <div className="bg-[#fff9ea] rounded-2xl p-5 border border-[#faeed0] flex flex-col justify-between h-32 hover:shadow-xs transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-[#64748b]">Completion Rate</span>
            <div className="text-3xl font-bold text-[#1e293b] tracking-tight mt-0.5">
              85%
            </div>
          </div>
        </div>

        {/* Card 3: Tasks Due Today - Soft Pastel Rose/Pink */}
        <div className="bg-[#fff0f3] rounded-2xl p-5 border border-[#fcdce3] flex flex-col justify-between h-32 hover:shadow-xs transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#f43f5e] text-white flex items-center justify-center shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-[#64748b]">Tasks Due Today</span>
            <div className="text-3xl font-bold text-[#1e293b] tracking-tight mt-0.5">
              12
            </div>
          </div>
        </div>

        {/* Card 4: Team Members - Soft Pastel Mint Green */}
        <div className="bg-[#eafaf2] rounded-2xl p-5 border border-[#d2f5e3] flex flex-col justify-between h-32 hover:shadow-xs transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#10b981] text-white flex items-center justify-center shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-[#64748b]">Team Members</span>
            <div className="text-3xl font-bold text-[#1e293b] tracking-tight mt-0.5">
              08
            </div>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: Team Workload & Task Status (EXACT IMAGE 1 REPLICA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Team Workload (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm font-bold text-[#1e293b] mb-6">
            Team Workload
          </h3>

          <div className="flex items-end justify-between gap-3 h-48 px-2 relative">
            {/* Left Y-axis labels like Image 1 */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-[#94a3b8] font-mono pointer-events-none">
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>

            {/* Bars container */}
            <div className="flex items-end justify-between w-full pl-6 pr-2 h-full">
              {workloadMembers.map((m, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-7 bg-[#f1f5f9] rounded-t-sm h-36 flex items-end justify-center">
                    <div
                      className="w-full bg-[#52a7ff] rounded-t-sm transition-all duration-300 group-hover:bg-[#3894fa]"
                      style={{ height: m.height }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#64748b] mt-2">
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Status (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[#1e293b] mb-4">
            Task Status
          </h3>

          <div className="grid grid-cols-2 gap-3.5">
            {/* To Do (Purple) */}
            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#818cf8] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1e293b]">To Do</p>
                <p className="text-[11px] text-[#94a3b8]">12 Projects</p>
              </div>
            </div>

            {/* In Progress (Orange) */}
            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1e293b]">In Progress</p>
                <p className="text-[11px] text-[#94a3b8]">20 Projects</p>
              </div>
            </div>

            {/* Revisions (Pink) */}
            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f43f5e] to-[#fb7185] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1e293b]">Revisions</p>
                <p className="text-[11px] text-[#94a3b8]">08 Projects</p>
              </div>
            </div>

            {/* Completed (Emerald) */}
            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#10b981] to-[#34d399] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1e293b]">Completed</p>
                <p className="text-[11px] text-[#94a3b8]">22 Projects</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#f8fafc] text-[11px] text-[#94a3b8] flex justify-between">
            <span>Weekly Target: 62 Tasks</span>
            <span className="font-semibold text-[#3b82f6]">On Schedule</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: Timeline / Gantt Chart (EXACT IMAGE 1 REPLICA) */}
      <div className="bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-[#1e293b]">
            Timeline / Gantt Chart
          </h3>
          <div className="flex items-center gap-1 text-xs text-[#94a3b8] cursor-pointer hover:text-slate-600">
            <span>Status</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#94a3b8] border-b border-[#f1f5f9] pb-3">
                <th className="pb-3 pl-1 font-semibold">Project</th>
                <th className="pb-3 font-semibold">Start Date</th>
                <th className="pb-3 font-semibold">End Date</th>
                <th className="pb-3 pr-1 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc] font-medium text-[#1e293b]">
              {[
                { id: 'C-108822', start: '12-05-2025', end: '29-08-2025', status: 'In Progress', statusStyle: 'bg-[#fffbeb] text-[#b45309]' },
                { id: 'C-108823', start: '22-06-2025', end: '11-10-2025', status: 'Pending', statusStyle: 'bg-[#fff1f2] text-[#e11d48]' },
                { id: 'C-108824', start: '01-08-2025', end: '25-11-2025', status: 'Completed', statusStyle: 'bg-[#ecfdf5] text-[#059669]' },
                { id: 'C-108825', start: '15-09-2025', end: '28-02-2026', status: 'In Progress', statusStyle: 'bg-[#fffbeb] text-[#b45309]' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="py-4 pl-1 font-bold text-[#1e293b]">{row.id}</td>
                  <td className="py-4 text-[#64748b] font-mono text-[11px]">{row.start}</td>
                  <td className="py-4 text-[#64748b] font-mono text-[11px]">{row.end}</td>
                  <td className="py-4 pr-1 text-right">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${row.statusStyle}`}>
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
