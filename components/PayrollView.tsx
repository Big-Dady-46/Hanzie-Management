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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Salaries & Office Payroll
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent salary disbursements visible to the entire software house
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => generateMonthlyPayroll(selectedMonth)}
            className="btn-secondary"
          >
            <span>Run Payroll ({selectedMonth})</span>
          </button>
        )}
      </div>

      {/* 3 Metric Cards (Unified Clean 2-Color Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="clean-card p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Cycle Budget</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 text-blue-600 focus:outline-none"
              >
                <option value="November 2026">Nov 2026</option>
                <option value="October 2026">Oct 2026</option>
              </select>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              PKR {totalMonthlyOutflow.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">{filteredPayroll.length} Active team members</p>
          </div>
          <div className="icon-badge">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="clean-card p-6 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Disbursed & Cleared</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              PKR {totalPaidOutflow.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="font-semibold text-blue-600">
                {filteredPayroll.filter(p => p.status === 'paid').length}
              </span> of {filteredPayroll.length} staff verified paid
            </p>
          </div>
          <div className="icon-badge">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="clean-card p-6 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Pending Release</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              PKR {totalPendingOutflow.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {filteredPayroll.filter(p => p.status === 'pending').length} Awaiting leader release
            </p>
          </div>
          <div className="icon-badge-slate">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Transparent Ledger Table */}
      <div className="clean-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Office Salary Ledger ({selectedMonth})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Verified company salary clearances</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            Transparent Records
          </span>
        </div>

        <div className="overflow-x-auto">
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
                      <div className="font-semibold text-slate-900 text-xs">{item.userName}</div>
                      <span className="text-[11px] text-slate-400 capitalize">{item.userRole.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3.5 text-slate-600">{item.department}</td>
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
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${
                        isPaid 
                          ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-blue-600' : 'bg-slate-400'}`} />
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
                            className="btn-primary text-xs py-1 px-2.5"
                          >
                            Mark as Paid
                          </button>
                        )}
                        <button
                          onClick={() => setViewReceipt(item)}
                          className="btn-light text-xs py-1 px-2.5"
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
                  className="btn-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPay}
                  className="btn-primary"
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
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
                  <span className="font-bold text-blue-600 uppercase">{viewReceipt.status}</span>
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
                  <span className="text-blue-700">PKR {viewReceipt.netSalary.toLocaleString()}</span>
                </div>
              </div>

              {viewReceipt.paymentMethod && (
                <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 font-mono">
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
                    className="btn-light text-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                  <button
                    onClick={() => setViewReceipt(null)}
                    className="btn-primary text-xs"
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
