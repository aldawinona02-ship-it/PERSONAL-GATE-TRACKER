import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Search,
  PlusCircle,
  Brain,
  BookOpen,
  Calendar as CalendarIcon,
  RotateCw,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    daysToExam,
    currentStreak,
    settings,
    updateSettings,
    setIsAddSessionOpen,
    setIsSearchOpen,
    setActiveTab,
  } = useApp();

  const toggleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: next });
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left: Mobile Menu & Countdown Banner */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-menu-toggle"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Dynamic Countdown Chip */}
        <div
          id="chip-gate-countdown"
          className="flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 sm:px-4 sm:py-1.5 sm:text-sm"
        >
          <span className="font-bold tracking-tight">GATE 2028</span>
          <span className="h-3 w-px bg-indigo-300 dark:bg-indigo-700" />
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
            {daysToExam} DAYS TO GO
          </span>
        </div>

        {/* Streak Counter */}
        <div
          id="chip-streak-counter"
          title={`Consecutive study days: ${currentStreak}`}
          className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300 sm:flex sm:text-sm"
        >
          <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{currentStreak} Day{currentStreak === 1 ? '' : 's'} Streak</span>
        </div>
      </div>

      {/* Middle/Right: Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search trigger */}
        <button
          id="btn-global-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100/80 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/60 sm:text-sm"
        >
          <Search className="h-4 w-4 text-slate-400" />
          <span className="hidden sm:inline">Search GATE DA...</span>
          <span className="inline sm:hidden">Search</span>
          <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-xs border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 md:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Study Session */}
        <button
          id="btn-quick-add-session"
          onClick={() => setIsAddSessionOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-98 dark:bg-indigo-600 dark:hover:bg-indigo-500 sm:px-4 sm:py-2 sm:text-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">+ Study Session</span>
          <span className="inline sm:hidden">+ Session</span>
        </button>

        {/* Theme Switcher */}
        <button
          id="btn-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {settings.theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
};
