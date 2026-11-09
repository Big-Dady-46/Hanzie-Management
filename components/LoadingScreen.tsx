'use client';

import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Gentle Luxury Ambient Radial Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Brand Seal */}
      <div className="relative flex flex-col items-center z-10 animate-in fade-in duration-300">
        {/* Luxury Monogram Card */}
        <div className="w-24 h-24 rounded-3xl bg-white border border-amber-200/80 shadow-[0_20px_50px_rgba(217,119,6,0.12),0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center relative overflow-hidden">
          {/* Subtle Shimmer Sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />

          {/* Architectural Luxury Gold "H" Emblem */}
          <svg className="w-12 h-12 relative z-10 drop-shadow-[0_2px_8px_rgba(217,119,6,0.25)]" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="goldEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            {/* Left Pillar */}
            <rect x="8" y="7" width="8" height="34" rx="2.5" fill="url(#goldEmblemGrad)" />
            {/* Right Pillar */}
            <rect x="32" y="7" width="8" height="34" rx="2.5" fill="url(#goldEmblemGrad)" />
            {/* Crossbar */}
            <rect x="14" y="20" width="20" height="8" rx="2" fill="url(#goldEmblemGrad)" />
            {/* Polished White-Silver Highlight */}
            <rect x="15" y="21.5" width="18" height="2" rx="1" fill="#ffffff" fillOpacity="0.45" />
          </svg>
        </div>

        {/* Brand Name & Tagline */}
        <div className="text-center mt-5">
          <h1 
            className="text-2xl font-black text-slate-900 tracking-tight leading-none"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Hanzie
          </h1>
          <p className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-slate-400 mt-1.5">
            Software House ERP
          </p>
        </div>

        {/* Sleek Golden Metallic Progress Bar */}
        <div className="w-36 h-1 bg-slate-200/80 rounded-full mt-6 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full animate-indeterminate-bar" />
        </div>

        {/* Subdued Status Text */}
        <p className="text-xs text-slate-400 font-medium mt-3.5 tracking-wide">
          Loading Workspace...
        </p>
      </div>
    </div>
  );
}
