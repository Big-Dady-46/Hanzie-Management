# Hanzei OS — Complete Software House Management System

An all-in-one ERP SaaS web application engineered specifically for modern software houses, design studios, and engineering agencies. Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase Realtime PostgreSQL**, ready to deploy directly to **Vercel**.

---

## 🚀 Key Features

### 1. Leader (CEO / Admin) Command Center
- **Commercial & P&L Ledger**: Live pipeline value, contract totals, payments received, remaining receivables, and monthly payroll outflow.
- **Pending Signups Approval Gate**: When any new user signs up, their account remains in `pending_approval`. Only the **Leader** can confirm them, set their official department, role, and base salary.
- **Project & Milestone Management**: Create and track client projects, interactive progress velocity sliders, milestones checklist, and log client payments.
- **Payroll & Salary Disbursement**: Leader marks salaries as `PAID` with transaction references (Bank Transfer, Cash, JazzCash, Easypaisa, Wise). The ledger is visible to the entire office for 100% transparency.

### 2. Live Hazari & Staff Shift Tracker
- **1-Click Clock In**: Live shift stopwatch counter starts running immediately.
- **Break Controller**: Toggle "Chaye / Break Pe Jaen" and "Resume Work" with break duration logging.
- **Live Office Presence Board**: See who is currently **Working** (green pulsating dot), **On Break** (amber), **On Leave / Choti** (purple), or **Offline**.
- **Support Staff & Cleaners Duty Management**: Dedicated tracking for caretakers (Muhammad Rafiq & Bashir Ahmed) with daily checklist (Server room dusting, coding floor sanitation, pantry restock).
- **Mandatory EOD (End of Day) Checkout Report**: When an employee clocks out, a mandatory report modal requires:
  - Tasks completed today
  - Blockers & hurdles faced
  - Hours worked
  - Tomorrow's plan
  - Self-productivity rating (1-5 stars)

### 3. Client Portal (Isolated & Transparent)
- Clients can log in and strictly see **ONLY their own projects**.
- Live completion percentage gauge (e.g. 82%).
- Milestone roadmap deliverables (Discovery, Wireframes, Engineering, QA, Handover).
- Invoicing & Payment transparency (Budget, Paid Amount, Remaining Balance).
- Direct query/feedback messaging to the Hanzei Lead.

---

## 🗄️ Database: Supabase Realtime PostgreSQL

The application is architected for **Supabase Realtime PostgreSQL** (live data changes across all devices/tabs) with an offline-first storage fallback so it never crashes even before you add your database credentials.

### How to Connect Supabase (1-Minute Setup):
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase and paste the contents of `supabase_schema.sql` (found in the root folder) and run it.
3. In Supabase **Project Settings -> API**, copy your **Project URL** and **Anon Key**.
4. In Vercel (or in `.env.local` locally), add:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## ⚡ Deployment to Vercel

1. Push this folder to your GitHub / GitLab repository.
2. Go to [vercel.com](https://vercel.com) &rarr; **Add New Project** &rarr; Select your repository.
3. Framework preset is automatically detected as **Next.js**.
4. Add the two environment variables from step above (optional for demo, recommended for live multi-user sync).
5. Click **Deploy**!

