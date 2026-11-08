'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Search, Clock, Coffee, Play, Square, Bell } from 'lucide-react';

export default function Header() {
  const {
    currentUser,
    clockIn,
    startBreak,
    resumeWork,
    setIsEODModalOpen,
    searchQuery,
    setSearchQuery,
    activeTab
  } = useApp();

  const isClient = currentUser.role === 'client';

  const tabNames: Record<string, string> = {
    dashboard: 'Overview',
    projects: 'Projects & Ledger',
    tasks: 'Sprint Tasks',
    attendance: 'Hazari & Attendance',
    team: 'Staff Directory',
    payroll: 'Payroll & Salaries',
    reports: 'Daily Reports',
    client_portal: 'Client Portal',
  };

  return (
    <header
      className="px-8 py-4 flex items-center justify-between gap-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,15,20,0.8)', backdropFilter: 'blur(20px)' }}
    >
      {/* Left */}
      <div>
        <h1 className="text-[15px] font-bold text-slate-100 tracking-tight">
          {tabNames[activeTab] || activeTab}
        </h1>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Hanzei Workspace · {currentUser.name}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="relative w-56">
          <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="dark-input w-full pl-9 pr-3 py-2 text-xs"
          />
        </div>

        {/* Shift actions */}
        {!isClient && (
          <div className="flex items-center gap-2">
            {currentUser.workStatus === 'offline' && (
              <button onClick={clockIn} className="btn-gold text-xs py-1.5 px-3.5 gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Clock In</span>
              </button>
            )}
            {currentUser.workStatus === 'working' && (
              <>
                <button onClick={startBreak} className="btn-silver text-xs py-1.5 px-3 gap-1.5">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Break</span>
                </button>
                <button onClick={() => setIsEODModalOpen(true)} className="btn-dark text-xs py-1.5 px-3.5 gap-1.5">
                  <Square className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>End Day</span>
                </button>
              </>
            )}
            {currentUser.workStatus === 'on_break' && (
              <>
                <button onClick={resumeWork} className="btn-gold text-xs py-1.5 px-3.5 gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
                <button onClick={() => setIsEODModalOpen(true)} className="btn-dark text-xs py-1.5 px-3.5 gap-1.5">
                  <Square className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>End Day</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Bell */}
        <div className="relative w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors hover:bg-white/[0.06]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5 ring-2 ring-[#0d0f14] shadow-sm shadow-amber-400/50" />
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 text-black font-bold text-sm flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
          {currentUser.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
