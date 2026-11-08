import { User, Project, Task, AttendanceRecord, EODReport, PayrollRecord, LeaveRequest } from './types';

// Clean initial data - Only authentic Leader account (Abdul Hannan)
export const INITIAL_USERS: User[] = [
  {
    id: 'usr_leader',
    name: 'Abdul Hannan',
    email: 'hannan@hanzei.com',
    role: 'leader',
    department: 'Leadership',
    status: 'active',
    workStatus: 'working',
    joinedDate: '2024-01-01',
    salary: 500000,
    phone: '+92 300 1234567',
  },
];

// Clean empty projects list
export const INITIAL_PROJECTS: Project[] = [];

// Clean empty sprint tasks
export const INITIAL_TASKS: Task[] = [];

// Clean initial attendance for leader
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_leader_today',
    userId: 'usr_leader',
    userName: 'Abdul Hannan',
    userRole: 'leader',
    department: 'Leadership',
    date: new Date().toISOString().split('T')[0],
    clockInTime: '09:00:00',
    totalWorkMinutes: 300,
    totalBreakMinutes: 15,
    status: 'working',
    breaks: [],
  },
];

export const INITIAL_EOD_REPORTS: EODReport[] = [];

export const INITIAL_PAYROLL: PayrollRecord[] = [];

export const INITIAL_LEAVES: LeaveRequest[] = [];
