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

  const [newName, setNewName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newBudget, setNewBudget] = useState<number>(500000);
  const [newCategory, setNewCategory] = useState<'Web App' | 'Mobile App' | 'UI/UX Design' | 'AI Integration' | 'Custom Software'>('Web App');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDeadline, setNewDeadline] = useState('2027-01-31');

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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Projects & Financial Ledger
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1 font-medium">
            Manage software house client contracts, payments, and development velocity
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-2xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Top 3 Summary Cards with generous padding */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Pipeline Value</span>
          <div className="text-3xl font-black text-[#0f172a] mt-2">
            PKR {totalBudget.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">{projects.length} Active commercial contracts</p>
        </div>

        <div className="bg-[#eafaf2] rounded-3xl p-7 border border-[#d2f5e3]">
          <span className="text-xs font-semibold text-[#065f46] uppercase tracking-wider block">Payments Cleared</span>
          <div className="text-3xl font-black text-[#065f46] mt-2">
            PKR {totalPaid.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-700 mt-1">
            {Math.round((totalPaid / (totalBudget || 1)) * 100)}% verified revenue collected
          </p>
        </div>

        <div className="bg-[#fff0f3] rounded-3xl p-7 border border-[#fcdce3]">
          <span className="text-xs font-semibold text-[#9f1239] uppercase tracking-wider block">Outstanding Receivables</span>
          <div className="text-3xl font-black text-[#9f1239] mt-2">
            PKR {totalBalance.toLocaleString()}
          </div>
          <p className="text-xs text-rose-700 mt-1">Due across upcoming deliverables</p>
        </div>
      </div>

      {/* Project Cards (Spacious luxury layout) */}
      <div className="space-y-6">
        {projects.map((project) => {
          const balance = project.totalBudget - project.paidAmount;
          const isFullyPaid = balance <= 0;

          return (
            <div 
              key={project.id}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                      {project.category}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                      project.status === 'completed' ? 'bg-[#ecfdf5] text-[#059669]' :
                      project.status === 'in_progress' ? 'bg-[#fff9ea] text-[#b45309]' : 'bg-[#fff0f3] text-[#e11d48]'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a]">{project.name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-2xl">{project.description}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-3">
                    Client: <span className="text-[#0f172a] font-bold">{project.clientName}</span> ({project.clientEmail})
                  </p>
                </div>

                <div className="bg-[#f8fafc] border border-slate-200/60 p-5 rounded-2xl flex items-center gap-8 justify-between min-w-[340px]">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Budget</span>
                    <div className="text-base font-extrabold text-[#0f172a] mt-0.5">
                      PKR {project.totalBudget.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Paid</span>
                    <div className="text-base font-extrabold text-emerald-600 mt-0.5">
                      PKR {project.paidAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Balance</span>
                    <div className={`text-base font-extrabold mt-0.5 ${isFullyPaid ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isFullyPaid ? 'PAID ✓' : `PKR ${balance.toLocaleString()}`}
                    </div>
                  </div>

                  {isLeader && !isFullyPaid && (
                    <button
                      onClick={() => setShowPaymentModal(project.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all"
                    >
                      + Pay
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Slider & Milestones with ample padding */}
              <div className="pt-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-xs font-bold text-slate-700">Project Velocity:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={project.progressPercentage}
                      onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                      className="flex-1 max-w-md h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
                    />
                    <span className="text-sm font-mono font-bold text-[#2563eb]">
                      {project.progressPercentage}%
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    Handover Target: <strong className="text-slate-800">{project.deadline}</strong>
                  </div>
                </div>

                {/* Milestones list with luxurious cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.milestones.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => toggleMilestone(project.id, m.id)}
                      className={`text-left p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        m.completed 
                          ? 'bg-[#ecfdf5]/70 border-[#a7f3d0] text-slate-800' 
                          : 'bg-[#f8fafc] border-slate-100 text-slate-600 hover:bg-slate-100/70 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                          m.completed ? 'bg-emerald-600 text-white shadow-xs' : 'border border-slate-300 text-transparent'
                        }`}>
                          ✓
                        </span>
                        <span className={`text-xs font-semibold ${m.completed ? 'line-through text-slate-400' : ''}`}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{m.dueDate}</span>
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
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-[#0f172a] mb-1">Record Client Payment</h3>
            <p className="text-xs text-slate-500 mb-5">
              Enter amount received from client via Bank, JazzCash or Cash.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Amount (PKR)</label>
                <input
                  type="number"
                  step="5000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full text-base font-bold border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowPaymentModal(null)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddPayment(showPaymentModal)}
                  className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-[#0f172a] mb-1">Add New Project</h3>
            <p className="text-xs text-slate-500 mb-5">
              Register commercial details, client information, and milestones.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Apex Freight ERP Portal"
                  className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Eleyas Hasan"
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Client Email</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Budget (PKR) *</label>
                  <input
                    type="number"
                    step="10000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 font-medium"
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary of project goals and scope..."
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl shadow-xs"
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
