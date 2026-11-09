'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  FileText, Calendar, User, Clock, Star, Download, 
  Search, CheckCircle2, AlertTriangle, ArrowRight,
  Sparkles, Target, Rocket, ShieldCheck, Flame, Printer
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

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const reportDate = dateFilter || new Date().toISOString().split('T')[0];
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Hanzei EOD Report - ${reportDate}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 0; background: #ffffff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 18px; }
          .logo { font-size: 18px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
          .logo span { color: #d97706; }
          .sub { font-size: 11px; color: #64748b; margin-top: 3px; }
          .badge { font-size: 10px; font-weight: 800; background: #fffbeb; color: #b45309; border: 1px solid #fde68a; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; }
          .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
          .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
          .stat-lbl { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
          .stat-num { font-size: 18px; font-weight: 900; color: #0f172a; margin-top: 4px; }
          .report-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 14px; page-break-inside: avoid; background: #ffffff; }
          .card-top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 10px; }
          .name { font-size: 13px; font-weight: 800; color: #0f172a; }
          .role { font-size: 10px; background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-weight: 600; text-transform: capitalize; margin-left: 6px; }
          .meta { font-size: 10px; color: #64748b; }
          .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .pillar { background: #fafafa; border: 1px solid #f1f5f9; border-radius: 8px; padding: 10px; font-size: 11px; }
          .p-title { font-size: 9px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
          .p1 { border-top: 2.5px solid #f59e0b; }
          .p1 .p-title { color: #b45309; }
          .p2 { border-top: 2.5px solid #64748b; }
          .p2 .p-title { color: #475569; }
          .p3 { border-top: 2.5px solid #10b981; }
          .p3 .p-title { color: #047857; }
          .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">HANZEI <span>TECHNOLOGIES</span></div>
            <div class="sub">Official Daily Work Digest & Shift Checkouts (EOD)</div>
          </div>
          <div style="text-align: right;">
            <span class="badge">Verified Digest</span>
            <div class="sub" style="margin-top: 5px;">Date: <strong>${reportDate}</strong></div>
          </div>
        </div>

        <div class="stats">
          <div class="stat-box">
            <div class="stat-lbl">Reports Submitted</div>
            <div class="stat-num">${filteredReports.length} Staff</div>
          </div>
          <div class="stat-box">
            <div class="stat-lbl">Total Hours Logged</div>
            <div class="stat-num">${totalHoursLogged} hrs</div>
          </div>
          <div class="stat-box">
            <div class="stat-lbl">Efficiency Benchmark</div>
            <div class="stat-num">${avgRating} ★</div>
          </div>
        </div>

        <div>
          ${filteredReports.map(r => `
            <div class="report-card">
              <div class="card-top">
                <div>
                  <span class="name">${r.userName}</span>
                  <span class="role">${r.userRole}</span>
                </div>
                <div class="meta">
                  Logged: ${r.date} @ ${r.timestamp} • <strong>${r.hoursWorked} hrs</strong> (Rating: ${r.rating || 5}★)
                </div>
              </div>
              <div class="pillars">
                <div class="pillar p1">
                  <div class="p-title">1. Accomplished Today</div>
                  <div>${r.tasksCompleted || 'Sprint deliverables'}</div>
                </div>
                <div class="pillar p2">
                  <div class="p-title">2. Roadblocks & Blockers</div>
                  <div>${r.blockers || 'None reported. Smooth progress.'}</div>
                </div>
                <div class="pillar p3">
                  <div class="p-title">3. Tomorrow's Gameplan</div>
                  <div>${r.planForTomorrow || 'Upcoming sprint tasks'}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="footer">
          <span>Generated by Hanzei Cloud ERP • Internal Operations Audit</span>
          <span>Official Verified Record</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Daily Work Reports (EOD)
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
              Daily Digest
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Staff accomplishments, technical blockers, and next-day sprint gameplans
          </p>
        </div>

        <button 
          onClick={handleExportPDF}
          className="btn-gold text-xs py-2 px-4 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Daily PDF</span>
        </button>
      </div>

      {/* 3 Executive Daily Digest Metrics with White Background, Clean Border & No Shadow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: Reports Submitted — Amber Border */}
        <div className="bg-white rounded-2xl p-5 flex flex-col justify-between h-32 border border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Reports Submitted</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-900 tracking-tight">
              {eodReports.length} Vouchers
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">100% on-time EOD compliance</p>
          </div>
        </div>

        {/* Box 2: Hours Logged — Emerald Border */}
        <div className="bg-white rounded-2xl p-5 flex flex-col justify-between h-32 border border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Hours Logged</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-800 tracking-tight">
              {totalHoursLogged} hrs
            </div>
            <p className="text-[11px] text-emerald-700/80 font-semibold mt-0.5">
              Across engineering, design & ops
            </p>
          </div>
        </div>

        {/* Box 3: Efficiency Score — Slate Border */}
        <div className="bg-white rounded-2xl p-5 flex flex-col justify-between h-32 border border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Efficiency Score</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>{avgRating}</span>
              <span className="text-amber-500 text-lg">★</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">High team productivity benchmark</p>
          </div>
        </div>
      </div>

      {/* Unified Toolbar Panel */}
      <div className="clean-card p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
              className="text-xs font-bold text-amber-700 hover:text-amber-900 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200"
            >
              Clear Filter
            </button>
          )}
        </div>

        <span className="text-xs text-slate-400 font-semibold bg-slate-100 px-3 py-1 rounded-full shrink-0">
          {filteredReports.length} Daily Logs
        </span>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="clean-card p-5 space-y-3.5 hover:border-amber-300 transition-all relative overflow-hidden group printable-report-card"
          >
            {/* Top Amber Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 no-print" />

            {/* Report Header: Staff, Rating, Duration */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-300 font-bold flex items-center justify-center text-xs shadow-2xs border border-amber-500/20 shrink-0">
                  {report.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                      {report.userName}
                    </h4>
                    <span className="text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full capitalize">
                      {report.userRole}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Filed on {report.date} at {report.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-900">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{report.rating || 5}.0 Score</span>
                </div>

                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  {report.hoursWorked} hrs
                </span>
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Pillar 1: Accomplished Today */}
              <div className="p-3.5 rounded-xl bg-amber-50/30 border border-amber-200/70 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  <span>1. Accomplished Today</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {report.tasksCompleted}
                </p>
              </div>

              {/* Pillar 2: Blockers & Challenges */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
                  <span>2. Roadblocks & Challenges</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.blockers || 'None reported. Smooth sprint progression.'}
                </p>
              </div>

              {/* Pillar 3: Tomorrow's Gameplan */}
              <div className="p-3.5 rounded-xl bg-emerald-50/20 border border-emerald-200/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <Rocket className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Tomorrow's Gameplan</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
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