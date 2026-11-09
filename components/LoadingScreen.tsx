'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  onComplete?: () => void;
  userName?: string;
}

type AnimPhase = 'init' | 'jumbled' | 'aligned' | 'logo_reveal' | 'subtitles' | 'exiting';

interface LetterDef {
  char: string;
  start: { x: number; y: number; rot: number; scale: number };
  jumble: { y: number; rot: number; scale: number };
}

// 6 Alphabets of HANZEI flying from 6 different corners
const LETTERS: LetterDef[] = [
  {
    char: 'H',
    start: { x: -350, y: -280, rot: -85, scale: 0.3 },
    jumble: { y: 22, rot: -16, scale: 0.94 },
  },
  {
    char: 'A',
    start: { x: -300, y: 300, rot: 70, scale: 0.3 },
    jumble: { y: -26, rot: 14, scale: 1.08 },
  },
  {
    char: 'N',
    start: { x: 80, y: -340, rot: -55, scale: 0.3 },
    jumble: { y: 24, rot: -10, scale: 0.92 },
  },
  {
    char: 'Z',
    start: { x: 320, y: 280, rot: 80, scale: 0.3 },
    jumble: { y: -22, rot: 18, scale: 1.06 },
  },
  {
    char: 'E',
    start: { x: 350, y: -260, rot: -75, scale: 0.3 },
    jumble: { y: 20, rot: -14, scale: 0.95 },
  },
  {
    char: 'I',
    start: { x: -90, y: 320, rot: 60, scale: 0.3 },
    jumble: { y: -24, rot: 12, scale: 1.1 },
  },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<AnimPhase>('init');

  useEffect(() => {
    // 1. Letters fly-in from different corners spinning smoothly
    const t1 = setTimeout(() => {
      setPhase('jumbled');
    }, 50);

    // 2. Letters snap into straight line alignment
    const t2 = setTimeout(() => {
      setPhase('aligned');
    }, 900);

    // 3. Official 3D Logo (with roof, chimney & flourish) seamlessly illuminates
    const t3 = setTimeout(() => {
      setPhase('logo_reveal');
    }, 1250);

    // 4. "Software" slides in from Left, "House" slides in from Right (simple silver color, nothing in between)
    const t4 = setTimeout(() => {
      setPhase('subtitles');
    }, 1650);

    // 5. Smooth fade out and open the site
    const t5 = setTimeout(() => {
      setPhase('exiting');
    }, 2450);

    // 6. Complete and unmount
    const t6 = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (phase === 'exiting') return;
    setPhase('exiting');
    setTimeout(() => {
      onComplete?.();
    }, 450);
  };

  const isAligned = phase === 'aligned' || phase === 'logo_reveal' || phase === 'subtitles' || phase === 'exiting';
  const showFullLogo = phase === 'logo_reveal' || phase === 'subtitles' || phase === 'exiting';
  const showSubtitles = phase === 'subtitles' || phase === 'exiting';
  const isExiting = phase === 'exiting';

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[999999] bg-[#0c0e14] flex flex-col items-center justify-center p-6 select-none cursor-pointer overflow-hidden transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Ambient Radial Light (Pure & Clean) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Center Stage */}
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
        
        {/* Logo Container Area */}
        <div className="relative w-full flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
          
          {/* A. Letter-by-Letter Flying Alphabets (Phase 1 & 2) */}
          <div
            className={`flex items-center justify-center transition-opacity duration-400 ${
              showFullLogo ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'
            }`}
          >
            {LETTERS.map((item, index) => {
              let transformStyle = '';
              let opacityStyle = 1;
              let transitionStyle = 'all 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)';

              if (phase === 'init') {
                transformStyle = `translate3d(${item.start.x}px, ${item.start.y}px, 0) rotate(${item.start.rot}deg) scale(${item.start.scale})`;
                opacityStyle = 0;
              } else if (phase === 'jumbled') {
                // Misaligned / crooked spelling landing from corners
                transformStyle = `translate3d(0, ${item.jumble.y}px, 0) rotate(${item.jumble.rot}deg) scale(${item.jumble.scale})`;
                opacityStyle = 1;
                transitionStyle = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 40}ms`;
              } else {
                // Snapped into straight line: y=0, rot=0, scale=1
                transformStyle = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
                opacityStyle = 1;
                transitionStyle = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
              }

              return (
                <div
                  key={item.char + index}
                  style={{
                    transform: transformStyle,
                    opacity: opacityStyle,
                    transition: transitionStyle,
                  }}
                  className="inline-block mx-1 sm:mx-2 md:mx-3"
                >
                  <span
                    className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-wider leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#ca8a04] drop-shadow-[0_4px_16px_rgba(234,179,8,0.4)]"
                    style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
                  >
                    {item.char}
                  </span>
                </div>
              );
            })}
          </div>

          {/* B. Official 3D Luxury Logo Image (Illuminates once snapped into place) */}
          <div
            className={`w-full max-w-[420px] sm:max-w-[490px] transition-all duration-500 ease-out flex items-center justify-center ${
              showFullLogo
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-2 pointer-events-none absolute'
            }`}
          >
            <div className="relative w-full aspect-[16/9] [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_100%)]">
              <Image
                src="/hanzei-logo.jpg"
                alt="HANZEI"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

        </div>

        {/* C. "Software" from Left & "House" from Right (Simple silver color, nothing in between) */}
        <div className="relative mt-2 sm:mt-3 flex items-center justify-center gap-2 overflow-hidden py-1">
          {/* "Software" slides in from the Left */}
          <div
            style={{
              transform: showSubtitles ? 'translateX(0)' : 'translateX(-120px)',
              opacity: showSubtitles ? 1 : 0,
              transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span
              className="text-xs sm:text-sm md:text-base font-medium uppercase tracking-[0.3em] text-slate-300 font-mono"
            >
              SOFTWARE
            </span>
          </div>

          {/* Clean natural space - nothing in between */}

          {/* "House" slides in from the Right */}
          <div
            style={{
              transform: showSubtitles ? 'translateX(0)' : 'translateX(120px)',
              opacity: showSubtitles ? 1 : 0,
              transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span
              className="text-xs sm:text-sm md:text-base font-medium uppercase tracking-[0.3em] text-slate-300 font-mono"
            >
              HOUSE
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}