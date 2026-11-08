'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Plus, Calendar, TrendingUp, CheckCircle2, Clock,
  Search, Layers, ChevronDown, DollarSign, ShieldCheck, Code2, Smartphone, Cpu, Laptop
} from 'lucide-react';

const fmtMoney = (n: number) => `PKR ${n.toLocaleString()}`;

export default function ProjectsView() {
  const {
    projects, addProject, updateProjectProgress,
    recordProjectPayment, toggleMilestone, currentUser
  } = useApp();

  const isLeader = currentUser.role === 'leader';
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(50000);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [newName, setNewName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newBudget, setNewBudget] = useState(500000);
  const [newCategory, setNewCategory] = useState<'Web App' | 'Mobile App' | 'UI/UX Design' | 'AI Integration' | 'Custom Software'>('Web App');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDeadline, setNewDeadline] = useState('2027-01-31');

  const totalBudget = projects.reduce((acc, p) => acc + p.totalBudget, 0);
  const totalPaid   = projects.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalBalance = totalBudget - totalPaid;

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newClientName.trim()) return;
    addProject({ name: newName, clientName: newClientName, clientEmail: newClientEmail, description: newDescription, totalBudget: newBudget, currency: 'PKR', category: newCategory, startDate: newStartDate, deadline: newDeadline, assignedTeamMemberIds: ['usr_dev_1', 'usr_des_1'] });
    setNewName(''); setNewClientName(''); setNewClientEmail(''); setNewDescription(''); setShowAddModal(false);
  };

  const handleAddPayment = (projectId: string) => {
    if (paymentAmount <= 0) return;
    recordProjectPayment(projectId, paymentAmount);
    setShowPaymentModal(null);
  };

  const getCatIcon = (c: string) => ({ 'Mobile App': Smartphone, 'AI Integration': Cpu, 'Web App': Laptop }[c] || Code2);

  const cats = ['ALL', 'Custom Software', 'Web App', 'Mobile App', 'AI Integration'];

  return (
    <div className="space-y-5 fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Projects & Financial Ledger</h2>
          <p className="text-xs text-slate-600 mt-0.5">{projects.length} active contracts · client delivery velocity</p>
        </div>
        {isLeader && (
          <button onClick={() => setShowAddModal(true)} className="btn-gold text-xs py-1.5 px-4 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pipeline Value', value: fmtMoney(totalBudget), sub: `${projects.length} contracts`, icon: DollarSign, gold: true },
          { label: 'Revenue Cleared', value: fmtMoney(totalPaid), sub: `${Math.round((totalPaid/(totalBudget||1))*100)}% collected`, icon: CheckCircle2, gold: true },
          { label: 'Balance Due', value: fmtMoney(totalBalance), sub: 'pending on deliverables', icon: Clock, gold: false },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="glass-card-hover p-5 flex items-start justify-between">
              <div>
                <p className="section-label mb-2">{kpi.label}</p>
                <div className="text-[1.35rem] font-extrabold text-slate-100 leading-none tracking-tight">{kpi.value}</div>
                <p className="text-[11px] text-slate-600 mt-1.5">{kpi.sub}</p>
              </div>
              <div className={`icon-badge${kpi.gold ? '-gold' : '-silver'} w-10 h-10 rounded-xl`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="glass-card p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              {cat === 'ALL' ? 'All' : cat}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project or client..."
            className="dark-input w-full pl-9 pr-3 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const balance = project.totalBudget - project.paidAmount;
          const paidPct = Math.round((project.paidAmount / project.totalBudget) * 100);
          const CatIcon = getCatIcon(project.category);
          const doneMilestones = project.milestones.filter(m => m.completed).length;

          return (
            <div key={project.id} className="glass-card-hover p-5 space-y-5 relative overflow-hidden">
              {/* Gold top line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

              {/* Head */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Left: info */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
                  >
                    <CatIcon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                        {project.category}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100 tracking-tight leading-snug">{project.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">{project.description}</p>
                    <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-600">
                      <span>Client: <strong className="text-slate-400">{project.clientName}</strong></span>
                      <span className="text-slate-700">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Due: <strong className="text-slate-400 font-mono">{project.deadline}</strong></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: financial widget */}
                <div
                  className="p-4 rounded-2xl space-y-3 min-w-[290px]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="section-label mb-1">Budget</p>
                      <div className="text-sm font-bold text-slate-200">{fmtMoney(project.totalBudget)}</div>
                    </div>
                    <div className="text-right">
                      <p className="section-label mb-1 text-amber-600">Received</p>
                      <div className="text-sm font-bold text-amber-400">{fmtMoney(project.paidAmount)}</div>
                    </div>
                    <div className="text-right">
                      <p className="section-label mb-1">Balance</p>
                      <div className="text-sm font-bold text-slate-400">{balance <= 0 ? '✓ Settled' : fmtMoney(balance)}</div>
                    </div>
                  </div>
                  <div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${paidPct}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-700">
                      <span>{paidPct}% paid</span>
                      {balance > 0 && <span className="text-amber-700">Balance due</span>}
                    </div>
                  </div>
                  {isLeader && balance > 0 && (
                    <button onClick={() => setShowPaymentModal(project.id)} className="btn-gold w-full text-xs py-1.5 gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Payment</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Velocity + Milestones */}
              <div className="space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 shrink-0">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-400">Velocity</span>
                  </div>
                  <input
                    type="range" min="0" max="100" step="5"
                    value={project.progressPercentage}
                    onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-amber-500"
                    style={{ background: `linear-gradient(to right, #d4af37 ${project.progressPercentage}%, rgba(255,255,255,0.1) ${project.progressPercentage}%)` }}
                  />
                  <span className="text-sm font-black text-amber-400 w-10 text-right">{project.progressPercentage}%</span>
                  <div className="flex items-center gap-1.5">
                    {[25, 50, 75, 100].map((v) => (
                      <button
                        key={v}
                        onClick={() => updateProjectProgress(project.id, v)}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all ${
                          project.progressPercentage === v
                            ? 'bg-amber-500 text-black'
                            : 'text-slate-600 hover:text-slate-300'
                        }`}
                        style={{ border: project.progressPercentage === v ? 'none' : '1px solid rgba(255,255,255,0.08)' }}
                      >
                        {v}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-slate-600" />
                      <span className="section-label">Milestones</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400">{doneMilestones}/{project.milestones.length} delivered</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.milestones.map((m, idx) => (
                      <div
                        key={m.id}
                        onClick={() => toggleMilestone(project.id, m.id)}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all select-none"
                        style={{
                          background: m.completed ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
                          border: m.completed ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                          style={{
                            background: m.completed ? 'linear-gradient(135deg, #f5c842, #c88f00)' : 'rgba(255,255,255,0.05)',
                            border: m.completed ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            color: m.completed ? '#1a0f00' : '#475569',
                          }}
                        >
                          {m.completed ? '✓' : idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold truncate ${m.completed ? 'text-slate-300 line-through decoration-amber-600/50' : 'text-slate-400'}`}>
                            {m.title}
                          </p>
                          <p className="text-[10px] text-slate-700 font-mono mt-0.5">{m.dueDate}</p>
                        </div>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider shrink-0 px-2 py-0.5 rounded-full"
                          style={{
                            background: m.completed ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                            color: m.completed ? '#f5c842' : '#475569',
                          }}
                        >
                          {m.completed ? 'Done' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="glass-card p-16 text-center">
            <p className="text-slate-600 text-sm">No projects match your filter.</p>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card-gold p-6 max-w-sm w-full">
            <h3 className="text-sm font-bold text-slate-100 mb-1">Record Client Payment</h3>
            <p className="text-xs text-slate-600 mb-4">Enter amount received via Bank, JazzCash, or Cash.</p>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Amount (PKR)</label>
            <input
              type="number" step="5000" value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="dark-input w-full text-sm font-bold mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPaymentModal(null)} className="btn-silver text-xs py-1.5 px-4">Cancel</button>
              <button onClick={() => handleAddPayment(showPaymentModal)} className="btn-gold text-xs py-1.5 px-4">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card-gold p-6 max-w-lg w-full">
            <h3 className="text-sm font-bold text-slate-100 mb-1">Create New Project</h3>
            <p className="text-xs text-slate-600 mb-4">Register commercial details and client contract.</p>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Project Name *</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Apex Freight ERP Portal" className="dark-input w-full" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Client Name *</label>
                  <input type="text" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Client name" className="dark-input w-full" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Client Email</label>
                  <input type="email" value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} placeholder="email@client.com" className="dark-input w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Budget (PKR) *</label>
                  <input type="number" step="10000" value={newBudget} onChange={(e) => setNewBudget(Number(e.target.value))} className="dark-input w-full font-bold" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Category</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)} className="dark-input w-full">
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="AI Integration">AI Integration</option>
                    <option value="Custom Software">Custom Software</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Description</label>
                <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Project scope and goals..." rows={2} className="dark-input w-full resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Start Date</label>
                  <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} className="dark-input w-full" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Deadline</label>
                  <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className="dark-input w-full" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-silver text-xs py-2 px-4">Cancel</button>
                <button type="submit" className="btn-gold text-xs py-2 px-4">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
