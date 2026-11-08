'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  LayoutDashboard, CheckSquare, FolderKanban, Clock, 
  Users, DollarSign, FileText, Briefcase, Database,
  Search, Sparkles, ChevronDown, BookOpen, HelpCircle, Settings,
  Circle, Plus, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    users, 
    switchUser,
    projects,
    leaves,
    setIsDbModalOpen
  } = useApp();

  const isLeader = currentUser.role === 'leader';
  const isClient = currentUser.role === 'client';
  const pendingUsersCount = users.filter(u => u.status === 'pending_approval').length;
  const pendingLeavesCount = leaves.filter(l => l.status === 'pending').length;

  return (
    <aside className="w-[270px] bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 select-none z-20 shrink-0">
      {/* 1. Header with Logo (Matching Image 3: Zentask style) */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              H
            </div>
            <div>
              <div className="flex items-center gap-1.5 cursor-pointer">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">Hanzei</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Software House</p>
            </div>
          </div>

          {/* Quick Database Sync Status Indicator */}
          <button 
            onClick={() => setIsDbModalOpen(true)}
            title="Database Status: Supabase Realtime Ready"
            className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Demo Switcher Pill (Discreet, clean, professional) */}
        <div className="mt-3.5 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5">
            Viewing Role:
          </div>
          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="w-full text-xs font-semibold bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="usr_leader">👑 Abdul Hannan (Leader / CEO)</option>
            <option value="usr_dev_1">💻 Hamza Malik (Senior Dev)</option>
            <option value="usr_des_1">🎨 Zainab Fatima (UI/UX Designer)</option>
            <option value="usr_cleaner_1">🧹 Muhammad Rafiq (Caretaker)</option>
            <option value="usr_client_1">🏢 Eleyas Hasan (Client View)</option>
            <option value="usr_pending_1">⏳ Farhan Siddiqui (Pending User)</option>
          </select>
        </div>
      </div>

      {/* 2. Navigation Items (Grouped like Image 3 Zentask) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 text-xs font-semibold">
        {/* MAIN SECTION */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Main
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Dashboard</span>
              </div>
            </button>

            {!isClient && (
              <button
                onClick={() => setActiveTab('tasks')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'tasks'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckSquare className={`w-4 h-4 ${activeTab === 'tasks' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>My Tasks</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">8</span>
              </button>
            )}
          </div>
        </div>

        {/* WORKSPACE SECTION */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          <div className="space-y-0.5">
            {!isClient && (
              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'projects'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className={`w-4 h-4 ${activeTab === 'projects' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Projects & Finance</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">{projects.length}</span>
              </button>
            )}

            {!isClient && (
              <button
                onClick={() => setActiveTab('attendance')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'attendance'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 ${activeTab === 'attendance' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Hazari & Attendance</span>
                </div>
                {pendingLeavesCount > 0 && isLeader && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                    {pendingLeavesCount}
                  </span>
                )}
              </button>
            )}

            {isLeader && (
              <button
                onClick={() => setActiveTab('team')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'team'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 ${activeTab === 'team' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Staff & Cleaners</span>
                </div>
                {pendingUsersCount > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                    {pendingUsersCount}
                  </span>
                )}
              </button>
            )}

            {!isClient && (
              <button
                onClick={() => setActiveTab('payroll')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'payroll'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DollarSign className={`w-4 h-4 ${activeTab === 'payroll' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Salaries & Payroll</span>
                </div>
              </button>
            )}

            {!isClient && (
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'reports'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 ${activeTab === 'reports' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Daily EOD Reports</span>
                </div>
              </button>
            )}

            <button
              onClick={() => setActiveTab('client_portal')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'client_portal'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className={`w-4 h-4 ${activeTab === 'client_portal' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Client Portal</span>
              </div>
            </button>
          </div>
        </div>

        {/* PROJECTS LIST SECTION (Exact match of Image 3: Zentask) */}
        <div>
          <div className="px-3 pb-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Projects</span>
            <span className="text-slate-300">4</span>
          </div>
          <div className="space-y-0.5">
            {[
              { name: 'Apex Freight ERP', color: 'bg-purple-500', count: 7 },
              { name: 'Lumina Health AI', color: 'bg-orange-500', count: 4 },
              { name: 'Nova AI Content', color: 'bg-teal-500', count: 4 },
              { name: 'Zenith Real Estate', color: 'bg-sky-500', count: 5 },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab('projects')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-[11px]"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`w-2 h-2 rounded-full ${p.color}`} />
                  <span className="truncate">{p.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{p.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Footer Profile (Image 3 style) */}
      <div className="p-3.5 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${
                currentUser.workStatus === 'working' ? 'bg-emerald-500' :
                currentUser.workStatus === 'on_break' ? 'bg-amber-500' :
                currentUser.workStatus === 'on_leave' ? 'bg-purple-500' : 'bg-slate-300'
              }`} />
              <span className="capitalize">{currentUser.workStatus.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
