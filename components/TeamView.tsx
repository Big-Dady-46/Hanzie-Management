'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Users, UserCheck, Plus, Check, X, ShieldAlert, 
  Mail, Phone, Calendar, DollarSign, Sparkles, Search,
  LayoutGrid, List, Briefcase, UserCog, ShieldCheck
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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
    const matchesDept = departmentFilter === 'ALL' || u.department === departmentFilter;
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Software House Team & Personnel Directory
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
              {activeStaff.length} Members Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Engineering, UI/UX design, QA testing, and operations personnel roster
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table Directory View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {isLeader && (
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="btn-gold"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard Staff</span>
            </button>
          )}
        </div>
      </div>

      {/* PENDING SIGNUPS APPROVALS (Frosted Gold Alert Banner) */}
      {pendingUsers.length > 0 && (
        <div className="clean-card p-5 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70 border-amber-300 shadow-soft">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Registration Gate: {pendingUsers.length} User Signup Awaiting Confirmation
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-200">
              Leader Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingUsers.map((u) => (
              <div 
                key={u.id}
                className="bg-white border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded capitalize">
                      {u.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{u.email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenApproval(u)}
                    className="btn-gold text-xs py-1.5 px-3"
                  >
                    Confirm & Setup
                  </button>
                  <button
                    onClick={() => rejectUser(u.id)}
                    className="btn-silver text-xs py-1.5 px-2.5 text-slate-400 hover:text-rose-600"
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

      {/* Filter and Search Bar */}
      <div className="clean-card p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'Development', 'Design', 'Quality Assurance', 'Office & Maintenance'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                departmentFilter === dept
                  ? 'bg-amber-50 text-amber-950 font-bold border border-amber-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {dept === 'ALL' ? 'All Personnel' : dept}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff by name..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>
      </div>

      {/* VIEW MODE 1: CREATIVE GRID PROFILE CARDS */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredStaff.map((staff) => {
            const isWorking = staff.workStatus === 'working';
            const isOnBreak = staff.workStatus === 'on_break';

            return (
              <div
                key={staff.id}
                className="clean-card p-5 space-y-4 hover:border-amber-300 hover:shadow-soft transition-all relative overflow-hidden group"
              >
                {/* Top Role Highlight Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-slate-200" />

                {/* Profile Header */}
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-300 font-black text-base flex items-center justify-center shadow-xs border border-amber-500/30 group-hover:scale-105 transition-transform">
                      {staff.name.charAt(0)}
                    </div>
                    <span className={`w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-white ${
                      isWorking ? 'bg-amber-500 animate-pulse' : isOnBreak ? 'bg-amber-400' : 'bg-slate-300'
                    }`} />
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    isWorking 
                      ? 'bg-amber-50 text-amber-950 border border-amber-300' 
                      : isOnBreak 
                      ? 'bg-amber-100/60 text-amber-900 border border-amber-200' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {staff.workStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Info */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                    {staff.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded capitalize block w-fit mt-1">
                    {staff.role.replace('_', ' ')}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">{staff.department}</p>
                </div>

                {/* Contact Pill Details */}
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200/60">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{staff.phone || 'Internal Extension'}</span>
                  </div>
                  {isLeader && (
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/50">
                      <span className="text-slate-400 font-medium">Base Salary:</span>
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
      )}

      {/* VIEW MODE 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="clean-card p-6 overflow-x-auto">
          <table className="w-full text-left text-xs font-normal">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 pb-3">
                <th className="pb-3 pl-2 font-semibold uppercase tracking-wider text-[10px]">Name</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Department</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Role</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Contact Email</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Monthly Salary</th>
                <th className="pb-3 pr-2 text-right font-semibold uppercase tracking-wider text-[10px]">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="font-bold text-slate-900 text-xs">{staff.name}</div>
                    <span className="text-[11px] text-slate-400">{staff.email}</span>
                  </td>
                  <td className="py-3.5 text-slate-600 font-medium">{staff.department}</td>
                  <td className="py-3.5 capitalize font-medium text-slate-700">
                    {staff.role.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 font-mono text-slate-400 text-[11px]">{staff.email}</td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {staff.salary ? `PKR ${staff.salary.toLocaleString()}` : 'N/A'}
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                      {staff.workStatus.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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