'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Plus, Mail, Phone, X
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
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

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
  const activeStaff = users.filter(u => u.status === 'active' && u.role !== 'client');

  const filteredStaff = activeStaff.filter(u => {
    return departmentFilter === 'ALL' || u.department === departmentFilter;
  });

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Staff Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Software house developers, designers, and operations team
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Departments ({activeStaff.length})</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Quality Assurance">QA</option>
            <option value="Office & Maintenance">Office Caretakers</option>
          </select>

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
      </div>

      {/* Pending Approval Banner (Clean & Subtle) */}
      {pendingUsers.length > 0 && (
        <div className="clean-card p-5 bg-amber-50/70 border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Pending Leader Approvals ({pendingUsers.length})
            </h3>
            <span className="text-xs text-amber-800">New Sign-Up</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingUsers.map((u) => (
              <div 
                key={u.id}
                className="bg-white border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                  <p className="text-xs text-slate-400 capitalize">{u.role.replace('_', ' ')} &bull; {u.email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenApproval(u)}
                    className="btn-gold text-xs py-1 px-3"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectUser(u.id)}
                    className="btn-silver text-xs py-1 px-2.5 text-slate-400 hover:text-rose-600"
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

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredStaff.map((staff) => {
          const isWorking = staff.workStatus === 'working';
          const isOnBreak = staff.workStatus === 'on_break';

          return (
            <div
              key={staff.id}
              className="clean-card p-5 space-y-4 hover:border-amber-300 transition-colors"
            >
              {/* Profile Head */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-300 font-bold text-sm flex items-center justify-center border border-amber-500/30">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{staff.name}</h4>
                    <p className="text-xs text-slate-400 capitalize">{staff.role.replace('_', ' ')}</p>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                  isWorking 
                    ? 'bg-amber-50 text-amber-950 border border-amber-300' 
                    : isOnBreak 
                    ? 'bg-amber-100/60 text-amber-900' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {staff.workStatus.replace('_', ' ')}
                </span>
              </div>

              {/* Department & Contact */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200/60">
                <div className="flex justify-between text-slate-500">
                  <span>Department:</span>
                  <span className="font-semibold text-slate-700">{staff.department}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Contact:</span>
                  <span className="text-slate-700 truncate max-w-[140px]">{staff.email}</span>
                </div>
                {isLeader && (
                  <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200">
                    <span>Salary:</span>
                    <span className="font-bold text-slate-900">
                      {staff.salary ? `PKR ${staff.salary.toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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