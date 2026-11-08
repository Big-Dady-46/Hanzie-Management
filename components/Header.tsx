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

  return (
    <header className="px-8 lg:px-10 pt-7 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 bg-white/60 backdrop-blur-xs mb-6">
      {/* Left Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight capitalize">
          {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('_', ' ')}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          Hanzei Software House &bull; Workspace of {currentUser.name}
        </p>
      </div>

      {/* Right Controls: Search, Clean Shift Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Clean Search Input */}
        <div className="relative w-56 sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, staff..."
            className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
          />
        </div>

        {/* Staff Shift Actions */}
        {!isClient && (
          <div className="flex items-center gap-2">
            {currentUser.workStatus === 'offline' && (
              <button
                onClick={clockIn}
                className="btn-primary"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Clock In</span>
              </button>
            )}

            {currentUser.workStatus === 'working' && (
              <>
                <button
                  onClick={startBreak}
                  className="btn-light"
                >
                  <Coffee className="w-3.5 h-3.5 text-slate-500" />
                  <span>Break</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="btn-secondary"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>End Day</span>
                </button>
              </>
            )}

            {currentUser.workStatus === 'on_break' && (
              <>
                <button
                  onClick={resumeWork}
                  className="btn-primary"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="btn-secondary"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>End Day</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Notification Bell */}
        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors relative shrink-0">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white" />
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
          <span>{currentUser.name.charAt(0)}</span>
        </div>
      </div>
    </header>
  );
}
