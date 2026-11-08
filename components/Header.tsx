'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  Search, Bell, Clock, Coffee, Play, Square, 
  Sparkles, CheckCircle2, AlertCircle, ShieldCheck
} from 'lucide-react';

export default function Header() {
  const { 
    currentUser, 
    todayAttendance, 
    clockIn, 
    startBreak, 
    resumeWork, 
    setIsEODModalOpen,
    searchQuery,
    setSearchQuery,
    users,
    setActiveTab,
    notificationMessage
  } = useApp();

  const isLeader = currentUser.role === 'leader';
  const isClient = currentUser.role === 'client';
  const pendingApprovalsCount = users.filter(u => u.status === 'pending_approval').length;

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Toast Notification Banner */}
      {notificationMessage && (
        <div className="absolute top-16 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Global Search Bar (Image 1, 2, 3 inspiration) */}
      <div className="relative w-80 max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects, staff, tasks..."
          className="w-full bg-slate-100/80 hover:bg-slate-100 text-slate-800 placeholder-slate-400 text-xs pl-9 pr-8 py-2 rounded-xl border border-transparent focus:border-indigo-400 focus:bg-white focus:outline-none transition-all"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
          ⌘K
        </span>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-3">
        {/* Pending approvals badge for Leader */}
        {isLeader && pendingApprovalsCount > 0 && (
          <button
            onClick={() => setActiveTab('team')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-800 text-xs font-semibold transition-all shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{pendingApprovalsCount} Signup Pending Confirmation</span>
          </button>
        )}

        {/* Staff Quick Hazari / Clock In / Out Bar (Not for clients) */}
        {!isClient && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 p-1 rounded-xl shadow-2xs">
            {/* Status indicator */}
            <div className="px-3 py-1 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                currentUser.workStatus === 'working' ? 'bg-emerald-500 animate-pulse' :
                currentUser.workStatus === 'on_break' ? 'bg-amber-500' :
                currentUser.workStatus === 'on_leave' ? 'bg-purple-500' : 'bg-slate-300'
              }`} />
              <span className="text-xs font-bold text-slate-700 capitalize">
                {currentUser.workStatus.replace('_', ' ')}
              </span>
            </div>

            {/* Action Buttons */}
            {currentUser.workStatus === 'offline' && (
              <button
                onClick={clockIn}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Clock In (Hazari)</span>
              </button>
            )}

            {currentUser.workStatus === 'working' && (
              <>
                <button
                  onClick={startBreak}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Break</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>End Day & Report</span>
                </button>
              </>
            )}

            {currentUser.workStatus === 'on_break' && (
              <>
                <button
                  onClick={resumeWork}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Work</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>End Day & Report</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Current User Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
            <p className="text-[10px] font-medium text-slate-500 capitalize">{currentUser.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

