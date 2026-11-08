'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  TrendingUp, Clock, Zap, Target, Award, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Sparkles, Filter, ChevronDown, 
  Layers, CheckCircle2, PieChart as PieIcon
} from 'lucide-react';

export default function AnalyticsView() {
  const { projects, tasks, users } = useApp();
  const [timeRange, setTimeRange] = useState('6_months');
  const [activeHoverPoint, setActiveHoverPoint] = useState<number | null>(2); // March by default

  const months = [
    { name: 'Jan', completed: 25, created: 30 },
    { name: 'Feb', completed: 42, created: 38 },
    { name: 'Mar', completed: 70, created: 29 },
    { name: 'Apr', completed: 62, created: 50 },
    { name: 'May', completed: 78, created: 45 },
    { name: 'Jun', completed: 95, created: 60 },
  ];

  const efficiencyBars = [
    { month: 'Jan', val: 55 },
    { month: 'Feb', val: 70 },
    { month: 'Mar', val: 40 },
    { month: 'Apr', val: 118, highlight: true },
    { month: 'May', val: 65 },
    { month: 'Jun', val: 85 },
  ];

  const categories = [
    { label: 'Development', count: 68, pct: 75, color: 'bg-indigo-600' },
    { label: 'Design', count: 42, pct: 55, color: 'bg-blue-600' },
    { label: 'Testing & QA', count: 28, pct: 35, color: 'bg-sky-500' },
    { label: 'Documentation', count: 18, pct: 24, color: 'bg-teal-500' },
    { label: 'Planning & Strategy', count: 14, pct: 18, color: 'bg-purple-500' },
    { label: 'Other / Misc', count: 8, pct: 10, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card (Recreation of Reference Image 2: TaskFlow) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Executive Performance Analytics
            </span>
            <span className="text-xs text-slate-400">Team Velocity & Sprint Success</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Analytics & Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Detailed insights into your software house engineering velocity, response times, and sprint throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="last_30_days">Last 30 Days</option>
            <option value="6_months">Last 6 Months</option>
            <option value="this_year">This Year (2026)</option>
          </select>
        </div>
      </div>

      {/* 4 Core Top Metrics (Exact layout of Image 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Task Completion Rate */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            94.2%
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Task Completion Rate
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4.2% vs last month</span>
          </div>
        </div>

        {/* Metric 2: Average Response Time */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            2.4h
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Average Response Time
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-18% faster turnaround</span>
          </div>
        </div>

        {/* Metric 3: Team Velocity */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            18.5
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Team Velocity (Pts / Sprint)
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Top quartile performance</span>
          </div>
        </div>

        {/* Metric 4: Sprint Success Rate */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            87%
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Sprint Success Rate
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>On track across 4 active projects</span>
          </div>
        </div>
      </div>

      {/* Row 2: Monthly Progress (Line Curve) & Team Efficiency Trend (Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress Chart (Exact style of Image 2) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Monthly Progress</h3>
              <p className="text-xs text-slate-500">Task completion trends over 6 months</p>
            </div>
            <span className="text-xs font-bold text-slate-400">...</span>
          </div>

          {/* SVG Smooth Curve Graph */}
          <div className="relative h-56 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid horizontal lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Area fill under curve */}
              <path
                d="M 10 140 Q 90 120, 100 100 T 200 60 T 300 80 T 400 45 T 490 20 L 490 170 L 10 170 Z"
                fill="url(#curveGradient)"
              />

              {/* Stroke line */}
              <path
                d="M 10 140 Q 90 120, 100 100 T 200 60 T 300 80 T 400 45 T 490 20"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Highlight Circle on March (x=200, y=60) */}
              <circle cx="200" cy="60" r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
            </svg>

            {/* Hover Tooltip Box on March (Image 2 reproduction) */}
            <div className="absolute left-[36%] top-[10%] bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3 shadow-soft-lg text-xs pointer-events-none">
              <span className="font-extrabold text-slate-800 block text-[11px] mb-1">March</span>
              <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>Completed: 70</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Created: 29</span>
              </div>
            </div>

            {/* X-axis Month labels */}
            <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2 px-2">
              {months.map(m => (
                <span key={m.name}>{m.name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Team Efficiency Trend (Bar Chart matching Image 2) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Team Efficiency Trend</h3>
              <p className="text-xs text-slate-500">Overall efficiency percentage over time</p>
            </div>
            <span className="text-xs font-bold text-slate-400">...</span>
          </div>

          <div className="flex items-end justify-between gap-4 h-56 pt-6 px-4">
            {efficiencyBars.map((bar, idx) => {
              const heightPct = Math.round((bar.val / 130) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative group">
                  {bar.highlight && (
                    <div className="absolute -top-12 bg-white border border-slate-200 rounded-xl p-2 shadow-soft text-center whitespace-nowrap z-10">
                      <span className="text-[10px] font-bold text-slate-700 block">April</span>
                      <span className="text-[11px] font-black text-indigo-600 flex items-center gap-1 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        Efficiency: {bar.val}
                      </span>
                    </div>
                  )}

                  <div className="w-full bg-slate-100 rounded-2xl h-44 flex items-end overflow-hidden p-1">
                    <div
                      className={`w-full rounded-xl transition-all duration-500 ${
                        bar.highlight 
                          ? 'bg-indigo-600 shadow-md shadow-indigo-200' 
                          : 'bg-slate-200 hover:bg-slate-300'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500">{bar.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Tasks by Category, Quick Insights & Productivity Trends (Exact Image 2 lower row) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Tasks by Category */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Tasks by Category</h3>
            <p className="text-xs text-slate-500">Distribution across work categories</p>
          </div>

          <div className="space-y-3 pt-2">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{cat.label}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{cat.count} tasks</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-2 rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Quick Insights (Alerts & Tips matching Image 2) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Quick Insights</h3>
            <p className="text-xs text-slate-500">Automated performance alerts</p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center gap-3.5">
              <div className="icon-round-amber w-9 h-9 min-w-9 min-h-9">
                <Award className="w-4 h-4 drop-shadow-xs" />
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-slate-900 block">Best day: Wednesday (95%)</span>
                <span className="text-slate-500 text-[11px]">Highest task completion rate recorded midweek.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center gap-3.5">
              <div className="icon-round-rose w-9 h-9 min-w-9 min-h-9">
                <AlertTriangle className="w-4 h-4 drop-shadow-xs" />
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-slate-900 block">Overdue Tasks Increased by 5%</span>
                <span className="text-slate-500 text-[11px]">Slight rise in delayed tasks compared to last week.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3.5">
              <div className="icon-round-green w-9 h-9 min-w-9 min-h-9">
                <TrendingUp className="w-4 h-4 drop-shadow-xs" />
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-slate-900 block">Team Velocity Up 12% This Week</span>
                <span className="text-slate-500 text-[11px]">More sprint story points resolved with higher efficiency.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3.5">
              <div className="icon-round-blue w-9 h-9 min-w-9 min-h-9">
                <Target className="w-4 h-4 drop-shadow-xs" />
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-slate-900 block">At-Risk Projects: 0</span>
                <span className="text-slate-500 text-[11px]">All 4 current projects are on schedule.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Productivity Trends (Donut Chart matching Image 2) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Productivity Trends</h3>
            <p className="text-xs text-slate-500">Daily productivity ratio distribution</p>

            {/* Donut Chart visualization */}
            <div className="relative w-40 h-40 mx-auto my-4 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 1: Blue */}
                <path
                  className="text-indigo-600"
                  strokeDasharray="40, 100"
                  strokeDashoffset="0"
                  strokeWidth="5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 2: Light Blue */}
                <path
                  className="text-sky-400"
                  strokeDasharray="30, 100"
                  strokeDashoffset="-40"
                  strokeWidth="5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 3: Deep Blue */}
                <path
                  className="text-slate-800"
                  strokeDasharray="20, 100"
                  strokeDashoffset="-70"
                  strokeWidth="5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute text-center">
                <span className="text-xl font-black text-slate-900">92%</span>
                <span className="text-[10px] font-bold text-slate-400 block">Avg Rate</span>
              </div>
            </div>
          </div>

          {/* Daily metrics legend matching Image 2 */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600" /> Mon: 92%</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-800" /> Tue: 92%</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> Wed: 95%</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" /> Thu: 83%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

