'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Plus, DollarSign, Calendar, CheckCircle2, 
  Clock, TrendingUp, X, Filter, ChevronRight,
  ShieldCheck, ArrowUpRight, Sparkles, AlertCircle,
  Code2, Check, Users
} from 'lucide-react';
import CustomDropdown from '@/components/CustomDropdown';
import CustomDatePicker from '@/components/CustomDatePicker';

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Single Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Projects & Financial Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Software house contracts, sprint progress, and revenue ledger
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold text-xs py-2 px-4 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* 2. TOP 3 FINANCIAL KPI CARDS - Minimal, Beautiful, Unified Luxury Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Box 1: Total Pipeline */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pipeline Value</span>
            <div className="icon-badge-gold">
              <DollarSign className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              PKR {totalBudget.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{projects.length} Active commercial contracts</p>
          </div>
        </div>

        {/* Box 2: Payments Cleared */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Payments Cleared</span>
            <div className="icon-badge-gold">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700 tracking-tight">
              PKR {totalPaid.toLocaleString()}
            </div>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
              {Math.round((totalPaid / (totalBudget || 1)) * 100)}% verified revenue collected
            </p>
          </div>
        </div>

        {/* Box 3: Outstanding Receivables */}
        <div className="clean-card p-5 flex flex-col justify-between h-32 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Outstanding Receivables</span>
            <div className="icon-badge-silver">
              <Clock className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              PKR {totalBalance.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Due across upcoming deliverables</p>
          </div>
        </div>
      </div>

      {/* 3. Category Pills (Neat & Minimal) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'Web App', 'Mobile App', 'UI/UX Design', 'AI Integration', 'Custom Software'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              filterCategory === cat
                ? 'bg-amber-100/80 text-amber-900 border border-amber-300'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Contracts' : cat}
          </button>
        ))}
      </div>

      {/* 4. Projects Cards - Completely Regenerated Executive Architecture */}
      <div className="space-y-6">
        {filteredProjects.map((project) => {
          const balance = Math.max(0, project.totalBudget - project.paidAmount);
          const isFullyPaid = balance <= 0;

          return (
            <div 
              key={project.id}
              className="clean-card p-6 md:p-7 space-y-6 hover:border-amber-300 transition-all shadow-sm hover:shadow-md bg-white border border-slate-200"
            >
              {/* TOP ROW: Project Identity & Financial Command Bar */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-5 border-b border-slate-100">
                {/* Left: Code Squircle, Name, Category, Status & Client */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(217,119,6,0.25)] shrink-0 select-none">
                    <Code2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[11px] font-bold text-amber-900 bg-[#fff5d6] border border-[#fde68a] px-3 py-0.5 rounded-full">
                        {project.category}
                      </span>
                      <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" />
                        <span className="capitalize">{project.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Client: <strong className="text-slate-700">{project.clientName}</strong> ({project.clientEmail || 'No email specified'})
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right: Clean Financial Bar + Action Button (Always in One Clean Line) */}
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap bg-slate-50/90 border border-slate-200 p-3 sm:p-4 rounded-2xl self-start xl:self-auto">
                  <div className="px-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Contract Budget</span>
                    <span className="text-sm sm:text-base font-bold text-slate-900">PKR {project.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-200" />
                  <div className="px-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block">Paid In</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-600">PKR {project.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-200" />
                  <div className="px-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Remaining Balance</span>
                    <span className={`text-sm sm:text-base font-bold ${isFullyPaid ? 'text-slate-400' : 'text-amber-800'}`}>
                      {isFullyPaid ? 'Cleared ✓' : `PKR ${balance.toLocaleString()}`}
                    </span>
                  </div>

                  {isLeader && (
                    <button
                      onClick={() => setShowPaymentModal(project.id)}
                      className="btn-gold text-xs py-2 px-5 ml-2 shrink-0 flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>+ Pay</span>
                    </button>
                  )}
                </div>
              </div>

              {/* MIDDLE ROW: Velocity Progress Bar & Handover Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-amber-50/25 p-4 rounded-2xl border border-amber-100">
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">Project Velocity & Engineering Progress</span>
                    <span className="text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200 font-extrabold text-[11px]">
                      {project.progressPercentage}% Completed
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 border border-slate-200 p-0.5 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${project.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[10px] text-slate-400 font-medium">Adjust Velocity:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={project.progressPercentage}
                      onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-3 text-xs border-t md:border-t-0 md:border-l border-amber-200/60 pt-3 md:pt-0 md:pl-5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 shadow-2xs">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none mb-1">Handover Deadline</span>
                    <span className="font-extrabold text-slate-900 text-sm tracking-tight">{project.deadline}</span>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: Milestones Grid */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shadow-2xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Contract Deliverable Milestones</h4>
                  </div>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">Click milestone to toggle status</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {project.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(project.id, m.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all select-none hover:shadow-xs hover:border-amber-300 ${
                        m.completed 
                          ? 'bg-amber-50/30 border-amber-200 text-slate-900' 
                          : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold leading-snug line-clamp-2">{m.title}</span>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          m.completed ? 'bg-amber-500 text-white shadow-2xs' : 'border border-slate-300 bg-white text-transparent'
                        }`}>
                          ✓
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
                        <span className="text-slate-400 font-medium">{m.dueDate}</span>
                        <span className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                          m.completed ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]' : 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]'
                        }`}>
                          {m.completed ? 'Completed' : 'Pending'}
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

      {/* Record Payment Modal */}
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
              Enter amount received from client:
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
                  <CustomDropdown
                    fullWidth
                    value={newCategory}
                    onChange={(val) => setNewCategory(val as any)}
                    options={[
                      { value: 'Web App', label: 'Web App' },
                      { value: 'Mobile App', label: 'Mobile App' },
                      { value: 'UI/UX Design', label: 'UI/UX Design' },
                      { value: 'AI Integration', label: 'AI Integration' },
                      { value: 'Custom Software', label: 'Custom Software' },
                    ]}
                  />
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
                  <CustomDatePicker
                    fullWidth
                    value={newStartDate}
                    onChange={setNewStartDate}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Handover Target Date</label>
                  <CustomDatePicker
                    fullWidth
                    value={newDeadline}
                    onChange={setNewDeadline}
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
