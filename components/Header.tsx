'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Search, Clock, Coffee, Play, Square } from 'lucide-react';

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
    <header className="px-8 pt-7 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left Title & Greeting (Exact Image 1 style) */}
      <div>
        <h1 className="text-xl font-bold text-[#1e293b] tracking-tight capitalize">
          {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('_', ' ')}
        </h1>
        <p className="text-xs text-[#94a3b8] mt-0.5 font-medium">
          Welcome back, {currentUser.name}!
        </p>
      </div>

      {/* Right Controls: Search & Avatar (Exact Image 1 style) */}
      <div className="flex items-center gap-4">
        {/* Search Bar matching Image 1: pill-shaped rounded-full */}
        <div className="relative w-64 sm:w-72">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-[#f8fafc] text-xs text-[#1e293b] placeholder-[#94a3b8] pl-10 pr-4 py-2.5 rounded-full border border-[#e2e8f0] focus:bg-white focus:outline-none focus:border-[#3b82f6] transition-all"
          />
        </div>

        {/* Staff Quick Shift Buttons */}
        {!isClient && (
          <div className="flex items-center gap-1.5">
            {currentUser.workStatus === 'offline' && (
              <button
                onClick={clockIn}
                className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-all shadow-xs"
              >
                Clock In (Hazari)
              </button>
            )}

            {currentUser.workStatus === 'working' && (
              <>
                <button
                  onClick={startBreak}
                  className="bg-[#fffbeb] border border-[#fde68a] text-[#b45309] text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                >
                  Break
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                >
                  End Day
                </button>
              </>
            )}

            {currentUser.workStatus === 'on_break' && (
              <>
                <button
                  onClick={resumeWork}
                  className="bg-[#2563eb] text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all shadow-xs"
                >
                  Resume
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                >
                  End Day
                </button>
              </>
            )}
          </div>
        )}

        {/* Round Avatar with border like Image 1 */}
        <div className="w-10 h-10 rounded-full bg-[#3b82f6] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
          {currentUser.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
