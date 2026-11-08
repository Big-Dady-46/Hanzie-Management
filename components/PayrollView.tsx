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

  // Payment form state
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              Software House Salary Transparency & Disbursement
            </span>
            <span className="text-xs text-slate-400">Office-wide Verified Ledger</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Salaries & Payroll Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Leader manages payments; entire office can view transparently who has received their pay for 100% trust.
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => generateMonthlyPayroll(selectedMonth)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate Run for {selectedMonth}</span>
          </button>
        )}
      </div>

      {/* Month Filter & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Cycle Budget
            </span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-indigo-600"
            >
              <option value="November 2026">November 2026</option>
              <option value="October 2026">October 2026</option>
            </select>
          </div>
          <div className="text-2xl font-black text-slate-900">
            PKR {totalMonthlyOutflow.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{filteredPayroll.length} Active staff records</p>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Disbursed & Paid (Cleared)
          </span>
          <div className="text-2xl font-black text-emerald-800">
            PKR {totalPaidOutflow.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">
            {filteredPayroll.filter(p => p.status === 'paid').length} Staff paid successfully
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
            Pending Disbursement
          </span>
          <div className="text-2xl font-black text-amber-800">
            PKR {totalPendingOutflow.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-700 mt-1">
            {filteredPayroll.filter(p => p.status === 'pending').length} Awaiting leader release
          </p>
        </div>
      </div>

      {/* Office Transparency Salary Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Transparent Office Payroll Board ({selectedMonth})
            </h3>
            <p className="text-xs text-slate-500">
              Visible to all team members to confirm that company salaries have been officially cleared.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            Company Ledger
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Staff Member</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Base Pay</th>
                <th className="pb-3">Bonus</th>
                <th className="pb-3">Net Disbursed</th>
                <th className="pb-3">Disbursement Status</th>
                <th className="pb-3">Method & Date</th>
                <th className="pb-3 pr-2 text-right">Action / Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayroll.map((item) => {
                const isPaid = item.status === 'paid';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 pl-2">
                      <div className="font-extrabold text-slate-900">{item.userName}</div>
                      <span className="text-[10px] text-slate-400">{item.userRole}</span>
                    </td>
                    <td className="py-3.5 text-slate-600">{item.department}</td>
                    <td className="py-3.5 font-bold text-slate-800">
                      PKR {item.baseSalary.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-emerald-600 font-semibold">
                      +PKR {item.bonus.toLocaleString()}
                    </td>
                    <td className="py-3.5 font-black text-slate-900">
                      PKR {item.netSalary.toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                        isPaid 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
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
                        <span className="text-[11px] text-slate-400 italic">Processing</span>
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
                          Payslip
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

      {/* Mark Salary Paid Modal (Leader Action) */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Mark Salary as Paid for {showPayModal.userName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Confirming this records the payment in the transparent office ledger.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Employee:</span>
                <span className="font-bold text-slate-800">{showPayModal.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Designation:</span>
                <span className="font-semibold text-slate-700">{showPayModal.userRole}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Net Amount to Disburse:</span>
                <span className="text-emerald-600">PKR {showPayModal.netSalary.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
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
                  Transaction Reference / Receipt Note
                </label>
                <input
                  type="text"
                  value={transRef}
                  onChange={(e) => setTransRef(e.target.value)}
                  placeholder="e.g. HBL-FT-9941829 or Cash Voucher #12"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowPayModal(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPay}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Confirm Disbursement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Company Payslip Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl">
                  H
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Hanzei Technologies</h3>
                  <p className="text-[11px] text-slate-400">Official Monthly Salary Slip</p>
                </div>
              </div>
              <button onClick={() => setViewReceipt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Details */}
            <div className="py-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Employee</span>
                  <div className="font-extrabold text-slate-900">{viewReceipt.userName}</div>
                  <div className="text-slate-500">{viewReceipt.userRole}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pay Period</span>
                  <div className="font-extrabold text-slate-900">{viewReceipt.month}</div>
                  <div className="text-emerald-700 font-bold uppercase">{viewReceipt.status}</div>
                </div>
              </div>

              <div className="space-y-2 border-b border-slate-200 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Basic Monthly Salary:</span>
                  <span className="font-bold text-slate-800">PKR {viewReceipt.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Performance Bonus:</span>
                  <span className="font-bold text-emerald-600">+PKR {viewReceipt.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax / Deductions:</span>
                  <span className="font-bold text-slate-400">-PKR {viewReceipt.deductions.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-1">
                <span>Net Take-Home Salary:</span>
                <span className="text-emerald-600">PKR {viewReceipt.netSalary.toLocaleString()}</span>
              </div>

              {viewReceipt.paidDate && (
                <div className="text-[11px] text-slate-400 bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-100">
                  Cleared via <strong>{viewReceipt.paymentMethod}</strong> on <strong>{viewReceipt.paidDate}</strong>. Ref: {viewReceipt.transactionReference}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => setViewReceipt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
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

