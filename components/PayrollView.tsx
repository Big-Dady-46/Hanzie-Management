'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  DollarSign, CheckCircle2, Clock, Check, Sparkles, 
  CreditCard, FileText, Download, Building2, User, Printer, X
} from 'lucide-react';
import { PayrollRecord } from '@/lib/types';

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

  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'JazzCash' | 'Easypaisa' | 'Cash' | 'Wise'>('Bank Transfer');
  const [transRef, setTransRef] = useState('');

  const filteredPayroll = payroll.filter(p => p.month === selectedMonth);

  const totalMonthlyOutflow = filteredPayroll.reduce((acc, p) => acc + p.netSalary, 0);
  const totalPaidOutflow = filteredPayroll.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.netSalary, 0);
  const totalPendingOutflow = totalMonthlyOutflow - totalPaidOutflow;

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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
            Salaries & Office Payroll
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1 font-medium">
            Transparent salary disbursements visible to the entire software house
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => generateMonthlyPayroll(selectedMonth)}
            className="flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-2xl transition-all shadow-sm"
          >
            <span>Run Payroll ({selectedMonth})</span>
          </button>
        )}
      </div>

      {/* 3 Metric Cards with generous padding */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Cycle Budget</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold bg-[#f8fafc] border border-slate-200 rounded-lg px-2.5 py-1 text-blue-600"
            >
              <option value="November 2026">Nov 2026</option>
              <option value="October 2026">Oct 2026</option>
            </select>
          </div>
          <div className="text-3xl font-black text-[#0f172a] mt-3">
            PKR {totalMonthlyOutflow.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">{filteredPayroll.length} Active team members</p>
        </div>

        <div className="bg-[#eafaf2] rounded-3xl p-7 border border-[#d2f5e3]">
          <span className="text-xs font-semibold text-[#065f46] uppercase tracking-wider block">Disbursed & Cleared</span>
          <div className="text-3xl font-black text-[#065f46] mt-3">
            PKR {totalPaidOutflow.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-700 mt-1">
            {filteredPayroll.filter(p => p.status === 'paid').length} Staff verified paid
          </p>
        </div>

        <div className="bg-[#fff9ea] rounded-3xl p-7 border border-[#faeed0]">
          <span className="text-xs font-semibold text-[#92400e] uppercase tracking-wider block">Pending Release</span>
          <div className="text-3xl font-black text-[#92400e] mt-3">
            PKR {totalPendingOutflow.toLocaleString()}
          </div>
          <p className="text-xs text-amber-700 mt-1">
            {filteredPayroll.filter(p => p.status === 'pending').length} Awaiting leader release
          </p>
        </div>
      </div>

      {/* Transparent Ledger Table (Spacious & Clean) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-[#0f172a]">
              Transparent Office Salary Ledger ({selectedMonth})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Visible to all employees to confirm company salary clearances</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            Verified Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 pb-4">
                <th className="pb-4 pl-3 font-semibold uppercase tracking-wider text-[11px]">Staff Member</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Department</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Base Salary</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Bonus</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Net Pay</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-[11px]">Method & Date</th>
                <th className="pb-4 pr-3 text-right font-semibold uppercase tracking-wider text-[11px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayroll.map((item) => {
                const isPaid = item.status === 'paid';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-3">
                      <div className="font-bold text-[#0f172a] text-sm">{item.userName}</div>
                      <span className="text-xs text-[#94a3b8]">{item.userRole}</span>
                    </td>
                    <td className="py-4 text-slate-600">{item.department}</td>
                    <td className="py-4 font-bold text-slate-800">
                      PKR {item.baseSalary.toLocaleString()}
                    </td>
                    <td className="py-4 text-emerald-600 font-semibold">
                      +PKR {item.bonus.toLocaleString()}
                    </td>
                    <td className="py-4 font-extrabold text-[#0f172a] text-sm">
                      PKR {item.netSalary.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase inline-block ${
                        isPaid 
                          ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]' 
                          : 'bg-[#fff9ea] text-[#b45309] border border-[#fde68a]'
                      }`}>
                        {isPaid ? 'PAID ✓' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">
                      {isPaid ? (
                        <div>
                          <span className="font-semibold text-slate-700">{item.paymentMethod}</span>
                          <span className="text-[11px] text-slate-400 block font-mono">{item.paidDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Processing</span>
                      )}
                    </td>
                    <td className="py-4 pr-3 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {isLeader && !isPaid && (
                          <button
                            onClick={() => setShowPayModal(item)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-all whitespace-nowrap"
                          >
                            Mark as Paid
                          </button>
                        )}
                        <button
                          onClick={() => setViewReceipt(item)}
                          className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
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
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-[#0f172a] mb-1">
              Mark Salary Paid: {showPayModal.userName}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Confirming this records payment in the transparent office ledger.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                >
                  <option value="Bank Transfer">Bank Transfer (Meezan / HBL / Alfalah)</option>
                  <option value="JazzCash">JazzCash Mobile Wallet</option>
                  <option value="Easypaisa">Easypaisa Mobile Wallet</option>
                  <option value="Cash">Cash (Handed directly)</option>
                  <option value="Wise">Wise / International Remittance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Transaction Reference / Voucher Note
                </label>
                <input
                  type="text"
                  value={transRef}
                  onChange={(e) => setTransRef(e.target.value)}
                  placeholder="e.g. HBL-FT-9941829 or Cash Voucher #12"
                  className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowPayModal(null)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPay}
                  className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
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
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-sm">
                  H
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f172a]">Hanzei Technologies</h4>
                  <p className="text-xs text-slate-400">Official Monthly Salary Payslip</p>
                </div>
              </div>
              <button onClick={() => setViewReceipt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-100 flex justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Employee</span>
                  <div className="font-bold text-slate-800 text-sm">{viewReceipt.userName}</div>
                  <div className="text-slate-500 mt-0.5">{viewReceipt.userRole}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Month</span>
                  <div className="font-bold text-slate-800 text-sm">{viewReceipt.month}</div>
                  <div className="text-emerald-600 font-bold uppercase mt-0.5">{viewReceipt.status}</div>
                </div>
              </div>

              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Basic Monthly Pay:</span>
                  <span className="font-bold text-slate-800">PKR {viewReceipt.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Performance Bonus:</span>
                  <span className="font-bold text-emerald-600">+PKR {viewReceipt.bonus.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-bold text-slate-900 pt-1">
                <span>Net Disbursed:</span>
                <span className="text-emerald-600">PKR {viewReceipt.netSalary.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-5">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700"
              >
                Print
              </button>
              <button
                onClick={() => setViewReceipt(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0f172a] text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
