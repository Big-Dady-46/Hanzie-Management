'use client';

import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  userName?: string;
}

type AnimPhase = 'init' | 'jumbled' | 'aligned' | 'roof_reveal' | 'subtitles' | 'exiting';

interface LetterDef {
  char: string;
  start: { x: number; y: number; rot: number };
  jumble: { y: number; rot: number; scale: number };
}

// 6 alphabets of HANZEI flying in from 6 corners
const LETTERS: LetterDef[] = [
  { char: 'H', start: { x: -380, y: -280, rot: -85 }, jumble: { y: 22, rot: -16, scale: 0.94 } },
  { char: 'A', start: { x: -300, y: 300, rot: 70 }, jumble: { y: -24, rot: 14, scale: 1.08 } },
  { char: 'N', start: { x: 80, y: -340, rot: -55 }, jumble: { y: 24, rot: -10, scale: 0.92 } },
  { char: 'Z', start: { x: 320, y: 280, rot: 80 }, jumble: { y: -20, rot: 16, scale: 1.06 } },
  { char: 'E', start: { x: 360, y: -260, rot: -75 }, jumble: { y: 20, rot: -14, scale: 0.95 } },
  { char: 'I', start: { x: -90, y: 320, rot: 60 }, jumble: { y: -24, rot: 12, scale: 1.1 } },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<AnimPhase>('init');

  useEffect(() => {
    // 1. Alphabets fly in from corners spinning smoothly into misaligned state
    const t1 = setTimeout(() => {
      setPhase('jumbled');
    }, 40);

    // 2. Alphabets snap into straight line
    const t2 = setTimeout(() => {
      setPhase('aligned');
    }, 850);

    // 3. Roof, Chimney & Swoosh flourish draw onto the logo
    const t3 = setTimeout(() => {
      setPhase('roof_reveal');
    }, 1250);

    // 4. "Software" from Left & "House" from Right (simple silver color)
    const t4 = setTimeout(() => {
      setPhase('subtitles');
    }, 1650);

    // 5. Smooth fade out and open app
    const t5 = setTimeout(() => {
      setPhase('exiting');
    }, 2450);

    const t6 = setTimeout(() => {
      onComplete?.();
    }, 2950);

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
    }, 400);
  };

  const isAligned = phase === 'aligned' || phase === 'roof_reveal' || phase === 'subtitles' || phase === 'exiting';
  const showRoof = phase === 'roof_reveal' || phase === 'subtitles' || phase === 'exiting';
  const showSubtitles = phase === 'subtitles' || phase === 'exiting';
  const isExiting = phase === 'exiting';

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[999999] bg-[#0b0d13] flex flex-col items-center justify-center p-6 select-none cursor-pointer overflow-hidden transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Central Gold Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
        
        {/* Vector SVG + Typography Pure Code Construction */}
        <div className="relative w-full max-w-[540px] flex flex-col items-center justify-center">
          
          {/* Top Roof & Chimney Vector Line */}
          <div
            className={`w-full max-w-[340px] sm:max-w-[420px] h-14 sm:h-18 transition-all duration-600 ease-out ${
              showRoof ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <svg viewBox="0 0 380 90" fill="none" className="w-full h-full drop-shadow-[0_4px_12px_rgba(217,119,6,0.5)]">
              <defs>
                <linearGradient id="roofGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="35%" stopColor="#fde047" />
                  <stop offset="65%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>
              {/* Outer Roof Line with Chimney */}
              <path
                d="M 20 85 L 145 14 L 205 38 L 205 24 L 245 24 L 245 54 L 325 85"
                stroke="url(#roofGoldGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={showRoof ? 'animate-draw-crossbar' : ''}
              />
              {/* Inner Bevel Specular Accent Line */}
              <path
                d="M 28 85 L 145 22 L 200 44 L 200 30 L 238 30 L 238 58 L 318 85"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeOpacity="0.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Center Alphabets: H A N Z E I */}
          <div className="relative flex items-center justify-center py-1 sm:py-2">
            {LETTERS.map((item, index) => {
              let transformStyle = '';
              let opacityStyle = 1;
              let transitionStyle = 'all 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)';

              if (phase === 'init') {
                transformStyle = `translate3d(${item.start.x}px, ${item.start.y}px, 0) rotate(${item.start.rot}deg) scale(0.35)`;
                opacityStyle = 0;
              } else if (phase === 'jumbled') {
                transformStyle = `translate3d(0, ${item.jumble.y}px, 0) rotate(${item.jumble.rot}deg) scale(${item.jumble.scale})`;
                opacityStyle = 1;
                transitionStyle = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 40}ms`;
              } else {
                transformStyle = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
                opacityStyle = 1;
                transitionStyle = 'all 0.42s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
              }

              return (
                <div
                  key={item.char + index}
                  style={{
                    transform: transformStyle,
                    opacity: opacityStyle,
                    transition: transitionStyle,
                  }}
                  className="relative inline-block mx-1 sm:mx-2 md:mx-3"
                >
                  <span
                    className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-wider leading-none select-none text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#f59e0b] to-[#b45309] drop-shadow-[0_4px_18px_rgba(245,158,11,0.55)]"
                    style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
                  >
                    {item.char}
                  </span>

                  {/* Dual-Tone Silver-Gold Chrome Highlight */}
                  <span
                    className="absolute inset-0 text-5xl sm:text-7xl md:text-8xl font-bold tracking-wider leading-none select-none text-transparent bg-clip-text bg-gradient-to-tr from-transparent via-white/50 to-transparent pointer-events-none"
                    style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
                  >
                    {item.char}
                  </span>

                  {/* Golden Sphere Dot over the 'I' */}
                  {item.char === 'I' && (
                    <div
                      className={`absolute -top-3 sm:-top-5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-700 shadow-[0_0_12px_#fbbf24] transition-all duration-500 ${
                        showRoof ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Underline & Z Swoosh Flourish */}
          <div
            className={`w-full max-w-[360px] sm:max-w-[440px] h-6 sm:h-8 -mt-2 transition-all duration-600 ease-out ${
              showRoof ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <svg viewBox="0 0 420 40" fill="none" className="w-full h-full drop-shadow-[0_2px_10px_rgba(217,119,6,0.4)]">
              <defs>
                <linearGradient id="baseSwooshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ca8a04" />
                  <stop offset="40%" stopColor="#fde047" />
                  <stop offset="80%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
              </defs>
              {/* Straight Baseline under AN */}
              <line x1="75" y1="8" x2="215" y2="8" stroke="url(#baseSwooshGrad)" strokeWidth="3.5" strokeLinecap="round" />
              {/* Curved Tail of Z swooshing under EI */}
              <path
                d="M 215 8 Q 285 10 345 22 Q 390 28 415 14"
                stroke="url(#baseSwooshGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Specular White Stroke */}
              <line x1="80" y1="7" x2="210" y2="7" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
              <path
                d="M 218 7 Q 285 9 345 21"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

        </div>

        {/* Subtitles: "Software" from Left & "House" from Right (Simple silver color, nothing in between) */}
        <div className="relative mt-3 sm:mt-4 flex items-center justify-center gap-2.5 overflow-hidden py-1">
          {/* Software from Left */}
          <div
            style={{
              transform: showSubtitles ? 'translateX(0)' : 'translateX(-120px)',
              opacity: showSubtitles ? 1 : 0,
              transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span
              className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.32em] text-slate-300 font-mono"
            >
              SOFTWARE
            </span>
          </div>

          {/* Clean natural space - nothing in between */}

          {/* House from Right */}
          <div
            style={{
              transform: showSubtitles ? 'translateX(0)' : 'translateX(120px)',
              opacity: showSubtitles ? 1 : 0,
              transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span
              className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.32em] text-slate-300 font-mono"
            >
              HOUSE
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}