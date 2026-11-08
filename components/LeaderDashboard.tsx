'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  FolderKanban, CheckCircle2, Clock, Users, ArrowUpRight, 
  DollarSign, TrendingUp, AlertTriangle, Sparkles, ShieldCheck,
  ChevronRight, Calendar, UserCheck, Check, X, RefreshCw
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

  // Core metrics
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'review');
  const totalBudget = projects.reduce((acc, p) => acc + p.totalBudget, 0);
  const totalReceived = projects.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalOutstanding = totalBudget - totalReceived;

  // Average completion rate
  const avgCompletion = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + p.progressPercentage, 0) / projects.length) 
    : 0;

  // Active staff today
  const workingUsers = users.filter(u => u.workStatus === 'working' && u.role !== 'client');
  const onBreakUsers = users.filter(u => u.workStatus === 'on_break');
  const onLeaveUsers = users.filter(u => u.workStatus === 'on_leave');
  const cleaners = users.filter(u => u.role === 'support_cleaner');

  // Task metrics
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const reviewTasks = tasks.filter(t => t.status === 'review');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Pending user signups needing leader approval
  const pendingUsers = users.filter(u => u.status === 'pending_approval');

  // Current month payroll stats
  const pendingSalaries = payroll.filter(p => p.status === 'pending');
  const paidSalaries = payroll.filter(p => p.status === 'paid');
  const totalPaidPayroll = paidSalaries.reduce((acc, p) => acc + p.netSalary, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Executive Command Center
            </span>
            <span className="text-xs text-slate-400 font-medium">Software House Lead</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}! 👋
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hanzei Software House is operating at <strong className="text-slate-800">{avgCompletion}% average project velocity</strong>. {workingUsers.length} staff currently clocked in.
          </p>
        </div>

        {/* Quick action badges */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('projects')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all"
          >
            <FolderKanban className="w-4 h-4" />
            <span>Manage Projects</span>
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Live Hazari Board</span>
          </button>
        </div>
      </div>

      {/* PENDING APPROVALS ALERT BOX (If new users signed up) */}
      {pendingUsers.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-3xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-amber-950">
                  New Signups Awaiting Your Leader Approval ({pendingUsers.length})
                </h3>
                <p className="text-xs text-amber-800">
                  As the leader, new staff or clients cannot enter Hanzei until you review and confirm them.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {pendingUsers.map(u => (
              <div key={u.id} className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{u.name}</p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
                    Requested Role: {u.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approveUser(u.id, u.role, u.department, 80000)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => rejectUser(u.id)}
                    className="flex items-center gap-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 Soft Pastel Stat Cards (Inspired directly by Reference Image 1 & 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Projects */}
        <div className="bg-purple-50/70 border border-purple-100/90 rounded-3xl p-5 hover:shadow-soft transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-purple-900/80 uppercase tracking-wider">Active Projects</span>
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900">{activeProjects.length}</h3>
            <span className="text-xs font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md">
              {projects.length} Total
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-purple-900/70">
            <span className="font-semibold text-purple-800">PKR {(totalBudget / 1000000).toFixed(2)}M</span> total pipeline value
          </div>
        </div>

        {/* Card 2: Completion Rate */}
        <div className="bg-amber-50/70 border border-amber-100/90 rounded-3xl p-5 hover:shadow-soft transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-900/80 uppercase tracking-wider">Completion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900">{avgCompletion}%</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              +8.5%
            </span>
          </div>
          <div className="w-full bg-amber-200/50 rounded-full h-1.5 mt-3">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${avgCompletion}%` }} />
          </div>
        </div>

        {/* Card 3: Cash Collected & Received */}
        <div className="bg-emerald-50/70 border border-emerald-100/90 rounded-3xl p-5 hover:shadow-soft transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-900/80 uppercase tracking-wider">Payments Received</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900">PKR {(totalReceived / 1000).toFixed(0)}k</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              Verified
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-800">
            <span>Outstanding:</span>
            <span className="font-bold text-rose-600">PKR {(totalOutstanding / 1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Card 4: Team Hazari Status */}
        <div className="bg-blue-50/70 border border-blue-100/90 rounded-3xl p-5 hover:shadow-soft transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-900/80 uppercase tracking-wider">Live Active Staff</span>
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900">
              {workingUsers.length} <span className="text-xs text-slate-400 font-semibold">/ {users.filter(u => u.role !== 'client' && u.status === 'active').length}</span>
            </h3>
            <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
              {onBreakUsers.length} On Break
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-blue-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{cleaners.filter(c => c.workStatus === 'working').length} Cleaning Staff On Duty</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Team Workload (Image 1) & Task Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Workload Chart (Image 1 recreation) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Team Workload & Output Hours</h3>
              <p className="text-xs text-slate-500">Live hours dedicated to active sprints</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              This Week
            </span>
          </div>

          {/* Bar Visualizer matching Image 1 */}
          <div className="flex items-end justify-between gap-3 h-48 pt-6 px-2 border-b border-slate-100">
            {[
              { name: 'Hamza', role: 'Dev', hours: 32, max: 40, color: 'bg-indigo-500' },
              { name: 'Bilal', role: 'Dev', hours: 24, max: 40, color: 'bg-indigo-400' },
              { name: 'Ayesha', role: 'Dev', hours: 28, max: 40, color: 'bg-indigo-500' },
              { name: 'Zainab', role: 'UI/UX', hours: 35, max: 40, color: 'bg-purple-500' },
              { name: 'Daniyal', role: 'QA', hours: 18, max: 40, color: 'bg-sky-400' },
              { name: 'Rafiq', role: 'Office', hours: 38, max: 40, color: 'bg-emerald-500' },
              { name: 'Bashir', role: 'Support', hours: 20, max: 40, color: 'bg-teal-400' },
            ].map((member, idx) => {
              const heightPercent = Math.round((member.hours / member.max) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                    {member.hours}h
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl h-36 flex items-end overflow-hidden p-1">
                    <div 
                      className={`w-full ${member.color} rounded-t-lg transition-all duration-500 group-hover:brightness-95`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 truncate w-full text-center">
                    {member.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-slate-500">
            <span>Weekly Target: 40 hrs / full-time</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Dev</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Design</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Maintenance</span>
            </div>
          </div>
        </div>

        {/* Task Status Breakdown (Matching Image 1 right card) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">Task Status</h3>
              <button 
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                View all ({tasks.length})
              </button>
            </div>

            <div className="space-y-3">
              {/* To Do */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    TD
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">To Do</p>
                    <p className="text-[11px] text-slate-400">Backlog queue</p>
                  </div>
                </div>
                <span className="text-sm font-black text-indigo-700">{todoTasks.length} Tasks</span>
              </div>

              {/* In Progress */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    IP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">In Progress</p>
                    <p className="text-[11px] text-slate-400">Under active work</p>
                  </div>
                </div>
                <span className="text-sm font-black text-amber-700">{inProgressTasks.length} Tasks</span>
              </div>

              {/* Revisions / Review */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    RV
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Revisions & QA</p>
                    <p className="text-[11px] text-slate-400">Client / lead check</p>
                  </div>
                </div>
                <span className="text-sm font-black text-rose-700">{reviewTasks.length} Tasks</span>
              </div>

              {/* Completed */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Completed</p>
                    <p className="text-[11px] text-slate-400">Shipped & accepted</p>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-700">{completedTasks.length} Tasks</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] font-medium text-slate-400">
              {Math.round((completedTasks.length / (tasks.length || 1)) * 100)}% of current cycle tasks resolved
            </span>
          </div>
        </div>
      </div>

      {/* Timeline / Gantt & Projects Table (Recreation of Image 1 bottom & Image 3) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Timeline / Projects & Financial Health</h3>
            <p className="text-xs text-slate-500">Live milestones, payment receipts & progress tracking</p>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
          >
            <span>Full Project Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Project</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Contract Value</th>
                <th className="pb-3">Paid Amount</th>
                <th className="pb-3">Progress</th>
                <th className="pb-3">Deadline</th>
                <th className="pb-3 pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {projects.map((project) => {
                const isFullyPaid = project.paidAmount >= project.totalBudget;
                return (
                  <tr key={project.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="font-bold text-slate-900">{project.name}</div>
                      <span className="text-[10px] text-slate-400">{project.category}</span>
                    </td>
                    <td className="py-3.5 text-slate-600">{project.clientName}</td>
                    <td className="py-3.5 font-bold text-slate-900">
                      PKR {project.totalBudget.toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${isFullyPaid ? 'text-emerald-600' : 'text-slate-800'}`}>
                          PKR {project.paidAmount.toLocaleString()}
                        </span>
                        {isFullyPaid ? (
                          <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                            PAID
                          </span>
                        ) : (
                          <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                            PARTIAL
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="w-28">
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                          <span className="text-slate-700">{project.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${
                              project.progressPercentage >= 100 ? 'bg-emerald-500' :
                              project.progressPercentage > 60 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${project.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-500">{project.deadline}</td>
                    <td className="py-3.5 pr-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                        project.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        project.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        project.status === 'review' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

