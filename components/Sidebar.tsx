'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  Calendar, FileText, DollarSign, Database, Briefcase, Sparkles
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
  const pendingCount = users.filter(u => u.status === 'pending_approval').length;

  const menuItems = [
    { id: 'dashboard',     label: 'Overview',         icon: LayoutDashboard },
    { id: 'projects',      label: 'Projects & Ledger', icon: FolderKanban },
    { id: 'tasks',         label: 'Sprint Tasks',      icon: CheckSquare },
    { id: 'attendance',    label: 'Hazari / Attendance', icon: Calendar },
    { id: 'team',          label: 'Staff Directory',   icon: Users,       badge: isLeader && pendingCount > 0 ? pendingCount : null },
    { id: 'payroll',       label: 'Payroll & Salaries', icon: DollarSign },
    { id: 'reports',       label: 'Daily Reports',     icon: FileText },
    { id: 'client_portal', label: 'Client Portal',     icon: Briefcase },
  ];

  return (
    <aside className="w-[230px] bg-[#13161e] border-r border-white/[0.06] flex flex-col h-full select-none shrink-0 py-6 px-3.5">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-7">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f5c842] to-[#b8860b] flex items-center justify-center text-black font-black text-sm shadow-lg shadow-amber-500/20">
          H
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-extrabold text-white tracking-tight leading-none">Hanzei</span>
            <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-[9px] text-amber-600/80 font-bold tracking-widest uppercase">Software House</span>
        </div>
      </div>

      {/* Demo Role Switcher */}
      <div className="mb-5 p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">
          Demo Persona
        </label>
        <select
          value={currentUser.id}
          onChange={(e) => switchUser(e.target.value)}
          className="dark-input w-full text-xs py-1.5"
        >
          <option value="usr_leader">👑 Abdul Hannan (Leader)</option>
          <option value="usr_dev_1">💻 Hamza (Senior Dev)</option>
          <option value="usr_des_1">🎨 Zainab (UI/UX Designer)</option>
          <option value="usr_cleaner_1">🧹 Rafiq (Office Staff)</option>
          <option value="usr_client_1">🏢 Eleyas (Client)</option>
          <option value="usr_pending_1">⏳ Farhan (Pending)</option>
        </select>
      </div>

      {/* Nav */}
      <nav className="space-y-0.5 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/15 to-transparent text-amber-300 font-semibold border border-amber-500/20'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-600'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="pt-4 border-t border-white/[0.06] space-y-1">
        <button
          onClick={() => setIsDbModalOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] transition-all font-medium"
        >
          <Database className="w-4 h-4" />
          <span>Connect Supabase</span>
        </button>
        <div className="px-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-black font-bold text-[11px] flex items-center justify-center shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="text-[12px] font-semibold text-slate-300 leading-none">{currentUser.name.split(' ')[0]}</div>
              <div className="text-[10px] text-slate-600 mt-0.5 capitalize">{currentUser.role.replace('_',' ')}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
