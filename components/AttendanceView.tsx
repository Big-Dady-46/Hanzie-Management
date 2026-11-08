'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { Clock, Coffee, Calendar, CheckCircle2 } from 'lucide-react';

export default function AttendanceView() {
  const { attendance, users, leaves, reviewLeave, currentUser } = useApp();

  const isLeader = currentUser.role === 'leader';
  const [activeSubTab, setActiveSubTab] = useState<'live_board' | 'cleaners' | 'history' | 'leaves'>('live_board');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [cleanerTasks, setCleanerTasks] = useState([
    { id: 1, zone: 'Main Coding Floor & Workstations', detail: 'Sanitize desks, monitors, empty floor bins', done: true, time: '09:30 AM' },
    { id: 2, zone: 'Server Rack Room & Console', detail: 'Dust server chassis, verify AC airflow', done: true, time: '10:15 AM' },
    { id: 3, zone: 'Executive Restrooms', detail: 'Disinfection, refill soap, fresh towels', done: true, time: '11:00 AM' },
    { id: 4, zone: 'Pantry & Coffee Machine', detail: 'Clean espresso nozzle, descale kettle', done: true, time: '11:45 AM' },
    { id: 5, zone: 'Evening Floor Mopping', detail: 'Complete wet mopping with antiseptic, waste disposal', done: false, time: 'Pending 05:30 PM' },
  ]);

  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const workingUsers = users.filter(u => u.status === 'active' && u.role !== 'client');
  const filteredUsers = departmentFilter === 'ALL' ? workingUsers : workingUsers.filter(u => u.department === departmentFilter);
  const workingCount = workingUsers.filter(u => u.workStatus === 'working').length;
  const breakCount = workingUsers.filter(u => u.workStatus === 'on_break').length;
  const offlineCount = workingUsers.filter(u => u.workStatus === 'offline').length;
  const leaveCount = leaves.filter(l => l.status === 'approved').length;
  const toggleTask = (id: number) => setCleanerTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const subTabs = [
    { id: 'live_board', label: 'Live Floor' },
    { id: 'cleaners', label: 'Hygiene Zone' },
    { id: 'history', label: 'Timesheet' },
    { id: 'leaves', label: 'Leave Requests', badge: leaves.filter(l => l.status === 'pending').length },
  ];

  return (
    <div className="space-y-5 fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">Hazari & Attendance</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded-full animate-pulse">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-600">Real-time shift tracking · {workingUsers.length} active staff</p>
        </div>

        {/* Clock */}
        <div
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="font-mono font-bold text-sm text-amber-300 tracking-widest">
            {currentTime || '12:00:00 PM'}
          </span>
        </div>
      </div>

      {/* Status bar */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg status-working text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span>{workingCount} Working</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg status-break text-xs font-semibold">
            <Coffee className="w-3.5 h-3.5" />
            <span>{breakCount} On Break</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg status-offline text-xs font-medium">
            <span>{offlineCount} Offline</span>
          </div>
          {leaveCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-400 bg-indigo-400/10 border border-indigo-400/20">
              <Calendar className="w-3.5 h-3.5" />
              <span>{leaveCount} On Leave</span>
            </div>
          )}
        </div>
        <span className="text-xs text-slate-700">Office Shift: <strong className="text-slate-500">09:00 AM – 06:00 PM</strong></span>
      </div>

      {/* Sub-tabs */}
      <div
        className="flex items-center gap-1 p-1.5 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === tab.id
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                : 'text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]'
            }`}
          >
            <span>{tab.label}</span>
            {Boolean(tab.badge && tab.badge > 0) && (
              <span className="bg-amber-500 text-black text-[9px] px-1.5 py-0.5 rounded-full font-bold min-w-[16px] text-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}

        {activeSubTab === 'live_board' && (
          <div className="ml-auto pr-1">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="dark-input text-xs py-1 px-2.5"
            >
              <option value="ALL">All Depts</option>
              <option value="Development">Dev</option>
              <option value="Design">Design</option>
              <option value="Quality Assurance">QA</option>
              <option value="Office & Maintenance">Office</option>
            </select>
          </div>
        )}
      </div>

      {/* LIVE FLOOR */}
      {activeSubTab === 'live_board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((user) => {
            const rec = attendance.find(a => a.userId === user.id);
            const isWorking = user.workStatus === 'working';
            const isOnBreak = user.workStatus === 'on_break';
            const totalMins = rec?.totalWorkMinutes || (isWorking ? 310 : 0);
            const hoursLogged = Math.round((totalMins / 60) * 10) / 10;
            const shiftPct = Math.min(100, Math.round((totalMins / 480) * 100));
            const statusClass = isWorking ? 'status-working' : isOnBreak ? 'status-break' : 'status-offline';

            return (
              <div
                key={user.id}
                className="glass-card-hover p-4 space-y-3.5 relative overflow-hidden"
              >
                {/* glow top line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: isWorking
                      ? 'linear-gradient(90deg, transparent, rgba(74,222,128,0.6), transparent)'
                      : isOnBreak
                      ? 'linear-gradient(90deg, transparent, rgba(245,200,66,0.6), transparent)'
                      : 'rgba(255,255,255,0.03)',
                  }}
                />

                {/* Avatar + name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-black font-bold flex items-center justify-center text-sm shadow-md">
                        {user.name.charAt(0)}
                      </div>
                      <span
                        className="w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 border-2"
                        style={{
                          borderColor: '#13161e',
                          background: isWorking ? '#4ade80' : isOnBreak ? '#f5c842' : '#475569',
                          boxShadow: isWorking ? '0 0 6px rgba(74,222,128,0.5)' : isOnBreak ? '0 0 6px rgba(245,200,66,0.5)' : 'none',
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-200 leading-none">{user.name.split(' ')[0]}</h4>
                      <span className="text-[10px] text-slate-600 mt-0.5 block capitalize">{user.role.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-lg ${statusClass}`}>
                    {user.workStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Shift progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-600">Shift Progress</span>
                    <span className="font-mono font-bold text-slate-400">{hoursLogged} / 8h</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${shiftPct}%` }} />
                  </div>
                </div>

                {/* Time details */}
                <div
                  className="p-3 rounded-xl space-y-1.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700">Clock In:</span>
                    <span className="font-mono font-bold text-slate-400">{rec?.clockInTime || '—'}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700">Break Taken:</span>
                    <span className="font-mono text-slate-500">{rec?.totalBreakMinutes || 0} min</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700">Dept:</span>
                    <span className="text-slate-500">{user.department.split(' & ')[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HYGIENE ZONE */}
      {activeSubTab === 'cleaners' && (
        <div className="space-y-4">
          <div className="glass-card-gold p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Hygiene & Caretaker Protocol</h3>
              <p className="text-xs text-slate-600 mt-0.5">Coding floor, server room, restroom & pantry inspections</p>
            </div>
            <div className="text-right">
              <p className="section-label mb-1">Sanitation Index</p>
              <div className="text-xl font-black text-amber-400">
                {Math.round((cleanerTasks.filter(t => t.done).length / cleanerTasks.length) * 100)}%
              </div>
              <p className="text-[10px] text-slate-700">{cleanerTasks.filter(t => t.done).length}/{cleanerTasks.length} zones spotless</p>
            </div>
          </div>

          <div className="glass-card p-5 space-y-3">
            <p className="section-label mb-2">Daily Inspection Checklist</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cleanerTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all select-none"
                  style={{
                    background: t.done ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.03)',
                    border: t.done ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0"
                    style={{
                      background: t.done ? 'linear-gradient(135deg, #f5c842, #c88f00)' : 'rgba(255,255,255,0.05)',
                      border: t.done ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: t.done ? '#1a0f00' : '#475569',
                    }}
                  >
                    {t.done ? '✓' : ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-300">{t.zone}</h5>
                    <p className="text-[11px] text-slate-600 mt-0.5">{t.detail}</p>
                    <span className="text-[10px] font-mono text-slate-700 mt-1 block">{t.time}</span>
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider shrink-0 px-2 py-0.5 rounded-full"
                    style={{
                      background: t.done ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                      color: t.done ? '#f5c842' : '#475569',
                    }}
                  >
                    {t.done ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TIMESHEET HISTORY */}
      {activeSubTab === 'history' && (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Staff Member', 'Dept', 'Date', 'Clock In', 'Clock Out', 'Duration', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendance.map((rec) => (
                <tr key={rec.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-300">{rec.userName}</div>
                    <div className="text-[10px] text-slate-600 capitalize">{rec.userRole.replace('_', ' ')}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{rec.department}</td>
                  <td className="px-4 py-3.5 text-slate-600 font-mono">{rec.date}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-400">{rec.clockInTime || '—'}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-400">{rec.clockOutTime || 'Active'}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                      {rec.totalWorkMinutes ? `${Math.round((rec.totalWorkMinutes / 60) * 10) / 10}h` : 'Live'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LEAVES */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Casual Leave Pool', val: '12 Days / Year', gold: false },
              { label: 'Medical Allowance', val: '8 Days / Year', gold: true },
              { label: 'Approved Leaves', val: `${leaves.filter(l => l.status === 'approved').length} Active`, gold: false },
            ].map((kpi) => (
              <div key={kpi.label} className="glass-card-hover p-4">
                <p className="section-label mb-2">{kpi.label}</p>
                <div className={`text-xl font-bold ${kpi.gold ? 'text-amber-400' : 'text-slate-200'}`}>{kpi.val}</div>
              </div>
            ))}
          </div>

          <div className="glass-card p-5 space-y-3">
            <p className="section-label mb-1">Absence Requests & Approvals</p>
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-200">{leave.userName}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                      {leave.leaveType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{leave.reason}"</p>
                  <p className="text-[10px] text-slate-700 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {leave.startDate} → {leave.endDate}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {leave.status === 'pending' && isLeader ? (
                    <>
                      <button onClick={() => reviewLeave(leave.id, 'approved')} className="btn-gold text-xs py-1.5 px-3.5">Approve</button>
                      <button onClick={() => reviewLeave(leave.id, 'rejected')} className="btn-silver text-xs py-1.5 px-3">Reject</button>
                    </>
                  ) : (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg capitalize"
                      style={{
                        background: leave.status === 'approved' ? 'rgba(74,222,128,0.1)' : leave.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                        color: leave.status === 'approved' ? '#4ade80' : leave.status === 'rejected' ? '#f87171' : '#94a3b8',
                        border: `1px solid ${leave.status === 'approved' ? 'rgba(74,222,128,0.2)' : leave.status === 'rejected' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      {leave.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
