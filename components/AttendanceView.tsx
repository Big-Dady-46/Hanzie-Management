'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { 
  Calendar, Clock, Coffee, Check, Brush, X
} from 'lucide-react';
import CustomDropdown from '@/components/CustomDropdown';

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
    { id: 1, zone: 'Main Coding Floor & Desks', detail: 'Sanitize workstations and clear trash bins', done: true, time: '09:30 AM' },
    { id: 2, zone: 'Server Rack Room', detail: 'Dust server hardware and inspect AC airflow', done: true, time: '10:15 AM' },
    { id: 3, zone: 'Office Restrooms', detail: 'Disinfect counters, refill soap and fresh towels', done: true, time: '11:00 AM' },
    { id: 4, zone: 'Pantry & Coffee Bar', detail: 'Clean espresso machine nozzle and restock water', done: true, time: '11:45 AM' },
    { id: 5, zone: 'Evening Floor Mopping', detail: 'Complete mopping with disinfectant solution', done: false, time: '05:30 PM' },
  ]);

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const workingUsers = users.filter(u => u.status === 'active' && u.role !== 'client');
  const filteredUsers = departmentFilter === 'ALL'
    ? workingUsers
    : workingUsers.filter(u => u.department === departmentFilter);

  const workingCount = workingUsers.filter(u => u.workStatus === 'working').length;
  const breakCount = workingUsers.filter(u => u.workStatus === 'on_break').length;
  const offlineCount = workingUsers.filter(u => u.workStatus === 'offline').length;
  const leaveCount = leaves.filter(l => l.status === 'approved').length;

  const toggleTask = (id: number) => {
    setCleanerTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Hazari & Attendance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time biometric shift tracking, break status, and caretaker zones
          </p>
        </div>

        {/* Live Clock Pill */}
        <div className="flex items-center gap-2 bg-slate-900 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold shadow-2xs">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>PKT {currentTime || '12:00 PM'}</span>
        </div>
      </div>

      {/* Clean Presence Counters */}
      <div className="clean-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-50 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{workingCount} Working</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100">
            <Coffee className="w-3.5 h-3.5 text-amber-700" />
            <span>{breakCount} Break</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{leaveCount} Leave</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>{offlineCount} Offline</span>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Office Shift: <strong className="text-slate-800">09:00 AM - 06:00 PM</strong>
        </span>
      </div>

      {/* Sub Tabs */}
      <div className="clean-card p-1.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'live_board', label: 'Live Hazari Floor' },
            { id: 'cleaners', label: 'Hygiene & Cleaners' },
            { id: 'history', label: 'Timesheet History' },
            { id: 'leaves', label: 'Leaves (Choti)', badge: leaves.filter(l => l.status === 'pending').length },
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
                <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeSubTab === 'live_board' && (
          <div className="flex items-center gap-2 pr-2">
            <span className="text-xs text-slate-400">Department:</span>
            <CustomDropdown
              value={departmentFilter}
              onChange={setDepartmentFilter}
              options={[
                { value: 'ALL', label: 'All Departments' },
                { value: 'Development', label: 'Development' },
                { value: 'Design', label: 'Design' },
                { value: 'Quality Assurance', label: 'QA' },
                { value: 'Office & Maintenance', label: 'Office Caretakers' },
              ]}
              menuWidth="w-48"
            />
          </div>
        )}
      </div>

      {/* SUB-TAB 1: LIVE HAZARI FLOOR */}
      {activeSubTab === 'live_board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredUsers.map((user) => {
            const userAttendance = attendance.find(a => a.userId === user.id);
            const isWorking = user.workStatus === 'working';
            const isOnBreak = user.workStatus === 'on_break';
            const isOnLeave = user.workStatus === 'on_leave';
            const totalMins = userAttendance?.totalWorkMinutes || (isWorking ? 310 : 0);
            const hoursLogged = Math.round((totalMins / 60) * 10) / 10;
            const shiftPct = Math.min(100, Math.round((totalMins / 480) * 100));

            const statusInfo = isWorking
              ? { label: 'Working', cls: 'bg-amber-50 text-amber-950 border border-amber-300' }
              : isOnBreak
              ? { label: 'On Break', cls: 'bg-amber-100/70 text-amber-900 border border-amber-200' }
              : isOnLeave
              ? { label: 'On Leave', cls: 'bg-sky-50 text-sky-800 border border-sky-200' }
              : { label: 'Offline', cls: 'bg-slate-100 text-slate-600 border border-slate-200/80' };

            return (
              <div
                key={user.id}
                className="clean-card p-5 space-y-4 hover:border-amber-300 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] aspect-square rounded-full bg-slate-900 text-amber-300 font-bold flex items-center justify-center text-sm border border-amber-500/30 shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <span className={`w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-white shrink-0 ${
                        isWorking ? 'bg-amber-500 animate-pulse' : isOnBreak ? 'bg-amber-400' : 'bg-slate-300'
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate" title={user.name}>{user.name}</h4>
                      <p className="text-xs text-slate-400 capitalize truncate">{user.role.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 whitespace-nowrap inline-flex items-center justify-center leading-none ${statusInfo.cls}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Shift Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Shift Progress</span>
                    <span className="font-mono font-bold text-slate-800">{hoursLogged} / 8.0 hrs</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: `${shiftPct}%` }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="bg-slate-50/80 rounded-xl p-3 text-xs space-y-2 border border-slate-200/60">
                  <div className="flex items-center justify-between gap-3 text-slate-500">
                    <span className="text-slate-400 font-medium shrink-0">Clock In:</span>
                    <span className="font-mono font-bold text-slate-800">{userAttendance?.clockInTime || 'Not yet'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-slate-500">
                    <span className="text-slate-400 font-medium shrink-0">Break Taken:</span>
                    <span className="font-mono font-medium text-slate-700">{userAttendance?.totalBreakMinutes || 0} mins</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-slate-500">
                    <span className="text-slate-400 font-medium shrink-0">Department:</span>
                    <span className="font-semibold text-slate-800 truncate text-right">{user.department}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: CLEANERS & HYGIENE */}
      {activeSubTab === 'cleaners' && (
        <div className="clean-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Daily Office Caretaker & Hygiene Checklist
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Click any zone to toggle completion status</p>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-3 py-1 rounded-md">
              {cleanerTasks.filter(t => t.done).length} / {cleanerTasks.length} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cleanerTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-colors select-none ${
                  t.done 
                    ? 'bg-amber-50/40 border-amber-300 text-slate-900' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                    t.done 
                      ? 'bg-amber-600 text-white' 
                      : 'border border-slate-300 text-slate-400'
                  }`}>
                    {t.done && '✓'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{t.zone}</h5>
                    <p className="text-xs text-slate-500 mt-0.5">{t.detail}</p>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                  t.done 
                    ? 'bg-amber-100/80 text-amber-900 border border-amber-200' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {t.done ? 'Done ✓' : 'Pending'}
                </span>
              </div>
            ))}
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
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Total Hours</th>
                <th className="pb-3 pr-2 text-right font-semibold uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendance.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-slate-900 text-xs">{record.userName}</td>
                  <td className="py-3.5 text-slate-600">{record.userRole}</td>
                  <td className="py-3.5 text-slate-500 font-mono text-xs">{record.date}</td>
                  <td className="py-3.5 text-slate-700 font-mono text-xs">{record.clockInTime || '--:--'}</td>
                  <td className="py-3.5 text-slate-700 font-mono text-xs">{record.clockOutTime || 'Active'}</td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {record.totalWorkMinutes ? `${Math.round((record.totalWorkMinutes / 60) * 10) / 10} hrs` : 'In Progress'}
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-950 border border-amber-300 capitalize">
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUB-TAB 4: LEAVES */}
      {activeSubTab === 'leaves' && (
        <div className="clean-card p-6 space-y-3">
          {leaves.map((leave) => (
            <div 
              key={leave.id} 
              className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900">{leave.userName}</span>
                  <span className="text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded capitalize">
                    {leave.leaveType} Leave
                  </span>
                </div>
                <p className="text-xs text-slate-600">"{leave.reason}"</p>
                <p className="text-xs text-slate-400 mt-1">
                  Period: <strong className="text-slate-700 font-mono">{leave.startDate}</strong> to <strong className="text-slate-700 font-mono">{leave.endDate}</strong>
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
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg capitalize bg-white border border-slate-200 text-slate-700">
                    {leave.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}