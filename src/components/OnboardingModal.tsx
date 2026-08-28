import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Target, Calendar, Sparkles } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { settings, updateSettings, loadDemoData } = useApp();

  const [examDate, setExamDate] = useState(settings.examDate || '2028-02-05');
  const [dailyHours, setDailyHours] = useState('3');
  const [weeklyHours, setWeeklyHours] = useState('20');
  const [quizSize, setQuizSize] = useState('10');

  if (settings.hasCompletedSetup) return null;

  const handleStart = (withDemo: boolean = false) => {
    if (withDemo) {
      loadDemoData();
    } else {
      updateSettings({
        examDate,
        dailyStudyTargetMinutes: Math.max(30, Number(dailyHours) * 60),
        weeklyStudyTargetMinutes: Math.max(120, Number(weeklyHours) * 60),
        quizQuestionCount: Number(quizSize) || 10,
        hasCompletedSetup: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 p-4 backdrop-blur-md">
      <div
        id="modal-onboarding"
        className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white sm:text-2xl">
              Welcome to GATE 2028
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
              Data Science & Artificial Intelligence (DA) Prep Tracker
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-sm">
          Your personal preparation companion for syllabus mastery, non-repeating smart quizzes, mistake logging, spaced revision, and daily focus.
        </p>

        <div className="mt-6 space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Exam Name
            </label>
            <div className="mt-1 flex items-center rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
              GATE 2028 – Data Science & Artificial Intelligence
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Target Exam Date
            </label>
            <input
              id="input-onboarding-exam-date"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
            <p className="mt-1 text-[11px] text-neutral-400">
              You can update this anytime when the official GATE 2028 schedule is released.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Daily Target
              </label>
              <select
                id="select-onboarding-daily-hours"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              >
                <option value="1">1 hour / day</option>
                <option value="2">2 hours / day</option>
                <option value="3">3 hours / day</option>
                <option value="4">4 hours / day</option>
                <option value="5">5+ hours / day</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Weekly Target
              </label>
              <select
                id="select-onboarding-weekly-hours"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              >
                <option value="10">10 hours / week</option>
                <option value="14">14 hours / week</option>
                <option value="20">20 hours / week</option>
                <option value="28">28+ hours / week</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            id="btn-start-preparation"
            onClick={() => handleStart(false)}
            className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-center text-xs font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-95 sm:text-sm"
          >
            START PREPARATION
          </button>
          <button
            id="btn-start-with-demo-data"
            onClick={() => handleStart(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-xs font-bold text-neutral-700 transition hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Load Demo Data First</span>
          </button>
        </div>
      </div>
    </div>
  );
};
