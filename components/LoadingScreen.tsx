'use client';

import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Ambient Radial Luxury Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-gradient-to-tr from-amber-200/25 via-amber-100/10 to-slate-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Brand Seal */}
      <div className="relative flex flex-col items-center z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Emblem with Dual Gold & Silver Concentric Orbits */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer Rotating Gold Accent Ring */}
          <div 
            className="absolute inset-0 rounded-3xl border-2 border-dashed border-amber-400/40 animate-spin" 
            style={{ animationDuration: '14s' }} 
          />

          {/* Inner Counter-Rotating Silver Accent Ring */}
          <div 
            className="absolute inset-2 rounded-2xl border border-slate-300/60 -rotate-12" 
          />

          {/* Central Obsidian Luxury Tile */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/60 shadow-[0_12px_36px_rgba(217,119,6,0.25),inset_0_1px_2px_rgba(255,255,255,0.25)] flex items-center justify-center overflow-hidden">
            {/* Shimmer Light Reflection */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent -translate-x-full animate-shimmer" 
            />

            {/* Sculpted Metallic Gold & Silver "H" */}
            <span 
              className="text-4xl font-extrabold bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.6)] select-none"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              H
            </span>

            {/* Subtle Metallic Corner Sparkle */}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
          </div>
        </div>

        {/* Brand Typography */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-1.5">
            <h1 
              className="text-2xl font-black text-slate-900 tracking-tight leading-none"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              Hanzie
            </h1>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.24em] font-extrabold text-slate-400 mt-1.5">
            Software House ERP
          </p>
        </div>

        {/* Gold & Silver Metallic Loading Bar */}
        <div className="w-44 h-1.5 bg-slate-200/90 rounded-full mt-6 overflow-hidden relative shadow-inner">
          <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-slate-300 rounded-full animate-indeterminate-bar" />
        </div>

        {/* Live Synchronizing Badge */}
        <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-amber-900 bg-amber-50/90 border border-amber-200/80 px-3.5 py-1 rounded-full shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>Synchronizing Workspace &bull; PostgreSQL Live</span>
        </div>
      </div>
    </div>
  );
}
