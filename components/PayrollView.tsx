'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { DollarSign, CheckCircle2, Clock, Sparkles, CreditCard, FileText, Search, X } from 'lucide-react';
import { PayrollRecord } from '@/lib/types';

export default function PayrollView() {
  const { payroll, markSalaryPaid, generateMonthlyPayroll, currentUser, users } = useApp();

  const isLeader = currentUser.role === 'leader';
  const [selectedMonth, setSelectedMonth] = useState('November 2026');
  const [showPayModal, setShowPayModal] = useState<PayrollRecord | null>(null);
  const [viewReceipt, setViewReceipt] = useState<PayrollRecord | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'JazzCash' | 'Easypaisa' | 'Cash' | 'Wise'>('Bank Transfer');
  const [transRef, setTransRef] = useState('');

  const filteredPayroll = payroll.filter(p => {
    const matchesMonth = p.month === selectedMonth;
    const matchesDept = departmentFilter === 'ALL' || p.department === departmentFilter;
    const matchesSearch = p.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesDept && matchesSearch;
  });

  const totalOutflow = payroll.filter(p => p.month === selectedMonth).reduce((acc, p) => acc + p.netSalary, 0);
  const totalPaid = payroll.filter(p => p.month === selectedMonth && p.status === 'paid').reduce((acc, p) => acc + p.netSalary, 0);
  const totalPending = totalOutflow - totalPaid;

  const handleConfirmPay = () => {
    if (!showPayModal) return;
    markSalaryPaid(showPayModal.id, paymentMethod, transRef || `TXN-${Date.now().toString().slice(-6)}`);
    setShowPayModal(null); setTransRef('');
  };

  return (
    <div className="space-y-5 fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Payroll & Salaries</h2>
          <p className="text-xs text-slate-600 mt-0.5">Transparent salary ledger visible to entire team</p>
        </div>
        {isLeader && (
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="dark-input text-xs py-1.5 px-3"
            >
              <option value="November 2026">November 2026</option>
              <option value="October 2026">October 2026</option>
            </select>
            <button onClick={() => generateMonthlyPayroll(selectedMonth)} className="btn-gold text-xs py-1.5 px-4 gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Payroll</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Cycle Budget', val: `PKR ${totalOutflow.toLocaleString()}`, sub: `${payroll.filter(p => p.month === selectedMonth).length} staff members`, icon: DollarSign, gold: false },
          { label: 'Disbursed & Cleared', val: `PKR ${totalPaid.toLocaleString()}`, sub: `${payroll.filter(p => p.month === selectedMonth && p.status === 'paid').length} staff verified paid`, icon: CheckCircle2, gold: true },
          { label: 'Pending Release', val: `PKR ${totalPending.toLocaleString()}`, sub: `${payroll.filter(p => p.month === selectedMonth && p.status !== 'paid').length} awaiting leader release`, icon: Clock, gold: false },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="glass-card-hover p-5 flex items-start justify-between">
              <div>
                <p className="section-label mb-2">{kpi.label}</p>
                <div className={`text-[1.3rem] font-extrabold leading-none tracking-tight ${kpi.gold ? 'text-amber-400' : 'text-slate-200'}`}>{kpi.val}</div>
                <p className="text-[11px] text-slate-700 mt-1.5">{kpi.sub}</p>
              </div>
              <div className={`icon-badge${kpi.gold ? '-gold' : '-silver'} w-10 h-10 rounded-xl`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="glass-card p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {['ALL', 'Development', 'Design', 'Office & Maintenance'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                departmentFilter === dept
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              {dept === 'ALL' ? 'All Depts' : dept}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee..." className="dark-input w-full pl-9 pr-3 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-card overflow-x-auto">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Salary Ledger — {selectedMonth}</h3>
            <p className="text-xs text-slate-600 mt-0.5">Visible to all team for transparency</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
            All Records Open
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Staff Member', 'Department', 'Base Salary', 'Bonus', 'Net Pay', 'Status', 'Method / Date', 'Action'].map((h, i) => (
                <th key={h} className={`px-4 py-3 section-label ${i === 7 ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPayroll.map((item) => {
              const isPaid = item.status === 'paid';
              return (
                <tr key={item.id} className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-black font-bold text-xs flex items-center justify-center shrink-0">
                        {item.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200 text-xs">{item.userName}</div>
                        <div className="text-[10px] text-slate-600 capitalize">{item.userRole.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{item.department}</td>
                  <td className="px-4 py-4 font-medium text-slate-400 text-xs">PKR {item.baseSalary.toLocaleString()}</td>
                  <td className="px-4 py-4 text-xs">
                    <span className="text-amber-400 font-semibold">+PKR {item.bonus.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-200 text-xs">PKR {item.netSalary.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 w-fit"
                      style={{
                        background: isPaid ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                        color: isPaid ? '#4ade80' : '#94a3b8',
                        border: `1px solid ${isPaid ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-green-400' : 'bg-slate-500'}`} />
                      {isPaid ? 'PAID' : 'PENDING'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs">
                    {isPaid ? (
                      <div>
                        <div className="font-medium text-slate-400">{item.paymentMethod}</div>
                        <div className="text-[10px] text-slate-700 font-mono">{item.paidDate}</div>
                      </div>
                    ) : (
                      <span className="text-slate-700 italic">Processing</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isLeader && !isPaid && (
                        <button onClick={() => setShowPayModal(item)} className="btn-gold text-[11px] py-1 px-3">Mark Paid</button>
                      )}
                      <button onClick={() => setViewReceipt(item)} className="btn-silver text-[11px] py-1 px-2.5">Slip</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card-gold p-6 max-w-md w-full">
            <h3 className="text-sm font-bold text-slate-100 mb-1">Mark Paid: {showPayModal.userName}</h3>
            <p className="text-xs text-slate-600 mb-4">Net Amount: <strong className="text-amber-400">PKR {showPayModal.netSalary.toLocaleString()}</strong></p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} className="dark-input w-full">
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="Cash">Cash</option>
                  <option value="Wise">Wise</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Transaction Reference (optional)</label>
                <input type="text" value={transRef} onChange={(e) => setTransRef(e.target.value)} placeholder="e.g. TXN123456" className="dark-input w-full" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowPayModal(null)} className="btn-silver text-xs py-2 px-4">Cancel</button>
                <button onClick={handleConfirmPay} className="btn-gold text-xs py-2 px-4">Confirm Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card-gold p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-100">Pay Slip — {viewReceipt.month}</h3>
              <button onClick={() => setViewReceipt(null)}><X className="w-4 h-4 text-slate-600" /></button>
            </div>
            <div className="space-y-2.5">
              {[
                ['Staff', viewReceipt.userName],
                ['Role', viewReceipt.userRole],
                ['Department', viewReceipt.department],
                ['Base Salary', `PKR ${viewReceipt.baseSalary.toLocaleString()}`],
                ['Bonus', `+PKR ${viewReceipt.bonus.toLocaleString()}`],
                ['Net Pay', `PKR ${viewReceipt.netSalary.toLocaleString()}`],
                ['Status', viewReceipt.status.toUpperCase()],
                viewReceipt.paymentMethod ? ['Method', viewReceipt.paymentMethod] : null,
                viewReceipt.paidDate ? ['Paid Date', viewReceipt.paidDate] : null,
              ].filter(Boolean).map((row) => { const [label, val] = row as [string, string]; return (
                <div key={label} className="flex items-center justify-between py-1.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-xs text-slate-600">{label}</span>
                  <span className="text-xs font-bold text-slate-200">{val as string}</span>
                </div>
              ); })}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setViewReceipt(null)} className="btn-silver text-xs py-1.5 px-4">Close</button>
              <button onClick={() => window.print()} className="btn-gold text-xs py-1.5 px-4 gap-1.5">
                <FileText className="w-3 h-3" /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
