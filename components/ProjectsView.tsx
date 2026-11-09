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

      {/* 4. Projects Grid — 2 per row, compact clean cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const balance = Math.max(0, project.totalBudget - project.paidAmount);
          const isFullyPaid = balance <= 0;
          const completedMilestones = project.milestones.filter(m => m.completed).length;
          const totalMilestones = project.milestones.length;

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-amber-300 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4"
            >
              {/* Row 1: Icon + Title + Status + Action */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                    {getCategoryIcon(project.category)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">
                        {project.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full">
                        {project.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        project.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-sky-50 text-sky-600 border border-sky-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'completed' ? 'bg-emerald-500' : 'bg-sky-500 animate-pulse'}`} />
                        <span className="capitalize">{project.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {isLeader && (
                  <button
                    onClick={() => setShowPaymentModal(project.id)}
                    className="shrink-0 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg shadow-xs transition-all"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    Pay
                  </button>
                )}
              </div>

              {/* Row 2: Client + Deadline */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700 truncate">{project.clientName}</span>
                  {project.clientEmail && (
                    <span className="text-slate-400 hidden sm:inline truncate">({project.clientEmail})</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-slate-400 shrink-0">
                  <Calendar className="w-3 h-3" />
                  <span className="font-semibold text-slate-600">{project.deadline}</span>
                </div>
              </div>

              {/* Row 3: Financials — Budget / Paid / Balance with 2D luxury feel */}
              <div className="grid grid-cols-3 gap-2">
                {/* Budget — gold */}
                <div className="rounded-xl p-2.5 text-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #fefce8 0%, #fef9c3 60%, #fde68a 100%)',
                    border: '1px solid #fcd34d',
                    boxShadow: '0 2px 0 #d97706, 0 3px 8px rgba(217,119,6,0.12)',
                  }}>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 block mb-1">Budget</span>
                  <span className="text-[11px] font-black text-amber-900 block leading-tight">PKR {(project.totalBudget / 1000).toFixed(0)}K</span>
                </div>

                {/* Paid — emerald */}
                <div className="rounded-xl p-2.5 text-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
                    border: '1px solid #6ee7b7',
                    boxShadow: '0 2px 0 #059669, 0 3px 8px rgba(5,150,105,0.12)',
                  }}>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">Paid</span>
                  <span className="text-[11px] font-black text-emerald-800 block leading-tight">PKR {(project.paidAmount / 1000).toFixed(0)}K</span>
                </div>

                {/* Balance — silver/slate if cleared, amber if pending */}
                <div className="rounded-xl p-2.5 text-center relative overflow-hidden"
                  style={isFullyPaid ? {
                    background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 60%, #e2e8f0 100%)',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 2px 0 #94a3b8, 0 3px 8px rgba(100,116,139,0.10)',
                  } : {
                    background: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 60%, #fde68a 100%)',
                    border: '1px solid #fbbf24',
                    boxShadow: '0 2px 0 #b45309, 0 3px 8px rgba(180,83,9,0.10)',
                  }}>
                  <span className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${isFullyPaid ? 'text-slate-500' : 'text-amber-800'}`}>Balance</span>
                  <span className={`text-[11px] font-black block leading-tight ${isFullyPaid ? 'text-slate-500' : 'text-amber-900'}`}>
                    {isFullyPaid ? 'Cleared ✓' : `PKR ${(balance / 1000).toFixed(0)}K`}
                  </span>
                </div>
              </div>

              {/* Row 4: Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-amber-500" />
                    Progress
                  </span>
                  <span className="text-[11px] font-black text-amber-700">{project.progressPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={project.progressPercentage}
                  onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-amber-500 bg-slate-200"
                />
              </div>

              {/* Row 5: Milestones compact */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-400" />
                    Milestones
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full">
                    {completedMilestones}/{totalMilestones}
                  </span>
                </div>

                <div className="space-y-1">
                  {project.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(project.id, m.id)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer select-none transition-all ${
                        m.completed
                          ? 'bg-emerald-50/60 border-emerald-200/60'
                          : 'bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50/20'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-all ${
                        m.completed
                          ? 'bg-emerald-500 text-white shadow-[0_1px_0_#047857]'
                          : 'border border-slate-300 bg-white'
                      }`}>
                        {m.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>

                      {/* Title */}
                      <span className={`text-[11px] font-medium flex-1 truncate transition-all ${
                        m.completed ? 'text-emerald-700 line-through decoration-emerald-400' : 'text-slate-700'
                      }`}>
                        {m.title}
                      </span>

                      {/* Right: date or done badge */}
                      {m.completed ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded-md shrink-0">
                          Done ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 shrink-0">{m.dueDate}</span>
                      )}
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
