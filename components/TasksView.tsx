'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  CheckSquare, Plus, Clock, User, AlertCircle, 
  ChevronRight, Sparkles, Filter, Check, X, Layers
} from 'lucide-react';
import { TaskStatus, TaskPriority } from '@/lib/types';

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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [assignedToId, setAssignedToId] = useState(users[1]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('2026-11-20');

  const filteredTasks = projectFilter === 'ALL'
    ? tasks
    : tasks.filter(t => t.projectId === projectFilter);

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

  const columns: { id: TaskStatus; label: string }[] = [
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'review', label: 'Revisions' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Sprint Tasks & Delivery
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Agile Kanban board, bug resolution, and developer ticket status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="clean-card px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Filter Project:</span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">All Projects ({tasks.length})</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredTasks.length} tasks
        </span>
      </div>

      {/* KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="clean-card p-4 space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{col.label}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[360px]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all space-y-2.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded truncate max-w-[140px]">
                            {task.projectName}
                          </span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase bg-slate-100 text-slate-600">
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700">{task.assignedToName}</span>
                        <span className="font-mono text-slate-400 text-[10px]">{task.dueDate}</span>
                      </div>

                      {/* Clean Status Selector (No cut off text) */}
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-medium text-slate-400">Status:</span>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                          className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
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
                    <div className="text-center py-12 text-xs text-slate-400 font-normal">
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
        <div className="clean-card p-6">
          <table className="w-full text-left text-xs font-normal">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 pb-3">
                <th className="pb-3 pl-2 font-semibold uppercase tracking-wider text-[10px]">Task</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Project</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Assignee</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Priority</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Due Date</th>
                <th className="pb-3 pr-2 text-right font-semibold uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2 font-medium text-slate-900 text-xs">{t.title}</td>
                  <td className="py-3 text-blue-600 font-medium">{t.projectName}</td>
                  <td className="py-3 text-slate-700">{t.assignedToName}</td>
                  <td className="py-3 capitalize text-slate-600">{t.priority}</td>
                  <td className="py-3 text-slate-400 font-mono text-[11px]">{t.dueDate}</td>
                  <td className="py-3 pr-2 text-right">
                    <select
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Revisions</option>
                      <option value="completed">Completed</option>
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
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Sprint Task</h3>
            <p className="text-xs text-slate-500 mb-4">Assign work to a developer or designer.</p>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Integrate Stripe Payment Webhooks"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
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
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white"
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
                  className="btn-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
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
