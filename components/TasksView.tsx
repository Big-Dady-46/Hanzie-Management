'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Plus, Calendar, Sparkles, Search, ChevronDown } from 'lucide-react';
import { TaskStatus, TaskPriority } from '@/lib/types';

const fmtDate = (d: string) => {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const PRIORITY_CLASS: Record<string, string> = {
  urgent: 'priority-urgent',
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
};

const COL_DOT: Record<string, string> = {
  todo: 'bg-slate-500',
  in_progress: 'bg-amber-400 shadow-[0_0_6px_rgba(245,200,66,0.6)]',
  review: 'bg-indigo-400',
  completed: 'bg-emerald-400',
};

const COL_ACCENT: Record<string, string> = {
  todo: 'rgba(100,116,139,0.4)',
  in_progress: 'rgba(212,175,55,0.5)',
  review: 'rgba(99,102,241,0.4)',
  completed: 'rgba(52,211,153,0.4)',
};

export default function TasksView() {
  const { tasks, addTask, updateTaskStatus, projects, users, currentUser } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [assignedToId, setAssignedToId] = useState(users[1]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('2026-11-20');

  const filteredTasks = tasks.filter((t) => {
    const matchesProj = projectFilter === 'ALL' || t.projectId === projectFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProj && matchesPriority && matchesSearch;
  });

  const columns: { id: TaskStatus; label: string }[] = [
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'review', label: 'Review & QA' },
    { id: 'completed', label: 'Delivered' },
  ];

  const counts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const selectedProj = projects.find(p => p.id === projectId);
    const selectedUser = users.find(u => u.id === assignedToId);
    addTask({
      title, description, projectId,
      projectName: selectedProj?.name || 'Hanzei Core',
      assignedToId,
      assignedToName: selectedUser?.name || 'Unassigned',
      status: 'todo', priority, dueDate,
    });
    setTitle(''); setDescription(''); setShowAddModal(false);
  };

  const moveOptions: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Done ✓' },
  ];

  return (
    <div className="space-y-5 fade-up">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">Sprint Tasks</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded-full">
              Sprint 24 Active
            </span>
          </div>
          <p className="text-xs text-slate-600">Kanban board · {tasks.length} total tickets</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filters */}
          <div className="relative">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="dark-input text-xs py-1.5 px-3 pr-7 appearance-none cursor-pointer"
            >
              <option value="ALL">All Projects</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name.split(' ').slice(0,3).join(' ')}</option>)}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="dark-input text-xs py-1.5 px-3 pr-7 appearance-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="urgent">🔥 Urgent</option>
              <option value="high">⚡ High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="dark-input text-xs py-1.5 pl-9 pr-3 w-44"
            />
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn-gold text-xs py-1.5 px-4 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Sprint progress bar */}
      <div className="glass-card p-4 flex items-center gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-slate-200">Sprint 24</span>
        </div>
        <div className="flex-1">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.round((counts.completed / (tasks.length || 1)) * 100)}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs shrink-0">
          <span className="text-slate-600">Done: <strong className="text-slate-300">{counts.completed}</strong></span>
          <span className="text-slate-600">Active: <strong className="text-amber-400">{counts.in_progress}</strong></span>
          <span className="text-slate-600">Review: <strong className="text-indigo-400">{counts.review}</strong></span>
          <span className="font-bold text-amber-400">
            {Math.round((counts.completed / (tasks.length || 1)) * 100)}%
          </span>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(19,22,30,0.6)', border: `1px solid rgba(255,255,255,0.06)` }}>
              {/* Column header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: `2px solid ${COL_ACCENT[col.id]}` }}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${COL_DOT[col.id]}`} />
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{col.label}</span>
                </div>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-3 min-h-[380px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl p-3.5 space-y-2.5 group transition-all duration-150"
                    style={{
                      background: 'rgba(26,30,40,0.95)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = COL_ACCENT[col.id])}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                  >
                    {/* Project + Priority */}
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider truncate max-w-[110px]"
                        style={{ color: '#f5c842', opacity: 0.8 }}
                      >
                        {task.projectName.split(' ').slice(0,3).join(' ')}
                      </span>
                      <span className={PRIORITY_CLASS[task.priority]}>{task.priority}</span>
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-[13px] font-semibold text-slate-200 leading-snug">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Footer: assignee + date */}
                    <div className="flex items-center justify-between pt-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-black font-bold text-[9px] flex items-center justify-center shrink-0">
                          {task.assignedToName.charAt(0)}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">{task.assignedToName.split(' ')[0]}</span>
                      </div>
                      <span className="text-[10px] text-slate-700 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {fmtDate(task.dueDate)}
                      </span>
                    </div>

                    {/* Move dropdown */}
                    <div className="relative">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                        className="dark-input w-full text-[11px] py-1.5 px-2.5 pr-6 cursor-pointer appearance-none"
                      >
                        {moveOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div
                    className="flex items-center justify-center h-24 rounded-xl text-xs text-slate-700"
                    style={{ border: '1px dashed rgba(255,255,255,0.06)' }}
                  >
                    No tickets
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card-gold p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-badge-gold w-9 h-9 rounded-xl">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Create Sprint Ticket</h3>
                <p className="text-xs text-slate-600">Add to engineering backlog</p>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Task Title *</label>
                <input
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Optimize Redis Cache for API"
                  className="dark-input w-full" required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Description</label>
                <textarea
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical details, acceptance criteria..."
                  rows={2} className="dark-input w-full resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Project</label>
                  <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="dark-input w-full">
                    {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Assignee</label>
                  <select value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} className="dark-input w-full">
                    {users.filter(u => u.role !== 'client' && u.status === 'active').map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="dark-input w-full">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="dark-input w-full" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-silver text-xs py-2 px-4">Cancel</button>
                <button type="submit" className="btn-gold text-xs py-2 px-4">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
