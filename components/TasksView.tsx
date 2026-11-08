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

  const columns: { id: TaskStatus; label: string; dot: string; countColor: string; bgBadge: string }[] = [
    { id: 'todo', label: 'To Do', dot: 'bg-indigo-500', countColor: 'text-indigo-600', bgBadge: 'bg-indigo-50' },
    { id: 'in_progress', label: 'In Progress', dot: 'bg-amber-500', countColor: 'text-amber-600', bgBadge: 'bg-amber-50' },
    { id: 'review', label: 'Revisions', dot: 'bg-rose-500', countColor: 'text-rose-600', bgBadge: 'bg-rose-50' },
    { id: 'completed', label: 'Completed', dot: 'bg-emerald-500', countColor: 'text-emerald-600', bgBadge: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Sprint Tasks & Delivery
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1 font-medium">
            Agile task boards, bug resolution and developer ticket status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#f1f4f9] p-1.5 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              List View
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-2d-dark px-5 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar with generous padding */}
      <div className="flex items-center justify-between gap-4 bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Filter by Project:</span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="text-xs bg-[#f8fafc] border border-slate-200/80 rounded-xl px-3.5 py-1.5 text-slate-700 font-semibold"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <span className="text-sm font-bold text-slate-800">{col.label}</span>
                  </div>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${col.bgBadge} ${col.countColor}`}>
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[340px]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100 hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md uppercase">
                            {task.projectName}
                          </span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            task.priority === 'urgent' ? 'bg-[#fff0f3] text-[#e11d48]' :
                            task.priority === 'high' ? 'bg-[#fff9ea] text-[#b45309]' : 'bg-slate-200/80 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                        )}
                      </div>

                      <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{task.assignedToName}</span>
                        <span className="font-mono text-[10px] text-slate-400">Due: {task.dueDate}</span>
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                        className="w-full text-[11px] font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 shadow-2xs"
                      >
                        <option value="todo">Move: To Do</option>
                        <option value="in_progress">Move: In Progress</option>
                        <option value="review">Move: Revisions</option>
                        <option value="completed">Move: Completed ✓</option>
                      </select>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="text-center py-12 text-xs text-slate-400 font-medium">
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
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 pb-4">
                <th className="pb-4 pl-3 font-semibold uppercase tracking-wider text-[11px]">Task</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Project</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Assignee</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Priority</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Due Date</th>
                <th className="pb-4 pr-3 text-right font-semibold uppercase tracking-wider text-[11px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 pl-3 font-bold text-slate-800 text-sm">{t.title}</td>
                  <td className="py-4 text-blue-600 font-semibold">{t.projectName}</td>
                  <td className="py-4 text-slate-700 font-medium">{t.assignedToName}</td>
                  <td className="py-4 capitalize font-semibold">{t.priority}</td>
                  <td className="py-4 text-slate-400 font-mono text-xs">{t.dueDate}</td>
                  <td className="py-4 pr-3 text-right">
                    <select
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                      className="text-xs font-bold bg-[#f8fafc] border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700"
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
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-[#0f172a] mb-1">Create Task</h3>
            <p className="text-xs text-slate-500 mb-5">Assign work ticket to team member.</p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build Payment Webhook Listener"
                  className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assignee</label>
                  <select
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                  >
                    {users.filter(u => u.role !== 'client').map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-2d-light px-5 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-2d-primary px-5 py-2 text-xs"
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
