'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  FolderKanban, Plus, DollarSign, Calendar, CheckCircle2, 
  Clock, TrendingUp, Users, ChevronRight, X, Sparkles, Check,
  Search, Filter, Layers, ArrowUpRight, ShieldCheck, Code2, Smartphone, Cpu, Laptop
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
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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
  const overallCompletionRate = Math.round(
    projects.reduce((acc, p) => acc + p.progressPercentage, 0) / (projects.length || 1)
  );

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mobile App': return Smartphone;
      case 'AI Integration': return Cpu;
      case 'Web App': return Laptop;
      default: return Code2;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Projects & Commercial Portfolio
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
              {projects.length} Contracts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time delivery milestones, commercial payments, and client contract velocity
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        )}
      </div>

      {/* Top 3 Luxury Metric Cards with Visual Progress Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Total Pipeline Value */}
        <div className="clean-card p-6 flex items-start justify-between hover:border-amber-300 transition-all">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Contract Pipeline
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              PKR {totalBudget.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Avg Velocity: {overallCompletionRate}%
              </span>
              <span className="text-xs text-slate-400">{projects.length} contracts</span>
            </div>
          </div>
          <div className="icon-badge-gold">
            <DollarSign className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        {/* Card 2: Payments Cleared */}
        <div className="clean-card p-6 flex items-start justify-between hover:border-amber-300 transition-all">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Cleared Revenue
            </span>
            <div className="text-2xl font-bold text-amber-700 mt-2">
              PKR {totalPaid.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full"
                  style={{ width: `${Math.round((totalPaid / (totalBudget || 1)) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-amber-800">
                {Math.round((totalPaid / (totalBudget || 1)) * 100)}%
              </span>
            </div>
          </div>
          <div className="icon-badge-gold">
            <CheckCircle2 className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        {/* Card 3: Outstanding Receivables */}
        <div className="clean-card p-6 flex items-start justify-between hover:border-slate-300 transition-all">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Receivables Balance
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              PKR {totalBalance.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Pending release on milestone signoff</span>
            </p>
          </div>
          <div className="icon-badge-silver">
            <ShieldCheck className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="clean-card p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Projects' },
            { id: 'Custom Software', label: 'Custom Software' },
            { id: 'Web App', label: 'Web Apps' },
            { id: 'Mobile App', label: 'Mobile' },
            { id: 'AI Integration', label: 'AI Integration' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-50 text-amber-950 font-bold border border-amber-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, client..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>
      </div>

      {/* Projects Creative Cards List */}
      <div className="space-y-6">
        {filteredProjects.map((project) => {
          const balance = project.totalBudget - project.paidAmount;
          const isFullyPaid = balance <= 0;
          const paidPercentage = Math.round((project.paidAmount / project.totalBudget) * 100);
          const CatIcon = getCategoryIcon(project.category);
          const completedMilestones = project.milestones.filter(m => m.completed).length;

          return (
            <div 
              key={project.id}
              className="clean-card p-6 hover:border-amber-300 transition-all space-y-5 relative overflow-hidden"
            >
              {/* Top Accent Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-slate-200" />

              {/* Head Section: Title, Category Icon, Client, Financial Widget */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-50 to-amber-100/60 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-xs">
                    <CatIcon className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                        {project.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md capitalize flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{project.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">{project.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                      <span>Client: <strong className="text-slate-800">{project.clientName}</strong> ({project.clientEmail})</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Target: <strong className="text-slate-800 font-mono">{project.deadline}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Creative Financial & Payment Ledger Pill */}
                <div className="bg-slate-50/90 border border-slate-200/80 p-4 rounded-2xl flex flex-col gap-3 min-w-[320px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Contract</span>
                      <div className="text-base font-extrabold text-slate-900">
                        PKR {project.totalBudget.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Received</span>
                      <div className="text-base font-extrabold text-amber-700">
                        PKR {project.paidAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Financial Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${paidPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>{paidPercentage}% Paid</span>
                      <span>
                        {isFullyPaid ? (
                          <strong className="text-emerald-700 font-bold">Paid in Full ✓</strong>
                        ) : (
                          <span>Balance: <strong className="text-slate-700">PKR {balance.toLocaleString()}</strong></span>
                        )}
                      </span>
                    </div>
                  </div>

                  {isLeader && !isFullyPaid && (
                    <button
                      onClick={() => setShowPaymentModal(project.id)}
                      className="w-full btn-gold text-xs py-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Payment</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Interactive Velocity & Step Milestones Roadmap */}
              <div className="pt-2 space-y-4">
                {/* Velocity Bar with Quick Adjust Buttons */}
                <div className="bg-slate-50/60 border border-slate-200/60 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                      <span>Sprint Velocity:</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={project.progressPercentage}
                      onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                      className="flex-1 max-w-sm h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <span className="text-sm font-mono font-black text-amber-800 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                      {project.progressPercentage}%
                    </span>
                  </div>

                  {/* Quick percentage adjustment pills */}
                  <div className="flex items-center gap-1.5">
                    {[25, 50, 75, 100].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateProjectProgress(project.id, val)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                          project.progressPercentage === val
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-amber-400'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milestone Roadmap Title */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Milestone Roadmap Checklist
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                    {completedMilestones} of {project.milestones.length} Completed
                  </span>
                </div>

                {/* Milestone Step Nodes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.milestones.map((milestone, idx) => (
                    <div
                      key={milestone.id}
                      onClick={() => toggleMilestone(project.id, milestone.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border flex items-center justify-between transition-all select-none ${
                        milestone.completed 
                          ? 'bg-amber-50/40 border-amber-300 text-slate-900 shadow-xs' 
                          : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${
                          milestone.completed 
                            ? 'bg-gradient-to-tr from-amber-600 to-amber-400 text-white shadow-xs' 
                            : 'border border-slate-300 text-slate-400 bg-slate-50'
                        }`}>
                          {milestone.completed ? '✓' : idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${milestone.completed ? 'text-slate-900' : 'text-slate-700'}`}>
                            {milestone.title}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">Due: {milestone.dueDate}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                        milestone.completed 
                          ? 'bg-amber-100/80 text-amber-900 border border-amber-200' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {milestone.completed ? 'Delivered ✓' : 'In Progress'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="clean-card p-12 text-center">
            <FolderKanban className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No projects match your filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try changing the category or search keyword.</p>
          </div>
        )}
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