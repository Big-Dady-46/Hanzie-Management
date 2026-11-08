'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Plus, DollarSign, Calendar, CheckCircle2, 
  Clock, TrendingUp, X, Layers, Briefcase, 
  ChevronRight, ArrowUpRight, ShieldCheck, Filter
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
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(50000);

  // Form states
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

  const filteredProjects = filterCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === filterCategory);

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
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              Commercial Portfolio
            </span>
            <span className="text-xs text-slate-400">Software House Contracts</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Projects & Financial Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track active client contracts, development progress, milestones, and incoming disbursements
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold text-xs py-2.5 px-4 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Commercial Contract</span>
          </button>
        )}
      </div>

      {/* 2. Top Summary Metrics (Clean, Spacious, Not Cramped) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pipeline Value */}
        <div className="clean-card p-6 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Contract Pipeline
            </span>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono tracking-tight">
              PKR {totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <span>{projects.length} Active signed contracts</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl icon-badge-gold flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-amber-700" />
          </div>
        </div>

        {/* Payments Cleared */}
        <div className="clean-card p-6 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Verified Revenue Cleared
            </span>
            <div className="text-2xl font-black text-amber-700 mt-2 font-mono tracking-tight">
              PKR {totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>
                <strong className="text-slate-800 font-semibold">
                  {Math.round((totalPaid / (totalBudget || 1)) * 100)}%
                </strong> collected of pipeline
              </span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl icon-badge-gold flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-amber-700" />
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="clean-card p-6 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Outstanding Receivables
            </span>
            <div className="text-2xl font-black text-slate-800 mt-2 font-mono tracking-tight">
              PKR {totalBalance.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              <span>Due on milestone sign-offs</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl icon-badge-silver flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </div>

      {/* 3. Category Filter Bar (Clean pill buttons with breathing space) */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['all', 'Web App', 'Mobile App', 'UI/UX Design', 'AI Integration', 'Custom Software'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-medium text-slate-500">
          Showing <strong className="text-slate-800">{filteredProjects.length}</strong> of {projects.length} contracts
        </span>
      </div>

      {/* 4. Projects List (Spacious, well-separated cards) */}
      <div className="space-y-6">
        {filteredProjects.map((project) => {
          const balance = project.totalBudget - project.paidAmount;
          const isFullyPaid = balance <= 0;
          const paidPercentage = Math.min(100, Math.round((project.paidAmount / (project.totalBudget || 1)) * 100));

          return (
            <div 
              key={project.id}
              className="clean-card p-6 md:p-7 hover:border-amber-300/80 transition-all shadow-xs hover:shadow-md space-y-6"
            >
              {/* Card Top: Title, Badges & Financial Strip */}
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 pb-6 border-b border-slate-100">
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200/90 px-2.5 py-0.5 rounded-md">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md capitalize">
                      Status: {project.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {project.id}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {project.name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                    {project.description}
                  </p>

                  <div className="pt-1 flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Client:</span>
                      <strong className="text-slate-800 font-semibold">{project.clientName}</strong>
                    </div>
                    <span className="text-slate-300">&bull;</span>
                    <div className="text-slate-500 font-mono text-[11px]">
                      {project.clientEmail}
                    </div>
                    <span className="text-slate-300">&bull;</span>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target: <strong className="text-slate-700 font-mono">{project.deadline}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Financial Ledger Box (Separated, airy card) */}
                <div className="bg-slate-50 border border-slate-200/90 p-4 sm:p-5 rounded-2xl flex flex-col gap-3 min-w-[320px] sm:min-w-[360px] shrink-0">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Financial Clearance
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded">
                      {paidPercentage}% Paid
                    </span>
                  </div>

                  {/* 3 Metric Columns */}
                  <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1 font-mono">
                        PKR {(project.totalBudget / 1000).toFixed(0)}k
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Received</span>
                      <div className="text-xs sm:text-sm font-bold text-emerald-700 mt-1 font-mono">
                        PKR {(project.paidAmount / 1000).toFixed(0)}k
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remaining</span>
                      <div className={`text-xs sm:text-sm font-bold mt-1 font-mono ${isFullyPaid ? 'text-slate-400' : 'text-slate-800'}`}>
                        {isFullyPaid ? 'Settled ✓' : `PKR ${(balance / 1000).toFixed(0)}k`}
                      </div>
                    </div>
                  </div>

                  {/* Small progress line */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${paidPercentage}%` }}
                    />
                  </div>

                  {/* Payment Button */}
                  {isLeader && !isFullyPaid && (
                    <button
                      onClick={() => setShowPaymentModal(project.id)}
                      className="btn-gold text-xs py-1.5 px-3 w-full justify-center mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Client Payment</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Card Middle: Development Velocity Control */}
              <div className="bg-slate-50/60 border border-slate-200/80 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-700">Sprint Delivery Velocity:</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={project.progressPercentage}
                    onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                    className="flex-1 max-w-md h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />

                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-md shrink-0">
                    {project.progressPercentage}% Complete
                  </span>
                </div>

                <div className="text-xs text-slate-500 shrink-0">
                  Total Milestones: <strong className="text-slate-800 font-semibold">{project.milestones.filter(m => m.completed).length} / {project.milestones.length} Delivered</strong>
                </div>
              </div>

              {/* Card Bottom: Milestone Checklist with clear separation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Contract Deliverables & Milestones:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Click milestone to toggle status
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(project.id, m.id)}
                      className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all select-none ${
                        m.completed 
                          ? 'bg-amber-50/40 border-amber-200 text-slate-900 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          m.completed 
                            ? 'bg-amber-600 text-white shadow-2xs' 
                            : 'border border-slate-300 bg-slate-50 text-slate-400'
                        }`}>
                          {m.completed ? '✓' : ''}
                        </span>
                        <span className={`text-xs font-semibold truncate ${m.completed ? 'text-slate-900' : 'text-slate-700'}`}>
                          {m.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          m.completed ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {m.completed ? 'Completed' : 'Pending'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {m.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Recording Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Record Client Payment</h4>
              <button onClick={() => setShowPaymentModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Enter the amount received from client via Bank Wire or Cheque:
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                Disbursement Amount (PKR)
              </label>
              <input
                type="number"
                step="10000"
                min="1000"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(null)}
                className="btn-silver text-xs py-2 px-3.5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddPayment(showPaymentModal)}
                className="btn-gold text-xs py-2 px-4"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">New Software Contract</h3>
                <p className="text-xs text-slate-400 mt-0.5">Onboard a client project into Hanzei ledger</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Apex Freight ERP Portal"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Eleyas Hasan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-amber-500"
                  >
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="AI Integration">AI Integration</option>
                    <option value="Custom Software">Custom Software</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Total Contract Budget (PKR) *</label>
                  <input
                    type="number"
                    step="50000"
                    required
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Description / Scope</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Outline core deliverables and sprint milestones..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Handover Target Date</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-silver text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold text-xs py-2 px-5"
                >
                  Create & Lock Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
