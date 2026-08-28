import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewTab } from '../types';
import {
  LayoutDashboard,
  Calendar,
  BookMarked,
  Clock,
  FileText,
  BrainCircuit,
  RotateCcw,
  BarChart3,
  Sparkles,
  Settings,
  Flame,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    needsAttentionTopics,
    mistakes,
    overallCompletion,
    todayStudyMinutes,
  } = useApp();

  const unresolvedMistakesCount = mistakes.filter((m) => m.status !== 'Understood').length;
  const revisionDueCount = needsAttentionTopics.length;

  const navItems: Array<{
    id: ViewTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'syllabus', label: 'Syllabus', icon: BookMarked },
    { id: 'study-sessions', label: 'Study Sessions', icon: Clock },
    { id: 'notes', label: 'Digital Notes', icon: FileText },
    { id: 'quizzes', label: 'Quizzes & PYQs', icon: BrainCircuit },
    {
      id: 'revision',
      label: 'Revision Hub',
      icon: RotateCcw,
      badge: revisionDueCount > 0 ? revisionDueCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: ViewTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 md:static md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Title / Header */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              GATE 2028
            </h1>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Data Science & AI Tracker
            </p>
          </div>
        </div>

        {/* Syllabus Progress Mini Bar */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Syllabus Completion
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {overallCompletion}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${overallCompletion}%` }}
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Philosophy */}
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              💡 Daily Philosophy
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              Small progress every day adds up. Today's goal: study one topic well.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
