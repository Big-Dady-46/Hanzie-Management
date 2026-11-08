'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, Coffee, 
  Sparkles, Filter, Check, X, Shield, Sparkle, Brush,
  TrendingUp, Laptop, Users, Building2, Flame
} from 'lucide-react';

export default function AttendanceView() {
  const { 
    attendance, 
    users, 
    leaves, 
    reviewLeave, 
    currentUser 
  } = useApp();

  const isLeader = currentUser.role === 'leader';
  const [activeSubTab, setActiveSubTab] = useState<'live_board' | 'cleaners' | 'history' | 'leaves'>('live_board');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [cleanerTasks, setCleanerTasks] = useState([
    { id: 1, zone: 'Main Coding Floor & Workstations', detail: 'Sanitize desks, monitors, and empty floor bins', done: true, time: '09:30 AM' },
    { id: 2, zone: 'Server Rack Room & Console', detail: 'Dust server chassis, verify AC airflow and tidy cables', done: true, time: '10:15 AM' },
    { id: 3, zone: 'Executive Restrooms', detail: 'Disinfection, refill soap, sanitizer, and fresh towels', done: true, time: '11:00 AM' },
    { id: 4, zone: 'Pantry, Coffee Machine & Fridge', detail: 'Clean espresso nozzle, descale kettle, restock water jars', done: true, time: '11:45 AM' },
    { id: 5, zone: 'Evening Floor Mopping & Lockup', detail: 'Complete wet mopping with antiseptic solution and waste disposal', done: false, time: 'Pending 05:30 PM' },
  ]);

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const workingUsers = users.filter(u => u.status === 'active' && u.role !== 'client');
  const filteredUsers = departmentFilter === 'ALL'
    ? workingUsers
    : workingUsers.filter(u => u.department === departmentFilter);

  const cleaners = users.filter(u => u.role === 'support_cleaner');

  const workingCount = workingUsers.filter(u => u.workStatus === 'working').length;
  const breakCount = workingUsers.filter(u => u.workStatus === 'on_break').length;
  const offlineCount = workingUsers.filter(u => u.workStatus === 'offline').length;
  const leaveCount = leaves.filter(l => l.status === 'approved').length;

  const toggleTask = (id: number) => {
    setCleanerTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Live Office Floor Clock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Hazari & Live Floor Attendance
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
              Live Terminal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time biometric shift tracking, break monitors, hygiene zones, and leaves ledger
          </p>
        </div>

        {/* Live Digital Clock Widget */}
        <div className="flex items-center gap-2.5 bg-slate-900 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-xl shadow-xs">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-mono font-bold text-xs tracking-wider">
            PKT {currentTime || '12:00:00 PM'}
          </span>
        </div>
      </div>

      {/* Live Floor Shift Status Bar */}
      <div className="clean-card p-4 bg-gradient-to-r from-white via-amber-50/30 to-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-50 border border-amber-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{workingCount} Working on Floor</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100">
            <Coffee className="w-3.5 h-3.5 text-amber-700" />
            <span>{breakCount} On Break</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{leaveCount} On Leave</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>{offlineCount} Offline</span>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <span>Office Shift: <strong>09:00 AM - 06:00 PM</strong></span>
          <span className="text-amber-700 font-bold">&bull; Day Shift 1</span>
        </div>
      </div>

      {/* Creative Navigation Sub-Tabs */}
      <div className="clean-card p-1.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'live_board', label: 'Live Hazari Floor' },
            { id: 'cleaners', label: 'Hygiene & Cleaners Zone' },
            { id: 'history', label: 'Timesheet History' },
            { id: 'leaves', label: 'Leave Requests (Choti)', badge: leaves.filter(l => l.status === 'pending').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === tab.id
                  ? 'bg-amber-50 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="bg-amber-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeSubTab === 'live_board' && (
          <div className="flex items-center gap-2 pr-2">
            <span className="text-xs text-slate-400 font-medium">Filter Dept:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-700 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Quality Assurance">QA</option>
              <option value="Office & Maintenance">Office Caretakers</option>
            </select>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: LIVE HAZARI FLOOR CARDS */}
      {activeSubTab === 'live_board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((user) => {
            const userAttendance = attendance.find(a => a.userId === user.id);
            const isWorking = user.workStatus === 'working';
            const isOnBreak = user.workStatus === 'on_break';
            const totalMins = userAttendance?.totalWorkMinutes || (isWorking ? 310 : 0);
            const hoursLogged = Math.round((totalMins / 60) * 10) / 10;
            const shiftPct = Math.min(100, Math.round((totalMins / 480) * 100));

            return (
              <div
                key={user.id}
                className="clean-card p-5 space-y-4 hover:border-amber-300 hover:shadow-soft transition-all relative overflow-hidden group"
              >
                {/* Active Status Glow Strip */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isWorking 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-300' 
                      : isOnBreak 
                      ? 'bg-amber-300' 
                      : 'bg-slate-200'
                  }`}
                />

                {/* Staff Head & Presence Ring */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs border border-amber-500/40">
                        {user.name.charAt(0)}
                      </div>
                      <span className={`w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-white ${
                        isWorking ? 'bg-amber-500 animate-pulse' : isOnBreak ? 'bg-amber-400' : 'bg-slate-300'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{user.name}</h4>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.2 rounded capitalize block w-fit mt-0.5">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex items-center gap-1 shrink-0 ${
                    isWorking 
                      ? 'bg-amber-50 text-amber-950 border border-amber-300' 
                      : isOnBreak 
                      ? 'bg-amber-100/60 text-amber-900 border border-amber-200' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {user.workStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Shift Progress Gauge Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Shift Progress</span>
                    <span className="font-mono font-bold text-slate-800">{hoursLogged} / 8.0 hrs</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-600 to-amber-400 h-1.5 rounded-full"
                      style={{ width: `${shiftPct}%` }}
                    />
                  </div>
                </div>

                {/* Time Metrics Pill Box */}
                <div className="bg-slate-50/80 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200/60">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Clock In:</span>
                    <span className="font-mono font-bold text-slate-800">{userAttendance?.clockInTime || 'Not yet'}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Break Taken:</span>
                    <span className="font-mono font-medium text-slate-700">{userAttendance?.totalBreakMinutes || 0} mins</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Department:</span>
                    <span className="font-semibold text-slate-700">{user.department}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: CLEANERS & HYGIENE OPERATIONS ZONE */}
      {activeSubTab === 'cleaners' && (
        <div className="space-y-6">
          {/* Top Hygiene Overview Banner */}
          <div className="clean-card p-6 bg-gradient-to-r from-amber-50/60 via-white to-slate-50 border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-center justify-center shrink-0">
                <Brush className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Software House Hygiene & Caretaker Protocol
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Coding floor air quality, server room dust prevention, and sanitized common rooms
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sanitation Index</span>
                <span className="text-xl font-black text-amber-800">
                  {Math.round((cleanerTasks.filter(t => t.done).length / cleanerTasks.length) * 100)}% Spotless
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-amber-300 border-t-amber-600 flex items-center justify-center font-bold text-xs text-slate-900">
                {cleanerTasks.filter(t => t.done).length}/{cleanerTasks.length}
              </div>
            </div>
          </div>

          {/* Interactive Checklist of Hygiene Zones */}
          <div className="clean-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daily Inspection Checklist (Click to Toggle Status)
              </h4>
              <span className="text-xs text-slate-400">Click any zone to update completion</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cleanerTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`cursor-pointer p-4 rounded-2xl border flex items-start justify-between transition-all select-none ${
                    t.done 
                      ? 'bg-amber-50/40 border-amber-300 text-slate-900 shadow-xs' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                      t.done 
                        ? 'bg-amber-600 text-white' 
                        : 'border border-slate-300 text-slate-400 bg-slate-50'
                    }`}>
                      {t.done ? '✓' : ''}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{t.zone}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.detail}</p>
                      <span className="text-[10px] font-mono text-slate-400 block mt-1">Logged: {t.time}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                    t.done 
                      ? 'bg-amber-100/80 text-amber-900 border border-amber-300' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {t.done ? 'Sanitized ✓' : 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TIMESHEET HISTORY */}
      {activeSubTab === 'history' && (
        <div className="clean-card p-6 overflow-x-auto">
          <table className="w-full text-left text-xs font-normal">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 pb-3">
                <th className="pb-3 pl-2 font-semibold uppercase tracking-wider text-[10px]">Staff Member</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Department</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Date</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Clock In</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Clock Out</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Duration Logged</th>
                <th className="pb-3 pr-2 text-right font-semibold uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendance.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="font-bold text-slate-900 text-xs">{record.userName}</div>
                    <span className="text-[10px] text-slate-400 capitalize">{record.userRole.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3.5 text-slate-600">{record.userRole}</td>
                  <td className="py-3.5 text-slate-500 font-mono text-[11px]">{record.date}</td>
                  <td className="py-3.5 text-slate-800 font-mono text-[11px] font-semibold">{record.clockInTime || '--:--'}</td>
                  <td className="py-3.5 text-slate-800 font-mono text-[11px] font-semibold">{record.clockOutTime || 'Active'}</td>
                  <td className="py-3.5">
                    <span className="font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      {record.totalWorkMinutes ? `${Math.round((record.totalWorkMinutes / 60) * 10) / 10} hrs` : 'In Progress'}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-950 border border-amber-300 capitalize">
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUB-TAB 4: LEAVES & CHOTI MANAGEMENT */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="clean-card p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Casual Leave Pool</span>
              <div className="text-xl font-bold text-slate-900 mt-1">12 Days / Year</div>
            </div>
            <div className="clean-card p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Medical Allowance</span>
              <div className="text-xl font-bold text-amber-700 mt-1">8 Days / Year</div>
            </div>
            <div className="clean-card p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved Leaves</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{leaves.filter(l => l.status === 'approved').length} Active</div>
            </div>
          </div>

          <div className="clean-card p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Absence Requests & Approvals
            </h4>

            <div className="space-y-3">
              {leaves.map((leave) => (
                <div 
                  key={leave.id} 
                  className="p-4 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-900">{leave.userName}</span>
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-md capitalize">
                        {leave.leaveType} Leave
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 italic">"{leave.reason}"</p>
                    <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Duration: <strong>{leave.startDate}</strong> to <strong>{leave.endDate}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {leave.status === 'pending' && isLeader ? (
                      <>
                        <button
                          onClick={() => reviewLeave(leave.id, 'approved')}
                          className="btn-gold text-xs py-1.5 px-3.5"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reviewLeave(leave.id, 'rejected')}
                          className="btn-silver text-xs py-1.5 px-3.5"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg capitalize bg-white border border-slate-200 text-slate-700 shadow-2xs">
                        Status: {leave.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}