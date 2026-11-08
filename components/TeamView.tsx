'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Users, Plus, Mail, Phone, Search, X } from 'lucide-react';
import { UserRole, User } from '@/lib/types';

const STATUS_CLASS: Record<string, string> = {
  working: 'status-working',
  on_break: 'status-break',
  offline: 'status-offline',
  on_leave: 'status-offline',
};

const DEPT_COLOR: Record<string, string> = {
  'Development': 'rgba(99,102,241,0.15)',
  'Design': 'rgba(236,72,153,0.12)',
  'Quality Assurance': 'rgba(14,165,233,0.12)',
  'Office & Maintenance': 'rgba(100,116,139,0.12)',
  'Leadership': 'rgba(212,175,55,0.15)',
};
const DEPT_TEXT: Record<string, string> = {
  'Development': '#a5b4fc',
  'Design': '#f9a8d4',
  'Quality Assurance': '#7dd3fc',
  'Office & Maintenance': '#94a3b8',
  'Leadership': '#f5c842',
};

export default function TeamView() {
  const { users, approveUser, rejectUser, signupUser, currentUser } = useApp();

  const isLeader = currentUser.role === 'leader';
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [approvingUser, setApprovingUser] = useState<User | null>(null);
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
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
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
    signupUser({ name, email, phone, role, department });
    setTimeout(() => {
      const added = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (added) approveUser(added.id, role, department, salary);
    }, 200);
    setName(''); setEmail(''); setPhone(''); setShowAddStaffModal(false);
  };

  const depts = ['ALL', 'Development', 'Design', 'Quality Assurance', 'Office & Maintenance'];

  return (
    <div className="space-y-5 fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Staff Directory</h2>
          <p className="text-xs text-slate-600 mt-0.5">{activeStaff.length} active members · Engineering, Design, QA & Ops</p>
        </div>
        <div className="flex items-center gap-2">
          {isLeader && (
            <button onClick={() => setShowAddStaffModal(true)} className="btn-gold text-xs py-1.5 px-4 gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Onboard Staff</span>
            </button>
          )}
        </div>
      </div>

      {/* Pending approvals */}
      {pendingUsers.length > 0 && (
        <div className="glass-card-gold p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {pendingUsers.length} Signup Awaiting Approval
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-200">{u.name}</span>
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider capitalize">
                      {u.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenApproval(u)} className="btn-gold text-xs py-1 px-3">Approve</button>
                  <button onClick={() => rejectUser(u.id)} className="btn-silver text-xs py-1 px-2.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter + Search */}
      <div className="glass-card p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {depts.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                departmentFilter === dept
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              {dept === 'ALL' ? 'All' : dept}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff..."
            className="dark-input w-full pl-9 pr-3 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStaff.map((staff) => {
          const isWorking = staff.workStatus === 'working';
          const isOnBreak = staff.workStatus === 'on_break';
          const deptBg = DEPT_COLOR[staff.department] || 'rgba(100,116,139,0.1)';
          const deptTxt = DEPT_TEXT[staff.department] || '#94a3b8';

          return (
            <div
              key={staff.id}
              className="glass-card-hover p-5 space-y-4 relative overflow-hidden"
            >
              {/* glow */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${deptTxt}60, transparent)` }}
              />

              {/* Avatar + status */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 text-black font-black text-base flex items-center justify-center shadow-md shadow-amber-500/15">
                    {staff.name.charAt(0)}
                  </div>
                  <span
                    className="w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 border-2"
                    style={{
                      borderColor: '#13161e',
                      background: isWorking ? '#4ade80' : isOnBreak ? '#f5c842' : '#475569',
                      boxShadow: isWorking ? '0 0 6px rgba(74,222,128,0.5)' : 'none',
                    }}
                  />
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-lg ${STATUS_CLASS[staff.workStatus] || 'status-offline'}`}>
                  {staff.workStatus.replace('_', ' ')}
                </span>
              </div>

              {/* Info */}
              <div>
                <h4 className="text-[14px] font-bold text-slate-200 tracking-tight">{staff.name}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full capitalize"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#f5c842', border: '1px solid rgba(212,175,55,0.2)' }}
                  >
                    {staff.role.replace('_', ' ')}
                  </span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: deptBg, color: deptTxt }}
                  >
                    {staff.department.split(' & ')[0]}
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div
                className="p-3 rounded-xl space-y-1.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-2 text-[11px] text-slate-600 truncate">
                  <Mail className="w-3 h-3 shrink-0 text-slate-700" />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <Phone className="w-3 h-3 shrink-0 text-slate-700" />
                  <span>{staff.phone || 'Internal Ext.'}</span>
                </div>
                {isLeader && (
                  <div className="flex items-center justify-between pt-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-[10px] text-slate-700">Salary:</span>
                    <span className="text-[11px] font-bold text-amber-400">
                      {staff.salary ? `PKR ${staff.salary.toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Approval Modal */}
      {approvingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card-gold p-6 max-w-md w-full">
            <h3 className="text-sm font-bold text-slate-100 mb-1">Approve: {approvingUser.name}</h3>
            <p className="text-xs text-slate-600 mb-4">Set role, department, and base salary.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Role</label>
                <select value={assignedRole} onChange={(e) => setAssignedRole(e.target.value as UserRole)} className="dark-input w-full">
                  <option value="developer">Developer</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="qa">QA Engineer</option>
                  <option value="support_cleaner">Office Staff</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Department</label>
                <input type="text" value={assignedDept} onChange={(e) => setAssignedDept(e.target.value)} className="dark-input w-full" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Monthly Salary (PKR)</label>
                <input type="number" step="5000" value={assignedSalary} onChange={(e) => setAssignedSalary(Number(e.target.value))} className="dark-input w-full font-bold" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setApprovingUser(null)} className="btn-silver text-xs py-2 px-4">Cancel</button>
                <button onClick={handleConfirmApproval} className="btn-gold text-xs py-2 px-4">Confirm & Activate</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card-gold p-6 max-w-md w-full">
            <h3 className="text-sm font-bold text-slate-100 mb-1">Onboard Staff Member</h3>
            <p className="text-xs text-slate-600 mb-4">Add directly to Hanzei workspace.</p>
            <form onSubmit={handleDirectAddStaff} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Full Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Asad Qureshi" className="dark-input w-full" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="asad@hanzei.com" className="dark-input w-full" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="dark-input w-full">
                    <option value="developer">Developer</option>
                    <option value="designer">UI/UX Designer</option>
                    <option value="qa">QA Engineer</option>
                    <option value="support_cleaner">Office Staff</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Department</label>
                  <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="dark-input w-full" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Monthly Salary (PKR)</label>
                <input type="number" step="5000" value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="dark-input w-full font-bold" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddStaffModal(false)} className="btn-silver text-xs py-2 px-4">Cancel</button>
                <button type="submit" className="btn-gold text-xs py-2 px-4">Onboard Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
