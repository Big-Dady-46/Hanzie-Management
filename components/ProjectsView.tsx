'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  FolderKanban, Plus, DollarSign, Calendar, CheckCircle2, 
  Clock, TrendingUp, Users, ChevronRight, X, Sparkles
} from 'lucide-react';
import { Project } from '@/lib/types';

export default function ProjectsView() {
  const { 
    projects, 
    addProject, 
    updateProjectProgress, 
    recordProjectPayment, 
    toggleMilestone,
    currentUser,
    users 
  } = useApp();

  const isLeader = currentUser.role === 'leader';
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(50000);

  // New project state
  const [newName, setNewName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newBudget, setNewBudget] = useState<number>(500000);
  const [newCategory, setNewCategory] = useState<'Web App' | 'Mobile App' | 'UI/UX Design' | 'AI Integration' | 'Custom Software'>('Web App');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDeadline, setNewDeadline] = useState('2027-01-31');

  // Stats
  const totalBudget = projects.reduce((acc, p) => acc + p.totalBudget, 0);
  const totalPaid = projects.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalBalance = totalBudget - totalPaid;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newClientName.trim()) return;

    addProject({
      name: newName,
      clientName: newClientName,
      clientEmail: newClientEmail,
      description: newDescription,
      totalBudget: newBudget,
      currency: 'PKR',
      category: newCategory,
      startDate: newStartDate,
      deadline: newDeadline,
      assignedTeamMemberIds: ['usr_dev_1', 'usr_des_1'],
    });

    setNewName('');
    setNewClientName('');
    setNewClientEmail('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const handleAddPayment = (projectId: string) => {
    if (paymentAmount <= 0) return;
    recordProjectPayment(projectId, paymentAmount);
    setShowPaymentModal(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Software House Deliverables & Commercials
            </span>
            <span className="text-xs text-slate-400">P&L and Project Pipeline</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Projects & Financial Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitor client contracts, milestones completion, payment disbursements, and active team deliverables.
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-md shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        )}
      </div>

      {/* Financial Health 3 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Contract Value
          </span>
          <div className="text-2xl font-black text-slate-900">
            PKR {totalBudget.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{projects.length} Total active contracts</p>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Received Payments
          </span>
          <div className="text-2xl font-black text-emerald-800">
            PKR {totalPaid.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">
            {Math.round((totalPaid / (totalBudget || 1)) * 100)}% revenue collected
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block mb-1">
            Outstanding Receivable
          </span>
          <div className="text-2xl font-black text-rose-800">
            PKR {totalBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-rose-700 mt-1">Due across remaining milestones</p>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="space-y-4">
        {projects.map((project) => {
          const balance = project.totalBudget - project.paidAmount;
          const isFullyPaid = balance <= 0;

          return (
            <div 
              key={project.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft hover:shadow-soft-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-5 border-b border-slate-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md uppercase">
                      {project.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      project.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      project.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">{project.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{project.description}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-2">
                    Client: <span className="text-slate-900">{project.clientName}</span> ({project.clientEmail})
                  </p>
                </div>

                {/* Financial Summary for this project */}
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 min-w-[320px] justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Budget</span>
                    <div className="text-base font-extrabold text-slate-900">
                      PKR {project.totalBudget.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Paid</span>
                    <div className="text-base font-extrabold text-emerald-600">
                      PKR {project.paidAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Balance</span>
                    <div className={`text-base font-extrabold ${isFullyPaid ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isFullyPaid ? 'PAID ✓' : `PKR ${balance.toLocaleString()}`}
                    </div>
                  </div>

                  {isLeader && !isFullyPaid && (
                    <button
                      onClick={() => setShowPaymentModal(project.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-all whitespace-nowrap"
                    >
                      + Payment
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Slider & Milestones Checklist */}
              <div className="pt-5 space-y-4">
                {/* Progress bar controller */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs font-bold text-slate-700">Project Velocity:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={project.progressPercentage}
                      onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                      className="flex-1 max-w-md h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-sm font-black font-mono text-indigo-600">
                      {project.progressPercentage}%
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Target Handover: <strong className="text-slate-800">{project.deadline}</strong>
                  </div>
                </div>

                {/* Milestones list */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Milestones & Scope Deliverables:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {project.milestones.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => toggleMilestone(project.id, m.id)}
                        className={`text-left p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                          m.completed 
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black ${
                            m.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-transparent'
                          }`}>
                            ✓
                          </span>
                          <span className={`text-xs font-semibold ${m.completed ? 'line-through text-slate-400' : ''}`}>
                            {m.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{m.dueDate}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Record Client Payment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter amount received from client via Bank, Cash, or Online transfer.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  step="5000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full text-sm font-bold border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowPaymentModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddPayment(showPaymentModal)}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Confirm & Update Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Add New Project to Hanzei</h3>
            <p className="text-xs text-slate-500 mb-4">
              Register commercial details, client information, and milestones.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Apex Freight ERP Portal"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Eleyas Hasan"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Client Email</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="e.g. client@company.com"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contract Budget (PKR) *</label>
                  <input
                    type="number"
                    step="10000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50"
                  >
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="AI Integration">AI Integration</option>
                    <option value="Custom Software">Custom Software</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary of project goals and scope..."
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

