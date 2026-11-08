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

      {/* Right Controls: Search, Actions & Profile */}
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

        {/* Staff Quick Shift Buttons */}
        {!isClient && (
          <div className="flex items-center gap-2 bg-[#ffffff] border border-slate-200/80 p-1.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            {currentUser.workStatus === 'offline' && (
              <button
                onClick={clockIn}
                className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-xs flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Clock In</span>
              </button>
            )}

            {currentUser.workStatus === 'working' && (
              <>
                <button
                  onClick={startBreak}
                  className="bg-[#fff9ea] hover:bg-[#faeed0] text-[#b45309] text-xs font-bold px-3.5 py-1.5 rounded-full transition-all border border-[#fde68a]"
                >
                  Break
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="bg-[#fff0f3] hover:bg-[#fcdce3] text-[#e11d48] text-xs font-bold px-3.5 py-1.5 rounded-full transition-all border border-[#fecdd3]"
                >
                  End Day
                </button>
              </>
            )}

            {currentUser.workStatus === 'on_break' && (
              <>
                <button
                  onClick={resumeWork}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-all shadow-xs"
                >
                  Resume
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="bg-[#fff0f3] hover:bg-[#fcdce3] text-[#e11d48] text-xs font-bold px-3.5 py-1.5 rounded-full transition-all border border-[#fecdd3]"
                >
                  End Day
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

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-blue-100">
          {currentUser.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
