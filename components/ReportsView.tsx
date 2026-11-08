'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  FileText, Calendar, Star, Clock, User, 
  CheckCircle2, AlertTriangle, Filter, Search, Printer
} from 'lucide-react';

export default function ReportsView() {
  const { eodReports, currentUser } = useApp();

  const [searchUser, setSearchUser] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredReports = eodReports.filter(r => {
    const matchesUser = !searchUser || r.userName.toLowerCase().includes(searchUser.toLowerCase());
    const matchesDate = !dateFilter || r.date === dateFilter;
    return matchesUser && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Daily EOD Checkout Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mandatory work summaries, blockers, and tomorrow's roadmaps submitted by staff
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn-light"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Export Reports</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="clean-card px-5 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Search staff..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
            />
          </div>

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredReports.length} reports
        </span>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="clean-card p-6 space-y-4 hover:border-slate-300 transition-colors"
          >
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                  {report.userName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{report.userName}</h4>
                  <p className="text-[11px] text-slate-400">{report.userRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs">
                  <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                  <span className="font-bold text-slate-800">{report.rating || 5}.0</span>
                </div>

                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                  {report.hoursWorked} hrs shift
                </span>

                <span className="text-[11px] font-mono text-slate-400">
                  {report.date} @ {report.timestamp}
                </span>
              </div>
            </div>

            {/* 3 Detail Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Tasks Completed
                </span>
                <p className="text-slate-800 leading-relaxed font-normal">
                  {report.tasksCompleted}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Blockers & Hurdles
                </span>
                <p className="text-slate-700 leading-relaxed font-normal">
                  {report.blockers || 'None reported. Smooth shift.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                  Tomorrow's Plan
                </span>
                <p className="text-slate-800 leading-relaxed font-normal">
                  {report.planForTomorrow}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
