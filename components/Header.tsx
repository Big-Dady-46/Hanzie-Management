'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Search, Clock, Coffee, Play, Square, Bell, Sparkles } from 'lucide-react';

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

  return (
    <header className="px-8 lg:px-10 pt-7 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 bg-white/70 backdrop-blur-md mb-6">
      {/* Left Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight capitalize">
            {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('_', ' ')}
          </h1>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        </div>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          Hanzei Workspace &bull; {currentUser.name} ({currentUser.role.replace('_', ' ')})
        </p>
      </div>

      {/* Right Controls: Search, Frosted 2D Glass Shift Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Search Input with Gold/Silver focus */}
        <div className="relative w-56 sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, staff..."
            className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 transition-all font-medium"
          />
        </div>

        {/* Staff Shift Actions (Frosted Glass 2D Buttons) */}
        {!isClient && (
          <div className="flex items-center gap-2">
            {currentUser.workStatus === 'offline' && (
              <button
                onClick={clockIn}
                className="btn-gold"
              >
                <Clock className="w-3.5 h-3.5 drop-shadow-xs" />
                <span>Clock In</span>
              </button>
            )}

            {currentUser.workStatus === 'working' && (
              <>
                <button
                  onClick={startBreak}
                  className="btn-silver"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Break</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="btn-dark"
                >
                  <Square className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>End Day</span>
                </button>
              </>
            )}

            {currentUser.workStatus === 'on_break' && (
              <>
                <button
                  onClick={resumeWork}
                  className="btn-gold"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="btn-dark"
                >
                  <Square className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>End Day</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Notification Bell with Gold Dot */}
        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors relative shrink-0">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2 ring-2 ring-white" />
        </div>

        {/* User Avatar with Golden Border */}
        <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs border border-amber-500/40">
          <span>{currentUser.name.charAt(0)}</span>
        </div>
      </div>
    </header>
  );
}
