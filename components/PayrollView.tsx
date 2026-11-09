'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  DollarSign, CheckCircle2, Clock, Check, Sparkles, 
  CreditCard, FileText, Download, Building2, User, Printer, X,
  ShieldCheck, Search, Filter, TrendingUp, AlertCircle
} from 'lucide-react';
import { PayrollRecord } from '@/lib/types';
import CustomDropdown from '@/components/CustomDropdown';

export default function PayrollView() {
  const { 
    payroll, 
    markSalaryPaid, 
    generateMonthlyPayroll, 
    currentUser,
    users 
  } = useApp();

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
    const matchesSearch = p.userName.toLowerCase().includes(searchQuery.toLowerCase()) || p.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesDept && matchesSearch;
  });

  const totalMonthlyOutflow = payroll.filter(p => p.month === selectedMonth).reduce((acc, p) => acc + p.netSalary, 0);
  const totalPaidOutflow = payroll.filter(p => p.month === selectedMonth && p.status === 'paid').reduce((acc, p) => acc + p.netSalary, 0);
  const totalPendingOutflow = totalMonthlyOutflow - totalPaidOutflow;
  const disbursedPct = totalMonthlyOutflow > 0 ? Math.round((totalPaidOutflow / totalMonthlyOutflow) * 100) : 0;

  const handleConfirmPay = () => {
    if (!showPayModal) return;
    markSalaryPaid(
      showPayModal.id, 
      paymentMethod, 
      transRef || `TXN-${Date.now().toString().slice(-6)}`
    );
    setShowPayModal(null);
    setTransRef('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Payroll, Salaries & Compensation
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
              Transparent Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent company salary clearances, disbursement vouchers, and employee pay slips
          </p>
        </div>

        {isLeader && (
          <div className="flex items-center gap-2.5">
            <CustomDropdown
              value={selectedMonth}
              onChange={setSelectedMonth}
              options={[
                { value: 'November 2026', label: 'November 2026' },
                { value: 'October 2026', label: 'October 2026' },
              ]}
              menuWidth="w-44"
            />

            <button
              onClick={() => generateMonthlyPayroll(selectedMonth)}
              className="btn-gold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Payroll Cycle</span>
            </button>
          </div>
        )}
      </div>

      {/* 3 Metric Cards with Financial Progress Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Cycle Budget */}
        <div className="clean-card p-6 flex items-start justify-between hover:border-amber-300 transition-all">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Cycle Outflow
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              PKR {totalMonthlyOutflow.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">{filteredPayroll.length} active software house team members</p>
          </div>
          <div className="icon-badge-gold">
            <DollarSign className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        {/* Card 2: Disbursed & Cleared */}
        <div className="clean-card p-6 flex items-start justify-between hover:border-amber-300 transition-all">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Disbursed & Cleared
            </span>
            <div className="text-2xl font-bold text-amber-700 mt-2">
              PKR {totalPaidOutflow.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full"
                  style={{ width: `${disbursedPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-amber-800">{disbursedPct}% Cleared</span>
            </div>
          </div>
          <div className="icon-badge-gold">
            <CheckCircle2 className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        {/* Card 3: Pending Release */}
        <div className="clean-card p-6 flex items-start justify-between hover:border-slate-300 transition-all">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Pending Release
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              PKR {totalPendingOutflow.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {payroll.filter(p => p.month === selectedMonth && p.status === 'pending').length} vouchers awaiting leader signoff
            </p>
          </div>
          <div className="icon-badge-silver">
            <Clock className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="clean-card p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'Development', 'Design', 'Office & Maintenance'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                departmentFilter === dept
                  ? 'bg-amber-50 text-amber-950 font-bold border border-amber-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {dept === 'ALL' ? 'All Departments' : dept}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>
      </div>

      {/* Transparent Ledger Table */}
      <div className="clean-card p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Verified Office Salary Ledger ({selectedMonth})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Visible to all employees to confirm company salary clearances</p>
          </div>
          <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
            All Records Open & Transparent
          </span>
        </div>

        <table className="w-full text-left text-xs font-normal">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 pb-3">
              <th className="pb-3 pl-2 font-semibold uppercase tracking-wider text-[10px]">Staff Member</th>
              <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Department</th>
              <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Base Salary</th>
              <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Bonus</th>
              <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Net Pay</th>
              <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Status</th>
              <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Method & Date</th>
              <th className="pb-3 pr-2 text-right font-semibold uppercase tracking-wider text-[10px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPayroll.map((item) => {
              const isPaid = item.status === 'paid';
              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 min-w-[32px] min-h-[32px] aspect-square rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/30">
                        {item.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{item.userName}</div>
                        <span className="text-[11px] text-slate-400 capitalize">{item.userRole.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-600 font-medium">{item.department}</td>
                  <td className="py-3.5 font-medium text-slate-700">
                    PKR {item.baseSalary.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-slate-600">
                    +PKR {item.bonus.toLocaleString()}
                  </td>
                  <td className="py-3.5 font-bold text-slate-900">
                    PKR {item.netSalary.toLocaleString()}
                  </td>
                  <td className="py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      isPaid 
                        ? 'bg-amber-50 text-amber-950 border border-amber-300' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-amber-600' : 'bg-slate-400'}`} />
                      {isPaid ? 'PAID' : 'PENDING'}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-500">
                    {isPaid ? (
                      <div>
                        <span className="font-medium text-slate-700">{item.paymentMethod}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{item.paidDate}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Processing</span>
                    )}
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isLeader && !isPaid && (
                        <button
                          onClick={() => setShowPayModal(item)}
                          className="btn-gold text-xs py-1 px-3"
                        >
                          Mark as Paid
                        </button>
                      )}
                      <button
                        onClick={() => setViewReceipt(item)}
                        className="btn-silver text-xs py-1 px-3"
                      >
                        Slip
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mark Salary Paid Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Mark Salary Paid: {showPayModal.userName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Confirming this records payment in the transparent office ledger.
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                >
                  <option value="Bank Transfer">Bank Transfer (Meezan / HBL / Alfalah)</option>
                  <option value="JazzCash">JazzCash Mobile Wallet</option>
                  <option value="Easypaisa">Easypaisa Mobile Wallet</option>
                  <option value="Cash">Cash (Handed directly)</option>
                  <option value="Wise">Wise / Remittance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Transaction Reference / Voucher Note
                </label>
                <input
                  type="text"
                  value={transRef}
                  onChange={(e) => setTransRef(e.target.value)}
                  placeholder="e.g. HBL-FT-9941829 or Cash Voucher #12"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setShowPayModal(null)}
                  className="btn-silver"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPay}
                  className="btn-gold"
                >
                  Confirm Disbursement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slip Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl border border-slate-200 printable-slip">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  Official Salary Certificate
                </span>
                <h3 className="text-lg font-bold text-slate-900">Hanzei Technologies (Pvt) Ltd</h3>
              </div>
              <button
                onClick={() => setViewReceipt(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block text-[10px]">Employee</span>
                  <span className="font-bold text-slate-800 text-sm">{viewReceipt.userName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Department & Role</span>
                  <span className="font-semibold text-slate-700 capitalize">{viewReceipt.userRole} &bull; {viewReceipt.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pay Period</span>
                  <span className="font-semibold text-slate-700">{viewReceipt.month}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Voucher Status</span>
                  <span className="font-bold text-amber-700 uppercase">{viewReceipt.status}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Base Salary</span>
                  <span className="font-medium text-slate-800">PKR {viewReceipt.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Performance Bonus</span>
                  <span className="font-medium text-slate-800">+PKR {viewReceipt.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Tax Deductions</span>
                  <span className="font-medium text-slate-800">-PKR {viewReceipt.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold border-t border-slate-200 pt-2">
                  <span className="text-slate-900">Total Net Disbursed</span>
                  <span className="text-amber-700">PKR {viewReceipt.netSalary.toLocaleString()}</span>
                </div>
              </div>

              {viewReceipt.paymentMethod && (
                <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900 font-mono">
                  Disbursed via {viewReceipt.paymentMethod} &bull; Ref: {viewReceipt.transactionReference} &bull; {viewReceipt.paidDate}
                </div>
              )}

              <div className="pt-3 flex items-center justify-between border-t border-slate-200">
                <span className="text-[10px] text-slate-400 font-mono">
                  Doc ID: {viewReceipt.id}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="btn-silver text-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                  <button
                    onClick={() => setViewReceipt(null)}
                    className="btn-gold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}