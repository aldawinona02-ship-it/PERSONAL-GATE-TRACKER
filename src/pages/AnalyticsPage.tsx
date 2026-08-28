import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Flame,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const {
    syllabus,
    studySessions,
    quizAttempts,
    mistakes,
    currentStreak,
    longestStreak,
    overallCompletion,
    subjectProgressList,
  } = useApp();

  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStudyHours = Math.round((totalStudyMinutes / 60) * 10) / 10;

  const totalQuestionsAttempted = quizAttempts.reduce((acc, q) => acc + q.totalQuestions, 0);
  const avgOverallAccuracy =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((acc, q) => acc + q.accuracy, 0) / quizAttempts.length
        )
      : 0;

  // Study time per subject
  const subjectTimeDistribution = useMemo(() => {
    return syllabus.map((subj) => {
      const subjSessions = studySessions.filter((s) => s.subjectId === subj.id);
      const minutes = subjSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
      const percentOfTotal =
        totalStudyMinutes > 0 ? Math.round((minutes / totalStudyMinutes) * 100) : 0;

      const attempts = quizAttempts.filter((q) => q.subjectId === subj.id);
      const accuracy =
        attempts.length > 0
          ? Math.round(attempts.reduce((acc, a) => acc + a.accuracy, 0) / attempts.length)
          : null;

      const subjMistakes = mistakes.filter((m) => m.subjectId === subj.id && m.status !== 'Understood');

      return {
        subject: subj,
        minutes,
        hours: Math.round((minutes / 60) * 10) / 10,
        percentOfTotal,
        accuracy,
        unresolvedMistakes: subjMistakes.length,
      };
    });
  }, [syllabus, studySessions, totalStudyMinutes, quizAttempts, mistakes]);

  // Find strongest and weakest subjects
  const { strongestSubject, weakestSubject } = useMemo(() => {
    const scored = subjectTimeDistribution.filter((s) => s.accuracy !== null);
    if (scored.length === 0) return { strongestSubject: null, weakestSubject: null };
    const sorted = [...scored].sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0));
    return {
      strongestSubject: sorted[0],
      weakestSubject: sorted[sorted.length - 1],
    };
  }, [subjectTimeDistribution]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            Preparation Analytics
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Deep performance insights, subject balance, and consistency metrics
          </p>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Total Study Hours</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            {totalStudyHours} hrs
          </div>
          <span className="mt-1 block text-[11px] text-neutral-400">
            {studySessions.length} sessions logged
          </span>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Syllabus Completion</span>
            <BookOpen className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400 sm:text-3xl">
            {overallCompletion}%
          </div>
          <span className="mt-1 block text-[11px] text-neutral-400">
            Weighted progress score
          </span>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Avg Quiz Accuracy</span>
            <Brain className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            {avgOverallAccuracy}%
          </div>
          <span className="mt-1 block text-[11px] text-neutral-400">
            {totalQuestionsAttempted} questions solved
          </span>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Study Streak</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400 sm:text-3xl">
            {currentStreak} Days
          </div>
          <span className="mt-1 block text-[11px] text-neutral-400">
            Longest: {longestStreak} days
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Subject Time Breakdown (2 Cols) */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Subject Study Time Distribution
            </h3>
            <span className="text-xs text-neutral-400">7 GATE DA Areas</span>
          </div>

          <div className="space-y-4">
            {subjectTimeDistribution.map(({ subject, hours, minutes, percentOfTotal, accuracy, unresolvedMistakes }) => (
              <div key={subject.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-neutral-800 dark:text-neutral-200">
                    {subject.name}
                  </span>
                  <div className="flex items-center gap-3">
                    {accuracy !== null && (
                      <span className="text-purple-600 dark:text-purple-400">
                        {accuracy}% accuracy
                      </span>
                    )}
                    <span className="text-neutral-500">{hours} hrs ({percentOfTotal}%)</span>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${percentOfTotal}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Strengths, Weaknesses & Recommendations */}
        <div className="space-y-6">
          {/* Strengths and Weaknesses */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white border-b border-neutral-100 pb-3 dark:border-neutral-800">
              Focus Analysis
            </h3>

            {strongestSubject && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 dark:border-emerald-950 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <Award className="h-4 w-4" />
                  <span>Strongest Subject</span>
                </div>
                <p className="mt-1 text-xs font-bold text-neutral-900 dark:text-white">
                  {strongestSubject.subject.name} ({strongestSubject.accuracy}% Accuracy)
                </p>
              </div>
            )}

            {weakestSubject && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-3.5 dark:border-rose-950 dark:bg-rose-950/20">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Subject Needing Reinforcement</span>
                </div>
                <p className="mt-1 text-xs font-bold text-neutral-900 dark:text-white">
                  {weakestSubject.subject.name} ({weakestSubject.accuracy}% Accuracy)
                </p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  {weakestSubject.unresolvedMistakes} active mistakes to review in the Mistakes Notebook.
                </p>
              </div>
            )}
          </div>

          {/* Consistency Advice */}
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 dark:border-indigo-950 dark:bg-indigo-950/30 space-y-2">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider dark:text-indigo-300">
              📈 Exam Readiness Insight
            </h4>
            <p className="text-xs leading-relaxed text-indigo-950/80 dark:text-indigo-200/80">
              To maximize your GATE 2028 DA percentile, aim for at least 70% accuracy across all 7 subjects and complete 100% of syllabus topics with active practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
