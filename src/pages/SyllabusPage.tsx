import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProgressStatus } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Check,
  TrendingUp,
  Brain,
  FileText,
} from 'lucide-react';

export const SyllabusPage: React.FC = () => {
  const {
    syllabus,
    navigateToTopic,
    toggleTopicRevisionMark,
    updateTopicProgress,
    overallCompletion,
    subjectProgressList,
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  const toggleExpand = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  // Filtered topics
  const filteredSubjects = useMemo(() => {
    return syllabus
      .filter((subj) => {
        if (selectedSubjectId !== 'all' && subj.id !== selectedSubjectId) return false;
        return true;
      })
      .map((subj) => {
        const topics = subj.topics.filter((topic) => {
          // Status filter
          if (statusFilter === 'revision' && !topic.isMarkedForRevision) return false;
          if (statusFilter !== 'all' && statusFilter !== 'revision' && topic.status !== statusFilter) {
            return false;
          }
          // Search query
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesTopic = topic.name.toLowerCase().includes(q);
            const matchesSubtopics = topic.subtopics.some((st) => st.name.toLowerCase().includes(q));
            const matchesSubject = subj.name.toLowerCase().includes(q);
            if (!matchesTopic && !matchesSubtopics && !matchesSubject) return false;
          }
          return true;
        });

        return { ...subj, topics };
      })
      .filter((subj) => subj.topics.length > 0);
  }, [syllabus, selectedSubjectId, statusFilter, searchQuery]);

  const totalTopicsCount = syllabus.reduce((acc, s) => acc + s.topics.length, 0);
  const masteredCount = syllabus.reduce(
    (acc, s) => acc + s.topics.filter((t) => t.status === 'mastered').length,
    0
  );
  const learningCount = syllabus.reduce(
    (acc, s) => acc + s.topics.filter((t) => t.status === 'learning' || t.status === 'practiced').length,
    0
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl tracking-tight">
            Syllabus Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Complete GATE 2028 Data Science & Artificial Intelligence (DA) Roadmap
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-right">
            <span className="block text-[11px] font-bold text-slate-500">
              Total Progress
            </span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {overallCompletion}%
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {masteredCount}
            </span>{' '}
            / {totalTopicsCount} Mastered
          </div>
        </div>
      </div>

      {/* Subject Summary Cards Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {subjectProgressList.map(({ subject, progressPercent, topicsCount, completedCount }) => {
          const isSelected = selectedSubjectId === subject.id;
          return (
            <button
              key={subject.id}
              onClick={() => setSelectedSubjectId(isSelected ? 'all' : subject.id)}
              className={`flex flex-col justify-between rounded-2xl border p-3 text-left transition shadow-xs ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/60 dark:border-indigo-500 dark:bg-indigo-950/40'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <span className="line-clamp-2 text-xs font-bold text-slate-900 dark:text-white">
                  {subject.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {completedCount}/{topicsCount} done
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-500">{progressPercent}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="input-syllabus-search"
            type="text"
            placeholder="Search topic or subtopic (e.g. Eigenvalues, Normalization, PCA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'not_started', label: 'Not Started' },
            { id: 'learning', label: 'In Progress' },
            { id: 'practiced', label: 'Practiced' },
            { id: 'mastered', label: 'Mastered' },
            { id: 'revision', label: '🔄 Marked for Revision' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects & Topics Hierarchy List */}
      <div className="space-y-6">
        {filteredSubjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
            No topics match the selected filters.
          </div>
        ) : (
          filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Subject Title */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {subject.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {subject.topics.length} topic{subject.topics.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {subject.topics.filter((t) => t.status === 'mastered').length}/
                  {subject.topics.length} Mastered
                </span>
              </div>

              {/* Topics under this subject */}
              <div className="mt-4 space-y-3">
                {subject.topics.map((topic) => {
                  const isExpanded = expandedTopics[topic.id] || false;
                  return (
                    <div
                      key={topic.id}
                      onClick={() => navigateToTopic(topic.id, 'overview')}
                      className="group cursor-pointer rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-indigo-400 hover:bg-indigo-50/20 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-600"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                              {topic.name}
                            </span>

                            {/* Status Chip */}
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                topic.status === 'mastered'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : topic.status === 'practiced'
                                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                  : topic.status === 'learning'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {topic.status === 'not_started'
                                ? 'Not Started'
                                : topic.status === 'learning'
                                ? 'Learning'
                                : topic.status === 'practiced'
                                ? 'Practiced'
                                : 'Mastered'}
                            </span>

                            {topic.isMarkedForRevision && (
                              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                🔄 Revise
                              </span>
                            )}
                          </div>

                          {/* Progress sub-metrics */}
                          <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                            <span>
                              Understanding:{' '}
                              <strong className="text-slate-800 dark:text-slate-200">
                                {topic.understandingPercent}%
                              </strong>
                            </span>
                            <span>
                              Practice:{' '}
                              <strong className="text-slate-800 dark:text-slate-200">
                                {topic.practicePercent}%
                              </strong>
                            </span>
                            <span>
                              Revision:{' '}
                              <strong className="text-slate-800 dark:text-slate-200">
                                {topic.revisionPercent}%
                              </strong>
                            </span>
                          </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTopicRevisionMark(topic.id);
                            }}
                            className={`rounded-xl p-2 text-xs font-semibold transition ${
                              topic.isMarkedForRevision
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700'
                            }`}
                            title="Toggle Revision Mark"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToTopic(topic.id, 'quiz');
                            }}
                            className="flex items-center gap-1 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-300"
                          >
                            <Brain className="h-3.5 w-3.5" />
                            <span>Quiz</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToTopic(topic.id, 'notes');
                            }}
                            className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Notes</span>
                          </button>

                          <button
                            onClick={(e) => toggleExpand(topic.id, e)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Subtopics checklist */}
                      {isExpanded && topic.subtopics.length > 0 && (
                        <div className="mt-3 border-t border-slate-200/60 pt-3 dark:border-slate-700/60">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Subtopics
                          </p>
                          <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                            {topic.subtopics.map((st) => (
                              <div
                                key={st.id}
                                className="flex items-center gap-2 rounded-lg bg-white p-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    st.isCompleted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                                  }`}
                                />
                                <span>{st.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
