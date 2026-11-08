'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  FileText, CheckCircle2, Clock, AlertTriangle, 
  Sparkles, Star, X, Send
} from 'lucide-react';

export default function EODReportModal() {
  const { 
    isEODModalOpen, 
    setIsEODModalOpen, 
    currentUser, 
    clockOutWithReport 
  } = useApp();

  const [tasksCompleted, setTasksCompleted] = useState('');
  const [blockers, setBlockers] = useState('');
  const [hoursWorked, setHoursWorked] = useState(8.0);
  const [planForTomorrow, setPlanForTomorrow] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');

  if (!isEODModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasksCompleted.trim()) {
      setError('Please provide details of the tasks you completed today.');
      return;
    }
    if (!planForTomorrow.trim()) {
      setError('Please provide a brief plan for tomorrow.');
      return;
    }

    clockOutWithReport({
      tasksCompleted,
      blockers,
      hoursWorked,
      planForTomorrow,
      rating,
    });

    setTasksCompleted('');
    setBlockers('');
    setPlanForTomorrow('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-8 sm:p-9 max-w-xl w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#fff0f3] text-[#e11d48] flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0f172a]">
                End Day: Daily Work Report (EOD)
              </h3>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Staff Checkout for <strong className="text-slate-800">{currentUser.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEODModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice alert */}
        <div className="mt-5 p-4 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900 leading-relaxed font-medium">
          <strong>Mandatory Software House Policy:</strong> To ensure office transparency, day checkout is only registered once you submit what you accomplished today and what you plan to do tomorrow.
        </div>

        {error && (
          <div className="mt-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Tasks Completed */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              1. What work / tasks did you accomplish today? *
            </label>
            <textarea
              value={tasksCompleted}
              onChange={(e) => setTasksCompleted(e.target.value)}
              placeholder="e.g. Completed billing module API, fixed UI button responsiveness on mobile, tested checkout flow..."
              rows={3}
              className="w-full text-xs border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium leading-relaxed"
              required
            />
          </div>

          {/* Blockers */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              2. Any blockers, bugs, or challenges faced? (Optional)
            </label>
            <input
              type="text"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="e.g. Waiting on client API key, server restart needed, or None."
              className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Tomorrow's Plan */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              3. What is your plan for tomorrow? *
            </label>
            <input
              type="text"
              value={planForTomorrow}
              onChange={(e) => setPlanForTomorrow(e.target.value)}
              placeholder="e.g. Implement webhook receiver and start regression tests."
              className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>

          {/* Hours & Rating */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Hours Worked Today
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="18"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 8)}
                className="w-full text-xs font-bold border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Productivity Rating
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-5 h-5 ${
                        star <= rating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-slate-200'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEODModalOpen(false)}
              className="btn-2d-light px-5 py-2.5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-2d-rose px-6 py-2.5 text-xs flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5 drop-shadow-xs" />
              <span>Submit Report & Clock Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
