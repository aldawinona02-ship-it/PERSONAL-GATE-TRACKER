import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  Flame,
  PlusCircle,
  Brain,
  FileText,
  RotateCcw,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Sparkles,
  Award,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  TrendingUp,
  BookOpen,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    daysToExam,
    currentStreak,
    longestStreak,
    todaySessions,
    todayStudyMinutes,
    todayTopicsCount,
    todayQuizAttempts,
    todayAccuracy,
    todayTasks,
    addTask,
    toggleTask,
    deleteTask,
    setIsAddSessionOpen,
    setActiveTab,
    navigateToTopic,
    settings,
    syllabus,
  } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Formatted Today Date: e.g. Friday, 28 August 2026
  const formattedToday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), undefined, undefined, undefined, newTaskPriority);
    setNewTaskTitle('');
  };

  const hoursStudied = Math.floor(todayStudyMinutes / 60);
  const minutesStudied = todayStudyMinutes % 60;
  const targetHours = Math.round(settings.dailyStudyTargetMinutes / 60);
  const targetPercent = Math.min(
    100,
    Math.round((todayStudyMinutes / (settings.dailyStudyTargetMinutes || 180)) * 100)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Countdown & Date & Streak Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg dark:border-slate-800 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{formattedToday}</span>
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
              GATE 2028
            </h1>
            <p className="mt-1 text-xl font-extrabold text-indigo-300 sm:text-2xl">
              {daysToExam} DAYS TO GO
            </p>
            <p className="mt-2 text-xs text-indigo-100/80 sm:text-sm">
              Data Science & Artificial Intelligence (DA) Target Date: {settings.examDate}
            </p>
          </div>

          {/* Right Hero: Streak & Consistency Card */}
          <div className="flex flex-row items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="h-7 w-7 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold sm:text-2xl">
                  {currentStreak} Days
                </span>
                <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-indigo-100/70">
                Current Study Streak (Longest: {longestStreak} days)
              </p>
            </div>
          </div>
        </div>

        {/* Subtle decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5 sm:gap-3">
        <button
          id="btn-quick-action-study-session"
          onClick={() => setIsAddSessionOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs font-bold text-slate-800 shadow-xs transition hover:border-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300 sm:text-sm"
        >
          <PlusCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>+ Study Session</span>
        </button>

        <button
          id="btn-quick-action-take-quiz"
          onClick={() => setActiveTab('quizzes')}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs font-bold text-slate-800 shadow-xs transition hover:border-purple-500 hover:bg-purple-50/50 hover:text-purple-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-purple-600 dark:hover:bg-purple-950/30 dark:hover:text-purple-300 sm:text-sm"
        >
          <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span>🧠 Take Quiz</span>
        </button>

        <button
          id="btn-quick-action-open-notes"
          onClick={() => setActiveTab('notes')}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs font-bold text-slate-800 shadow-xs transition hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300 sm:text-sm"
        >
          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>📝 Open Notes</span>
        </button>

        <button
          id="btn-quick-action-calendar"
          onClick={() => setActiveTab('calendar')}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs font-bold text-slate-800 shadow-xs transition hover:border-amber-500 hover:bg-amber-50/50 hover:text-amber-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-amber-600 dark:hover:bg-amber-950/30 dark:hover:text-amber-300 sm:text-sm"
        >
          <CalendarIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span>📅 Calendar</span>
        </button>

        <button
          id="btn-quick-action-revise"
          onClick={() => setActiveTab('revision')}
          className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-xs font-bold text-slate-800 shadow-xs transition hover:border-rose-500 hover:bg-rose-50/50 hover:text-rose-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-300 sm:col-span-1 sm:text-sm"
        >
          <RotateCcw className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          <span>🔄 Revise</span>
        </button>
      </div>

      {/* Today's Progress Stats */}
      <div>
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Today's Progress
          </h2>
          <span className="text-xs font-medium text-slate-500">
            Target: {targetHours} hrs / day
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Study Time */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Study Time</span>
              <Clock className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
              {hoursStudied}h {minutesStudied}m
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${targetPercent}%` }}
              />
            </div>
            <span className="mt-1 block text-[10px] text-slate-400">
              {targetPercent}% of daily goal
            </span>
          </div>

          {/* Topics Studied */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Topics Studied</span>
              <BookOpen className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
              {todayTopicsCount}
            </div>
            <span className="mt-3 block text-[11px] text-slate-500 dark:text-slate-400">
              {todaySessions.length} session{todaySessions.length === 1 ? '' : 's'} recorded
            </span>
          </div>

          {/* Quizzes & Accuracy */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Quiz Accuracy</span>
              <Brain className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
              {todayQuizAttempts.length > 0 ? `${todayAccuracy}%` : '—'}
            </div>
            <span className="mt-3 block text-[11px] text-slate-500 dark:text-slate-400">
              {todayQuizAttempts.length} quiz attempt{todayQuizAttempts.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Tasks Completed */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Tasks Done</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
              {todayTasks.filter((t) => t.completed).length} / {todayTasks.length}
            </div>
            <span className="mt-3 block text-[11px] text-slate-500 dark:text-slate-400">
              Daily checklist items
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: Left (Today's Study & Recommendations) | Right (Daily Notepad & Philosophy) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns */}
        <div className="space-y-6 lg:col-span-2">
          {/* Today's Study Sessions */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Today's Study Log
                </h3>
                <p className="text-xs text-slate-500">
                  {todaySessions.length === 0
                    ? 'No sessions recorded yet today.'
                    : `Recorded ${todaySessions.length} session(s) today.`}
                </p>
              </div>
              <button
                id="btn-add-session-from-today-list"
                onClick={() => setIsAddSessionOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Study Session</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todaySessions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No study sessions yet today.
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Start your first study session today to keep your streak burning!
                  </p>
                  <button
                    onClick={() => setIsAddSessionOpen(true)}
                    className="mt-3 inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98"
                  >
                    + Add Study Session
                  </button>
                </div>
              ) : (
                todaySessions.map((session) => {
                  const subject = syllabus.find((s) => s.id === session.subjectId);
                  const topic = subject?.topics.find((t) => t.id === session.topicId);
                  return (
                    <div
                      key={session.id}
                      className="group flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-slate-200 dark:border-slate-800/80 dark:bg-slate-800/40 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {subject?.name || 'Subject'}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {topic?.name || 'Topic'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {session.description}
                        </p>
                        {session.importantPoints && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            💡 {session.importantPoints}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {Math.floor(session.durationMinutes / 60) > 0
                              ? `${Math.floor(session.durationMinutes / 60)} hr `
                              : ''}
                            {session.durationMinutes % 60} min
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {session.startTime} - {session.endTime}
                          </div>
                        </div>

                        {session.completed && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <Check className="h-3 w-3" />
                            <span>Completed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Daily Plan Notepad */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Today's Plan / Notepad
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {todayTasks.filter((t) => t.completed).length} / {todayTasks.length}
              </span>
            </div>

            {/* Add Task Input */}
            <form onSubmit={handleAddTask} className="mt-4 space-y-2">
              <div className="flex gap-2">
                <input
                  id="input-new-task-title"
                  type="text"
                  placeholder="Add goal: e.g. Solve 10 Normalization PYQs..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  id="btn-add-daily-task"
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Task list */}
            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
              {todayTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No tasks set for today. Plan your study targets above!
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group flex items-center justify-between rounded-xl border p-2.5 text-xs transition ${
                      task.completed
                        ? 'border-slate-100 bg-slate-50/50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50'
                        : 'border-slate-200 bg-white text-slate-800 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-2.5 text-left flex-1"
                    >
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                          task.completed
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 hover:border-indigo-500 dark:border-slate-600'
                        }`}
                      >
                        {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className={task.completed ? 'line-through text-slate-400' : 'font-medium'}>
                        {task.title}
                      </span>
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 rounded p-1 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Preparation Philosophy Card */}
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-slate-50 p-5 dark:border-indigo-950/60 dark:bg-gradient-to-br dark:from-indigo-950/30 dark:to-slate-900/40 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Award className="h-5 w-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                GATE 2028 Preparation Mindset
              </h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-indigo-950/80 dark:text-indigo-200/80 font-medium">
              "Consistency outperforms intensity. Studying 2 dedicated hours every day for GATE 2028 builds compounding clarity and unshakeable problem-solving intuition."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
