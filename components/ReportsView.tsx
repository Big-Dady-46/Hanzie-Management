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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Daily Accountability & Output Ledger
            </span>
            <span className="text-xs text-slate-400">Mandatory Checkout Submissions</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Daily EOD Work Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review detailed daily accomplishments, blockers, and tomorrow's roadmap submitted by employees upon checkout.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Export / Print Reports</span>
        </button>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Filter by staff name..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
            />
          </div>

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-[11px] font-bold text-rose-600 hover:underline"
            >
              Clear Date
            </button>
          )}
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing {filteredReports.length} reports
        </span>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft hover:shadow-soft-lg transition-all space-y-4"
          >
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-sm shadow-2xs">
                  {report.userName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{report.userName}</h4>
                  <p className="text-[11px] text-slate-400">{report.userRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
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
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {report.hoursWorked} hrs worked
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {report.date} @ {report.timestamp}
                </span>
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Accomplished */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Tasks Completed</span>
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {report.tasksCompleted}
                </p>
              </div>

              {/* Blockers */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>Blockers & Hurdles</span>
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {report.blockers || 'None reported.'}
                </p>
              </div>

              {/* Tomorrow's Plan */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-600" />
                  <span>Tomorrow's Roadmap</span>
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

