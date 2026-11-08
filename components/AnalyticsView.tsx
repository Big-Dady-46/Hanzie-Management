'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  TrendingUp, Clock, Zap, Target, Award,
  ArrowUpRight, ArrowDownRight, Sparkles, Filter,
  Layers, CheckCircle2, BarChart2
} from 'lucide-react';

export default function AnalyticsView() {
  const { projects, tasks, users } = useApp();
  const [timeRange, setTimeRange] = useState('6_months');
  const [activeHoverPoint, setActiveHoverPoint] = useState<number | null>(2);

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
    { label: 'Development', count: 68, pct: 75, color: 'from-amber-500 to-amber-600' },
    { label: 'Design', count: 42, pct: 55, color: 'from-amber-400 to-amber-500' },
    { label: 'Testing & QA', count: 28, pct: 35, color: 'from-slate-400 to-slate-500' },
    { label: 'Documentation', count: 18, pct: 24, color: 'from-slate-500 to-slate-600' },
    { label: 'Planning & Strategy', count: 14, pct: 18, color: 'from-slate-600 to-slate-700' },
  ];

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const activeProjectsCount = projects.filter(p => p.status === 'in_progress').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card-gold p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
              Executive Performance Analytics
            </span>
            <span className="text-xs text-slate-400">Team Velocity & Sprint Success</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Analytics & Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detailed insights into your software house engineering velocity, response times, and sprint throughput.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['1_month', '3_months', '6_months', '1_year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'btn-gold shadow-md'
                  : 'btn-dark'
              }`}
            >
              {range.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sprint Throughput', value: `${completedTasks} Tasks`, delta: '+18.4%', trend: 'up', icon: CheckCircle2 },
          { label: 'Active Pipeline', value: `${activeProjectsCount} Projects`, delta: '+2', trend: 'up', icon: Layers },
          { label: 'In Progress Tasks', value: `${inProgressTasks} Sprint Units`, delta: 'On Track', trend: 'up', icon: Zap },
          { label: 'Team Efficiency Rate', value: '94.2%', delta: '+5.1%', trend: 'up', icon: TrendingUp },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card p-5 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="section-label">{card.label}</span>
                <div className="w-8 h-8 rounded-lg icon-badge-gold flex items-center justify-center">
                  <Icon className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="text-xl font-black text-slate-100 mt-3 font-mono">{card.value}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  {card.delta}
                </span>
                <span className="text-[11px] text-slate-500">vs last cycle</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprint Burnup Chart (SVG) */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Sprint Delivery Velocity</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tasks completed vs new requests opened (6 Month Trajectory)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-400">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <span className="text-slate-400">Created</span>
              </div>
            </div>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="h-64 w-full relative">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal Grid lines */}
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
              ))}
              {/* Gold completed area */}
              <polygon
                points="0,180 50,150 150,120 250,70 350,85 450,50 550,20 600,20 600,200 0,200"
                fill="url(#goldGradient)"
              />
              {/* Gold completed line */}
              <polyline
                fill="none"
                stroke="#d4af37"
                strokeWidth="2.5"
                points="50,150 150,120 250,70 350,85 450,50 550,20"
              />
              {/* Gray created line */}
              <polyline
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="4 4"
                points="50,140 150,125 250,142 350,100 450,110 550,80"
              />
              {/* Data points */}
              {[
                { x: 50, y: 150, label: 'Jan' },
                { x: 150, y: 120, label: 'Feb' },
                { x: 250, y: 70, label: 'Mar' },
                { x: 350, y: 85, label: 'Apr' },
                { x: 450, y: 50, label: 'May' },
                { x: 550, y: 20, label: 'Jun' },
              ].map((pt, i) => (
                <g key={pt.label}>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#13161e" stroke="#d4af37" strokeWidth="2.5" />
                  <text x={pt.x} y="195" textAnchor="middle" fill="#64748b" fontSize="10">{pt.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Task Distribution / Breakdown */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Domain Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tasks distributed across departments</p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {categories.map((cat) => (
              <div key={cat.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px]">{cat.count} units</span>
                    <span className="font-bold text-slate-200">{cat.pct}%</span>
                  </div>
                </div>
                <div className="progress-track h-2">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-500`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-amber-400/[0.04] border border-amber-400/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg icon-badge-gold flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">High Engineering Velocity</p>
              <p className="text-[11px] text-slate-400">Software house is currently tracking 22% ahead of sprint schedule.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Efficiency Strip */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Monthly Efficiency Index</h3>
            <p className="text-xs text-slate-400 mt-0.5">Weighted average of ticket resolutions and client sign-offs</p>
          </div>
          <span className="text-xs text-amber-400 font-semibold font-mono">Benchmark: 80 pts</span>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {efficiencyBars.map((bar) => (
            <div key={bar.month} className="text-center">
              <div className="h-32 bg-white/[0.02] rounded-xl border border-white/[0.04] p-2 flex flex-col justify-end items-center relative group">
                <div
                  className={`w-full rounded-lg transition-all ${
                    bar.highlight
                      ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-700/60 group-hover:bg-slate-600'
                  }`}
                  style={{ height: `${Math.min(100, (bar.val / 120) * 100)}%` }}
                />
                <span className="absolute top-2 text-[10px] font-bold font-mono text-slate-300">
                  {bar.val}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">{bar.month}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
