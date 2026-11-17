import { 
  User, Project, Task, AttendanceRecord, EODReport, PayrollRecord, LeaveRequest 
} from './types';

// Default Admin User for Hanzie Management
export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Abdul Hannan',
    email: 'admin@gmail.com',
    password: 'Hanzie46@',
    role: 'leader',
    department: 'Leadership',
    status: 'active',
    workStatus: 'working',
    joinedDate: '2026-01-01',
    salary: 500000,
    phone: '+92 300 1234567',
  },
];

// Pristine Empty Data Sets (All dummy data wiped)
export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

export const INITIAL_EOD_REPORTS: EODReport[] = [];

export const INITIAL_PAYROLL: PayrollRecord[] = [];

export const INITIAL_LEAVES: LeaveRequest[] = [];
