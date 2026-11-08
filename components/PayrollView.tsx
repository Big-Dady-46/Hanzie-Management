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
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Salaries & Office Payroll
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent salary disbursements visible to the entire software house
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => generateMonthlyPayroll(selectedMonth)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            <span>Run Payroll ({selectedMonth})</span>
          </button>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Month Budget</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold bg-[#f8fafc] border border-slate-200/80 rounded-lg px-2 py-0.5 text-indigo-600"
            >
              <option value="November 2026">Nov 2026</option>
              <option value="October 2026">Oct 2026</option>
            </select>
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-2">
            PKR {totalMonthlyOutflow.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{filteredPayroll.length} Active team members</p>
        </div>

        <div className="bg-[#f0fbf6] rounded-2xl p-5 border border-[#cbf2de]">
          <span className="text-xs font-semibold text-emerald-800">Disbursed & Paid</span>
          <div className="text-2xl font-bold text-emerald-800 mt-2">
            PKR {totalPaidOutflow.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            {filteredPayroll.filter(p => p.status === 'paid').length} Staff verified paid
          </p>
        </div>

        <div className="bg-[#fffbf0] rounded-2xl p-5 border border-[#faeec7]">
          <span className="text-xs font-semibold text-amber-800">Pending Release</span>
          <div className="text-2xl font-bold text-amber-800 mt-2">
            PKR {totalPendingOutflow.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-700 mt-0.5">
            {filteredPayroll.filter(p => p.status === 'pending').length} Awaiting leader release
          </p>
        </div>
      </div>

      {/* Transparent Ledger Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-bold text-slate-800 mb-4">
          Transparent Office Salary Ledger ({selectedMonth})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 pb-3">
                <th className="pb-3 pl-2 font-semibold">Staff Member</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Base Salary</th>
                <th className="pb-3 font-semibold">Bonus</th>
                <th className="pb-3 font-semibold">Net Pay</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Method & Date</th>
                <th className="pb-3 pr-2 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayroll.map((item) => {
                const isPaid = item.status === 'paid';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 pl-2">
                      <div className="font-bold text-slate-800">{item.userName}</div>
                      <span className="text-[10px] text-slate-400">{item.userRole}</span>
                    </td>
                    <td className="py-3.5 text-slate-600">{item.department}</td>
                    <td className="py-3.5 font-bold text-slate-800">
                      PKR {item.baseSalary.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-emerald-600 font-semibold">
                      +PKR {item.bonus.toLocaleString()}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900">
                      PKR {item.netSalary.toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        isPaid 
                          ? 'bg-[#ecfdf5] text-[#047857]' 
                          : 'bg-[#fff9e6] text-[#b45309]'
                      }`}>
                        {isPaid ? 'PAID ✓' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500">
                      {isPaid ? (
                        <div>
                          <span className="font-semibold text-slate-700">{item.paymentMethod}</span>
                          <span className="text-[10px] text-slate-400 block">{item.paidDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isLeader && !isPaid && (
                          <button
                            onClick={() => setShowPayModal(item)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all whitespace-nowrap"
                          >
                            Mark as Paid
                          </button>
                        )}
                        <button
                          onClick={() => setViewReceipt(item)}
                          className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Mark Salary Paid: {showPayModal.userName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Disbursing PKR {showPayModal.netSalary.toLocaleString()}
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                >
                  <option value="Bank Transfer">Bank Transfer (Meezan / HBL)</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="Cash">Cash (Handed directly)</option>
                  <option value="Wise">Wise</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
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

              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={() => setShowPayModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPay}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
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
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  H
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Hanzei Technologies</h4>
                  <p className="text-[10px] text-slate-400">Official Salary Payslip</p>
                </div>
              </div>
              <button onClick={() => setViewReceipt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#f8fafc] p-3.5 rounded-xl border border-slate-100 flex justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Employee</span>
                  <div className="font-bold text-slate-800">{viewReceipt.userName}</div>
                  <div className="text-slate-500 text-[11px]">{viewReceipt.userRole}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Month</span>
                  <div className="font-bold text-slate-800">{viewReceipt.month}</div>
                  <div className="text-emerald-600 font-bold uppercase">{viewReceipt.status}</div>
                </div>
              </div>

              <div className="space-y-1.5 border-b border-slate-100 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Basic Pay:</span>
                  <span className="font-bold text-slate-800">PKR {viewReceipt.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bonus:</span>
                  <span className="font-bold text-emerald-600">+PKR {viewReceipt.bonus.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                <span>Net Disbursed:</span>
                <span className="text-emerald-600">PKR {viewReceipt.netSalary.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
              >
                Print
              </button>
              <button
                onClick={() => setViewReceipt(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white"
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
