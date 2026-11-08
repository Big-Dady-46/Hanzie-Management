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
import EODReportModal from '@/components/EODReportModal';
import DatabaseSettingsModal from '@/components/DatabaseSettingsModal';
import AuthModal from '@/components/AuthModal';
import { ShieldAlert, Clock, Sparkles, UserCheck } from 'lucide-react';

export default function Home() {
  const { currentUser, activeTab, switchUser } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If the logged in user is pending approval
  if (currentUser.status === 'pending_approval') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-soft text-center border border-slate-200/90 space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md">
              Awaiting Approval
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              Registration Under Review
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Hello <strong>{currentUser.name}</strong>, your account was registered for <strong>{currentUser.role.replace('_', ' ')}</strong>. The leader (Abdul Hannan) must confirm your onboarding before full dashboard access is unlocked.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => switchUser('usr_leader')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl shadow-md shadow-indigo-100 transition-all"
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
    <div className="flex min-h-screen bg-[#f6f8fc]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header />
        
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <EODReportModal />
      <DatabaseSettingsModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

