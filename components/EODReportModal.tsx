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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                End Day: Daily Work Report (EOD)
              </h3>
              <p className="text-xs text-slate-500">
                Staff Checkout for <strong className="text-slate-800">{currentUser.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEODModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice alert */}
        <div className="mt-4 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
          <strong>Mandatory Software House Policy:</strong> To ensure transparency, your day checkout is only registered once you submit what you accomplished today and what you plan to do tomorrow.
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Tasks Completed */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              1. What work / tasks did you accomplish today? *
            </label>
            <textarea
              value={tasksCompleted}
              onChange={(e) => setTasksCompleted(e.target.value)}
              placeholder="e.g. Completed billing module API, fixed UI button responsiveness on mobile, tested checkout flow..."
              rows={3}
              className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
              required
            />
          </div>

          {/* Blockers */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              2. Any blockers, bugs, or challenges faced? (Optional)
            </label>
            <input
              type="text"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="e.g. Waiting on client API key, server restart needed, or None."
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Tomorrow's Plan */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              3. What is your plan for tomorrow? *
            </label>
            <input
              type="text"
              value={planForTomorrow}
              onChange={(e) => setPlanForTomorrow(e.target.value)}
              placeholder="e.g. Implement webhook receiver and start regression tests."
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>

          {/* Hours & Rating */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Hours Worked Today
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="18"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 8)}
                className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Self Productivity Rating
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
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEODModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report & Clock Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

