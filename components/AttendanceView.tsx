'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Clock, Users, Coffee, Calendar, Check, X, 
  Sparkles, CheckCircle2, AlertCircle, FileText,
  Filter
} from 'lucide-react';

export default function AttendanceView() {
  const { 
    users, 
    attendance, 
    leaves, 
    reviewLeave, 
    currentUser,
    eodReports 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'live_board' | 'cleaners' | 'history' | 'leaves'>('live_board');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const isLeader = currentUser.role === 'leader';
  const staffUsers = users.filter(u => u.role !== 'client' && u.status === 'active');
  const filteredUsers = departmentFilter === 'ALL' 
    ? staffUsers 
    : staffUsers.filter(u => u.department === departmentFilter);

  const workingCount = staffUsers.filter(u => u.workStatus === 'working').length;
  const breakCount = staffUsers.filter(u => u.workStatus === 'on_break').length;
  const leaveCount = staffUsers.filter(u => u.workStatus === 'on_leave').length;
  const offlineCount = staffUsers.filter(u => u.workStatus === 'offline').length;

  const cleaners = staffUsers.filter(u => u.role === 'support_cleaner');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Hazari & Attendance Presence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time shift tracking, breaks, leaves, and cleaners maintenance
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl">
          <div className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>{workingCount} Working</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>{breakCount} Break</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>{leaveCount} Leave</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>{offlineCount} Offline</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="clean-card p-1.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('live_board')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'live_board' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Live Hazari Board
          </button>
          <button
            onClick={() => setActiveSubTab('cleaners')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'cleaners' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Cleaners & Maintenance
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'history' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Timesheet History
          </button>
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'leaves' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Leaves (Choti)</span>
            {leaves.filter(l => l.status === 'pending').length > 0 && (
              <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                {leaves.filter(l => l.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {activeSubTab === 'live_board' && (
          <div className="flex items-center gap-2 pr-2">
            <span className="text-xs text-slate-400">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none"
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

      {/* SUB-TAB 1: LIVE HAZARI BOARD */}
      {activeSubTab === 'live_board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((user) => {
            const userAttendance = attendance.find(a => a.userId === user.id);
            const isWorking = user.workStatus === 'working';
            return (
              <div
                key={user.id}
                className="clean-card p-4 space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">{user.name}</h4>
                      <p className="text-[11px] text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize flex items-center gap-1 ${
                    isWorking 
                      ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isWorking ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'}`} />
                    {user.workStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-lg p-2.5 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Department:</span>
                    <span className="font-medium text-slate-700">{user.department}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Clock In:</span>
                    <span className="font-medium text-slate-700">{userAttendance?.clockInTime || 'Not yet'}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Break Taken:</span>
                    <span className="font-medium text-slate-700">{userAttendance?.totalBreakMinutes || 0} mins</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: CLEANERS & MAINTENANCE */}
      {activeSubTab === 'cleaners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cleaners.map((cleaner) => {
            const cleanerAtt = attendance.find(a => a.userId === cleaner.id);
            return (
              <div key={cleaner.id} className="clean-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {cleaner.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{cleaner.name}</h4>
                      <p className="text-[11px] text-slate-400">Office Caretaker & Hygiene</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                    {cleaner.workStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Daily Hygiene Zones:
                  </span>
                  {[
                    { task: 'Sanitize Main Coding Floor & Desks', done: true },
                    { task: 'Dust Server Rack Room & Clear Cables', done: true },
                    { task: 'Washroom Disinfection & Restock', done: cleaner.workStatus === 'working' },
                    { task: 'Pantry Coffee Machine & Dispenser', done: true },
                    { task: 'Evening Trash Disposal & Floor Mopping', done: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-xs">
                      <span className={`text-xs ${item.done ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                        {item.task}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.done ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.done ? 'Done ✓' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 3: TIMESHEET */}
      {activeSubTab === 'history' && (
        <div className="clean-card p-6">
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
                  <td className="py-3 pl-2 font-semibold text-slate-900">{record.userName}</td>
                  <td className="py-3 text-slate-500">{record.userRole}</td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">{record.date}</td>
                  <td className="py-3 text-slate-700 font-mono text-[11px]">{record.clockInTime || '--:--'}</td>
                  <td className="py-3 text-slate-700 font-mono text-[11px]">{record.clockOutTime || 'Active'}</td>
                  <td className="py-3 font-medium text-slate-800">{record.totalWorkMinutes ? `${Math.round((record.totalWorkMinutes / 60) * 10) / 10} hrs` : 'In Progress'}</td>
                  <td className="py-3 pr-2 text-right">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 capitalize">
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
            <div key={leave.id} className="p-3.5 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900">{leave.userName}</span>
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded capitalize">
                    {leave.leaveType} Leave
                  </span>
                </div>
                <p className="text-xs text-slate-600">"{leave.reason}"</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Period: <strong>{leave.startDate}</strong> to <strong>{leave.endDate}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {leave.status === 'pending' && isLeader ? (
                  <>
                    <button
                      onClick={() => reviewLeave(leave.id, 'approved')}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reviewLeave(leave.id, 'rejected')}
                      className="btn-light text-xs py-1.5 px-3"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded capitalize bg-slate-100 text-slate-700">
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
