'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { 
  Search, Clock, Coffee, Play, Square, Bell, Sparkles, 
  Users, CheckSquare, Calendar, DollarSign, CheckCheck, Trash2, X
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'approval' | 'task' | 'leave' | 'payroll' | 'system';
  title: string;
  message: string;
  time: string;
  tab: string;
  unread: boolean;
}

export default function Header() {
  const { 
    currentUser, 
    clockIn, 
    startBreak, 
    resumeWork, 
    setIsEODModalOpen,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    users,
    tasks,
    leaves,
    payroll
  } = useApp();

  const isClient = currentUser.role === 'client';
  const isLeader = currentUser.role === 'leader';

  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [cleared, setCleared] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'action'>('all');
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsOpenNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live notifications
  const rawNotifications = useMemo<NotificationItem[]>(() => {
    if (cleared) return [];
    const list: NotificationItem[] = [];

    // 1. Pending Approvals (for Leader)
    const pendingUsers = users.filter(u => u.status === 'pending_approval');
    pendingUsers.forEach(u => {
      list.push({
        id: `pending-user-${u.id}`,
        type: 'approval',
        title: 'New Member Access Request',
        message: `${u.name} requested onboarding in ${u.department}. Click to review & approve.`,
        time: 'Pending',
        tab: 'team',
        unread: true,
      });
    });

    // 2. Pending Leaves (for Leader)
    const pendingLeaves = leaves.filter(l => l.status === 'pending');
    pendingLeaves.forEach(l => {
      list.push({
        id: `leave-${l.id}`,
        type: 'leave',
        title: 'Leave Application',
        message: `${l.userName} requested ${l.leaveType} leave (${l.startDate} to ${l.endDate}).`,
        time: 'Action required',
        tab: 'attendance',
        unread: true,
      });
    });

    // 3. User's Assigned Active Tasks
    const myActiveTasks = tasks.filter(t => 
      (t.assignedToId === currentUser.id || isLeader) && 
      (t.status === 'in_progress' || t.status === 'todo')
    );
    myActiveTasks.slice(0, 3).forEach(t => {
      list.push({
        id: `task-${t.id}`,
        type: 'task',
        title: `Sprint Task: ${t.title}`,
        message: `Assigned to ${t.assignedToName} • Due ${t.dueDate}`,
        time: t.status === 'in_progress' ? 'In progress' : 'To Do',
        tab: 'tasks',
        unread: true,
      });
    });

    // 4. Pending Payroll (for Leader)
    if (isLeader) {
      const pendingPayrollCount = payroll.filter(p => p.status === 'pending').length;
      if (pendingPayrollCount > 0) {
        list.push({
          id: 'pending-payroll-alert',
          type: 'payroll',
          title: 'Monthly Payroll Vouchers',
          message: `${pendingPayrollCount} salary voucher(s) awaiting verified signoff.`,
          time: 'Action needed',
          tab: 'payroll',
          unread: true,
        });
      }
    }

    // 5. System Welcome / Live Connected State
    list.push({
      id: 'system-online',
      type: 'system',
      title: 'Cloud Database Online',
      message: 'Workspace is live and synced with Supabase PostgreSQL.',
      time: 'Live',
      tab: 'dashboard',
      unread: false,
    });

    return list;
  }, [users, leaves, tasks, payroll, currentUser.id, isLeader, cleared]);

  // Mark status based on readIds
  const notifications = useMemo(() => {
    return rawNotifications.map(n => ({
      ...n,
      unread: n.unread && !readIds.includes(n.id),
    }));
  }, [rawNotifications, readIds]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredNotifications = useMemo(() => {
    if (notifFilter === 'unread') return notifications.filter(n => n.unread);
    if (notifFilter === 'action') return notifications.filter(n => n.type === 'approval' || n.type === 'leave' || n.type === 'payroll');
    return notifications;
  }, [notifications, notifFilter]);

  const handleMarkAllRead = () => {
    setReadIds(rawNotifications.map(n => n.id));
  };

  const handleClearAll = () => {
    setCleared(true);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!readIds.includes(item.id)) {
      setReadIds(prev => [...prev, item.id]);
    }
    setActiveTab(item.tab);
    setIsOpenNotifications(false);
  };

  return (
    <header className="relative z-50 px-8 lg:px-10 pt-7 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-md mb-6">
      {/* Left Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight capitalize">
            {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('_', ' ')}
          </h1>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        </div>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          Hanzei Workspace &bull; {currentUser.name} ({currentUser.role.replace('_', ' ')})
        </p>
      </div>

      {/* Right Controls: Search, Frosted 2D Glass Shift Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Search Input with Gold/Silver focus */}
        <div className="relative w-56 sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, staff..."
            className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 transition-all font-medium"
          />
        </div>

        {/* Staff Shift Actions (Frosted Glass 2D Buttons) */}
        {!isClient && (
          <div className="flex items-center gap-2">
            {currentUser.workStatus === 'offline' && (
              <button
                onClick={clockIn}
                className="btn-gold"
              >
                <Clock className="w-3.5 h-3.5 drop-shadow-xs" />
                <span>Clock In</span>
              </button>
            )}

            {currentUser.workStatus === 'working' && (
              <>
                <button
                  onClick={startBreak}
                  className="btn-silver"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Break</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="btn-dark"
                >
                  <Square className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>End Day</span>
                </button>
              </>
            )}

            {currentUser.workStatus === 'on_break' && (
              <>
                <button
                  onClick={resumeWork}
                  className="btn-gold"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
                <button
                  onClick={() => setIsEODModalOpen(true)}
                  className="btn-dark"
                >
                  <Square className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>End Day</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Notification Bell with Dynamic Popover */}
        <div className="relative z-50" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsOpenNotifications(!isOpenNotifications)}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all select-none relative ${
              isOpenNotifications 
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-mono font-bold text-[10px] flex items-center justify-center absolute -top-1.5 -right-1.5 ring-2 ring-white shadow-xs animate-in zoom-in-50 duration-150">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Luxury Solid High-Z Notifications Panel */}
          {isOpenNotifications && (
            <div className="absolute right-0 top-full mt-2 w-[360px] sm:w-[440px] md:w-[460px] bg-white rounded-2xl shadow-[0_25px_60px_-12px_rgba(15,23,42,0.25)] border border-slate-200 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Notifications</h3>
                  {unreadCount > 0 ? (
                    <span className="text-xs font-bold bg-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                      {unreadCount} new
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">All caught up</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-slate-200/70"
                      title="Clear notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setNotifFilter('all')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    notifFilter === 'all'
                      ? 'bg-white text-slate-900 font-bold border border-slate-200 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setNotifFilter('unread')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    notifFilter === 'unread'
                      ? 'bg-white text-slate-900 font-bold border border-slate-200 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  type="button"
                  onClick={() => setNotifFilter('action')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    notifFilter === 'action'
                      ? 'bg-white text-slate-900 font-bold border border-slate-200 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Action Required
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 bg-white">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center px-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                      <Bell className="w-6 h-6 opacity-60" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">No notifications found</p>
                    <p className="text-xs text-slate-400 mt-1">Everything is in sync and up to date.</p>
                  </div>
                ) : (
                  filteredNotifications.map((item) => {
                    const iconConfig = 
                      item.type === 'approval' ? { icon: Users, bg: 'bg-amber-50 border-amber-300 text-amber-800' } :
                      item.type === 'leave' ? { icon: Calendar, bg: 'bg-purple-50 border-purple-200 text-purple-700' } :
                      item.type === 'task' ? { icon: CheckSquare, bg: 'bg-sky-50 border-sky-200 text-sky-700' } :
                      item.type === 'payroll' ? { icon: DollarSign, bg: 'bg-emerald-50 border-emerald-300 text-emerald-700' } :
                      { icon: Sparkles, bg: 'bg-amber-50 border-amber-200 text-amber-600' };

                    const IconComponent = iconConfig.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-4 transition-colors cursor-pointer flex items-start gap-3.5 hover:bg-slate-50/90 relative ${
                          item.unread ? 'bg-amber-50/25' : 'bg-white'
                        }`}
                      >
                        {item.unread && (
                          <div className="absolute left-0 top-3 bottom-3 w-1 bg-amber-500 rounded-r" />
                        )}

                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs ${iconConfig.bg}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className={`text-sm truncate leading-snug ${item.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                              {item.title}
                            </h4>
                            <span className="text-xs text-slate-400 font-mono shrink-0 whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded-md">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {item.message}
                          </p>
                          <span className="text-xs font-semibold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 mt-1.5">
                            Open in {item.tab} &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">Live Cloud Activity Stream</span>
                <span>Click item to navigate &rarr;</span>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with Golden Border */}
        <div className="w-9 h-9 min-w-[36px] min-h-[36px] aspect-square rounded-xl bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs border border-amber-500/40">
          <span>{currentUser.name.charAt(0)}</span>
        </div>
      </div>
    </header>
  );
}
