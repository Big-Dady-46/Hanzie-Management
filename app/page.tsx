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
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-6">
        <div className="glass-card-gold p-10 max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl icon-badge-gold flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1 rounded-full">
              Awaiting Approval
            </span>
            <h2 className="text-xl font-bold text-slate-100 mt-3">
              Registration Under Review
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Hello <strong className="text-slate-200">{currentUser.name}</strong>, your account was registered for <strong className="text-slate-200">{currentUser.role.replace('_', ' ')}</strong>. The leader (Abdul Hannan) must confirm your onboarding before full dashboard access is unlocked.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => switchUser('usr_leader')}
              className="btn-gold text-xs py-3 rounded-xl justify-center"
            >
              👑 Switch to Leader (Approve This User)
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-silver text-xs py-3 rounded-xl justify-center"
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
    <div className="min-h-screen bg-[#0d0f14] p-2 sm:p-4 lg:p-6 flex justify-center">
      {/* Outer Floating SaaS Canvas (Dark Glassmorphism Container) */}
      <div className="w-full max-w-[1680px] bg-[#13161e]/90 backdrop-blur-2xl rounded-2xl md:rounded-3xl border border-white/[0.08] shadow-[0_25px_80px_rgba(0,0,0,0.6)] flex overflow-hidden min-h-[95vh]">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d0f14]/50">
          <Header />
          
          <main className="flex-1 px-6 lg:px-8 pb-10 overflow-y-auto">
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
