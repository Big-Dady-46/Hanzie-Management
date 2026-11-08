'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  CheckSquare, Plus, Clock, User, AlertCircle, 
  ChevronRight, Sparkles, Filter, Check, X, Layers,
  Flame, Zap, Compass, CheckCircle2, Search, ArrowRight,
  Kanban as KanbanIcon, ListFilter, Calendar
} from 'lucide-react';
import { TaskStatus, TaskPriority, Task } from '@/lib/types';

export default function TasksView() {
  const { 
    tasks, 
    addTask, 
    updateTaskStatus, 
    updateTaskProgress, 
    projects, 
    users, 
    currentUser 
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
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

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const reviewCount = tasks.filter(t => t.status === 'review').length;
  const todoCount = tasks.filter(t => t.status === 'todo').length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedProj = projects.find(p => p.id === projectId);
    const selectedUser = users.find(u => u.id === assignedToId);

    addTask({
      title,
      description,
      projectId,
      projectName: selectedProj?.name || 'Hanzei Core',
      assignedToId,
      assignedToName: selectedUser?.name || 'Unassigned',
      status: 'todo',
      priority,
      dueDate,
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const columns: { id: TaskStatus; label: string; count: number; accent: string }[] = [
    { id: 'todo', label: 'To Do', count: todoCount, accent: 'border-slate-300' },
    { id: 'in_progress', label: 'In Progress', count: inProgressCount, accent: 'border-amber-400' },
    { id: 'review', label: 'Revisions & QA', count: reviewCount, accent: 'border-slate-400' },
    { id: 'completed', label: 'Delivered', count: completedCount, accent: 'border-amber-500' },
  ];

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return (
          <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-600" /> Urgent
          </span>
        );
      case 'high':
        return (
          <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-600" /> High
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-500" /> Medium
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Sprint Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Sprint Tasks & Engineering Board
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
              Sprint 24 Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Agile Kanban board, tickets management, code reviews, and developer handoffs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              List
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Sprint Health & Velocity Summary */}
      <div className="clean-card p-4 bg-gradient-to-r from-amber-50/50 via-white to-slate-50 border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Sprint 24 Completion Gauge</h4>
            <p className="text-[11px] text-slate-500">
              {completedCount} of {tasks.length} total tasks delivered across current milestones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-36 bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-600 to-amber-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((completedCount / (tasks.length || 1)) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-amber-800">
              {Math.round((completedCount / (tasks.length || 1)) * 100)}%
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 border-l border-slate-200 pl-4">
            <span>In Progress: <strong className="text-slate-800">{inProgressCount}</strong></span>
            <span>&bull;</span>
            <span>QA Review: <strong className="text-slate-800">{reviewCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Creative Filter Bar */}
      <div className="clean-card p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Projects ({tasks.length})</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="urgent">🔥 Urgent Only</option>
              <option value="high">⚡ High</option>
              <option value="medium">✦ Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks or dev..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>
      </div>

      {/* KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div 
                key={col.id} 
                className="clean-card p-4 space-y-3.5 bg-slate-50/60 border-t-2"
                style={{ borderTopColor: col.id === 'in_progress' ? '#d4af37' : col.id === 'completed' ? '#b45309' : '#cbd5e1' }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.id === 'in_progress' ? 'bg-amber-500 animate-pulse' : col.id === 'completed' ? 'bg-amber-700' : 'bg-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks Column List */}
                <div className="space-y-3 min-h-[400px]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-amber-300 hover:shadow-soft transition-all space-y-3 group"
                    >
                      {/* Project Tag & Priority */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-50/90 border border-amber-200 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                          {task.projectName}
                        </span>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-amber-900 transition-colors">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Assignee & Due Date Pill */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-slate-900 text-amber-300 font-bold text-[9px] flex items-center justify-center">
                            {task.assignedToName.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-700">{task.assignedToName}</span>
                        </div>
                        <span className="font-mono text-slate-400 text-[10px] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate}
                        </span>
                      </div>

                      {/* Interactive 2D Tactile Status Move Pills */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Move:
                        </span>
                        <div className="flex items-center gap-1">
                          {task.status !== 'todo' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'todo')}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                              title="Move to To Do"
                            >
                              Todo
                            </button>
                          )}
                          {task.status !== 'in_progress' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'in_progress')}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                              title="Move to In Progress"
                            >
                              In Prog
                            </button>
                          )}
                          {task.status !== 'review' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'review')}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                              title="Move to Revisions"
                            >
                              Review
                            </button>
                          )}
                          {task.status !== 'completed' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-600 text-white hover:bg-amber-700"
                              title="Mark as Completed"
                            >
                              Done ✓
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="text-center py-12 text-xs text-slate-400 font-normal border-2 border-dashed border-slate-200 rounded-2xl">
                      No tickets
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="clean-card p-6 overflow-x-auto">
          <table className="w-full text-left text-xs font-normal">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 pb-3">
                <th className="pb-3 pl-2 font-semibold uppercase tracking-wider text-[10px]">Task</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Project</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Assignee</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Priority</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Target Date</th>
                <th className="pb-3 pr-2 text-right font-semibold uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2">
                    <div className="font-bold text-slate-900 text-xs">{t.title}</div>
                    {t.description && <p className="text-[11px] text-slate-400 line-clamp-1">{t.description}</p>}
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      {t.projectName}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700 font-medium">{t.assignedToName}</td>
                  <td className="py-3">{getPriorityBadge(t.priority)}</td>
                  <td className="py-3 text-slate-400 font-mono text-[11px]">{t.dueDate}</td>
                  <td className="py-3 pr-2 text-right">
                    <select
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                      className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Revisions</option>
                      <option value="completed">Completed ✓</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Sprint Ticket</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add task to engineering sprint backlog and assign to staff.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Optimize Redis Cache for API"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical details, acceptance criteria..."
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Assignee</label>
                  <select
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50"
                  >
                    {users.filter(u => u.role !== 'client' && u.status === 'active').map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-silver"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}