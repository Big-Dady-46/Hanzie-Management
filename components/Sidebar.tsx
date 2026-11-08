'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  LayoutDashboard, FolderKanban, CheckSquare, Users, 
  Calendar, FileText, DollarSign, LogOut, Download, 
  Database, Briefcase, ChevronDown, CheckCircle2, Sparkles
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
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects & Ledger', icon: FolderKanban },
    { id: 'tasks', label: 'Sprint Tasks', icon: CheckSquare },
    { id: 'attendance', label: 'Hazari / Attendance', icon: Calendar },
    { id: 'team', label: 'Staff Directory', icon: Users, badge: isLeader && pendingCount > 0 ? pendingCount : null },
    { id: 'payroll', label: 'Payroll & Salaries', icon: DollarSign },
    { id: 'reports', label: 'Daily Reports', icon: FileText },
    { id: 'client_portal', label: 'Client Portal', icon: Briefcase },
  ];

  return (
    <aside className="w-[235px] bg-white border-r border-slate-200/90 flex flex-col justify-between h-full select-none shrink-0 py-6 px-4">
      {/* Top Part: Logo & Navigation */}
      <div>
        {/* Luxury Gold & Silver Brand Logo */}
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#b8860b] via-[#f5c842] to-[#d4af37] flex items-center justify-center text-slate-950 font-black text-base shadow-md shadow-amber-500/25 shrink-0" style={{ fontFamily: "'Cinzel', serif" }}>
            H
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg brand-logo-text leading-none uppercase">
                Hanzie
              </h1>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            </div>
            <span className="text-[10px] text-amber-700/80 font-bold tracking-wider uppercase block mt-1">
              Software House
            </span>
          </div>
        </div>

        {/* Demo Role Switcher */}
        <div className="mb-5 p-2 bg-slate-50 border border-slate-200/90 rounded-xl">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Demo Persona Switcher:
          </label>
          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="usr_leader">👑 Abdul Hannan (Leader)</option>
            <option value="usr_dev_1">💻 Hamza (Senior Dev)</option>
            <option value="usr_des_1">🎨 Zainab (UI/UX Designer)</option>
            <option value="usr_cleaner_1">🧹 Rafiq (Office Staff)</option>
            <option value="usr_client_1">🏢 Eleyas (Client)</option>
            <option value="usr_pending_1">⏳ Farhan (Pending User)</option>
          </select>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'text-amber-950 bg-amber-50/90 font-bold border-l-2 border-amber-600 rounded-l-none shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-amber-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part: Database Cloud Sync & User Profile */}
      <div className="space-y-3.5 pt-4 border-t border-slate-100">
        <button 
          onClick={() => setIsDbModalOpen(true)}
          className="w-full btn-silver text-xs py-1.5"
        >
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>Cloud Sync & DB</span>
        </button>

        {/* User Mini Profile with Gold Border */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-xs shadow-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 capitalize truncate">{currentUser.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
