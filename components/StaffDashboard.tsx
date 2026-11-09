'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { 
  Clock, Coffee, Play, Square, CheckSquare, DollarSign, 
  Calendar, FileText, Sparkles, CheckCircle2, AlertCircle,
  TrendingUp, Award, Send, Check, ShieldCheck, Flame, Zap
} from 'lucide-react';
import CustomDropdown from '@/components/CustomDropdown';
import CustomDatePicker from '@/components/CustomDatePicker';

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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Shift Controller Command Card */}
      <div className="clean-card p-6 bg-gradient-to-r from-amber-50/60 via-white to-slate-50 border-amber-200 hover:border-amber-300 transition-all relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-slate-200" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full">
                {currentUser.department}
              </span>
              <span className="text-xs text-slate-400 capitalize font-medium">
                Role: {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Welcome back, {currentUser.name}!
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Record shift time, update sprint milestones, and submit your mandatory daily checkout report.
            </p>
          </div>

          {/* Shift Timer & Frosted 2D Actions */}
          <div className="bg-slate-50/90 border border-slate-200/90 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-xs">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Today's Shift Timer</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">
                {currentUser.workStatus === 'working' ? (
                  formatStopwatch(secondsElapsed > 0 ? secondsElapsed : 245 * 60)
                ) : currentUser.workStatus === 'on_break' ? (
                  <span className="text-amber-800 font-bold text-lg">On Break</span>
                ) : (
                  <span className="text-slate-400 font-bold text-lg">Shift Offline</span>
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

      {/* Grid: My Tasks & Compensation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 clean-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isCleaner ? 'Daily Cleaning & Maintenance Checklist' : 'My Active Sprint Tickets'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Update sprint velocity and ticket progress directly</p>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-md">
              {myTasks.length} Assigned
            </span>
          </div>

          {myTasks.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">All assigned tickets completed!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Check with Abdul Hannan for your next sprint tasks.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-300 space-y-3 transition-all shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          {task.projectName}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                          {task.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                      {task.description && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <CustomDropdown
                        value={task.status}
                        onChange={(val) => updateTaskStatus(task.id, val as any)}
                        options={[
                          { value: 'todo', label: 'To Do' },
                          { value: 'in_progress', label: 'In Progress' },
                          { value: 'review', label: 'Revisions' },
                          { value: 'completed', label: 'Completed ✓' },
                        ]}
                        menuWidth="w-36"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] font-bold text-slate-600">Completion:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={task.progressPercent}
                      onChange={(e) => updateTaskProgress(task.id, Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <span className="text-xs font-mono font-bold text-amber-800 w-10 text-right">
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
              <h3 className="text-sm font-bold text-slate-900">Salary & Voucher</h3>
              <button
                onClick={() => setActiveTab('payroll')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
              >
                Office Ledger &rarr;
              </button>
            </div>

            {latestPayroll ? (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{latestPayroll.month}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    latestPayroll.status === 'paid'
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {latestPayroll.status}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  PKR {latestPayroll.netSalary.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500">
                  {latestPayroll.status === 'paid' 
                    ? `Disbursed via ${latestPayroll.paymentMethod} on ${latestPayroll.paidDate}` 
                    : 'Salary voucher currently processing by Hanzei Accounts.'}
                </p>
              </div>
            ) : (
              <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                Base Monthly Package: <strong className="text-slate-800">PKR {(currentUser.salary || 50000).toLocaleString()}</strong>
              </div>
            )}
          </div>

          <div className="clean-card p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Apply for Leave (Choti)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit your absence request directly to Abdul Hannan for review.
            </p>
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
            <h3 className="text-base font-bold text-slate-900 mb-1">Apply for Leave (Choti)</h3>
            <p className="text-xs text-slate-500 mb-4">Request approval from office leader.</p>

            <form onSubmit={handleLeaveSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Leave Type</label>
                <CustomDropdown
                  fullWidth
                  value={leaveType}
                  onChange={(val) => setLeaveType(val as any)}
                  options={[
                    { value: 'casual', label: 'Casual Leave' },
                    { value: 'sick', label: 'Sick / Medical Leave' },
                    { value: 'emergency', label: 'Emergency Absence' },
                    { value: 'annual', label: 'Annual Leave' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Start Date</label>
                  <CustomDatePicker
                    fullWidth
                    value={startDate}
                    onChange={setStartDate}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">End Date</label>
                  <CustomDatePicker
                    fullWidth
                    value={endDate}
                    onChange={setEndDate}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Reason *</label>
                <textarea
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Explain reason for leave..."
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