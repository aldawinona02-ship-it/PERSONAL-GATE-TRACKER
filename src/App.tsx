import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AddStudySessionModal } from './components/AddStudySessionModal';
import { OnboardingModal } from './components/OnboardingModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { SyllabusPage } from './pages/SyllabusPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { CalendarPage } from './pages/CalendarPage';
import { StudySessionsPage } from './pages/StudySessionsPage';
import { NotesHubPage } from './pages/NotesHubPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { RevisionPage } from './pages/RevisionPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/90 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'syllabus' && <SyllabusPage />}
          {activeTab === 'topic-detail' && <TopicDetailPage />}
          {activeTab === 'calendar' && <CalendarPage />}
          {activeTab === 'study-sessions' && <StudySessionsPage />}
          {activeTab === 'notes' && <NotesHubPage />}
          {activeTab === 'quizzes' && <QuizzesPage />}
          {activeTab === 'revision' && <RevisionPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <GlobalSearchModal />
      <AddStudySessionModal />
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
