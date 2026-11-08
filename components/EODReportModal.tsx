'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  FileText, Clock, AlertTriangle, 
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card-gold p-7 sm:p-8 max-w-xl w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl icon-badge-gold flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">End of Day Checkout</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                  Mandatory
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent shift wrap-up for {currentUser.name}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsEODModalOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block section-label mb-1.5">
              Tasks Accomplished Today <span className="text-amber-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={tasksCompleted}
              onChange={(e) => setTasksCompleted(e.target.value)}
              placeholder="List milestones finished, PRs created, commits merged, designs finalized..."
              className="dark-input w-full resize-none text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block section-label mb-1.5">
                Blockers / Obstacles Encountered
              </label>
              <textarea
                rows={2}
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="Any client blockers, API issues, or delays? (Leave blank if none)"
                className="dark-input w-full resize-none text-xs leading-relaxed"
              />
            </div>
            <div>
              <label className="block section-label mb-1.5">
                Tomorrow's Planned Priority <span className="text-amber-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={planForTomorrow}
                onChange={(e) => setPlanForTomorrow(e.target.value)}
                placeholder="What will you deliver or tackle next sprint shift?"
                className="dark-input w-full resize-none text-xs leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block section-label mb-1.5">
                <Clock className="w-3 h-3 inline mr-1 text-slate-400" />
                Shift Hours Logged
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 0)}
                className="dark-input w-full text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block section-label mb-1.5">
                <Sparkles className="w-3 h-3 inline mr-1 text-amber-400" />
                Shift Rating (1-5)
              </label>
              <div className="flex items-center gap-1.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-5 h-5 ${
                        star <= rating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-slate-600 hover:text-slate-400'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              type="button"
              onClick={() => setIsEODModalOpen(false)}
              className="btn-silver text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold text-xs py-2 px-5 gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit & End Shift</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
