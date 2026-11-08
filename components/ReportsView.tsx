'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { FileText, Search, Calendar, Download, Star, Target, AlertTriangle, Rocket, Clock, ShieldCheck } from 'lucide-react';

export default function ReportsView() {
  const { eodReports } = useApp();
  const [searchUser, setSearchUser] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredReports = eodReports.filter((report) => {
    const matchesUser = report.userName.toLowerCase().includes(searchUser.toLowerCase());
    const matchesDate = !dateFilter || report.date === dateFilter;
    return matchesUser && matchesDate;
  });

  const totalHours = Math.round(eodReports.reduce((acc, r) => acc + (r.hoursWorked || 8), 0) * 10) / 10;
  const avgRating = eodReports.length > 0
    ? (eodReports.reduce((acc, r) => acc + (r.rating || 5), 0) / eodReports.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-5 fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Daily Reports (EOD)</h2>
          <p className="text-xs text-slate-600 mt-0.5">End-of-day staff accomplishments, blockers & tomorrow's plans</p>
        </div>
        <button onClick={() => window.print()} className="btn-silver text-xs py-1.5 px-4 gap-1.5">
          <Download className="w-3.5 h-3.5" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Reports Submitted', val: `${eodReports.length}`, sub: '100% on-time EOD compliance', icon: FileText, gold: true },
          { label: 'Total Hours Logged', val: `${totalHours}h`, sub: 'Engineering, design & ops', icon: Clock, gold: true },
          { label: 'Avg Shift Score', val: `${avgRating} ★`, sub: 'High productivity benchmark', icon: ShieldCheck, gold: false },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="glass-card-hover p-5 flex items-start justify-between">
              <div>
                <p className="section-label mb-2">{kpi.label}</p>
                <div className={`text-[1.4rem] font-extrabold leading-none tracking-tight ${kpi.gold ? 'text-amber-400' : 'text-slate-200'}`}>{kpi.val}</div>
                <p className="text-[11px] text-slate-700 mt-1.5">{kpi.sub}</p>
              </div>
              <div className={`icon-badge${kpi.gold ? '-gold' : '-silver'} w-10 h-10 rounded-xl`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass-card p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={searchUser} onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Search staff or role..." className="dark-input w-full pl-9 pr-3 py-1.5 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-600" />
          <input
            type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
            className="dark-input text-xs py-1.5 px-3"
          />
          {dateFilter && (
            <button onClick={() => setDateFilter('')} className="text-xs text-amber-500 hover:text-amber-400 font-semibold">Clear</button>
          )}
        </div>
        <span className="text-xs text-slate-700 ml-auto">{filteredReports.length} logs</span>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="glass-card-hover p-5 space-y-4 relative overflow-hidden">
            {/* gold line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 text-black font-bold flex items-center justify-center text-sm shadow-md shadow-amber-500/15">
                  {report.userName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{report.userName}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full capitalize">
                      {report.userRole}
                    </span>
                    <span className="text-[10px] text-slate-700 font-mono">{report.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#f5c842', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{report.rating || 5}.0</span>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {report.hoursWorked}h shift
                </span>
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: Target, label: 'Accomplished', text: report.tasksCompleted, color: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.2)', iconColor: 'text-amber-400' },
                { icon: AlertTriangle, label: 'Blockers', text: report.blockers || 'None — smooth sprint.', color: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)', iconColor: 'text-slate-500' },
                { icon: Rocket, label: "Tomorrow's Plan", text: report.planForTomorrow, color: 'rgba(99,102,241,0.07)', borderColor: 'rgba(99,102,241,0.2)', iconColor: 'text-indigo-400' },
              ].map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.label}
                    className="p-3.5 rounded-xl space-y-2"
                    style={{ background: pillar.color, border: `1px solid ${pillar.borderColor}` }}
                  >
                    <div className={`flex items-center gap-1.5 text-xs font-bold text-slate-400`}>
                      <Icon className={`w-3.5 h-3.5 ${pillar.iconColor}`} />
                      <span className="uppercase tracking-wider text-[9px]">{pillar.label}</span>
                    </div>
                    <p className="text-[12px] text-slate-400 leading-relaxed">{pillar.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="glass-card p-16 text-center">
            <FileText className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No reports match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
