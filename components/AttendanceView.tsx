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
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Hazari & Attendance Presence
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time shift tracking, breaks, leaves and cleaners maintenance
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-2 bg-white border border-[#f1f5f9] p-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="px-3 py-1 bg-[#ecfdf5] rounded-full flex items-center gap-1.5 text-[11px] font-bold text-[#059669]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span>{workingCount} Working</span>
          </div>
          <div className="px-3 py-1 bg-[#fffbeb] rounded-full flex items-center gap-1.5 text-[11px] font-bold text-[#b45309]">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span>{breakCount} Break</span>
          </div>
          <div className="px-3 py-1 bg-[#f3eefd] rounded-full flex items-center gap-1.5 text-[11px] font-bold text-[#7c4dff]">
            <span className="w-2 h-2 rounded-full bg-[#7c4dff]" />
            <span>{leaveCount} Leave</span>
          </div>
          <div className="px-3 py-1 bg-[#f8fafc] rounded-full flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
            <span>{offlineCount} Offline</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-[#f1f5f9] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('live_board')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'live_board' 
                ? 'bg-[#eff6ff] text-[#2563eb] font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Live Hazari Board
          </button>
          <button
            onClick={() => setActiveSubTab('cleaners')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'cleaners' 
                ? 'bg-[#eff6ff] text-[#2563eb] font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🧹 Cleaners & Maintenance
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'history' 
                ? 'bg-[#eff6ff] text-[#2563eb] font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Timesheet History
          </button>
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'leaves' 
                ? 'bg-[#eff6ff] text-[#2563eb] font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Leaves (Choti)</span>
            {leaves.filter(l => l.status === 'pending').length > 0 && (
              <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
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
              className="text-xs bg-[#f8fafc] border border-slate-200/80 rounded-lg px-2.5 py-1 text-slate-700 font-medium"
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

      {/* SUB-TAB 1: LIVE BOARD */}
      {activeSubTab === 'live_board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((user) => {
            const userAttendance = attendance.find(a => a.userId === user.id);
            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl border border-[#f1f5f9] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f1f5f9] text-slate-700 font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{user.name}</h4>
                      <p className="text-[11px] text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex items-center gap-1 ${
                    user.workStatus === 'working' ? 'bg-[#ecfdf5] text-[#059669]' :
                    user.workStatus === 'on_break' ? 'bg-[#fffbeb] text-[#b45309]' :
                    user.workStatus === 'on_leave' ? 'bg-[#f3eefd] text-[#7c4dff]' :
                    'bg-[#f8fafc] text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      user.workStatus === 'working' ? 'bg-[#10b981] animate-pulse' :
                      user.workStatus === 'on_break' ? 'bg-[#f59e0b]' :
                      user.workStatus === 'on_leave' ? 'bg-[#7c4dff]' : 'bg-slate-300'
                    }`} />
                    {user.workStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-[#f8fafc] rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-500">
                    <span>Department:</span>
                    <span className="font-semibold text-slate-700">{user.department}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Clock In:</span>
                    <span className="font-semibold text-slate-700">{userAttendance?.clockInTime || 'Not yet'}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Break Taken:</span>
                    <span className="font-semibold text-amber-700">{userAttendance?.totalBreakMinutes || 0} mins</span>
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
              <div key={cleaner.id} className="bg-white rounded-2xl border border-[#f1f5f9] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-bold text-sm">
                      {cleaner.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{cleaner.name}</h4>
                      <p className="text-xs text-slate-400">Office Caretaker & Hygiene</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                    cleaner.workStatus === 'working' ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cleaner.workStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Daily Assigned Zones:
                  </span>
                  {[
                    { task: 'Sanitize Main Coding Lab & Desks', done: true },
                    { task: 'Dust Server Rack Room & Clear Cable Trays', done: true },
                    { task: 'Washroom Disinfection & Hygiene Restock', done: cleaner.workStatus === 'working' },
                    { task: 'Pantry Coffee Machine & Water Dispenser', done: true },
                    { task: 'Evening Trash Disposal & Floor Mopping', done: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#f8fafc] text-xs">
                      <span className={`font-medium ${item.done ? 'text-slate-800' : 'text-slate-400'}`}>
                        {item.task}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.done ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.done ? 'Done' : 'Pending'}
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
        <div className="bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 pb-3">
                <th className="pb-3 pl-2">Staff Member</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Clock In</th>
                <th className="pb-3">Clock Out</th>
                <th className="pb-3">Break</th>
                <th className="pb-3">Total Work</th>
                <th className="pb-3 pr-2 text-right">EOD Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 pl-2 font-bold text-slate-800">{rec.userName}</td>
                  <td className="py-3.5 text-slate-600">{rec.department}</td>
                  <td className="py-3.5 font-mono text-slate-500">{rec.clockInTime}</td>
                  <td className="py-3.5 font-mono text-slate-500">{rec.clockOutTime || 'Active Shift'}</td>
                  <td className="py-3.5 text-amber-700">{rec.totalBreakMinutes} mins</td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {Math.floor(rec.totalWorkMinutes / 60)}h {rec.totalWorkMinutes % 60}m
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className="text-[10px] font-bold bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded">
                      Submitted ✓
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
        <div className="bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          {leaves.map((leave) => (
            <div key={leave.id} className="p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f8fafc]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-800">{leave.userName}</span>
                  <span className="text-[10px] font-bold bg-[#f3eefd] text-[#7c4dff] px-2 py-0.5 rounded capitalize">
                    {leave.leaveType} Leave
                  </span>
                </div>
                <p className="text-xs text-slate-600">"{leave.reason}"</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dates: <strong>{leave.startDate}</strong> to <strong>{leave.endDate}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {leave.status === 'pending' && isLeader ? (
                  <>
                    <button
                      onClick={() => reviewLeave(leave.id, 'approved')}
                      className="btn-2d-emerald px-4 py-1.5 text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reviewLeave(leave.id, 'rejected')}
                      className="btn-2d-rose px-4 py-1.5 text-xs"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                    leave.status === 'approved' ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fff1f2] text-[#e11d48]'
                  }`}>
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
