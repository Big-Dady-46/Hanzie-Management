'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  LayoutDashboard, FolderKanban, CheckSquare, Clock, Users, 
  DollarSign, FileText, UserCheck, ShieldAlert, Database,
  Briefcase, Coffee, LogOut, ChevronRight, Sparkles, Building2
} from 'lucide-react';

export default function Sidebar() {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    users, 
    switchUser,
    leaves,
    isEODModalOpen,
    setIsEODModalOpen,
    setIsDbModalOpen
  } = useApp();

  const isLeader = currentUser.role === 'leader';
  const isClient = currentUser.role === 'client';
  const pendingUsersCount = users.filter(u => u.status === 'pending_approval').length;
  const pendingLeavesCount = leaves.filter(l => l.status === 'pending').length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      show: true,
    },
    {
      id: 'projects',
      label: 'Projects & Finance',
      icon: FolderKanban,
      badge: null,
      show: !isClient,
    },
    {
      id: 'tasks',
      label: 'Tasks & Sprints',
      icon: CheckSquare,
      badge: null,
      show: !isClient,
    },
    {
      id: 'attendance',
      label: 'Hazari & Attendance',
      icon: Clock,
      badge: pendingLeavesCount > 0 && isLeader ? `${pendingLeavesCount} Leaves` : null,
      badgeColor: 'bg-amber-100 text-amber-700',
      show: !isClient,
    },
    {
      id: 'team',
      label: 'Staff & Maintenance',
      icon: Users,
      badge: pendingUsersCount > 0 && isLeader ? `${pendingUsersCount} New` : null,
      badgeColor: 'bg-rose-100 text-rose-700 font-semibold animate-pulse',
      show: isLeader,
    },
    {
      id: 'payroll',
      label: 'Salaries & Payroll',
      icon: DollarSign,
      badge: null,
      show: !isClient,
    },
    {
      id: 'reports',
      label: 'Daily EOD Reports',
      icon: FileText,
      badge: null,
      show: !isClient,
    },
    {
      id: 'client_portal',
      label: 'Client Portal',
      icon: Briefcase,
      badge: null,
      show: true,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 select-none shadow-[2px_0_12px_-4px_rgba(0,0,0,0.03)] z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            {/* Elegant Tech Geometric Hanzei Logo */}
            <span className="font-black text-xl tracking-tighter">H</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg tracking-tight text-slate-900">Hanzei</h1>
              <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md uppercase">OS</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Software House ERP</p>
          </div>
        </div>
      </div>

      {/* Role Switcher Demo Bar (For fast review of Leader / Developer / Cleaner / Client views) */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
          Switch User View:
        </label>
        <select 
          value={currentUser.id}
          onChange={(e) => switchUser(e.target.value)}
          className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer"
        >
          <optgroup label="Leadership">
            {users.filter(u => u.role === 'leader').map(u => (
              <option key={u.id} value={u.id}>👑 {u.name} (Leader / CEO)</option>
            ))}
          </optgroup>
          <optgroup label="Engineering & Design">
            {users.filter(u => ['developer', 'designer', 'qa'].includes(u.role)).map(u => (
              <option key={u.id} value={u.id}>💻 {u.name} ({u.role.toUpperCase()})</option>
            ))}
          </optgroup>
          <optgroup label="Office Support & Maintenance">
            {users.filter(u => u.role === 'support_cleaner').map(u => (
              <option key={u.id} value={u.id}>🧹 {u.name} (Office Staff / Cleaner)</option>
            ))}
          </optgroup>
          <optgroup label="Clients">
            {users.filter(u => u.role === 'client').map(u => (
              <option key={u.id} value={u.id}>🏢 {u.name} (Client)</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Main Workspace
        </div>
        {menuItems.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 font-bold'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Database & Cloud Sync Button */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Cloud & Setup
          </div>
          <button
            onClick={() => setIsDbModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-150 group"
          >
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span>Database Sync</span>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
              Live
            </span>
          </button>
        </div>
      </div>

      {/* User Mini Profile Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/70 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                currentUser.workStatus === 'working' ? 'bg-emerald-500 animate-pulse' :
                currentUser.workStatus === 'on_break' ? 'bg-amber-500' :
                currentUser.workStatus === 'on_leave' ? 'bg-purple-500' : 'bg-slate-300'
              }`} />
              <p className="text-[11px] text-slate-500 capitalize truncate">
                {currentUser.workStatus.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

