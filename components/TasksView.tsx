'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  CheckSquare, Plus, Clock, User, AlertCircle, 
  ChevronRight, Sparkles, Filter, Check, X
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

  // New task form state
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

  const columns: { id: TaskStatus; label: string; color: string; badge: string }[] = [
    { id: 'todo', label: 'To Do', color: 'bg-indigo-50 border-indigo-200 text-indigo-700', badge: 'bg-indigo-100 text-indigo-800' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-amber-50 border-amber-200 text-amber-700', badge: 'bg-amber-100 text-amber-800' },
    { id: 'review', label: 'Revisions & QA', color: 'bg-rose-50 border-rose-200 text-rose-700', badge: 'bg-rose-100 text-rose-800' },
    { id: 'completed', label: 'Completed ✓', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Sprints & Execution Board
            </span>
            <span className="text-xs text-slate-400">Kanban Agile Workflow</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Tasks & Work Delivery
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organize software engineering tickets, review QA bug fixes, and monitor sprint completion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              List View
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Filter by Project:</span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700"
          >
            <option value="ALL">All Projects ({tasks.length} tasks)</option>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="bg-slate-100/70 rounded-3xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-800">{col.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-soft transition-all space-y-3 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {task.projectName}
                          </span>
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            task.priority === 'urgent' ? 'bg-rose-100 text-rose-700' :
                            task.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                        )}
                      </div>

                      {/* Assignee & Due Date */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center">
                            {task.assignedToName.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-700 truncate max-w-[90px]">
                            {task.assignedToName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Due: {task.dueDate}</span>
                      </div>

                      {/* Quick Move Status Selector */}
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                          className="w-full text-[10px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600"
                        >
                          <option value="todo">Move: To Do</option>
                          <option value="in_progress">Move: In Progress</option>
                          <option value="review">Move: Revisions</option>
                          <option value="completed">Move: Completed ✓</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                      Empty column
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
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Task</th>
                <th className="pb-3">Project</th>
                <th className="pb-3">Assigned To</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Due Date</th>
                <th className="pb-3 pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="py-3.5 pl-2 font-bold text-slate-900">{t.title}</td>
                  <td className="py-3.5 text-indigo-600 font-semibold">{t.projectName}</td>
                  <td className="py-3.5 text-slate-700">{t.assignedToName}</td>
                  <td className="py-3.5">
                    <span className="capitalize font-bold text-[10px]">{t.priority}</span>
                  </td>
                  <td className="py-3.5 text-slate-500">{t.dueDate}</td>
                  <td className="py-3.5 pr-2">
                    <select
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                      className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Create New Task</h3>
            <p className="text-xs text-slate-500 mb-4">
              Assign development, design or maintenance ticket to staff.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build Payment Webhook Listener"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description / Spec</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Acceptance criteria and requirements..."
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assign to Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assign to Staff</label>
                  <select
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  >
                    {users.filter(u => u.role !== 'client').map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role.toUpperCase()})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent 🔥</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
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

