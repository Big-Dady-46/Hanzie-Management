'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Users, UserCheck, Plus, Check, X, ShieldAlert, 
  Mail, Phone, Calendar, DollarSign, Sparkles
} from 'lucide-react';
import { UserRole, User } from '@/lib/types';

export default function TeamView() {
  const { 
    users, 
    approveUser, 
    rejectUser, 
    signupUser, 
    currentUser 
  } = useApp();

  const isLeader = currentUser.role === 'leader';
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [approvingUser, setApprovingUser] = useState<User | null>(null);

  const [assignedRole, setAssignedRole] = useState<UserRole>('developer');
  const [assignedDept, setAssignedDept] = useState('Development');
  const [assignedSalary, setAssignedSalary] = useState(120000);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('developer');
  const [department, setDepartment] = useState('Development');
  const [salary, setSalary] = useState(130000);

  const pendingUsers = users.filter(u => u.status === 'pending_approval');
  const activeStaff = users.filter(u => u.status === 'active');

  const handleOpenApproval = (user: User) => {
    setApprovingUser(user);
    setAssignedRole(user.role);
    setAssignedDept(user.department);
    setAssignedSalary(user.role === 'support_cleaner' ? 45000 : 120000);
  };

  const handleConfirmApproval = () => {
    if (!approvingUser) return;
    approveUser(approvingUser.id, assignedRole, assignedDept, assignedSalary);
    setApprovingUser(null);
  };

  const handleDirectAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    signupUser({
      name,
      email,
      phone,
      role,
      department,
    });

    setTimeout(() => {
      const added = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (added) {
        approveUser(added.id, role, department, salary);
      }
    }, 200);

    setName('');
    setEmail('');
    setPhone('');
    setShowAddStaffModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Team & Staff Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Software house engineering, design, and operations personnel
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => setShowAddStaffModal(true)}
            className="btn-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* PENDING SIGNUPS APPROVALS (Frosted Gold Alert) */}
      {pendingUsers.length > 0 && (
        <div className="clean-card p-5 bg-amber-50/60 border-amber-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Pending Leader Approvals ({pendingUsers.length})
              </h3>
            </div>
            <span className="text-[11px] text-amber-800">Access Gate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingUsers.map((u) => (
              <div 
                key={u.id}
                className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded capitalize">
                      {u.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{u.email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenApproval(u)}
                    className="btn-gold text-xs py-1 px-3"
                  >
                    Confirm & Setup
                  </button>
                  <button
                    onClick={() => rejectUser(u.id)}
                    className="btn-silver text-xs py-1 px-2.5 text-slate-400 hover:text-slate-700"
                    title="Reject"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE STAFF DIRECTORY */}
      <div className="clean-card p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Active Personnel ({activeStaff.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-normal">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 pb-3">
                <th className="pb-3 pl-2 font-semibold uppercase tracking-wider text-[10px]">Name</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Department</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Role</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Contact</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Monthly Salary</th>
                <th className="pb-3 pr-2 text-right font-semibold uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="font-semibold text-slate-900 text-xs">{staff.name}</div>
                    <span className="text-[11px] text-slate-400">{staff.email}</span>
                  </td>
                  <td className="py-3.5 text-slate-600">{staff.department}</td>
                  <td className="py-3.5 capitalize font-medium text-slate-700">
                    {staff.role.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 font-mono text-slate-400 text-[11px]">{staff.phone || 'N/A'}</td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {staff.salary ? `PKR ${staff.salary.toLocaleString()}` : 'N/A'}
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                      {staff.workStatus.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leader Approval Modal */}
      {approvingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Approve Access for {approvingUser.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Set role, department, and base salary.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Assigned Role</label>
                <select
                  value={assignedRole}
                  onChange={(e) => setAssignedRole(e.target.value as UserRole)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="qa">QA Engineer</option>
                  <option value="support_cleaner">Office Staff / Cleaner</option>
                  <option value="client">Client</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Department</label>
                <input
                  type="text"
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Salary (PKR)</label>
                <input
                  type="number"
                  step="5000"
                  value={assignedSalary}
                  onChange={(e) => setAssignedSalary(Number(e.target.value))}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setApprovingUser(null)}
                  className="btn-silver"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  className="btn-gold"
                >
                  Confirm & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Onboard Staff Member</h3>
            <p className="text-xs text-slate-500 mb-4">Directly add a team member to Hanzei.</p>

            <form onSubmit={handleDirectAddStaff} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asad Qureshi"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="asad@hanzei.com"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  >
                    <option value="developer">Developer</option>
                    <option value="designer">UI/UX Designer</option>
                    <option value="qa">QA Engineer</option>
                    <option value="support_cleaner">Office Staff / Cleaner</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Monthly Salary (PKR)</label>
                <input
                  type="number"
                  step="5000"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="btn-silver"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold"
                >
                  Onboard Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
