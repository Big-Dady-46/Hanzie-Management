'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Select date...',
  className = '',
  fullWidth = false,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date
  const parsedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const isValidDate = !isNaN(parsedDate.getTime()) && Boolean(value);

  const [viewYear, setViewYear] = useState<number>(
    isValidDate ? parsedDate.getFullYear() : new Date().getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    isValidDate ? parsedDate.getMonth() : new Date().getMonth()
  );

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update view when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Navigate months
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const handleSelectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setViewYear(yyyy);
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  // Format label for button
  const displayLabel = isValidDate
    ? `${SHORT_MONTHS[parsedDate.getMonth()]} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`
    : placeholder;

  const today = new Date();
  const isCurrentMonthView = today.getFullYear() === viewYear && today.getMonth() === viewMonth;
  const todayDateNum = today.getDate();

  return (
    <div 
      className={`relative ${fullWidth ? 'w-full block' : 'inline-block'} text-left ${className}`}
      ref={containerRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-slate-800 transition-all select-none shadow-2xs hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50 ${
          fullWidth ? 'w-full' : ''
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <CalendarIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="truncate font-semibold text-slate-800 font-mono text-[11px]" title={displayLabel}>
            {displayLabel}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">📅</span>
      </button>

      {/* Floating Luxury Calendar Card */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-1.5 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[9999] p-3 animate-in fade-in zoom-in-95 duration-100 select-none"
        >
          {/* Calendar Header: Month, Year, Nav Buttons */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-900 font-mono">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_OF_WEEK.map((d, idx) => (
              <span key={d} className={`text-[10px] font-bold ${idx === 0 || idx === 6 ? 'text-amber-700' : 'text-slate-400'}`}>
                {d}
              </span>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Previous month days */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + idx + 1;
              return (
                <span
                  key={`prev-${idx}`}
                  className="text-[11px] text-slate-300 py-1.5 select-none"
                >
                  {dayNum}
                </span>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isSelected = isValidDate &&
                parsedDate.getFullYear() === viewYear &&
                parsedDate.getMonth() === viewMonth &&
                parsedDate.getDate() === dayNum;
              const isToday = isCurrentMonthView && todayDateNum === dayNum;

              return (
                <button
                  key={`curr-${dayNum}`}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`text-[11px] font-semibold py-1.5 rounded-lg transition-all flex items-center justify-center relative ${
                    isSelected
                      ? 'bg-amber-500 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-amber-50 hover:text-amber-950'
                  }`}
                >
                  <span>{dayNum}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Footer: Today Button */}
          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-900 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Select Today</span>
            </button>
            <span className="text-[10px] text-slate-400 font-mono">
              {MONTH_NAMES[viewMonth].slice(0, 3)} '{String(viewYear).slice(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

