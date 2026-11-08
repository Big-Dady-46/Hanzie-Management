'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  LayoutDashboard, FolderKanban, CheckSquare, Users, 
  Calendar, FileText, DollarSign, LogOut, Download, 
  Database, Briefcase, ChevronDown, CheckCircle2
} from 'lucide-react';

export default function Sidebar() {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    users, 
    switchUser,
    setIsDbModalOpen
  } = useApp();

  const isLeader = currentUser.role === 'leader';
  const isClient = currentUser.role === 'client';
  const pendingCount = users.filter(u => u.status === 'pending_approval').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'attendance', label: 'Hazari / Attendance', icon: Calendar },
    { id: 'team', label: 'Team', icon: Users, badge: isLeader && pendingCount > 0 ? pendingCount : null },
    { id: 'payroll', label: 'Payroll & Salaries', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'client_portal', label: 'Client Portal', icon: Briefcase },
  ];

  return (
    <aside className="w-[240px] bg-white border-r border-[#edf2f7] flex flex-col justify-between h-full select-none shrink-0 py-6 px-5">
      {/* Top Part: Logo & Navigation */}
      <div>
        {/* Brand Logo (Exact match of Image 1 Project Pro style) */}
        <div className="flex items-center gap-3 px-1 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] flex items-center justify-center text-white shadow-md shadow-blue-200">
            {/* Winged folded shape like Image 1 */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#1e293b] tracking-tight">Hanzei</h1>
          </div>
        </div>

        {/* Demo Role Switcher */}
        <div className="mb-6 px-2 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            Active Role:
          </label>
          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="w-full text-xs font-semibold bg-white border border-[#cbd5e1] rounded-lg px-2 py-1 text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="usr_leader">👑 Abdul Hannan (Leader)</option>
            <option value="usr_dev_1">💻 Hamza (Senior Dev)</option>
            <option value="usr_des_1">🎨 Zainab (UI/UX Designer)</option>
            <option value="usr_cleaner_1">🧹 Rafiq (Office Staff)</option>
            <option value="usr_client_1">🏢 Eleyas (Client)</option>
            <option value="usr_pending_1">⏳ Farhan (Pending User)</option>
          </select>
        </div>

        {/* Navigation Links (Matching Image 1: Project Pro) */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-[#2563eb] bg-[#eff6ff] font-bold'
                    : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563eb]' : 'text-[#94a3b8]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part: Download Mobile App Card (Exact Image 1 feature!) */}
      <div className="space-y-4 pt-6">
        <div className="bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] rounded-2xl p-4 text-white shadow-md shadow-blue-200/50 relative overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-xs font-bold leading-tight">Download our mobile App</h4>
          <p className="text-[10px] text-blue-100 mt-1 font-medium leading-relaxed">
            Get easy in another way
          </p>
          <button 
            onClick={() => setIsDbModalOpen(true)}
            className="w-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold py-1.5 rounded-xl mt-3 transition-colors backdrop-blur-xs"
          >
            Cloud Sync
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#1e293b] truncate">{currentUser.name}</p>
            <p className="text-[10px] text-[#94a3b8] capitalize truncate">{currentUser.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
