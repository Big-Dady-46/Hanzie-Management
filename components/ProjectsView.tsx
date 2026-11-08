'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  FolderKanban, Plus, DollarSign, Calendar, CheckCircle2, 
  Clock, TrendingUp, Users, ChevronRight, X, Sparkles, Check
} from 'lucide-react';

export default function ProjectsView() {
  const { 
    projects, 
    addProject, 
    updateProjectProgress, 
    recordProjectPayment, 
    toggleMilestone,
    currentUser 
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Projects & Financial Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Software house contracts, milestones, and commercial payment accounts
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Top 3 Summary Cards (Luxury Gold & Silver System) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="clean-card p-6 flex items-start justify-between hover:border-amber-300 transition-colors">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Pipeline Value
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              PKR {totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">{projects.length} Active commercial contracts</p>
          </div>
          <div className="icon-badge-gold">
            <DollarSign className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        <div className="clean-card p-6 flex items-start justify-between hover:border-amber-300 transition-colors">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Payments Cleared
            </span>
            <div className="text-2xl font-bold text-amber-700 mt-2">
              PKR {totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="font-semibold text-amber-700">
                {Math.round((totalPaid / (totalBudget || 1)) * 100)}%
              </span> revenue collected
            </p>
          </div>
          <div className="icon-badge-gold">
            <CheckCircle2 className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        <div className="clean-card p-6 flex items-start justify-between hover:border-slate-300 transition-colors">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Outstanding Balance
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              PKR {totalBalance.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">Due across active deliverables</p>
          </div>
          <div className="icon-badge-silver">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-5">
        {projects.map((project) => {
          const balance = project.totalBudget - project.paidAmount;
          const isFullyPaid = balance <= 0;

          return (
            <div 
              key={project.id}
              className="clean-card p-6 hover:border-amber-200 transition-colors"
            >
              {/* Project Head & Ledger */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-5 border-b border-slate-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md capitalize">
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">{project.description}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Client: <strong className="text-slate-800">{project.clientName}</strong> &bull; {project.clientEmail}
                  </p>
                </div>

                <div className="bg-slate-50/80 border border-slate-200 p-4 rounded-xl flex items-center gap-6 justify-between min-w-[320px]">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Budget</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      PKR {project.totalBudget.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Received</span>
                    <div className="text-sm font-bold text-amber-700 mt-0.5">
                      PKR {project.paidAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Balance</span>
                    <div className={`text-sm font-bold mt-0.5 ${isFullyPaid ? 'text-slate-500' : 'text-slate-900'}`}>
                      {isFullyPaid ? 'Settled ✓' : `PKR ${balance.toLocaleString()}`}
                    </div>
                  </div>

                  {isLeader && !isFullyPaid && (
                    <button
                      onClick={() => setShowPaymentModal(project.id)}
                      className="btn-gold text-xs py-1.5 px-3"
                    >
                      + Pay
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Slider & Milestones */}
              <div className="pt-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs font-semibold text-slate-700">Velocity:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={project.progressPercentage}
                      onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                      className="flex-1 max-w-sm h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <span className="text-xs font-mono font-bold text-amber-700">
                      {project.progressPercentage}%
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Handover Deadline: <strong className="text-slate-800">{project.deadline}</strong>
                  </div>
                </div>

                {/* Milestone Checklist (Gold & Silver Accents) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {project.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(project.id, m.id)}
                      className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-colors ${
                        m.completed 
                          ? 'bg-amber-50/40 border-amber-200/80 text-slate-800' 
                          : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                          m.completed 
                            ? 'bg-gradient-to-tr from-[#cca43b] to-[#d4af37] text-white shadow-xs' 
                            : 'border border-slate-300'
                        }`}>
                          {m.completed && '✓'}
                        </span>
                        <span className="text-xs font-medium truncate">
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-3">{m.dueDate}</span>
                    </div>
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Client Payment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter amount received from client via Bank, JazzCash or Cash.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  step="5000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full text-sm font-bold border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setShowPaymentModal(null)}
                  className="btn-silver"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddPayment(showPaymentModal)}
                  className="btn-gold"
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
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create New Software Project</h3>
            <p className="text-xs text-slate-500 mb-4">
              Register commercial details, client information, and milestones.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Project Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Apex Freight ERP Portal"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50 focus:bg-white focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Eleyas Hasan"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Client Email</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Budget (PKR) *</label>
                  <input
                    type="number"
                    step="10000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50 font-medium"
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
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary of project goals and scope..."
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
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
