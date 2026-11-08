'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LeaderDashboard from '@/components/LeaderDashboard';
import StaffDashboard from '@/components/StaffDashboard';
import ClientDashboard from '@/components/ClientDashboard';
import AttendanceView from '@/components/AttendanceView';
import ProjectsView from '@/components/ProjectsView';
import TasksView from '@/components/TasksView';
import PayrollView from '@/components/PayrollView';
import TeamView from '@/components/TeamView';
import ReportsView from '@/components/ReportsView';
import AnalyticsView from '@/components/AnalyticsView';
import EODReportModal from '@/components/EODReportModal';
import DatabaseSettingsModal from '@/components/DatabaseSettingsModal';
import AuthModal from '@/components/AuthModal';
import { Clock } from 'lucide-react';

export default function Home() {
  const { currentUser, activeTab, switchUser } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If the logged in user is pending approval
  if (currentUser.status === 'pending_approval') {
    return (
      <div className="min-h-screen bg-[#edf1f7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_4px_25px_rgba(0,0,0,0.04)] text-center border border-slate-100 space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#fffbf0] text-amber-600 flex items-center justify-center mx-auto border border-[#faeec7]">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-[#fffbf0] border border-[#faeec7] px-2.5 py-0.5 rounded-full">
              Awaiting Approval
            </span>
            <h2 className="text-xl font-bold text-slate-800 mt-2.5">
              Registration Under Review
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Hello <strong>{currentUser.name}</strong>, your account was registered for <strong>{currentUser.role.replace('_', ' ')}</strong>. The leader (Abdul Hannan) must confirm your onboarding before full dashboard access is unlocked.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => switchUser('usr_leader')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl shadow-xs transition-all"
            >
              👑 Switch to Leader (Approve This User)
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all"
            >
              Sign In as Another Member
            </button>
          </div>
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  // Render view according to active tab and role
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentUser.role === 'leader' ? <LeaderDashboard /> : <StaffDashboard />;
      case 'analytics':
        return <AnalyticsView />;
      case 'projects':
        return <ProjectsView />;
      case 'tasks':
        return <TasksView />;
      case 'attendance':
        return <AttendanceView />;
      case 'team':
        return <TeamView />;
      case 'payroll':
        return <PayrollView />;
      case 'reports':
        return <ReportsView />;
      case 'client_portal':
        return <ClientDashboard />;
      default:
        return currentUser.role === 'leader' ? <LeaderDashboard /> : <StaffDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#edf1f7] p-2 sm:p-4 md:p-6 flex justify-center">
      {/* Outer Floating SaaS Frame (Exact match of modern dashboard mockups in pics) */}
      <div className="w-full max-w-[1550px] bg-white rounded-3xl md:rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-200/60 flex overflow-hidden min-h-[92vh]">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f9fafc]">
          <Header />
          
          <main className="flex-1 px-8 pb-8 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <EODReportModal />
      <DatabaseSettingsModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
