export type UserRole = 'leader' | 'developer' | 'designer' | 'qa' | 'support_cleaner' | 'manager' | 'client';

export type UserStatus = 'active' | 'pending_approval' | 'rejected' | 'suspended';

export type WorkStatus = 'working' | 'on_break' | 'on_leave' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: 'Leadership' | 'Development' | 'Design' | 'Quality Assurance' | 'Office & Maintenance' | 'Clients';
  avatar?: string;
  phone?: string;
  status: UserStatus;
  workStatus: WorkStatus;
  joinedDate: string;
  salary?: number;
  assignedProjectIds?: string[];
  clientId?: string; // If role is client
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  department: string;
  date: string; // YYYY-MM-DD
  clockInTime: string; // HH:mm:ss
  clockOutTime?: string; // HH:mm:ss
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  status: WorkStatus;
  eodReportId?: string;
  breaks: {
    start: string;
    end?: string;
    durationMinutes?: number;
  }[];
}

export interface EODReport {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  date: string;
  timestamp: string;
  tasksCompleted: string;
  blockers?: string;
  hoursWorked: number;
  planForTomorrow: string;
  rating?: number; // Self productivity rating 1-5
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  department: string;
  leaveType: 'casual' | 'sick' | 'annual' | 'emergency';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedBy?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  clientId?: string;
  description: string;
  totalBudget: number; // PKR or USD
  currency: string;
  paidAmount: number;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  progressPercentage: number;
  startDate: string;
  deadline: string;
  assignedTeamMemberIds: string[];
  milestones: ProjectMilestone[];
  category: 'Web App' | 'Mobile App' | 'UI/UX Design' | 'AI Integration' | 'Custom Software';
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'revisions';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  projectName: string;
  assignedToId: string;
  assignedToName: string;
  assignedToAvatar?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  progressPercent: number;
  timeSpentHours?: number;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  department: string;
  month: string; // e.g., "November 2026"
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  currency: string;
  status: 'paid' | 'pending';
  paidDate?: string;
  paymentMethod?: 'Bank Transfer' | 'JazzCash' | 'Easypaisa' | 'Cash' | 'Wise';
  transactionReference?: string;
}

export interface ClientFeedback {
  id: string;
  projectId: string;
  clientId: string;
  clientName: string;
  message: string;
  createdAt: string;
  status: 'open' | 'addressed';
}

