'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  menuWidth?: string;
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  menuWidth = 'w-48'
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2.5 text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-slate-800 transition-all select-none shadow-2xs hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
      >
        <span className="truncate max-w-[120px] sm:max-w-[150px] inline-block text-left" title={displayLabel}>
          {displayLabel}
        </span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-600' : ''
          }`} 
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className={`absolute right-0 top-full mt-1.5 ${menuWidth} bg-white rounded-xl shadow-xl border border-slate-200 z-[999] overflow-hidden animate-in fade-in zoom-in-95 duration-100`}>
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 py-1">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                    isSelected 
                      ? 'bg-amber-50 text-amber-950 font-bold' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate pr-2 max-w-[180px] inline-block" title={option.label}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
