'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Users, UserCheck, Plus, Check, X, ShieldAlert, 
  Mail, Phone, Calendar, DollarSign, Sparkles, Building
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

  // Approval form state
  const [assignedRole, setAssignedRole] = useState<UserRole>('developer');
  const [assignedDept, setAssignedDept] = useState('Development');
  const [assignedSalary, setAssignedSalary] = useState(120000);

  // Direct add staff form state
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

    // Auto-approve since Leader is directly adding them
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Human Resources & Software House Staff
            </span>
            <span className="text-xs text-slate-400">Personnel Directory & Signups Approval</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Staff Directory & Access Control
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review new applicant registrations, assign salaries & departments, and oversee cleaners and technical team.
          </p>
        </div>

        {isLeader && (
          <button
            onClick={() => setShowAddStaffModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-md shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {/* PENDING SIGNUPS APPROVAL SECTION (Requested by User) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Pending Leader Approvals ({pendingUsers.length})
              </h3>
              <p className="text-xs text-slate-500">
                Newly registered users cannot enter the app until you confirm their role and grant access.
              </p>
            </div>
          </div>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
            No registrations pending approval. All users are verified.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingUsers.map((u) => (
              <div 
                key={u.id}
                className="bg-amber-50/50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded capitalize">
                      {u.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Phone: {u.phone || 'N/A'} • Applied: {u.joinedDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenApproval(u)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm & Setup</span>
                  </button>
                  <button
                    onClick={() => rejectUser(u.id)}
                    className="flex items-center gap-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all"
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
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Active Software House Personnel ({activeStaff.length})
            </h3>
            <p className="text-xs text-slate-500">Developers, Designers, QA, Cleaners & Clients</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Name</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Base Salary</th>
                <th className="pb-3 pr-2">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 pl-2">
                    <div className="font-extrabold text-slate-900">{staff.name}</div>
                    <span className="text-[10px] text-slate-400">{staff.email}</span>
                  </td>
                  <td className="py-3.5 text-slate-700 font-semibold">{staff.department}</td>
                  <td className="py-3.5">
                    <span className="capitalize text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                      {staff.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-500">{staff.phone || 'N/A'}</td>
                  <td className="py-3.5 font-bold text-slate-800">
                    {staff.salary ? `PKR ${staff.salary.toLocaleString()}` : 'N/A'}
                  </td>
                  <td className="py-3.5 pr-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize flex items-center gap-1 w-fit ${
                      staff.workStatus === 'working' ? 'bg-emerald-100 text-emerald-800' :
                      staff.workStatus === 'on_break' ? 'bg-amber-100 text-amber-800' :
                      staff.workStatus === 'on_leave' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        staff.workStatus === 'working' ? 'bg-emerald-500 animate-pulse' :
                        staff.workStatus === 'on_break' ? 'bg-amber-500' :
                        staff.workStatus === 'on_leave' ? 'bg-purple-500' : 'bg-slate-400'
                      }`} />
                      {staff.workStatus.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leader Approval & Configuration Modal */}
      {approvingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Approve Access for {approvingUser.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Set their verified department, role, and official salary.
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Role</label>
                <select
                  value={assignedRole}
                  onChange={(e) => {
                    const r = e.target.value as UserRole;
                    setAssignedRole(r);
                    if (r === 'support_cleaner') {
                      setAssignedDept('Office & Maintenance');
                      setAssignedSalary(45000);
                    } else if (r === 'designer') {
                      setAssignedDept('Design');
                    } else if (r === 'client') {
                      setAssignedDept('Clients');
                    } else {
                      setAssignedDept('Development');
                    }
                  }}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                >
                  <option value="developer">Developer (Full-Stack / React / Node)</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="qa">QA Engineer</option>
                  <option value="support_cleaner">Office Staff / Cleaner / Maintenance</option>
                  <option value="client">Client</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Monthly Base Salary (PKR)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={assignedSalary}
                  onChange={(e) => setAssignedSalary(Number(e.target.value))}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setApprovingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Confirm & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leader Direct Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Add Staff Member</h3>
            <p className="text-xs text-slate-500 mb-4">
              Directly onboard staff without requiring self-signup.
            </p>

            <form onSubmit={handleDirectAddStaff} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email *</label>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone</label>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      const r = e.target.value as UserRole;
                      setRole(r);
                      if (r === 'support_cleaner') {
                        setDepartment('Office & Maintenance');
                        setSalary(45000);
                      } else if (r === 'designer') {
                        setDepartment('Design');
                        setSalary(140000);
                      } else {
                        setDepartment('Development');
                        setSalary(160000);
                      }
                    }}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  >
                    <option value="developer">Developer</option>
                    <option value="designer">UI/UX Designer</option>
                    <option value="qa">QA Engineer</option>
                    <option value="support_cleaner">Office Staff / Cleaner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Salary (PKR)</label>
                  <input
                    type="number"
                    step="5000"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Onboard Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

