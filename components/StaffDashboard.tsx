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
      {/* Shift Controller Card */}
      <div className="clean-card p-6 hover:border-amber-200 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                {currentUser.department}
              </span>
              <span className="text-xs text-slate-400 capitalize">
                Role: {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Hello, {currentUser.name}!
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track your shift time, update sprint tasks, and submit daily report on checkout.
            </p>
          </div>

          {/* Shift Timer & Frosted 2D Actions */}
          <div className="bg-slate-50/80 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-5">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Shift Duration</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                {currentUser.workStatus === 'working' ? (
                  formatStopwatch(secondsElapsed > 0 ? secondsElapsed : 245 * 60)
                ) : currentUser.workStatus === 'on_break' ? (
                  <span className="text-amber-800 font-semibold text-base">On Break</span>
                ) : (
                  <span className="text-slate-400 font-semibold text-base">Offline</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {todayAttendance?.clockInTime ? `Clocked in: ${todayAttendance.clockInTime}` : 'Not started'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentUser.workStatus === 'offline' && (
                <button
                  onClick={clockIn}
                  className="btn-gold"
                >
                  <Clock className="w-3.5 h-3.5 drop-shadow-xs" />
                  <span>Clock In</span>
                </button>
              )}

              {currentUser.workStatus === 'working' && (
                <>
                  <button
                    onClick={startBreak}
                    className="btn-silver"
                  >
                    <Coffee className="w-3.5 h-3.5 text-amber-700" />
                    <span>Break</span>
                  </button>
                  <button
                    onClick={() => setIsEODModalOpen(true)}
                    className="btn-dark"
                  >
                    <Square className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>End Day</span>
                  </button>
                </>
              )}

              {currentUser.workStatus === 'on_break' && (
                <>
                  <button
                    onClick={resumeWork}
                    className="btn-gold"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Resume</span>
                  </button>
                  <button
                    onClick={() => setIsEODModalOpen(true)}
                    className="btn-dark"
                  >
                    <Square className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>End Day</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Tasks & Salary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 clean-card p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isCleaner ? 'Daily Cleaning & Maintenance Checklist' : 'My Active Tasks'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Update sprint progress directly</p>
            </div>
            <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
              {myTasks.length} Assigned
            </span>
          </div>

          {myTasks.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">All assigned tasks completed!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Check with team lead for next tickets.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-amber-300 space-y-2.5 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          {task.projectName}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                          {task.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800">{task.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                        className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-amber-500"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Revisions</option>
                        <option value="completed">Completed ✓</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] font-medium text-slate-500">Progress:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={task.progressPercent}
                      onChange={(e) => updateTaskProgress(task.id, Number(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <span className="text-xs font-mono font-bold text-amber-700 w-10 text-right">
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
          <div className="clean-card p-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Salary & Payslip</h3>
              <button
                onClick={() => setActiveTab('payroll')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
              >
                Ledger
              </button>
            </div>

            {latestPayroll ? (
              <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">{latestPayroll.month}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    latestPayroll.status === 'paid'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {latestPayroll.status}
                  </span>
                </div>
                <div className="text-xl font-bold text-slate-900">
                  PKR {latestPayroll.netSalary.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500">
                  {latestPayroll.status === 'paid' 
                    ? `Disbursed via ${latestPayroll.paymentMethod} on ${latestPayroll.paidDate}` 
                    : 'Salary processing by Hanzei Accounts.'}
                </p>
              </div>
            ) : (
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                Base Monthly Salary: PKR {(currentUser.salary || 50000).toLocaleString()}
              </div>
            )}
          </div>

          <div className="clean-card p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Apply for Leave (Choti)</h3>
            <p className="text-xs text-slate-400 mb-4">Urgent or planned absence request.</p>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="w-full btn-gold"
            >
              Submit Leave Request
            </button>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Apply for Leave</h3>
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
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="btn-silver"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
