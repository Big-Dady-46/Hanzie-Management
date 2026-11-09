'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  userName?: string;
}

export default function LoadingScreen({ onComplete, userName }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [logoFilled, setLogoFilled] = useState(false);

  // Smooth cinematic progress counter
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2100; // 2.1 seconds of smooth animation

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      
      // Easing curve (starts fast, holds slightly at 80% for logo fill, then finishes smooth)
      setProgress(rawProgress);

      if (rawProgress >= 45 && !logoFilled) {
        setLogoFilled(true);
      }

      if (rawProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete?.();
          }, 550);
        }, 150);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete, logoFilled]);

  // Click or keypress to instantly fast-forward/skip
  const handleSkip = () => {
    if (isExiting) return;
    setProgress(100);
    setLogoFilled(true);
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 450);
  };

  const getStatusMessage = () => {
    if (progress < 25) return 'Initializing Enterprise Core...';
    if (progress < 55) return 'Architecting Workspace & Modules...';
    if (progress < 85) return 'Connecting Cloud Live Sync...';
    if (userName) return `Ready • Welcome back, ${userName}`;
    return 'Ready • Launching Workspace...';
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[999999] bg-[#070a11] flex flex-col items-center justify-center p-6 select-none cursor-pointer overflow-hidden transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Deep Ambient Radial Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-amber-500/12 rounded-full blur-[110px] pointer-events-none animate-gold-glow" />

      {/* 2. Micro Tech Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.35) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* 3. Subtle Vignette Border */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />

      {/* 4. Center Main Monogram & Brand Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full animate-logo-pop">
        
        {/* Luxury Monogram Emblem Box */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-[#161c28] via-[#0f141f] to-[#0a0e17] border border-amber-500/30 shadow-[0_20px_60px_-15px_rgba(217,119,6,0.35),0_0_2px_1px_rgba(251,191,36,0.25)] flex items-center justify-center p-4 overflow-hidden">
          
          {/* Subtle Ambient Shimmer Sweep inside card */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full animate-light-sweep pointer-events-none" />

          {/* Glowing Animated SVG Logo Assembly */}
          <svg className="w-16 h-16 sm:w-20 sm:h-20 relative z-10 drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)]" viewBox="0 0 96 96" fill="none">
            <defs>
              {/* Rich 24K Gold Gradient for Strokes */}
              <linearGradient id="goldStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>

              {/* Solid 3D Liquid Gold Gradient for Fill */}
              <linearGradient id="goldLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="75%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              {/* Specular Edge Filter */}
              <filter id="goldGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* A. Outer Geometric Squircle Ring (Draws smoothly) */}
            <rect
              x="6"
              y="6"
              width="84"
              height="84"
              rx="24"
              stroke="url(#goldStrokeGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-draw-frame opacity-80"
            />

            {/* B. Architectural Golden 'H' Stroke Assembly */}
            {/* Left Pillar Stroke */}
            <line
              x1="28"
              y1="22"
              x2="28"
              y2="74"
              stroke="url(#goldStrokeGrad)"
              strokeWidth="13"
              strokeLinecap="round"
              className="animate-draw-pillar-left"
            />

            {/* Right Pillar Stroke */}
            <line
              x1="68"
              y1="22"
              x2="68"
              y2="74"
              stroke="url(#goldStrokeGrad)"
              strokeWidth="13"
              strokeLinecap="round"
              className="animate-draw-pillar-right"
            />

            {/* Crossbar Stroke */}
            <line
              x1="28"
              y1="48"
              x2="68"
              y2="48"
              stroke="url(#goldStrokeGrad)"
              strokeWidth="13"
              strokeLinecap="round"
              className="animate-draw-crossbar"
            />

            {/* C. Solid 3D Polished Body (Fades in seamlessly once drawn) */}
            <g className={`transition-opacity duration-500 ${logoFilled ? 'opacity-100' : 'opacity-0'}`}>
              {/* Left Pillar Body */}
              <rect x="21.5" y="16" width="13" height="64" rx="6.5" fill="url(#goldLiquidGrad)" />
              {/* Right Pillar Body */}
              <rect x="61.5" y="16" width="13" height="64" rx="6.5" fill="url(#goldLiquidGrad)" />
              {/* Crossbar Body */}
              <rect x="26" y="41.5" width="44" height="13" rx="6.5" fill="url(#goldLiquidGrad)" />

              {/* Specular Chrome Highlights */}
              <rect x="23" y="19" width="3" height="58" rx="1.5" fill="#ffffff" fillOpacity="0.45" />
              <rect x="63" y="19" width="3" height="58" rx="1.5" fill="#ffffff" fillOpacity="0.45" />
              <rect x="28" y="43" width="40" height="2.5" rx="1" fill="#ffffff" fillOpacity="0.5" />
            </g>
          </svg>

          {/* Twinkling Star Accent */}
          <div className={`absolute top-2.5 right-2.5 text-amber-300 transition-opacity duration-300 ${logoFilled ? 'opacity-100' : 'opacity-0'}`}>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-2">
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              Hanzie
            </h1>
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse" />
          </div>
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400 mt-1 font-mono">
            SOFTWARE HOUSE ERP
          </p>
        </div>

        {/* Elegant Animated Progress Track */}
        <div className="w-full mt-7 space-y-2.5 px-2">
          {/* Progress Bar Container */}
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/60 p-[1px] relative">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(245,158,11,0.8)] relative"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing Spark on leading tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>

          {/* Dynamic Status Text & Percentage */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-0.5">
            <span className="truncate pr-2 text-slate-300">
              {getStatusMessage()}
            </span>
            <span className="font-bold text-amber-400 shrink-0">
              {progress}%
            </span>
          </div>
        </div>

        {/* Skip Hint */}
        <p className="text-[11px] text-slate-500 hover:text-slate-400 transition-colors mt-8 font-medium tracking-wide">
          Click anywhere to skip intro &rarr;
        </p>

      </div>
    </div>
  );
}