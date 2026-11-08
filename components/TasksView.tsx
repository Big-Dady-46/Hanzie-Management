'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Plus, Calendar, Sparkles, Filter, Check, X,
  Flame, Zap, Compass, Search
} from 'lucide-react';
import { TaskStatus, TaskPriority } from '@/lib/types';

export default function TasksView() {
  const { 
    tasks, 
    addTask, 
    updateTaskStatus, 
    projects, 
    users, 
    currentUser 
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showAddModal, setShowAddModal] = useState(false);
  const [projectFilter, setProjectFilter] = useState('ALL');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [assignedToId, setAssignedToId] = useState(users[1]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('2026-11-20');

  const filteredTasks = projectFilter === 'ALL'
    ? tasks
    : tasks.filter(t => t.projectId === projectFilter);

  const columns: { id: TaskStatus; label: string }[] = [
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'review', label: 'Revisions' },
    { id: 'completed', label: 'Completed' },
  ];

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

  const formatDueDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = parseInt(parts[1], 10) - 1;
        return `${months[m]} ${parseInt(parts[2], 10)}`;
      }
    } catch {}
    return dateStr;
  };

  const getPriorityStyle = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'high':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Sprint Tasks
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage agile tickets, development velocity, and task completion
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Projects ({tasks.length})</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          const isProgress = col.id === 'in_progress';
          const isDone = col.id === 'completed';

          return (
            <div 
              key={col.id} 
              className="clean-card p-4 space-y-4 bg-slate-50/70 border border-slate-200/90"
            >
              {/* Column Title & Count */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    isProgress ? 'bg-amber-500 animate-pulse' : isDone ? 'bg-amber-600' : 'bg-slate-400'
                  }`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 min-h-[350px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-amber-300 hover:shadow-soft transition-all space-y-3"
                  >
                    {/* Top Row: Project & Priority */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                        {task.projectName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize shrink-0 ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Task Title */}
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {task.title}
                    </h4>

                    {/* Description (clean & light) */}
                    {task.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Bottom Row: Assignee, Date, Status Selector */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 border border-amber-500/30">
                          {task.assignedToName.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-slate-700 truncate">{task.assignedToName}</span>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 shrink-0 whitespace-nowrap">
                        {formatDueDate(task.dueDate)}
                      </span>
                    </div>

                    {/* Clean Status Pill Switcher */}
                    <div className="pt-1 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-medium">Status:</span>
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Revisions</option>
                        <option value="completed">Completed ✓</option>
                      </select>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-12 text-xs text-slate-400 font-medium border border-dashed border-slate-200 rounded-2xl">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Sprint Task</h3>
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
                  placeholder="Task details and acceptance criteria..."
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
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
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