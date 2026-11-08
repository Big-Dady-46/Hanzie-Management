'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  FolderKanban, Plus, DollarSign, Calendar, CheckCircle2, 
  Clock, TrendingUp, Users, ChevronRight, X, Sparkles
} from 'lucide-react';

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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Projects & Commercials
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Client contracts, milestones delivery and payment ledger
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Top 3 Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <span className="text-xs font-semibold text-slate-400">Total Contract Value</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">
            PKR {totalBudget.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{projects.length} Active contracts</p>
        </div>

        <div className="bg-[#f0fbf6] rounded-2xl p-5 border border-[#cbf2de]">
          <span className="text-xs font-semibold text-emerald-800">Received Payments</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            PKR {totalPaid.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            {Math.round((totalPaid / (totalBudget || 1)) * 100)}% revenue collected
          </p>
        </div>

        <div className="bg-[#fff2f5] rounded-2xl p-5 border border-[#fcdbe2]">
          <span className="text-xs font-semibold text-rose-800">Outstanding Balance</span>
          <div className="text-2xl font-bold text-rose-800 mt-1">
            PKR {totalBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-rose-700 mt-0.5">Due across remaining deliverables</p>
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.map((project) => {
          const balance = project.totalBudget - project.paidAmount;
          const isFullyPaid = balance <= 0;

          return (
            <div 
              key={project.id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-5 border-b border-slate-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-indigo-600 bg-[#f4f2ff] px-2 py-0.5 rounded uppercase">
                      {project.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      project.status === 'completed' ? 'bg-[#ecfdf5] text-[#047857]' :
                      project.status === 'in_progress' ? 'bg-[#fff9e6] text-[#b45309]' : 'bg-[#fff0f3] text-[#be123c]'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{project.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{project.description}</p>
                  <p className="text-xs text-slate-500 font-semibold mt-2">
                    Client: <span className="text-slate-800">{project.clientName}</span> ({project.clientEmail})
                  </p>
                </div>

                <div className="bg-[#f8fafc] border border-slate-100 p-4 rounded-xl flex items-center gap-6 justify-between min-w-[300px]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Budget</span>
                    <div className="text-sm font-bold text-slate-800">
                      PKR {project.totalBudget.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Paid</span>
                    <div className="text-sm font-bold text-emerald-600">
                      PKR {project.paidAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Balance</span>
                    <div className={`text-sm font-bold ${isFullyPaid ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isFullyPaid ? 'PAID ✓' : `PKR ${balance.toLocaleString()}`}
                    </div>
                  </div>

                  {isLeader && !isFullyPaid && (
                    <button
                      onClick={() => setShowPaymentModal(project.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xs transition-all"
                    >
                      + Pay
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Slider & Milestones */}
              <div className="pt-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs font-semibold text-slate-600">Completion:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={project.progressPercentage}
                      onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                      className="flex-1 max-w-md h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      {project.progressPercentage}%
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    Handover Target: <strong className="text-slate-700">{project.deadline}</strong>
                  </div>
                </div>

                {/* Milestones list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {project.milestones.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => toggleMilestone(project.id, m.id)}
                      className={`text-left p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                        m.completed 
                          ? 'bg-[#f0fbf6] border-[#cbf2de] text-slate-800' 
                          : 'bg-[#fafbfc] border-slate-100 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          m.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-transparent'
                        }`}>
                          ✓
                        </span>
                        <span className={`text-xs font-medium ${m.completed ? 'line-through text-slate-400' : ''}`}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{m.dueDate}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Record Client Payment</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter amount received from client via Bank or Cash.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  step="5000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full text-sm font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowPaymentModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddPayment(showPaymentModal)}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Add New Project</h3>
            <p className="text-xs text-slate-400 mb-4">
              Register commercial details, client information, and milestones.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Project Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Apex Freight ERP Portal"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Eleyas Hasan"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Client Email</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Budget (PKR) *</label>
                  <input
                    type="number"
                    step="10000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
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
                <label className="text-xs font-semibold text-slate-600 block mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary of project..."
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
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
