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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Daily EOD Checkout Reports
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1 font-medium">
            Mandatory work summaries, blockers and tomorrow's roadmaps submitted by staff upon checkout
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn-2d-light px-5 py-2.5 text-xs flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Export / Print Reports</span>
        </button>
      </div>

      {/* Filter Bar with generous padding */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Search by staff member..."
              className="text-xs pl-9 pr-4 py-2 rounded-xl bg-[#f8fafc] border border-slate-200/80 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 text-slate-800 font-medium"
            />
          </div>

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing {filteredReports.length} submitted reports
        </span>
      </div>

      {/* Reports Feed (Spacious, Luxury Cards) */}
      <div className="space-y-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all space-y-5"
          >
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="icon-round-blue w-11 h-11 text-sm font-bold">
                  {report.userName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f172a]">{report.userName}</h4>
                  <p className="text-xs text-[#94a3b8] mt-0.5">{report.userRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-[#fff9ea] border border-[#faeed0] px-3 py-1.5 rounded-full">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= (report.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-amber-900 ml-1.5">{report.rating || 5}.0</span>
                </div>

                <span className="text-xs font-bold text-slate-700 bg-[#f1f4f9] px-3.5 py-1.5 rounded-full">
                  {report.hoursWorked} hrs shift
                </span>

                <span className="text-xs font-mono text-slate-400">
                  {report.date} @ {report.timestamp}
                </span>
              </div>
            </div>

            {/* 3 Spacious Detail Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              {/* Tasks Accomplished */}
              <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#065f46] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tasks Completed</span>
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {report.tasksCompleted}
                </p>
              </div>

              {/* Blockers & Issues */}
              <div className="p-5 rounded-2xl bg-[#fff0f3]/70 border border-[#fcdce3] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9f1239] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Blockers & Hurdles</span>
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {report.blockers || 'None reported. Smooth shift.'}
                </p>
              </div>

              {/* Tomorrow's Roadmap */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Tomorrow's Plan</span>
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
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
