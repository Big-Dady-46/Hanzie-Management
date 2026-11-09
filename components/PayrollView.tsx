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
              Payroll & Compensation
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
              Verified Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent salary disbursements, employee vouchers, and verified pay slips
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
              className="btn-gold text-xs py-2 px-3.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Cycle</span>
            </button>
          </div>
        )}
      </div>

      {/* 3 Metric Cards with 2D Luxury Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Cycle Budget — Gold */}
        <div className="rounded-2xl p-5 flex flex-col justify-between h-32 transition-all"
          style={{
            background: 'linear-gradient(160deg, #fffdf5 0%, #fefce8 50%, #fef9c3 100%)',
            border: '1px solid #fcd34d',
            boxShadow: '0 3px 0 #d97706, 0 6px 20px rgba(217,119,6,0.10)',
          }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Total Cycle Outflow</span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-300 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-900 tracking-tight">
              PKR {totalMonthlyOutflow.toLocaleString()}
            </div>
            <p className="text-[11px] text-amber-700/70 mt-0.5">{filteredPayroll.length} active team members</p>
          </div>
        </div>

        {/* Card 2: Disbursed & Cleared — Emerald */}
        <div className="rounded-2xl p-5 flex flex-col justify-between h-32 transition-all"
          style={{
            background: 'linear-gradient(160deg, #f0fdf8 0%, #dcfce7 50%, #bbf7d0 100%)',
            border: '1px solid #6ee7b7',
            boxShadow: '0 3px 0 #059669, 0 6px 20px rgba(5,150,105,0.10)',
          }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Disbursed & Cleared</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 border border-emerald-300 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-800 tracking-tight">
              PKR {totalPaidOutflow.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-700/70 font-semibold mt-0.5">
              {disbursedPct}% verified cleared
            </p>
          </div>
        </div>

        {/* Card 3: Pending Release — Silver */}
        <div className="rounded-2xl p-5 flex flex-col justify-between h-32 transition-all"
          style={{
            background: 'linear-gradient(160deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
            border: '1px solid #cbd5e1',
            boxShadow: '0 3px 0 #94a3b8, 0 6px 20px rgba(100,116,139,0.08)',
          }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Pending Release</span>
            <div className="w-8 h-8 rounded-xl bg-slate-200/80 border border-slate-300 flex items-center justify-center">
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              PKR {totalPendingOutflow.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {payroll.filter(p => p.month === selectedMonth && p.status === 'pending').length} vouchers pending approval
            </p>
          </div>
        </div>
      </div>

      {/* Unified Transparent Ledger Panel */}
      <div className="clean-card overflow-hidden">
        {/* Top Bar: Dept Filter + Search */}
        <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['ALL', 'Development', 'Design', 'Office & Maintenance'].map((dept) => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  departmentFilter === dept
                    ? 'bg-amber-100/80 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {dept === 'ALL' ? 'All Staff' : dept}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="p-4 sm:p-5 overflow-x-auto">
          <table className="w-full text-left text-xs font-normal">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 pb-2.5">
                <th className="pb-2.5 pl-2 font-semibold uppercase tracking-wider text-[10px]">Staff Member</th>
                <th className="pb-2.5 font-semibold uppercase tracking-wider text-[10px]">Department</th>
                <th className="pb-2.5 font-semibold uppercase tracking-wider text-[10px]">Net Pay</th>
                <th className="pb-2.5 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="pb-2.5 font-semibold uppercase tracking-wider text-[10px]">Disbursement</th>
                <th className="pb-2.5 pr-2 text-right font-semibold uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayroll.map((item) => {
                const isPaid = item.status === 'paid';
                return (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                    {/* Staff Member */}
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/20 shadow-2xs">
                          {item.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{item.userName}</div>
                          <span className="text-[10px] text-slate-400 capitalize">{item.userRole.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 text-slate-600 font-medium">
                      <span className="text-xs bg-slate-100/80 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {item.department}
                      </span>
                    </td>

                    {/* Net Pay with Base / Bonus hint */}
                    <td className="py-3">
                      <div className="font-black text-slate-900 text-xs">
                        PKR {item.netSalary.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Base: {(item.baseSalary / 1000).toFixed(0)}K {item.bonus > 0 ? `• +${(item.bonus / 1000).toFixed(0)}K bonus` : ''}
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                        isPaid 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        {isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </td>

                    {/* Disbursement Info */}
                    <td className="py-3 text-slate-500">
                      {isPaid ? (
                        <div>
                          <span className="font-semibold text-slate-800 text-xs">{item.paymentMethod}</span>
                          <span className="text-[10px] text-slate-400 block">{item.paidDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Awaiting clearance</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isLeader && !isPaid && (
                          <button
                            onClick={() => setShowPayModal(item)}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-[11px] py-1 px-3 rounded-lg shadow-2xs transition-all"
                          >
                            Pay
                          </button>
                        )}
                        <button
                          onClick={() => setViewReceipt(item)}
                          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-semibold text-[11px] py-1 px-2.5 rounded-lg transition-all"
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
                <CustomDropdown
                  fullWidth
                  value={paymentMethod}
                  onChange={(val) => setPaymentMethod(val as any)}
                  options={[
                    { value: 'Bank Transfer', label: 'Bank Transfer (Meezan / HBL / Alfalah)' },
                    { value: 'JazzCash', label: 'JazzCash Mobile Wallet' },
                    { value: 'Easypaisa', label: 'Easypaisa Mobile Wallet' },
                    { value: 'Cash', label: 'Cash (Handed directly)' },
                    { value: 'Wise', label: 'Wise / Remittance' },
                  ]}
                />
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

      {/* Official Executive Salary Slip Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 printable-slip-overlay">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 printable-slip relative overflow-hidden">
            {/* Top Amber Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 no-print" />

            {/* Official Letterhead */}
            <div className="flex items-start justify-between pb-5 border-b border-slate-200">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-amber-500/20 shrink-0">
                  H
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                    HANZEI TECHNOLOGIES (PVT) LTD
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Software House & Digital Product Engineering
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    NTN: 8941028-4 • Reg: SECP-0192841 • Lahore, Pakistan
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  Pay Slip Voucher
                </span>
                <span className="block text-xs font-mono font-bold text-slate-700 mt-1">
                  #{viewReceipt.id.toUpperCase()}
                </span>
                <button
                  onClick={() => setViewReceipt(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 no-print mt-1 inline-block"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              {/* Employee & Pay Period Details */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Staff Member</span>
                  <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{viewReceipt.userName}</span>
                  <span className="text-[11px] text-slate-500 capitalize">{viewReceipt.userRole.replace('_', ' ')} &bull; {viewReceipt.department}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Payroll Period</span>
                  <span className="font-extrabold text-amber-800 text-sm block mt-0.5">{viewReceipt.month}</span>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                    viewReceipt.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {viewReceipt.status === 'paid' ? 'DISBURSED ✓' : 'PENDING'}
                  </span>
                </div>
              </div>

              {/* Earnings & Deductions Breakdown Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-right">Type</th>
                      <th className="py-2.5 px-3 text-right">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2 px-3 font-medium">Basic Contract Salary</td>
                      <td className="py-2 px-3 text-right text-slate-400 text-[11px]">Earning</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">
                        PKR {viewReceipt.baseSalary.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Sprint Performance Bonus</td>
                      <td className="py-2 px-3 text-right text-emerald-600 text-[11px]">Incentive</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">
                        +PKR {viewReceipt.bonus.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Tax & Compliance Withholding</td>
                      <td className="py-2 px-3 text-right text-slate-400 text-[11px]">Deduction</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-600">
                        -PKR {(viewReceipt.deductions || 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net Disbursed Highlight Card */}
              <div 
                className="p-4 rounded-2xl flex items-center justify-between"
                style={{
                  background: 'linear-gradient(145deg, #fffdf5 0%, #fefce8 60%, #fef9c3 100%)',
                  border: '1.5px solid #fcd34d',
                  boxShadow: '0 2px 0 #d97706, 0 4px 12px rgba(217,119,6,0.12)',
                }}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800 block">
                    Total Net Salary Disbursed
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight mt-0.5">
                    PKR {viewReceipt.netSalary.toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="border-2 border-emerald-600 text-emerald-700 font-black text-[11px] px-3 py-1 rounded-lg uppercase tracking-wider inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>AUDITED & CLEARED</span>
                  </div>
                </div>
              </div>

              {/* Payment Method & Reference */}
              {viewReceipt.paymentMethod && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-2">
                  <span>Channel: <strong className="text-slate-800">{viewReceipt.paymentMethod}</strong></span>
                  <span>Ref: <strong className="text-slate-800 font-mono">{viewReceipt.transactionReference || 'TXN-DIRECT'}</strong></span>
                  <span>Date: <strong className="text-slate-800">{viewReceipt.paidDate || 'Cleared'}</strong></span>
                </div>
              )}

              {/* Signatures & Seal */}
              <div className="pt-4 flex items-end justify-between border-t border-slate-200 text-[11px] text-slate-400">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-300 pb-1 mb-1 font-semibold text-slate-700">
                    {viewReceipt.userName}
                  </div>
                  <span>Employee Signature</span>
                </div>

                <div className="text-center">
                  <div className="w-36 border-b border-slate-300 pb-1 mb-1 font-semibold text-slate-700">
                    Abdul Hannan
                  </div>
                  <span>Authorized Finance Director</span>
                </div>
              </div>

              {/* Modal Buttons (Hidden in print) */}
              <div className="pt-2 flex items-center justify-end gap-2.5 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-gold text-xs py-2 px-4 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewReceipt(null)}
                  className="btn-silver text-xs py-2 px-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}