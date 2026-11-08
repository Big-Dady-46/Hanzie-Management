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
      <div className="min-h-screen bg-[#edf2f7] flex items-center justify-center p-6">
        <div className="bg-white rounded-[32px] p-10 max-w-lg w-full shadow-[0_20px_50px_rgba(0,0,0,0.06)] text-center border border-slate-100 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#fff9ea] text-amber-600 flex items-center justify-center mx-auto border border-[#faeed0]">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-[#fff9ea] border border-[#faeed0] px-3.5 py-1 rounded-full">
              Awaiting Approval
            </span>
            <h2 className="text-2xl font-extrabold text-slate-800 mt-3">
              Registration Under Review
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Hello <strong>{currentUser.name}</strong>, your account was registered for <strong>{currentUser.role.replace('_', ' ')}</strong>. The leader (Abdul Hannan) must confirm your onboarding before full dashboard access is unlocked.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => switchUser('usr_leader')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3.5 rounded-2xl shadow-sm transition-all"
            >
              👑 Switch to Leader (Approve This User)
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-2xl transition-all"
            >
              Sign In as Another Member
            </button>
          </div>
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#edf2f7] p-3 sm:p-5 lg:p-7 flex justify-center">
      {/* Outer Floating SaaS Canvas (Generous luxury padding & soft depth) */}
      <div className="w-full max-w-[1600px] bg-white rounded-[32px] md:rounded-[40px] shadow-[0_20px_70px_-10px_rgba(15,23,42,0.06)] border border-slate-200/70 flex overflow-hidden min-h-[94vh]">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f9fafc]">
          <Header />
          
          <main className="flex-1 px-8 lg:px-10 pb-10 overflow-y-auto">
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
