'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Clock, Users, Coffee, Calendar, Check, X, 
  Sparkles, ShieldCheck, CheckCircle2, AlertCircle, FileText,
  Building, Filter
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Live Software House Hazari & Personnel
            </span>
            <span className="text-xs text-slate-400">Real-time attendance & shift monitoring</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Hazari & Staff Presence
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track who is currently coding, who stepped out for break, who is on leave, and verify cleaning maintenance.
          </p>
        </div>

        {/* Live Status Pill Counter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 p-2 rounded-2xl">
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{workingCount} Working</span>
          </div>
          <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-1.5 text-xs font-bold text-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{breakCount} Break</span>
          </div>
          <div className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-1.5 text-xs font-bold text-purple-800">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>{leaveCount} Leave</span>
          </div>
          <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>{offlineCount} Offline</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('live_board')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'live_board' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Live Hazari Board
          </button>
          <button
            onClick={() => setActiveSubTab('cleaners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'cleaners' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🧹 Cleaners & Office Maintenance
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'history' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Timesheet & Daily Shifts
          </button>
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'leaves' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Leave / Choti Requests</span>
            {leaves.filter(l => l.status === 'pending').length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {leaves.filter(l => l.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {activeSubTab === 'live_board' && (
          <div className="flex items-center gap-2 pr-2">
            <span className="text-[11px] font-bold text-slate-400">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700"
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
            return (
              <div
                key={user.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-soft hover:shadow-soft-lg transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-sm shadow-2xs group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 capitalize">
                        {user.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Pulsating status badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex items-center gap-1 ${
                    user.workStatus === 'working' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    user.workStatus === 'on_break' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    user.workStatus === 'on_leave' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      user.workStatus === 'working' ? 'bg-emerald-500 animate-pulse' :
                      user.workStatus === 'on_break' ? 'bg-amber-500' :
                      user.workStatus === 'on_leave' ? 'bg-purple-500' : 'bg-slate-400'
                    }`} />
                    {user.workStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex justify-between text-slate-500">
                    <span>Department:</span>
                    <span className="font-semibold text-slate-800">{user.department}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Clock In:</span>
                    <span className="font-semibold text-slate-800">
                      {userAttendance?.clockInTime || 'Not yet'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Break Taken:</span>
                    <span className="font-semibold text-amber-700">
                      {userAttendance?.totalBreakMinutes || 0} mins
                    </span>
                  </div>
                </div>

                {user.phone && (
                  <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Contact:</span>
                    <span className="font-mono text-slate-600">{user.phone}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: CLEANERS & OFFICE MAINTENANCE */}
      {activeSubTab === 'cleaners' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-3xl p-6 shadow-soft">
            <h3 className="text-base font-extrabold text-teal-950 mb-1">
              Office Caretakers & Hygiene Management
            </h3>
            <p className="text-xs text-teal-800">
              Ensure software house premises, server rooms, coding floor, restrooms, and pantries are clean and well-sanitized daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cleaners.map((cleaner) => {
              const cleanerAttendance = attendance.find(a => a.userId === cleaner.id);
              return (
                <div key={cleaner.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-base">
                        {cleaner.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{cleaner.name}</h4>
                        <p className="text-xs text-slate-500">Office Caretaker & Hygiene</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                      cleaner.workStatus === 'working' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cleaner.workStatus.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Checklist of cleaning responsibilities */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Daily Assigned Zones:
                    </span>
                    {[
                      { task: 'Sanitize Main Developer Coding Floor & Desks', done: true },
                      { task: 'Dust Server Rack Room & Clear Cable Trays', done: true },
                      { task: 'Washroom Disinfection & Hygiene Restock', done: cleaner.workStatus === 'working' },
                      { task: 'Pantry Coffee Machine & Water Dispenser Refill', done: true },
                      { task: 'Evening Trash Disposal & Floor Mopping', done: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <span className={`font-medium ${item.done ? 'text-slate-800' : 'text-slate-500'}`}>
                          {item.task}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {item.done ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span>Clock In: <strong>{cleanerAttendance?.clockInTime || '08:00 AM'}</strong></span>
                    <span>Monthly Salary: <strong>PKR {(cleaner.salary || 45000).toLocaleString()}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ATTENDANCE TIMESHEET & SHIFTS */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Today's Timesheet Ledger</h3>
              <p className="text-xs text-slate-500">Detailed clock-in, clock-out and verified work hours</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pl-2">Staff Member</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Clock In</th>
                  <th className="pb-3">Clock Out</th>
                  <th className="pb-3">Break Duration</th>
                  <th className="pb-3">Work Time</th>
                  <th className="pb-3 pr-2">EOD Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {attendance.map((rec) => {
                  const report = eodReports.find(r => r.id === rec.eodReportId);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 pl-2 font-bold text-slate-900">{rec.userName}</td>
                      <td className="py-3.5 text-slate-600">{rec.department}</td>
                      <td className="py-3.5 font-mono text-slate-700">{rec.clockInTime}</td>
                      <td className="py-3.5 font-mono text-slate-700">{rec.clockOutTime || 'Active Shift'}</td>
                      <td className="py-3.5 text-amber-700 font-semibold">{rec.totalBreakMinutes} mins</td>
                      <td className="py-3.5 font-bold text-slate-900">
                        {Math.floor(rec.totalWorkMinutes / 60)}h {rec.totalWorkMinutes % 60}m
                      </td>
                      <td className="py-3.5 pr-2">
                        {report ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            Submitted ✓
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                            In Shift
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LEAVE / CHOTI REQUESTS */}
      {activeSubTab === 'leaves' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Leave / Choti Management</h3>
              <p className="text-xs text-slate-500">Employee applications for casual, sick, or emergency absence</p>
            </div>
          </div>

          <div className="space-y-3">
            {leaves.map((leave) => (
              <div 
                key={leave.id}
                className="p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:border-indigo-200 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{leave.userName}</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                      {leave.department}
                    </span>
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded capitalize">
                      {leave.leaveType} Leave
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">"{leave.reason}"</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Dates: <strong>{leave.startDate}</strong> to <strong>{leave.endDate}</strong> • Applied: {leave.appliedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {leave.status === 'pending' ? (
                    isLeader ? (
                      <>
                        <button
                          onClick={() => reviewLeave(leave.id, 'approved')}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => reviewLeave(leave.id, 'rejected')}
                          className="flex items-center gap-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-xl"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                        Pending Leader Review
                      </span>
                    )
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                      leave.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {leave.status} by {leave.reviewedBy || 'Lead'}
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

