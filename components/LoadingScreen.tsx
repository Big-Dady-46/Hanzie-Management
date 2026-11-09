'use client';

import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  userName?: string;
}

type AnimPhase = 'init' | 'fly_in' | 'jumbled' | 'aligned' | 'subtitles' | 'locked' | 'exiting';

interface LetterDef {
  char: string;
  start: { x: number; y: number; rot: number; scale: number };
  jumble: { y: number; rot: number; scale: number };
}

const LETTERS: LetterDef[] = [
  {
    char: 'H',
    start: { x: -280, y: -200, rot: -75, scale: 0.3 },
    jumble: { y: 22, rot: -16, scale: 0.94 },
  },
  {
    char: 'a',
    start: { x: 220, y: -240, rot: 65, scale: 0.3 },
    jumble: { y: -24, rot: 14, scale: 1.08 },
  },
  {
    char: 'n',
    start: { x: -240, y: 190, rot: -60, scale: 0.3 },
    jumble: { y: 26, rot: -10, scale: 0.92 },
  },
  {
    char: 'z',
    start: { x: 260, y: 210, rot: 80, scale: 0.3 },
    jumble: { y: -20, rot: 16, scale: 1.06 },
  },
  {
    char: 'e',
    start: { x: -180, y: -190, rot: -50, scale: 0.3 },
    jumble: { y: 22, rot: -12, scale: 0.95 },
  },
  {
    char: 'i',
    start: { x: 240, y: -160, rot: 75, scale: 0.3 },
    jumble: { y: -26, rot: 12, scale: 1.1 },
  },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<AnimPhase>('init');

  useEffect(() => {
    // Phase 1: Start Fly-in from different sides and angles (spinning smoothly)
    const t1 = setTimeout(() => {
      setPhase('jumbled');
    }, 60);

    // Phase 2: Snap into perfect straight line alignment (Hanzei)
    const t2 = setTimeout(() => {
      setPhase('aligned');
    }, 950);

    // Phase 3: "SOFTWARE" slides from left, "HOUSE" slides from right
    const t3 = setTimeout(() => {
      setPhase('subtitles');
    }, 1450);

    // Phase 4: Final signature lock & shine
    const t4 = setTimeout(() => {
      setPhase('locked');
    }, 2050);

    // Phase 5: Fade & scale out to open the app
    const t5 = setTimeout(() => {
      setPhase('exiting');
    }, 2550);

    // Final unmount callback
    const t6 = setTimeout(() => {
      onComplete?.();
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  // Click to skip instantly
  const handleSkip = () => {
    if (phase === 'exiting') return;
    setPhase('exiting');
    setTimeout(() => {
      onComplete?.();
    }, 450);
  };

  const isAlignedOrBeyond = phase === 'aligned' || phase === 'subtitles' || phase === 'locked' || phase === 'exiting';
  const showSubtitles = phase === 'subtitles' || phase === 'locked' || phase === 'exiting';
  const isLocked = phase === 'locked' || phase === 'exiting';
  const isExiting = phase === 'exiting';

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[999999] bg-[#050811] flex flex-col items-center justify-center p-6 select-none cursor-pointer overflow-hidden transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Radial Golden Aura in the center */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none transition-all duration-700 ${
          isLocked ? 'scale-125 bg-amber-400/25' : 'scale-100'
        }`} 
      />

      {/* Cyberpunk Micro Matrix Grid */}
      <div 
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Vignette Shadow */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_140px_rgba(0,0,0,0.92)]" />

      {/* Center Animated Stage */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* ======================================================== */}
        {/* 1. "Hanzei" Sliced Letters Stage                          */}
        {/* ======================================================== */}
        <div className="relative flex items-center justify-center py-6 px-4">
          
          {/* Shockwave Radial Flash on Magnetic Snap */}
          <div
            className={`absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-amber-400/20 via-amber-200/30 to-amber-500/20 blur-2xl pointer-events-none transition-all duration-500 ${
              isAlignedOrBeyond ? 'scale-110 opacity-70' : 'scale-50 opacity-0'
            }`}
          />

          {/* Letter Track */}
          <div className="flex items-center justify-center">
            {LETTERS.map((item, index) => {
              // Calculate transform based on current animation phase
              let transformStyle = '';
              let opacityStyle = 1;
              let transitionStyle = 'all 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)';

              if (phase === 'init') {
                transformStyle = `translate3d(${item.start.x}px, ${item.start.y}px, 0) rotate(${item.start.rot}deg) scale(${item.start.scale})`;
                opacityStyle = 0;
              } else if (phase === 'jumbled') {
                // Misaligned spelling floating into crooked staggered positions
                transformStyle = `translate3d(0, ${item.jumble.y}px, 0) rotate(${item.jumble.rot}deg) scale(${item.jumble.scale})`;
                opacityStyle = 1;
                transitionStyle = `all 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${index * 45}ms`;
              } else {
                // Magnetic Snap: All letters lock into straight line: y=0, rot=0, scale=1
                transformStyle = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
                opacityStyle = 1;
                transitionStyle = 'all 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
              }

              return (
                <div
                  key={item.char + index}
                  style={{
                    transform: transformStyle,
                    opacity: opacityStyle,
                    transition: transitionStyle,
                  }}
                  className="relative inline-block select-none mx-0.5 sm:mx-1 md:mx-1.5"
                >
                  {/* Sliced Letter Container */}
                  <div className="relative">
                    {/* Upper Sliced Half */}
                    <span
                      className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none text-white drop-shadow-[0_4px_20px_rgba(251,191,36,0.4)]"
                      style={{
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 46%, 0% 55%)',
                        transform: isAlignedOrBeyond ? 'translate(-1.5px, -1px)' : 'none',
                        transition: 'transform 0.4s ease',
                        backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #fef3c7 40%, #f59e0b 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {item.char}
                    </span>

                    {/* Lower Sliced Half (Displaced slightly for tech cut effect) */}
                    <span
                      className="absolute inset-0 block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none text-white drop-shadow-[0_6px_28px_rgba(217,119,6,0.65)]"
                      style={{
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        clipPath: 'polygon(0% 55%, 100% 46%, 100% 100%, 0% 100%)',
                        transform: isAlignedOrBeyond ? 'translate(2px, 1.5px)' : 'none',
                        transition: 'transform 0.4s ease',
                        backgroundImage: 'linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #92400e 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {item.char}
                    </span>

                    {/* Glowing Razor Laser Slash passing through the cut seam */}
                    {isAlignedOrBeyond && (
                      <span
                        className="absolute inset-x-[-6px] top-[50%] h-[2px] bg-gradient-to-r from-amber-400/20 via-white to-amber-400/20 -rotate-[3.5deg] pointer-events-none shadow-[0_0_10px_#fbbf24] animate-in fade-in duration-300"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Golden Horizontal Laser Beam passing across all letters when aligned */}
          <div
            className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent pointer-events-none transition-all duration-700 ${
              isAlignedOrBeyond ? 'opacity-80 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          />
        </div>

        {/* ======================================================== */}
        {/* 2. "Software" from Left & "House" from Right              */}
        {/* ======================================================== */}
        <div className="relative mt-2 sm:mt-3 flex items-center justify-center gap-3 sm:gap-4 overflow-hidden py-1 px-4">
          
          {/* Left Wing: "SOFTWARE" slides in from the Left */}
          <div
            style={{
              transform: showSubtitles ? 'translateX(0)' : 'translateX(-160px)',
              opacity: showSubtitles ? 1 : 0,
              transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span
              className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.35em] bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              SOFTWARE
            </span>
          </div>

          {/* Center Glowing Neon Amber Diamond */}
          <div
            style={{
              transform: showSubtitles ? 'scale(1) rotate(45deg)' : 'scale(0) rotate(0deg)',
              opacity: showSubtitles ? 1 : 0,
              transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.15s',
            }}
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-400 shadow-[0_0_14px_#f59e0b] shrink-0"
          />

          {/* Right Wing: "HOUSE" slides in from the Right */}
          <div
            style={{
              transform: showSubtitles ? 'translateX(0)' : 'translateX(160px)',
              opacity: showSubtitles ? 1 : 0,
              transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span
              className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.35em] bg-gradient-to-r from-amber-400 via-amber-200 to-amber-100 bg-clip-text text-transparent"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              HOUSE
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. Sleek Gold Precision Underline                         */}
        {/* ======================================================== */}
        <div
          style={{
            transform: showSubtitles ? 'scaleX(1)' : 'scaleX(0)',
            opacity: showSubtitles ? 0.9 : 0,
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
          className="w-44 sm:w-60 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-3 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
        />

        {/* ======================================================== */}
        {/* 4. Subtle Status Hint                                    */}
        {/* ======================================================== */}
        <div
          className={`mt-8 text-[11px] font-mono tracking-wider transition-all duration-500 ${
            isLocked ? 'text-amber-400 opacity-90' : 'text-slate-500 opacity-50'
          }`}
        >
          {isLocked ? '✦ ENTERPRISE STUDIO UNLOCKED' : 'CALIBRATING WORKSPACE...'}
        </div>

      </div>
    </div>
  );
}