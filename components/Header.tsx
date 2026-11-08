'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  Search, Bell, Clock, Coffee, Play, Square, 
  Sparkles, CheckCircle2, AlertCircle, ChevronDown
} from 'lucide-react';

export default function Header() {
  const { 
    currentUser, 
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
    <header className="bg-transparent px-8 py-5 flex items-center justify-between gap-6">
      {/* Toast Notification */}
      {notificationMessage && (
        <div className="fixed top-6 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Left Title / Breadcrumb (Image 1 & 3 style) */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Welcome back, {currentUser.name}!
        </p>
      </div>

      {/* Right Controls (Pill search, Clock-in, and Avatar like Image 1 & 2) */}
      <div className="flex items-center gap-4">
        {/* Pill Search Input (Matching Image 1 & 2) */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-white text-slate-700 placeholder-slate-400 text-xs pl-9 pr-4 py-2 rounded-full border border-slate-200/80 focus:outline-none focus:border-indigo-400 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all"
          />
        </div>

        {/* Pending approvals badge for leader */}
        {isLeader && pendingApprovalsCount > 0 && (
          <button
            onClick={() => setActiveTab('team')}
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200/80 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{pendingApprovalsCount} Pending Approval</span>
          </button>
        )}

        {/* Staff Quick Hazari (Clean rounded buttons) */}
        {!isClient && (
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 p-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {currentUser.workStatus === 'offline' && (
              <button
                onClick={clockIn}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-all"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Clock In (Hazari)</span>
              </button>
            )}

            {currentUser.workStatus === 'working' && (
              <>
                <button
                  onClick={startBreak}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Break</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>End Day</span>
                </button>
              </>
            )}

            {currentUser.workStatus === 'on_break' && (
              <>
                <button
                  onClick={resumeWork}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>End Day</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* User avatar right like Image 1 */}
        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
          {currentUser.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
