'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Plus, DollarSign, Calendar, CheckCircle2, 
  Clock, TrendingUp, X, Filter, ChevronRight,
  ShieldCheck, ArrowUpRight, Sparkles, AlertCircle,
  Code2, Check, Users, Globe, Smartphone, Palette, Cpu,
  Layers, Zap, Coins
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web App':
        return <Globe className="w-6 h-6 text-amber-500 stroke-[2.2]" />;
      case 'Mobile App':
        return <Smartphone className="w-6 h-6 text-amber-500 stroke-[2.2]" />;
      case 'UI/UX Design':
        return <Palette className="w-6 h-6 text-amber-500 stroke-[2.2]" />;
      case 'AI Integration':
        return <Cpu className="w-6 h-6 text-amber-500 stroke-[2.2]" />;
      default:
        return <Code2 className="w-6 h-6 text-amber-500 stroke-[2.2]" />;
    }
  };

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

      {/* 4. Executive Projects Cards & Financial Ledger */}
      <div className="space-y-6">
        {filteredProjects.map((project) => {
          const balance = Math.max(0, project.totalBudget - project.paidAmount);
          const isFullyPaid = balance <= 0;
          const completedMilestones = project.milestones.filter(m => m.completed).length;
          const totalMilestones = project.milestones.length;

          return (
            <div 
              key={project.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400/80 p-5 sm:p-7 shadow-[0_4px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_40px_rgba(217,119,6,0.08)] transition-all duration-200 relative overflow-hidden group space-y-6"
            >
              {/* Decorative Subtle Ambient Glow */}
              <div className="absolute -top-20 -right-20 w-52 h-52 bg-gradient-to-br from-amber-100/40 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-amber-200/40 transition-all duration-500" />

              {/* 1. Header Row: Identity, Badges, Dates & Actions */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                <div className="flex items-start gap-4">
                  {/* Category Icon Squircle */}
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/90 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-xs">
                    {getCategoryIcon(project.category)}
                  </div>

                  <div className="min-w-0">
                    {/* Meta Tags */}
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                        {project.category}
                      </span>

                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                        project.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'completed' ? 'bg-emerald-500' : 'bg-sky-500 animate-pulse'}`} />
                        <span className="capitalize">{project.status.replace('_', ' ')}</span>
                      </span>

                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Target: <strong className="text-slate-700">{project.deadline}</strong></span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-amber-900 transition-colors">
                      {project.name}
                    </h3>

                    {/* Client Info */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Client:</span>
                      <strong className="text-slate-800 font-bold">{project.clientName}</strong>
                      {project.clientEmail && (
                        <span className="text-slate-400">({project.clientEmail})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {isLeader && (
                  <div className="flex items-center gap-2 lg:self-center shrink-0">
                    <button
                      onClick={() => setShowPaymentModal(project.id)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Record Payment</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Executive 3-Deck Financial Ledger */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 relative z-10">
                {/* Total Budget */}
                <div className="bg-[#fcfaf7] border border-amber-100 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-500 stroke-[2.2]" />
                      Contract Budget
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md">
                      Cap
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    PKR {project.totalBudget.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Fixed commercial volume</p>
                </div>

                {/* Revenue Received */}
                <div className="bg-[#f0fdf4]/80 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      Revenue Cleared
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                      {Math.round((project.paidAmount / (project.totalBudget || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-emerald-700 tracking-tight">
                    PKR {project.paidAmount.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-emerald-600/80 font-medium mt-1">Disbursed to bank account</p>
                </div>

                {/* Balance Receivable */}
                <div className="bg-[#fffdfa] border border-amber-200/70 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                      Balance Remaining
                    </span>
                    {isFullyPaid ? (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                        Settled ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                        Receivable
                      </span>
                    )}
                  </div>
                  <div className={`text-lg sm:text-xl font-black tracking-tight ${isFullyPaid ? 'text-slate-400' : 'text-amber-800'}`}>
                    {isFullyPaid ? 'Cleared ✓' : `PKR ${balance.toLocaleString()}`}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isFullyPaid ? 'Zero outstanding dues' : 'Collect on upcoming milestones'}
                  </p>
                </div>
              </div>

              {/* 3. Sprint Delivery Velocity & Live Interactive Slider */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 relative z-10 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Sprint Delivery Velocity</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Sprint Completion:</span>
                    <span className="text-xs font-black text-amber-600 bg-white border border-amber-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
                      {project.progressPercentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Slider */}
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={project.progressPercentage}
                    onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* 4. Sprint Milestones Deliverables */}
              <div className="space-y-3 relative z-10 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                      Sprint Milestones
                    </h4>
                  </div>

                  <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-3 py-0.5 rounded-full">
                    {completedMilestones} of {totalMilestones} Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {project.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(project.id, m.id)}
                      className={`p-3 sm:px-4 rounded-xl border flex items-center justify-between gap-3 cursor-pointer select-none transition-all ${
                        m.completed
                          ? 'bg-emerald-50/25 border-emerald-200/70 hover:bg-emerald-50/40'
                          : 'bg-white border-slate-200/80 hover:border-amber-300 hover:bg-slate-50/80 shadow-2xs'
                      }`}
                    >
                      {/* Left Checkbox & Title */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs shrink-0 transition-colors ${
                          m.completed
                            ? 'bg-emerald-500 text-white shadow-2xs'
                            : 'border-2 border-slate-300 bg-white'
                        }`}>
                          {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-xs font-semibold truncate ${m.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {m.title}
                        </span>
                      </div>

                      {/* Right Date & Status */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {m.dueDate}
                        </span>
                        {m.completed ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-md">
                            Done
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 border border-amber-200 px-2 py-0.5 rounded-md">
                            Pending
                          </span>
                        )}
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
