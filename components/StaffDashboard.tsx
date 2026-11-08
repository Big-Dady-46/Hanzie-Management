'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { 
  Clock, Coffee, Play, Square, CheckSquare, DollarSign, 
  Calendar, FileText, Sparkles, CheckCircle2, AlertCircle,
  TrendingUp, Award, Send, Check
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
    updateTaskProgress,
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
    <div className="space-y-6">
      {/* Shift Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-[#f4f2ff] px-2.5 py-0.5 rounded-full">
                {currentUser.department}
              </span>
              <span className="text-xs text-slate-400 capitalize font-medium">
                Role: {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Hello, {currentUser.name}! 👋
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Mark your attendance (Hazari), update your tasks progress, and submit daily report on checkout.
            </p>
          </div>

          {/* Hazari Controller */}
          <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-5">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Shift Timer</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-800 mt-1">
                {currentUser.workStatus === 'working' ? (
                  formatStopwatch(secondsElapsed > 0 ? secondsElapsed : 245 * 60)
                ) : currentUser.workStatus === 'on_break' ? (
                  <span className="text-amber-600 font-semibold text-lg">On Break ☕</span>
                ) : (
                  <span className="text-slate-400 font-semibold text-lg">Offline</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {todayAttendance?.clockInTime ? `Clocked in at ${todayAttendance.clockInTime}` : 'Shift not started'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentUser.workStatus === 'offline' && (
                <button
                  onClick={clockIn}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
                >
                  Clock In (Hazari)
                </button>
              )}

              {currentUser.workStatus === 'working' && (
                <>
                  <button
                    onClick={startBreak}
                    className="bg-[#fffbf0] border border-[#faeec7] text-amber-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                  >
                    Break
                  </button>
                  <button
                    onClick={() => setIsEODModalOpen(true)}
                    className="bg-[#fff2f5] border border-[#fcdbe2] text-rose-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                  >
                    End Day (Report)
                  </button>
                </>
              )}

              {currentUser.workStatus === 'on_break' && (
                <>
                  <button
                    onClick={resumeWork}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all"
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => setIsEODModalOpen(true)}
                    className="bg-[#fff2f5] border border-[#fcdbe2] text-rose-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                  >
                    End Day
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Tasks & Salary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {isCleaner ? 'Daily Cleaning & Maintenance Checklist' : 'My Active Tasks'}
              </h3>
              <p className="text-xs text-slate-400">Update your sprint task completion percentage</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
              {myTasks.length} Assigned
            </span>
          </div>

          {myTasks.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">All tasks completed!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTasks.map((task) => (
                <div 
                  key={task.id}
                  className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all bg-[#fafbfc]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {task.projectName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          task.priority === 'urgent' ? 'bg-[#fff2f5] text-rose-700' :
                          task.priority === 'high' ? 'bg-[#fffbf0] text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 mt-1">{task.description}</p>
                      )}
                    </div>

                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                      className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed ✓</option>
                    </select>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4">
                    <span className="text-[11px] font-semibold text-slate-400">Progress:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={task.progressPercent}
                      onChange={(e) => updateTaskProgress(task.id, Number(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-xs font-mono font-bold text-indigo-600 w-10 text-right">
                      {task.progressPercent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Salary & Leave */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Salary & Payslip</h3>
              <button
                onClick={() => setActiveTab('payroll')}
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                Office Ledger
              </button>
            </div>

            {latestPayroll ? (
              <div className="space-y-3">
                <div className={`p-4 rounded-xl border ${
                  latestPayroll.status === 'paid' 
                    ? 'bg-[#f0fbf6] border-[#cbf2de]' 
                    : 'bg-[#fffbf0] border-[#faeec7]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600">{latestPayroll.month}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      latestPayroll.status === 'paid'
                        ? 'bg-[#10b981] text-white'
                        : 'bg-[#f59e0b] text-white'
                    }`}>
                      {latestPayroll.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    PKR {latestPayroll.netSalary.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {latestPayroll.status === 'paid' 
                      ? `Paid via ${latestPayroll.paymentMethod} on ${latestPayroll.paidDate}` 
                      : 'Salary processing by Hanzei Accounts.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl">
                Base Monthly Salary: PKR {(currentUser.salary || 50000).toLocaleString()}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Apply for Leave (Choti)</h3>
            <p className="text-xs text-slate-400 mb-4">Need urgent or casual absence? Apply directly.</p>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
            >
              Submit Leave Request
            </button>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Apply for Leave</h3>
            <form onSubmit={handleLeaveSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="emergency">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Reason</label>
                <textarea
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Explain why you need leave..."
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
