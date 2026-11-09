'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Plus, DollarSign, Calendar, CheckCircle2, 
  Clock, TrendingUp, X, Filter, ChevronRight,
  ShieldCheck, ArrowUpRight, Sparkles, AlertCircle,
  Coins, Wallet, Check, Users
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

      {/* 4. Projects Cards - Split-Pane Architecture (User Design with Hanzei Palette) */}
      <div className="space-y-6">
        {filteredProjects.map((project) => {
          const balance = Math.max(0, project.totalBudget - project.paidAmount);
          const isFullyPaid = balance <= 0;
          const paidPercentage = Math.min(100, Math.round((project.paidAmount / (project.totalBudget || 1)) * 100));

          return (
            <div 
              key={project.id}
              className="bg-white rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-[0_4px_25px_rgba(217,119,6,0.04)] hover:shadow-[0_10px_35px_rgba(217,119,6,0.08)] hover:border-amber-300 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* LEFT PANE: Project Identity, Circular Velocity Gauge & Handover Target */}
                <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between space-y-4 pb-5 lg:pb-0 border-b lg:border-b-0 lg:border-r border-slate-100 pr-0 lg:pr-6">
                  {/* Top: Icon + Pills + Title + Client */}
                  <div className="flex items-start gap-3.5">
                    {/* Orange/Gold Gradient Code Icon Box */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-mono font-black text-lg shadow-[0_4px_14px_rgba(217,119,6,0.25)] shrink-0 select-none">
                      &lt;/&gt;
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Top Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-100/70 border border-amber-300/80 px-2.5 py-0.5 rounded-full">
                          {project.category}
                        </span>
                        <span className="text-[11px] font-medium text-sky-800 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-sky-600" />
                          <span className="capitalize">{project.status.replace('_', ' ')}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight truncate" title={project.name}>
                        {project.name}
                      </h3>

                      {/* Client */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          Client: <strong className="text-slate-700 font-semibold">{project.clientName}</strong> {project.clientEmail ? `(${project.clientEmail})` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Circular Velocity Gauge + Velocity Slider */}
                  <div className="flex items-center gap-4 bg-amber-50/20 p-3 rounded-2xl border border-amber-100/60">
                    {/* Circular Progress Gauge */}
                    <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-amber-500"
                          strokeDasharray={`${project.progressPercentage}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute font-black text-slate-900 text-xs font-mono tracking-tight">
                        {project.progressPercentage}%
                      </span>
                    </div>

                    {/* Velocity Slider */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">Project Velocity</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={project.progressPercentage}
                        onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>

                  {/* Bottom: Handover Target */}
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block leading-tight">
                        Handover Target
                      </span>
                      <span className="font-extrabold text-slate-900 font-mono text-xs">
                        {project.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANE: Financial Strip & Milestones */}
                <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-between space-y-4">
                  {/* Top: Financial Strip (Budget, Paid, Balance, + Pay) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      {/* Budget */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                          <Coins className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                            Budget
                          </span>
                          <span className="font-extrabold text-slate-900 font-mono text-xs sm:text-sm">
                            PKR {project.totalBudget.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Paid */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                            Paid
                          </span>
                          <span className="font-extrabold text-emerald-700 font-mono text-xs sm:text-sm">
                            PKR {project.paidAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                            Balance
                          </span>
                          <span className={`font-extrabold font-mono text-xs sm:text-sm ${isFullyPaid ? 'text-slate-400' : 'text-amber-800'}`}>
                            {isFullyPaid ? 'Cleared ✓' : `PKR ${balance.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* + Pay Button */}
                    {isLeader && (
                      <button
                        onClick={() => setShowPaymentModal(project.id)}
                        className="btn-gold text-xs py-1.5 px-4 font-bold shadow-xs shrink-0 flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pay</span>
                      </button>
                    )}
                  </div>

                  {/* Milestones Section */}
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                        Milestones
                      </h4>
                    </div>

                    {/* Milestones List */}
                    <div className="space-y-1.5">
                      {project.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleMilestone(project.id, m.id)}
                          className={`cursor-pointer px-3.5 py-2 rounded-xl border flex items-center justify-between gap-3 transition-all select-none hover:border-amber-300 ${
                            m.completed 
                              ? 'bg-amber-50/20 border-slate-200/90 text-slate-900' 
                              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {/* Left: Check circle + Title */}
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                              m.completed 
                                ? 'bg-amber-500 text-white shadow-xs' 
                                : 'border-2 border-slate-300 bg-white'
                            }`}>
                              {m.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <span className={`text-xs font-semibold truncate ${m.completed ? 'text-slate-800' : 'text-slate-600'}`}>
                              {m.title}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono shrink-0">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{m.dueDate}</span>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            {m.completed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                <span>Completed</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-2.5 h-2.5" />
                                <span>Pending</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
