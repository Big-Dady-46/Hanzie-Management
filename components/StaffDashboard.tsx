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

  // Live stopwatch timer for today's shift
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

  // Format stopwatch
  const formatStopwatch = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Staff assigned tasks
  const myTasks = tasks.filter(t => t.assignedToId === currentUser.id);

  // Staff current month salary
  const myPayrolls = payroll.filter(p => p.userId === currentUser.id);
  const latestPayroll = myPayrolls[0] || null;

  // Leave form state
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
      {/* Top Shift Status & Clock-in Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                {currentUser.department}
              </span>
              <span className="text-xs text-slate-400 capitalize">
                Role: {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Hello, {currentUser.name}! 🚀
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mark your attendance (Hazari), manage assigned workload, and submit your mandatory daily report at checkout.
            </p>
          </div>

          {/* Hazari Controller Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-5">
            {/* Live Counter */}
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Today's Work Shift</span>
              </div>
              <div className="text-3xl font-black tracking-tight font-mono text-slate-900 mt-1">
                {currentUser.workStatus === 'working' ? (
                  formatStopwatch(secondsElapsed > 0 ? secondsElapsed : 245 * 60)
                ) : currentUser.workStatus === 'on_break' ? (
                  <span className="text-amber-600 text-xl font-bold">On Break ☕</span>
                ) : (
                  <span className="text-slate-400 text-xl font-bold">Not Clocked In</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {todayAttendance?.clockInTime ? `Clocked in at ${todayAttendance.clockInTime}` : 'No shift logged yet'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {currentUser.workStatus === 'offline' && (
                <button
                  onClick={clockIn}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md shadow-emerald-100 transition-all active:scale-95"
                >
                  <Clock className="w-4 h-4" />
                  <span>Clock In (Hazari Lagayein)</span>
                </button>
              )}

              {currentUser.workStatus === 'working' && (
                <>
                  <button
                    onClick={startBreak}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-md shadow-amber-100 transition-all"
                  >
                    <Coffee className="w-4 h-4" />
                    <span>Chaye / Break</span>
                  </button>
                  <button
                    onClick={() => setIsEODModalOpen(true)}
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-4 py-3 rounded-xl shadow-md shadow-rose-100 transition-all"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>End Day (Daily Report)</span>
                  </button>
                </>
              )}

              {currentUser.workStatus === 'on_break' && (
                <>
                  <button
                    onClick={resumeWork}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-4 py-3 rounded-xl shadow-md shadow-indigo-100 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume Work</span>
                  </button>
                  <button
                    onClick={() => setIsEODModalOpen(true)}
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-4 py-3 rounded-xl shadow-md shadow-rose-100 transition-all"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>End Day (Daily Report)</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Tasks & Salary Transparency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Assigned Tasks */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {isCleaner ? 'Daily Office Maintenance Checklist' : 'My Active Work Tasks'}
              </h3>
              <p className="text-xs text-slate-500">Update your task progress so the Leader and Team can track updates</p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              {myTasks.length} Assigned
            </span>
          </div>

          {myTasks.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">All tasks completed or none assigned!</p>
              <p className="text-[11px] text-slate-400">Enjoy your shift or check in with your team lead.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {myTasks.map((task) => (
                <div 
                  key={task.id}
                  className="p-4 rounded-2xl border border-slate-200/90 hover:border-indigo-300 transition-all bg-white shadow-2xs group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {task.projectName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          task.priority === 'urgent' ? 'bg-rose-100 text-rose-700' :
                          task.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-slate-500 mt-1">{task.description}</p>
                      )}
                    </div>

                    {/* Status Pill Switcher */}
                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Under Review</option>
                        <option value="completed">Completed ✓</option>
                      </select>
                    </div>
                  </div>

                  {/* Progress Slider */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4">
                    <span className="text-[11px] font-bold text-slate-500">Progress:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={task.progressPercent}
                      onChange={(e) => updateTaskProgress(task.id, Number(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
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

        {/* Right Col: Personal Salary & Transparency + Leave Request */}
        <div className="space-y-6">
          {/* Salary Transparency Slip Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Salary & Payslip</h3>
              </div>
              <button
                onClick={() => setActiveTab('payroll')}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                Office Ledger
              </button>
            </div>

            {latestPayroll ? (
              <div className="space-y-3">
                <div className={`p-4 rounded-2xl border ${
                  latestPayroll.status === 'paid' 
                    ? 'bg-emerald-50/70 border-emerald-200/80' 
                    : 'bg-amber-50/70 border-amber-200/80'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600">{latestPayroll.month}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      latestPayroll.status === 'paid'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-amber-500 text-white shadow-xs'
                    }`}>
                      {latestPayroll.status}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    PKR {latestPayroll.netSalary.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {latestPayroll.status === 'paid' 
                      ? `Paid via ${latestPayroll.paymentMethod} on ${latestPayroll.paidDate}` 
                      : 'Salary processing by Hanzei Accounts.'}
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <div className="flex justify-between py-1">
                    <span>Base Salary:</span>
                    <span className="font-bold text-slate-800">PKR {latestPayroll.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Bonus:</span>
                    <span className="font-bold text-emerald-600">+PKR {latestPayroll.bonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-slate-200 mt-1 pt-1">
                    <span className="font-bold text-slate-800">Net Payable:</span>
                    <span className="font-extrabold text-slate-900">PKR {latestPayroll.netSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                Base Monthly Salary: PKR {(currentUser.salary || 50000).toLocaleString()}
              </div>
            )}
          </div>

          {/* Leave / Choti Application Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Apply for Leave (Choti)</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Need urgent or sick leave? Apply here directly for Leader approval.
            </p>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Submit Leave Request</span>
            </button>

            {/* Recent leaves */}
            {leaves.filter(l => l.userId === currentUser.id).length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  My Recent Applications:
                </span>
                {leaves.filter(l => l.userId === currentUser.id).map(l => (
                  <div key={l.id} className="text-xs flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="capitalize font-semibold text-slate-700">{l.leaveType} Leave ({l.startDate})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      l.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      l.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Apply for Leave / Choti</h3>
            <p className="text-xs text-slate-500 mb-4">
              Submit your dates and justification. Hanzei management will review.
            </p>

            <form onSubmit={handleLeaveSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick / Medical Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="annual">Annual / Planned Vacation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">End Date</label>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Leave</label>
                <textarea
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Explain why you need leave..."
                  rows={3}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
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

