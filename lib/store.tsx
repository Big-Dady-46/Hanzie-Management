'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, Project, Task, AttendanceRecord, EODReport, PayrollRecord, LeaveRequest, 
  UserRole, WorkStatus, TaskStatus 
} from './types';
import { 
  INITIAL_USERS, INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_ATTENDANCE, 
  INITIAL_EOD_REPORTS, INITIAL_PAYROLL, INITIAL_LEAVES 
} from './mock-data';
import { supabase, isSupabaseConfigured } from './supabase';

interface AppContextType {
  // Current user & Auth
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;
  signupUser: (userData: { name: string; email: string; role: UserRole; department: string; phone?: string }) => { success: boolean; message: string };
  approveUser: (userId: string, role: UserRole, department: string, salary: number, assignedProjectIds?: string[]) => void;
  rejectUser: (userId: string) => void;
  
  // Data lists
  users: User[];
  projects: Project[];
  tasks: Task[];
  attendance: AttendanceRecord[];
  eodReports: EODReport[];
  payroll: PayrollRecord[];
  leaves: LeaveRequest[];
  
  // Attendance actions
  todayAttendance: AttendanceRecord | null;
  clockIn: () => void;
  startBreak: () => void;
  resumeWork: () => void;
  clockOutWithReport: (reportData: { tasksCompleted: string; blockers?: string; hoursWorked: number; planForTomorrow: string; rating: number }) => void;
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedAt' | 'userId' | 'userName' | 'department'>) => void;
  reviewLeave: (leaveId: string, status: 'approved' | 'rejected') => void;

  // Projects actions
  addProject: (project: Omit<Project, 'id' | 'paidAmount' | 'status' | 'progressPercentage' | 'milestones'>) => void;
  updateProjectProgress: (projectId: string, progress: number) => void;
  recordProjectPayment: (projectId: string, amount: number) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;

  // Tasks actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'progressPercent' | 'timeSpentHours'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskProgress: (taskId: string, progress: number, hours?: number) => void;

  // Payroll actions
  markSalaryPaid: (payrollId: string, paymentMethod: 'Bank Transfer' | 'JazzCash' | 'Easypaisa' | 'Cash' | 'Wise', reference: string) => void;
  generateMonthlyPayroll: (month: string) => void;

  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isEODModalOpen: boolean;
  setIsEODModalOpen: (open: boolean) => void;
  isDbModalOpen: boolean;
  setIsDbModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notificationMessage: string | null;
  setNotificationMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'hanzei_v2_clean_';

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Load state from localStorage or fallback to Mock data
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_user_id`);
      if (savedId) {
        const found = INITIAL_USERS.find(u => u.id === savedId);
        if (found) return found;
      }
    }
    // Default to the Software House Leader (CEO)
    return INITIAL_USERS[0];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}projects`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}tasks`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_TASKS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}attendance`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_ATTENDANCE;
  });

  const [eodReports, setEodReports] = useState<EODReport[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}eod_reports`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_EOD_REPORTS;
  });

  const [payroll, setPayroll] = useState<PayrollRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}payroll`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_PAYROLL;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}leaves`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_LEAVES;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isEODModalOpen, setIsEODModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}attendance`, JSON.stringify(attendance));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}eod_reports`, JSON.stringify(eodReports));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}payroll`, JSON.stringify(payroll));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}leaves`, JSON.stringify(leaves));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}current_user_id`, currentUser.id);
    }
  }, [users, projects, tasks, attendance, eodReports, payroll, leaves, currentUser]);

  // Realtime Supabase listeners if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('hanzei_realtime_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        // Sync incoming users
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, (payload) => {
        // Sync incoming attendance
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'eod_reports' }, (payload) => {
        // Sync incoming reports
      })
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const showNotification = useCallback((msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4500);
  }, []);

  // Today's attendance for current logged in user
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find(
    a => a.userId === currentUser.id && a.date === todayStr
  ) || null;

  // Switch user role instantly (for demonstration / testing)
  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      if (target.role === 'client') {
        setActiveTab('client_portal');
      } else {
        setActiveTab('dashboard');
      }
      showNotification(`Switched active view to ${target.name} (${target.role.toUpperCase()})`);
    }
  };

  // Sign up a new user (enters pending_approval)
  const signupUser = (userData: { name: string; email: string; role: UserRole; department: string; phone?: string }) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'This email is already registered.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department as any,
      phone: userData.phone || '',
      status: 'pending_approval',
      workStatus: 'offline',
      joinedDate: todayStr,
      salary: 0,
    };

    setUsers(prev => [newUser, ...prev]);
    showNotification(`New account registered for ${newUser.name}. Waiting for Leader confirmation.`);
    return { success: true, message: 'Your registration was submitted! Hanzei management will approve your access shortly.' };
  };

  // Leader approves pending user
  const approveUser = (userId: string, role: UserRole, department: string, salary: number, assignedProjectIds?: string[]) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: 'active',
          role,
          department: department as any,
          salary,
          assignedProjectIds: assignedProjectIds || [],
        };
      }
      return u;
    }));
    showNotification(`User approved and granted active access!`);
  };

  // Leader rejects pending user
  const rejectUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    showNotification(`User request rejected.`);
  };

  // Clock In
  const clockIn = () => {
    const timeNow = new Date().toTimeString().split(' ')[0];
    
    // Update or create today attendance
    if (todayAttendance) {
      setAttendance(prev => prev.map(a => {
        if (a.id === todayAttendance.id) {
          return {
            ...a,
            status: 'working',
            clockInTime: a.clockInTime || timeNow,
          };
        }
        return a;
      }));
    } else {
      const newRecord: AttendanceRecord = {
        id: `att_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        department: currentUser.department,
        date: todayStr,
        clockInTime: timeNow,
        totalWorkMinutes: 0,
        totalBreakMinutes: 0,
        status: 'working',
        breaks: [],
      };
      setAttendance(prev => [newRecord, ...prev]);
    }

    // Update user work status
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, workStatus: 'working' } : u));
    setCurrentUser(prev => ({ ...prev, workStatus: 'working' }));
    showNotification(`Hazari Marked! Clocked in at ${timeNow}. Work timer is running.`);
  };

  // Start Break
  const startBreak = () => {
    const timeNow = new Date().toTimeString().split(' ')[0];

    if (todayAttendance) {
      setAttendance(prev => prev.map(a => {
        if (a.id === todayAttendance.id) {
          return {
            ...a,
            status: 'on_break',
            breaks: [...a.breaks, { start: timeNow }]
          };
        }
        return a;
      }));
    }

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, workStatus: 'on_break' } : u));
    setCurrentUser(prev => ({ ...prev, workStatus: 'on_break' }));
    showNotification(`Break started at ${timeNow}. Have a good recharge!`);
  };

  // Resume Work from Break
  const resumeWork = () => {
    const timeNow = new Date().toTimeString().split(' ')[0];

    if (todayAttendance) {
      setAttendance(prev => prev.map(a => {
        if (a.id === todayAttendance.id) {
          const updatedBreaks = a.breaks.map((b, idx) => {
            if (idx === a.breaks.length - 1 && !b.end) {
              return { ...b, end: timeNow, durationMinutes: 15 };
            }
            return b;
          });
          return {
            ...a,
            status: 'working',
            breaks: updatedBreaks,
            totalBreakMinutes: a.totalBreakMinutes + 15
          };
        }
        return a;
      }));
    }

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, workStatus: 'working' } : u));
    setCurrentUser(prev => ({ ...prev, workStatus: 'working' }));
    showNotification(`Welcome back! Work resumed at ${timeNow}.`);
  };

  // Clock Out with MANDATORY EOD Report
  const clockOutWithReport = (reportData: { 
    tasksCompleted: string; 
    blockers?: string; 
    hoursWorked: number; 
    planForTomorrow: string; 
    rating: number; 
  }) => {
    const timeNow = new Date().toTimeString().split(' ')[0];
    const reportId = `eod_${Date.now()}`;

    const newReport: EODReport = {
      id: reportId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      date: todayStr,
      timestamp: timeNow,
      tasksCompleted: reportData.tasksCompleted,
      blockers: reportData.blockers || 'None reported.',
      hoursWorked: reportData.hoursWorked,
      planForTomorrow: reportData.planForTomorrow,
      rating: reportData.rating,
    };

    setEodReports(prev => [newReport, ...prev]);

    // Update attendance record with clock-out time and report
    if (todayAttendance) {
      setAttendance(prev => prev.map(a => {
        if (a.id === todayAttendance.id) {
          return {
            ...a,
            status: 'offline',
            clockOutTime: timeNow,
            totalWorkMinutes: Math.round(reportData.hoursWorked * 60),
            eodReportId: reportId,
          };
        }
        return a;
      }));
    }

    // Update user status
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, workStatus: 'offline' } : u));
    setCurrentUser(prev => ({ ...prev, workStatus: 'offline' }));
    setIsEODModalOpen(false);
    showNotification(`Daily Work Report submitted successfully! Clocked out at ${timeNow}. Good job!`);
  };

  // Apply for leave / choti
  const applyLeave = (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'appliedAt' | 'userId' | 'userName' | 'department'>) => {
    const newLeave: LeaveRequest = {
      id: `lv_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      department: currentUser.department,
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      reason: leaveData.reason,
      status: 'pending',
      appliedAt: new Date().toLocaleString(),
    };
    setLeaves(prev => [newLeave, ...prev]);
    showNotification(`Leave application submitted. Waiting for leader review.`);
  };

  // Leader review leave
  const reviewLeave = (leaveId: string, status: 'approved' | 'rejected') => {
    setLeaves(prev => prev.map(l => {
      if (l.id === leaveId) {
        return {
          ...l,
          status,
          reviewedBy: currentUser.name
        };
      }
      return l;
    }));
    showNotification(`Leave application marked as ${status.toUpperCase()}.`);
  };

  // Add new project
  const addProject = (projectData: Omit<Project, 'id' | 'paidAmount' | 'status' | 'progressPercentage' | 'milestones'>) => {
    const newProject: Project = {
      ...projectData,
      id: `prj_${Date.now()}`,
      paidAmount: 0,
      status: 'planning',
      progressPercentage: 5,
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Discovery & Requirements Specification', completed: true, dueDate: projectData.startDate },
        { id: `m_${Date.now()}_2`, title: 'Core UI/UX & High-Fidelity Mockups', completed: false, dueDate: projectData.deadline },
        { id: `m_${Date.now()}_3`, title: 'Engineering, Backend & APIs', completed: false, dueDate: projectData.deadline },
        { id: `m_${Date.now()}_4`, title: 'QA Testing, Bug Fixes & Handover', completed: false, dueDate: projectData.deadline },
      ]
    };
    setProjects(prev => [newProject, ...prev]);
    showNotification(`New project "${newProject.name}" created!`);
  };

  // Update project progress
  const updateProjectProgress = (projectId: string, progress: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          progressPercentage: progress,
          status: progress >= 100 ? 'completed' : progress > 85 ? 'review' : 'in_progress',
        };
      }
      return p;
    }));
    showNotification(`Project progress updated to ${progress}%`);
  };

  // Record client payment
  const recordProjectPayment = (projectId: string, amount: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newPaid = Math.min(p.totalBudget, p.paidAmount + amount);
        return {
          ...p,
          paidAmount: newPaid,
        };
      }
      return p;
    }));
    showNotification(`Payment of PKR ${amount.toLocaleString()} recorded!`);
  };

  // Toggle milestone completion
  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updated = p.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
        const completedCount = updated.filter(m => m.completed).length;
        const autoProgress = Math.round((completedCount / updated.length) * 100);
        return {
          ...p,
          milestones: updated,
          progressPercentage: autoProgress,
        };
      }
      return p;
    }));
  };

  // Add task
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'progressPercent' | 'timeSpentHours'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk_${Date.now()}`,
      createdAt: todayStr,
      progressPercent: 0,
      timeSpentHours: 0,
    };
    setTasks(prev => [newTask, ...prev]);
    showNotification(`New task "${newTask.title}" assigned to ${newTask.assignedToName}!`);
  };

  // Update task status
  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          progressPercent: status === 'completed' ? 100 : t.progressPercent === 100 ? 50 : t.progressPercent,
        };
      }
      return t;
    }));
    showNotification(`Task status updated to ${status.toUpperCase()}`);
  };

  // Update task progress %
  const updateTaskProgress = (taskId: string, progress: number, hours?: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          progressPercent: progress,
          timeSpentHours: hours !== undefined ? hours : t.timeSpentHours,
          status: progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'todo',
        };
      }
      return t;
    }));
  };

  // Mark Salary Paid (Leader control)
  const markSalaryPaid = (payrollId: string, paymentMethod: 'Bank Transfer' | 'JazzCash' | 'Easypaisa' | 'Cash' | 'Wise', reference: string) => {
    setPayroll(prev => prev.map(p => {
      if (p.id === payrollId) {
        return {
          ...p,
          status: 'paid',
          paidDate: todayStr,
          paymentMethod,
          transactionReference: reference,
        };
      }
      return p;
    }));
    showNotification(`Salary marked as PAID. Verified across office payroll ledger!`);
  };

  // Generate monthly payroll run
  const generateMonthlyPayroll = (month: string) => {
    const activeStaff = users.filter(u => u.status === 'active' && u.role !== 'client');
    const newRecords: PayrollRecord[] = activeStaff.map(u => ({
      id: `pay_${Date.now()}_${u.id}`,
      userId: u.id,
      userName: u.name,
      userRole: u.role.replace('_', ' ').toUpperCase(),
      department: u.department,
      month,
      baseSalary: u.salary || 50000,
      bonus: 0,
      deductions: 0,
      netSalary: u.salary || 50000,
      currency: 'PKR',
      status: 'pending',
    }));

    setPayroll(prev => [...newRecords, ...prev]);
    showNotification(`Generated new payroll cycle for ${month}!`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUser,
        signupUser,
        approveUser,
        rejectUser,
        users,
        projects,
        tasks,
        attendance,
        eodReports,
        payroll,
        leaves,
        todayAttendance,
        clockIn,
        startBreak,
        resumeWork,
        clockOutWithReport,
        applyLeave,
        reviewLeave,
        addProject,
        updateProjectProgress,
        recordProjectPayment,
        toggleMilestone,
        addTask,
        updateTaskStatus,
        updateTaskProgress,
        markSalaryPaid,
        generateMonthlyPayroll,
        activeTab,
        setActiveTab,
        isEODModalOpen,
        setIsEODModalOpen,
        isDbModalOpen,
        setIsDbModalOpen,
        searchQuery,
        setSearchQuery,
        notificationMessage,
        setNotificationMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
