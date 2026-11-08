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
    <header className="px-8 lg:px-10 pt-8 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100/80 mb-2">
      {/* Left Title & Greeting */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight capitalize">
          {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('_', ' ')}
        </h1>
        <p className="text-xs text-[#94a3b8] mt-1 font-medium">
          Welcome back, {currentUser.name}! Here is your software house overview.
        </p>
      </div>

      {/* Right Controls: Search, 2D Tactile Action Buttons & Profile */}
      <div className="flex items-center gap-4">
        {/* Spacious Pill Search Input */}
        <div className="relative w-64 sm:w-80">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-4.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, staff..."
            className="w-full bg-[#ffffff] text-xs text-[#0f172a] placeholder-[#94a3b8] pl-11 pr-4 py-3 rounded-full border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] focus:bg-white focus:outline-none focus:border-[#3b82f6] focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
          />
        </div>

        {/* Staff Tactile 2D Shift Buttons (Text rests on top with tactile feel) */}
        {!isClient && (
          <div className="flex items-center gap-2">
            {currentUser.workStatus === 'offline' && (
              <button
                onClick={clockIn}
                className="btn-2d-emerald px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 drop-shadow-xs" />
                <span>Clock In (Hazari)</span>
              </button>
            )}

            {currentUser.workStatus === 'working' && (
              <>
                <button
                  onClick={startBreak}
                  className="btn-2d-amber px-3.5 py-1.5 text-xs flex items-center gap-1"
                >
                  <Coffee className="w-3.5 h-3.5 drop-shadow-xs" />
                  <span>Break</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="btn-2d-rose px-3.5 py-1.5 text-xs flex items-center gap-1"
                >
                  <Square className="w-3 h-3 fill-current drop-shadow-xs" />
                  <span>End Day</span>
                </button>
              </>
            )}

            {currentUser.workStatus === 'on_break' && (
              <>
                <button
                  onClick={resumeWork}
                  className="btn-2d-primary px-3.5 py-1.5 text-xs flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-current drop-shadow-xs" />
                  <span>Resume</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="btn-2d-rose px-3.5 py-1.5 text-xs flex items-center gap-1"
                >
                  <Square className="w-3 h-3 fill-current drop-shadow-xs" />
                  <span>End Day</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Notification Bell */}
        <div className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-xs cursor-pointer transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2.5 ring-2 ring-white" />
        </div>

        {/* User Avatar with Circular 2D Badge */}
        <div className="icon-round-blue w-10 h-10 font-bold text-sm shadow-sm ring-2 ring-blue-100">
          <span className="drop-shadow-xs">{currentUser.name.charAt(0)}</span>
        </div>
      </div>
    </header>
  );
}
