'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { 
  Clock, Coffee, Play, Square, CheckSquare, DollarSign, 
  Calendar, Sparkles, CheckCircle2,
  TrendingUp, Send, Check, ShieldCheck, Flame, Zap, Award
} from 'lucide-react';

export default function StaffDashboard() {
  const { 
    currentUser, 
    todayAttendance, 
    clockIn, 
    startBreak, 
    resumeWork, 
    setIsEODModalOpen, 
    tasks, 
    updateTaskStatus, 
    payroll, 
    applyLeave, 
    leaves, 
    setActiveTab 
  } = useApp();

  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentUser.workStatus === 'working') {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentUser.workStatus]);

  const formatStopwatch = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const myTasks = tasks.filter(t => t.assignedToId === currentUser.id);
  const myPayrolls = payroll.filter(p => p.userId === currentUser.id);
  const latestPayroll = myPayrolls[0] || null;

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'casual' | 'sick' | 'annual' | 'emergency'>('casual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveReason, setLeaveReason] = useState('');

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    applyLeave({
      leaveType,
      startDate,
      endDate,
      reason: leaveReason,
    });
    setLeaveReason('');
    setShowLeaveModal(false);
  };

  const isCleaner = currentUser.role === 'support_cleaner';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Shift Controller Command Card */}
      <div className="glass-card-gold p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                {currentUser.department}
              </span>
              <span className="text-xs text-slate-400 capitalize font-medium">
                Role: {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Welcome back, {currentUser.name}!
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Record shift time, update sprint milestones, and submit your mandatory daily checkout report.
            </p>
          </div>

          {/* Shift Timer & Frosted 2D Actions */}
          <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Today's Shift Timer</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-100 mt-0.5">
                {currentUser.workStatus === 'working' ? (
                  formatStopwatch(secondsElapsed > 0 ? secondsElapsed : 245 * 60)
                ) : currentUser.workStatus === 'on_break' ? (
                  <span className="text-amber-400 font-bold text-lg">On Break</span>
                ) : (
                  <span className="text-slate-500 font-bold text-lg">Shift Offline</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {todayAttendance?.clockInTime ? `Clocked in: ${todayAttendance.clockInTime}` : 'Not started'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentUser.workStatus === 'offline' && (
                <button
                  onClick={clockIn}
                  className="btn-gold text-xs py-2 px-5 gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Clock In Shift</span>
                </button>
              )}

              {currentUser.workStatus === 'working' && (
                <>
                  <button
                    onClick={startBreak}
                    className="btn-silver text-xs py-2 px-4 gap-2"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Take Break</span>
                  </button>
                  <button
                    onClick={() => setIsEODModalOpen(true)}
                    className="btn-dark text-xs py-2 px-4 gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>End Day (EOD)</span>
                  </button>
                </>
              )}

              {currentUser.workStatus === 'on_break' && (
                <button
                  onClick={resumeWork}
                  className="btn-gold text-xs py-2 px-5 gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Shift</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Assigned Tasks', val: `${myTasks.length} Active`, icon: CheckSquare, sub: `${myTasks.filter(t => t.status === 'completed').length} Completed` },
          { label: 'Current Salary', val: latestPayroll ? `PKR ${latestPayroll.netSalary.toLocaleString()}` : 'PKR 180,000', icon: DollarSign, sub: 'Disburses end of month' },
          { label: 'Shift Hours Tracked', val: '38.5 hrs', icon: Clock, sub: 'This cycle / 40h standard' },
          { label: 'Attendance Streak', val: '14 Days', icon: Flame, sub: '100% on-time record' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card p-5 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="section-label">{card.label}</span>
                <div className="w-8 h-8 rounded-lg icon-badge-gold flex items-center justify-center">
                  <Icon className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="text-xl font-black text-slate-100 mt-3 font-mono">{card.val}</div>
              <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Tasks / Assignments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  {isCleaner ? 'Office Maintenance & Hygiene Tasks' : 'My Sprint Deliverables'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Tasks assigned to you by software house leadership</p>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="btn-silver text-xs py-1.5 px-3"
              >
                View Full Kanban
              </button>
            </div>

            {myTasks.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                <p className="text-xs text-slate-400">All caught up! No pending sprint items assigned to you.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myTasks.map((t) => {
                  const isDone = t.status === 'completed';
                  return (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-amber-400/90 font-mono">
                            {t.projectId ? 'SPRINT' : 'OFFICE'}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            {t.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{t.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span>Due: {t.dueDate}</span>
                          <span className="capitalize">Priority: {t.priority}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={t.status}
                          onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                          className="dark-input text-xs py-1.5 px-2.5 font-medium cursor-pointer"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="revisions">Revisions</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Transparent Compensation & Payroll Summary */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Disbursement & Compensation Ledger</h3>
                <p className="text-xs text-slate-400 mt-0.5">Automated software house payroll history</p>
              </div>
              <button
                onClick={() => setActiveTab('payroll')}
                className="btn-silver text-xs py-1.5 px-3"
              >
                Full Ledger
              </button>
            </div>

            {latestPayroll ? (
              <div className="p-4 rounded-xl bg-amber-400/[0.03] border border-amber-400/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl icon-badge-gold flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      Cycle: {latestPayroll.month}
                    </div>
                    <div className="text-xs text-slate-400">
                      Base: PKR {latestPayroll.baseSalary.toLocaleString()} + Bonus: PKR {latestPayroll.bonus.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black font-mono text-slate-100">
                    PKR {latestPayroll.netSalary.toLocaleString()}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    latestPayroll.status === 'paid'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {latestPayroll.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No recent salary records found.</p>
            )}
          </div>
        </div>

        {/* Right Col: Quick Leave Request & Policy */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-100">Leave Portal</h3>
              <button
                onClick={() => setShowLeaveModal(true)}
                className="btn-gold text-xs py-1 px-3"
              >
                Apply Leave
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
                <span className="text-slate-400">Casual Leaves</span>
                <span className="font-bold text-slate-200">10 / 12 Remaining</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
                <span className="text-slate-400">Medical / Sick Leaves</span>
                <span className="font-bold text-slate-200">7 / 8 Remaining</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
                <span className="text-slate-400">Annual Paid Time Off</span>
                <span className="font-bold text-slate-200">14 / 14 Available</span>
              </div>
            </div>

            {/* Recent Leaves */}
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="section-label block mb-2">My Recent Applications</span>
              {leaves.filter(l => l.userId === currentUser.id).length === 0 ? (
                <p className="text-xs text-slate-500">No leave requests submitted this quarter.</p>
              ) : (
                <div className="space-y-2">
                  {leaves.filter(l => l.userId === currentUser.id).map(l => (
                    <div key={l.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs flex items-center justify-between">
                      <div>
                        <span className="font-medium text-slate-300 capitalize">{l.leaveType}</span>
                        <p className="text-[10px] text-slate-500">{l.startDate} to {l.endDate}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        l.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        l.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="glass-card-gold p-5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-slate-200">Software House Protocol</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every employee must submit their End-Of-Day (EOD) report before leaving the premises. Daily commits must reference sprint task IDs.
            </p>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card-gold p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-100 mb-1">Apply for Leave</h3>
            <p className="text-xs text-slate-400 mb-4">Request approval from software house leadership</p>

            <form onSubmit={handleLeaveSubmit} className="space-y-3">
              <div>
                <label className="block section-label mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="dark-input w-full text-xs font-medium cursor-pointer"
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick / Medical Leave</option>
                  <option value="annual">Annual PTO</option>
                  <option value="emergency">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block section-label mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="dark-input w-full text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block section-label mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="dark-input w-full text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block section-label mb-1">Reason / Note</label>
                <textarea
                  required
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="State the purpose of your leave request..."
                  className="dark-input w-full text-xs resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="btn-silver text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold text-xs py-2 px-4"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
