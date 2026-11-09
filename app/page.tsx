'use client';

import React, { useState, useEffect } from 'react';
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
import LoadingScreen from '@/components/LoadingScreen';
import { Clock, Sparkles, X } from 'lucide-react';

export default function Home() {
  const { currentUser, activeTab, switchUser, notificationMessage, setNotificationMessage } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <LoadingScreen
        userName={currentUser?.name}
        onComplete={() => setIsLoading(false)}
      />
    );
  }

  // If the logged in user is pending approval
  if (currentUser.status === 'pending_approval') {
    return (
      <div className="min-h-screen bg-[#edf2f7] flex items-center justify-center p-6 relative">
        {isLoading && (
          <LoadingScreen
            userName={currentUser?.name}
            onComplete={() => setIsLoading(false)}
          />
        )}
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
    <div className="h-screen bg-[#edf2f7] p-2 sm:p-3 lg:p-4 flex justify-center overflow-hidden relative">
      {/* Cinematic Opening Splash Overlay with Logo Animation */}
      {isLoading && (
        <LoadingScreen
          userName={currentUser?.name}
          onComplete={() => setIsLoading(false)}
        />
      )}

      {/* Outer Floating SaaS Canvas - Fixed Viewport Height */}
      <div className="w-full max-w-[1680px] bg-white rounded-2xl md:rounded-3xl shadow-[0_20px_70px_-10px_rgba(15,23,42,0.06)] border border-slate-200/70 flex overflow-hidden h-full max-h-[96vh]">
        {/* Sidebar Navigation - Fixed, Never Scrolls with Page Content */}
        <Sidebar />

        {/* Main Content Area - Only Right Side Scrolls */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f9fafc] h-full overflow-hidden">
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

      {/* Global Action Toast Notification */}
      {notificationMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999] max-w-md w-[92vw] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.35)] border border-slate-700/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-100 flex-1 leading-snug">
              {notificationMessage}
            </p>
            <button
              type="button"
              onClick={() => setNotificationMessage(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
