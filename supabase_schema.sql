-- ==============================================================================
-- HANZEI SOFTWARE HOUSE MANAGEMENT SYSTEM - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Execute this script in the Supabase SQL Editor (https://app.supabase.com)
-- This creates all tables with full Realtime support and row-level security.
-- ==============================================================================

-- 1. Create USERS table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('leader', 'developer', 'designer', 'qa', 'support_cleaner', 'manager', 'client')),
  department TEXT NOT NULL,
  avatar TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('active', 'pending_approval', 'rejected', 'suspended')),
  work_status TEXT NOT NULL DEFAULT 'offline' CHECK (work_status IN ('working', 'on_break', 'on_leave', 'offline')),
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  salary NUMERIC DEFAULT 0,
  assigned_project_ids TEXT[] DEFAULT '{}',
  client_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create PROJECTS table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_id TEXT,
  description TEXT,
  total_budget NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'PKR',
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  start_date DATE NOT NULL,
  deadline DATE NOT NULL,
  assigned_team_member_ids TEXT[] DEFAULT '{}',
  milestones JSONB DEFAULT '[]',
  category TEXT DEFAULT 'Web App',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create TASKS table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  assigned_to_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  assigned_to_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'revisions')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  progress_percent INTEGER DEFAULT 0,
  time_spent_hours NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create ATTENDANCE table
CREATE TABLE IF NOT EXISTS public.attendance (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  department TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in_time TIME NOT NULL,
  clock_out_time TIME,
  total_work_minutes INTEGER DEFAULT 0,
  total_break_minutes INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'working',
  eod_report_id TEXT,
  breaks JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create EOD_REPORTS table (Mandatory Checkout Reports)
CREATE TABLE IF NOT EXISTS public.eod_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  tasks_completed TEXT NOT NULL,
  blockers TEXT,
  hours_worked NUMERIC NOT NULL,
  plan_for_tomorrow TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create PAYROLL table (Salary disbursement & transparency)
CREATE TABLE IF NOT EXISTS public.payroll (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  department TEXT NOT NULL,
  month TEXT NOT NULL,
  base_salary NUMERIC NOT NULL,
  bonus NUMERIC DEFAULT 0,
  deductions NUMERIC DEFAULT 0,
  net_salary NUMERIC NOT NULL,
  currency TEXT DEFAULT 'PKR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending')),
  paid_date DATE,
  payment_method TEXT,
  transaction_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create LEAVE_REQUESTS table
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  department TEXT NOT NULL,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('casual', 'sick', 'annual', 'emergency')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by TEXT
);

-- 8. Enable Realtime Replication for instant live sync across all users
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.eod_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payroll;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leave_requests;

-- 9. Enable Row-Level Security (Allow read/write for all authenticated or public anon key for fast SaaS setup)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eod_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for anon" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for anon" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for anon" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for anon" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for anon" ON public.eod_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for anon" ON public.payroll FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for anon" ON public.leave_requests FOR ALL USING (true) WITH CHECK (true);

