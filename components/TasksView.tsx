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

  const columns: { id: TaskStatus; label: string; bg: string; dot: string; countColor: string }[] = [
    { id: 'todo', label: 'To Do', bg: 'bg-[#f8fafc]', dot: 'bg-indigo-500', countColor: 'text-indigo-600' },
    { id: 'in_progress', label: 'In Progress', bg: 'bg-[#f8fafc]', dot: 'bg-amber-500', countColor: 'text-amber-600' },
    { id: 'review', label: 'Revisions', bg: 'bg-[#f8fafc]', dot: 'bg-rose-500', countColor: 'text-rose-600' },
    { id: 'completed', label: 'Completed', bg: 'bg-[#f8fafc]', dot: 'bg-emerald-500', countColor: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Tasks & Sprints
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize engineering tickets and sprint deliverables
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#f1f4f9] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400'
              }`}
            >
              List
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Project:</span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="text-xs bg-[#f8fafc] border border-slate-200/80 rounded-lg px-2.5 py-1 text-slate-700 font-medium"
          >
            <option value="ALL">All Projects ({tasks.length})</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          {filteredTasks.length} tasks
        </span>
      </div>

      {/* KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="text-xs font-bold text-slate-800">{col.label}</span>
                  </div>
                  <span className={`text-xs font-bold ${col.countColor}`}>
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[300px]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-[#fafbfc] rounded-xl p-3.5 border border-slate-100 hover:border-slate-200 transition-all space-y-2.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold text-indigo-600 bg-[#f4f2ff] px-2 py-0.5 rounded">
                            {task.projectName}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            task.priority === 'urgent' ? 'bg-[#fff2f5] text-rose-700' :
                            task.priority === 'high' ? 'bg-[#fffbf0] text-amber-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800">
                          {task.title}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-medium text-slate-600">{task.assignedToName}</span>
                        <span className="font-mono text-[10px]">{task.dueDate}</span>
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                        className="w-full text-[10px] font-semibold bg-white border border-slate-200/80 rounded-lg px-2 py-1 text-slate-600"
                      >
                        <option value="todo">Move: To Do</option>
                        <option value="in_progress">Move: In Progress</option>
                        <option value="review">Move: Revisions</option>
                        <option value="completed">Move: Completed ✓</option>
                      </select>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400 font-medium">
                      No tasks
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
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 pb-3">
                <th className="pb-3 pl-2">Task</th>
                <th className="pb-3">Project</th>
                <th className="pb-3">Assigned To</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Due Date</th>
                <th className="pb-3 pr-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 pl-2 font-bold text-slate-800">{t.title}</td>
                  <td className="py-3.5 text-indigo-600 font-semibold">{t.projectName}</td>
                  <td className="py-3.5 text-slate-600">{t.assignedToName}</td>
                  <td className="py-3.5 capitalize font-semibold">{t.priority}</td>
                  <td className="py-3.5 text-slate-400 font-mono text-[11px]">{t.dueDate}</td>
                  <td className="py-3.5 pr-2 text-right">
                    <select
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                      className="text-xs font-semibold bg-[#f8fafc] border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Create Task</h3>
            <p className="text-xs text-slate-400 mb-4">Assign work ticket to team member.</p>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build Payment Webhook Listener"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Project</label>
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
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Assignee</label>
                  <select
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  >
                    {users.filter(u => u.role !== 'client').map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
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
