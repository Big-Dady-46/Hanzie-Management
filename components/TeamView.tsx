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
    projects,
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
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Team & Staff Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Software house engineering, design, and office maintenance directory
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => setShowAddStaffModal(true)}
            className="btn-2d-dark px-4 py-2 text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* PENDING SIGNUPS APPROVALS (The core requirement requested by user) */}
      <div className="bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-sm font-bold text-slate-800">
              Pending Leader Approvals ({pendingUsers.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Confirmation Gate</span>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#f8fafc] text-center text-xs text-slate-400 font-medium">
            No registration requests pending review. All users are approved.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingUsers.map((u) => (
              <div 
                key={u.id}
                className="bg-[#fff9ea] border border-[#faeed0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{u.name}</h4>
                    <span className="text-[10px] font-bold bg-white text-amber-900 px-2 py-0.5 rounded capitalize">
                      {u.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenApproval(u)}
                    className="btn-2d-emerald px-3.5 py-1.5 text-xs"
                  >
                    Confirm & Setup
                  </button>
                  <button
                    onClick={() => rejectUser(u.id)}
                    className="btn-2d-rose px-2.5 py-1.5 text-xs"
                    title="Reject"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE STAFF DIRECTORY */}
      <div className="bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-bold text-slate-800 mb-4">
          Active Personnel Directory ({activeStaff.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 pb-3">
                <th className="pb-3 pl-2">Name</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Monthly Salary</th>
                <th className="pb-3 pr-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 pl-2">
                    <div className="font-bold text-slate-800">{staff.name}</div>
                    <span className="text-[10px] text-slate-400">{staff.email}</span>
                  </td>
                  <td className="py-3.5 text-slate-600">{staff.department}</td>
                  <td className="py-3.5 capitalize font-semibold text-slate-700">
                    {staff.role.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 font-mono text-slate-500 text-[11px]">{staff.phone || 'N/A'}</td>
                  <td className="py-3.5 font-bold text-slate-800">
                    {staff.salary ? `PKR ${staff.salary.toLocaleString()}` : 'N/A'}
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                      staff.workStatus === 'working' ? 'bg-[#ecfdf5] text-[#059669]' :
                      staff.workStatus === 'on_break' ? 'bg-[#fffbeb] text-[#b45309]' :
                      staff.workStatus === 'on_leave' ? 'bg-[#f3eefd] text-[#7c4dff]' :
                      'bg-slate-100 text-slate-500'
                    }`}>
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Approve Access for {approvingUser.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">Set department and base salary.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Assigned Role</label>
                <select
                  value={assignedRole}
                  onChange={(e) => setAssignedRole(e.target.value as UserRole)}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
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

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  onClick={() => setApprovingUser(null)}
                  className="btn-2d-light px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  className="btn-2d-emerald px-4 py-2 text-xs"
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Onboard Staff Member</h3>
            <p className="text-xs text-slate-400 mb-4">Directly add a team member to Hanzei.</p>

            <form onSubmit={handleDirectAddStaff} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asad Ullah"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="asad@hanzei.com"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  >
                    <option value="developer">Developer</option>
                    <option value="designer">UI/UX Designer</option>
                    <option value="qa">QA Engineer</option>
                    <option value="support_cleaner">Office Staff / Cleaner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Salary (PKR)</label>
                  <input
                    type="number"
                    step="5000"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="btn-2d-light px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-2d-primary px-5 py-2 text-xs"
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
