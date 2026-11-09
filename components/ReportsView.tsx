'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  FileText, Calendar, User, Clock, Star, Download, 
  Search, CheckCircle2, AlertTriangle, ArrowRight,
  Sparkles, Target, Rocket, ShieldCheck, Flame
} from 'lucide-react';
import CustomDatePicker from '@/components/CustomDatePicker';

export default function ReportsView() {
  const { eodReports } = useApp();
  const [searchUser, setSearchUser] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredReports = eodReports.filter((report) => {
    const matchesUser = report.userName.toLowerCase().includes(searchUser.toLowerCase()) ||
                        report.userRole.toLowerCase().includes(searchUser.toLowerCase());
    const matchesDate = !dateFilter || report.date === dateFilter;
    return matchesUser && matchesDate;
  });

  const totalHoursLogged = Math.round(eodReports.reduce((acc, r) => acc + (r.hoursWorked || 8), 0) * 10) / 10;
  const avgRating = eodReports.length > 0 
    ? (eodReports.reduce((acc, r) => acc + (r.rating || 5), 0) / eodReports.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Daily Work Reports & Shift Checkouts (EOD)
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
              Verified Daily Digest
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mandatory end-of-day staff accomplishments, technical blockers, and next-day gameplans
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="btn-silver"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Daily PDF</span>
        </button>
      </div>

      {/* 3 Executive Daily Digest Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="clean-card p-5 flex items-start justify-between hover:border-amber-300 transition-all">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Reports Submitted
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1.5">
              {eodReports.length} Vouchers
            </div>
            <p className="text-xs text-amber-800 font-semibold mt-1">100% On-time EOD compliance</p>
          </div>
          <div className="icon-badge-gold">
            <FileText className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        <div className="clean-card p-5 flex items-start justify-between hover:border-amber-300 transition-all">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Hours Logged
            </span>
            <div className="text-2xl font-bold text-amber-700 mt-1.5">
              {totalHoursLogged} hrs
            </div>
            <p className="text-xs text-slate-400 mt-1">Across engineering, design, and ops</p>
          </div>
          <div className="icon-badge-gold">
            <Clock className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        <div className="clean-card p-5 flex items-start justify-between hover:border-slate-300 transition-all">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Efficiency Score
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
              <span>{avgRating}</span>
              <span className="text-amber-500 text-lg">★</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">High team productivity benchmark</p>
          </div>
          <div className="icon-badge-silver">
            <ShieldCheck className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="clean-card px-5 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Search staff or role..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CustomDatePicker
              value={dateFilter}
              onChange={setDateFilter}
              placeholder="Filter by date..."
            />
          </div>

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredReports.length} daily logs
        </span>
      </div>

      {/* Creative Reports Feed */}
      <div className="space-y-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="clean-card p-6 space-y-4 hover:border-amber-300 hover:shadow-soft transition-all relative overflow-hidden group"
          >
            {/* Top Amber Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-slate-200" />

            {/* Report Header: Staff, Rating, Duration */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs border border-amber-500/30">
                  {report.userName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                    {report.userName}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.2 rounded capitalize">
                      {report.userRole}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Logged {report.date} @ {report.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-900">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{report.rating || 5}.0 Shift Score</span>
                </div>

                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                  {report.hoursWorked} hrs Shift
                </span>
              </div>
            </div>

            {/* 3 Creative Feature Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Pillar 1: Accomplished Today */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/40 to-white border border-amber-200/70 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                  <Target className="w-4 h-4 text-amber-700" />
                  <span>1. Accomplished Today</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-normal">
                  {report.tasksCompleted}
                </p>
              </div>

              {/* Pillar 2: Blockers & Challenges */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <AlertTriangle className="w-4 h-4 text-slate-500" />
                  <span>2. Roadblocks & Challenges</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {report.blockers || 'None reported. Smooth sprint progression.'}
                </p>
              </div>

              {/* Pillar 3: Tomorrow's Gameplan */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/20 border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Rocket className="w-4 h-4 text-amber-600" />
                  <span>3. Tomorrow's Gameplan</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-normal">
                  {report.planForTomorrow}
                </p>
              </div>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="clean-card p-12 text-center">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No work reports match your criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting a different date or clearing the search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}