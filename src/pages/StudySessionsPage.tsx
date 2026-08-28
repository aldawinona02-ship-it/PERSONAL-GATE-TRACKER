import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  PlusCircle,
  Search,
  Trash2,
  BookOpen,
  Calendar as CalendarIcon,
  Star,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export const StudySessionsPage: React.FC = () => {
  const {
    studySessions,
    syllabus,
    deleteStudySession,
    setIsAddSessionOpen,
    navigateToTopic,
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const avgMinutes =
    studySessions.length > 0 ? Math.round(totalStudyMinutes / studySessions.length) : 0;

  const filteredSessions = useMemo(() => {
    return studySessions.filter((s) => {
      if (selectedSubjectId !== 'all' && s.subjectId !== selectedSubjectId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const subject = syllabus.find((subj) => subj.id === s.subjectId);
        const topic = subject?.topics.find((t) => t.id === s.topicId);
        const matchDesc = s.description.toLowerCase().includes(q);
        const matchTopic = topic?.name.toLowerCase().includes(q) || false;
        const matchSubject = subject?.name.toLowerCase().includes(q) || false;
        const matchPoints = s.importantPoints.toLowerCase().includes(q);
        if (!matchDesc && !matchTopic && !matchSubject && !matchPoints) return false;
      }
      return true;
    });
  }, [studySessions, selectedSubjectId, searchQuery, syllabus]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            Study Sessions
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Complete activity log of your GATE 2028 preparation sessions
          </p>
        </div>

        <button
          onClick={() => setIsAddSessionOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Log Study Session</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Total Study Time</span>
          <div className="mt-1 text-xl font-black text-blue-600 dark:text-blue-400 sm:text-2xl">
            {Math.floor(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m
          </div>
          <span className="text-[10px] text-neutral-400">All-time accumulated</span>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Total Sessions</span>
          <div className="mt-1 text-xl font-black text-neutral-900 dark:text-white sm:text-2xl">
            {studySessions.length}
          </div>
          <span className="text-[10px] text-neutral-400">Logged entries</span>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Avg Session Time</span>
          <div className="mt-1 text-xl font-black text-neutral-900 dark:text-white sm:text-2xl">
            {avgMinutes} mins
          </div>
          <span className="text-[10px] text-neutral-400">Per session</span>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Completed Sessions</span>
          <div className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400 sm:text-2xl">
            {studySessions.filter((s) => s.completed).length}
          </div>
          <span className="text-[10px] text-neutral-400">100% finished</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search sessions by topic or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="all">All Subjects</option>
            {syllabus.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900">
            No study sessions found matching your filters.
          </div>
        ) : (
          filteredSessions.map((session) => {
            const subject = syllabus.find((s) => s.id === session.subjectId);
            const topic = subject?.topics.find((t) => t.id === session.topicId);

            return (
              <div
                key={session.id}
                className="group rounded-3xl border border-neutral-200 bg-white p-5 shadow-xs transition hover:border-blue-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-700"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {subject?.name || 'Subject'}
                      </span>
                      <button
                        onClick={() => topic && navigateToTopic(topic.id, 'overview')}
                        className="text-xs font-bold text-neutral-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                      >
                        {topic?.name || 'Topic'}
                      </button>
                      <span className="text-[11px] text-neutral-400">
                        • {session.date} ({session.startTime} - {session.endTime})
                      </span>
                    </div>

                    <p className="text-xs text-neutral-700 dark:text-neutral-300">
                      {session.description}
                    </p>

                    {session.importantPoints && (
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        💡 <strong>Key Points:</strong> {session.importantPoints}
                      </p>
                    )}

                    {session.doubts && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400">
                        ❓ <strong>Doubts:</strong> {session.doubts}
                      </p>
                    )}
                  </div>

                  {/* Right side duration & actions */}
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-black text-blue-600 dark:text-blue-400">
                        {Math.floor(session.durationMinutes / 60) > 0
                          ? `${Math.floor(session.durationMinutes / 60)}h `
                          : ''}
                        {session.durationMinutes % 60}m
                      </div>
                      <div className="flex items-center justify-end gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= session.confidence ? 'fill-amber-400' : 'text-neutral-300 dark:text-neutral-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteStudySession(session.id)}
                      className="rounded-lg p-2 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                      title="Delete Session"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
