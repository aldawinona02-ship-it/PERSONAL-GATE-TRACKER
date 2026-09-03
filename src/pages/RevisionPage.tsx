import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Mistake } from '../types';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Sparkles,
  BookOpen,
  Filter,
  Search,
  Check,
  Trash2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const RevisionPage: React.FC = () => {
  const {
    needsAttentionTopics,
    mistakes,
    updateMistakeStatus,
    deleteMistake,
    navigateToTopic,
    syllabus,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'due' | 'mistakes'>('due');
  const [mistakeStatusFilter, setMistakeStatusFilter] = useState<'All' | 'Reviewed' | 'Understood' | 'Retest Required'>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [mistakeSearchQuery, setMistakeSearchQuery] = useState<string>('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState<string>('');

  const unresolvedMistakesCount = mistakes.filter((m) => m.status !== 'Understood').length;

  const filteredMistakes = useMemo(() => {
    return mistakes.filter((m) => {
      if (mistakeStatusFilter !== 'All' && m.status !== mistakeStatusFilter) return false;
      if (selectedSubjectFilter !== 'all' && m.subjectId !== selectedSubjectFilter) return false;
      if (mistakeSearchQuery.trim()) {
        const q = mistakeSearchQuery.toLowerCase();
        const matchQ = m.questionText.toLowerCase().includes(q);
        const matchExp = m.explanation.toLowerCase().includes(q);
        const matchConcept = m.concept.toLowerCase().includes(q);
        if (!matchQ && !matchExp && !matchConcept) return false;
      }
      return true;
    });
  }, [mistakes, mistakeStatusFilter, selectedSubjectFilter, mistakeSearchQuery]);

  const handleSaveUserNote = (mistakeId: string) => {
    updateMistakeStatus(mistakeId, 'Reviewed', editingNoteText);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            Revision Hub & Mistakes Notebook
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Spaced repetition recall schedule, weak areas reinforcement & error analysis
          </p>
        </div>

        {/* Unresolved Mistakes Badge */}
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-right">
            <span className="block text-[11px] font-bold text-neutral-500">
              Active Mistakes
            </span>
            <span className="text-base font-black text-rose-600 dark:text-rose-400">
              {unresolvedMistakesCount} to review
            </span>
          </div>
          <div className="h-7 w-px bg-neutral-200 dark:bg-neutral-800" />
          <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {needsAttentionTopics.length} Topics Due
          </div>
        </div>
      </div>

      {/* Subtabs Switcher */}
      <div className="flex rounded-2xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-800/80">
        <button
          onClick={() => setActiveSubTab('due')}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
            activeSubTab === 'due'
              ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
          }`}
        >
          🔄 Topics Due for Revision ({needsAttentionTopics.length})
        </button>

        <button
          onClick={() => setActiveSubTab('mistakes')}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
            activeSubTab === 'mistakes'
              ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
          }`}
        >
          ⚠️ Mistakes Notebook ({mistakes.length})
        </button>
      </div>

      {/* TAB 1: TOPICS DUE FOR REVISION */}
      {activeSubTab === 'due' && (
        <div className="space-y-4">
          {needsAttentionTopics.length === 0 ? (
            <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900">
              🎉 Outstanding! You have no topics due for revision or low accuracy topics right now.
            </div>
          ) : (
            needsAttentionTopics.map(({ topic, subject, reason, accuracy, mistakeCount, daysSinceStudy }) => (
              <div
                key={topic.id}
                className="flex flex-col justify-between gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs transition hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {subject.name}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {topic.name}
                    </h3>
                    <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {reason}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    Understanding: <strong>{topic.understandingPercent}%</strong> • Practice:{' '}
                    <strong>{topic.practicePercent}%</strong> • Mistakes logged:{' '}
                    <strong className="text-rose-600">{mistakeCount}</strong>
                    {daysSinceStudy !== undefined && ` • Studied ${daysSinceStudy} days ago`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateToTopic(topic.id, 'notes')}
                    className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    Revise Notes
                  </button>

                  <button
                    onClick={() => navigateToTopic(topic.id, 'quiz')}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
                  >
                    <Brain className="h-3.5 w-3.5" />
                    <span>Quick Quiz</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MISTAKES NOTEBOOK */}
      {activeSubTab === 'mistakes' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search error concepts, questions, or explanations..."
                value={mistakeSearchQuery}
                onChange={(e) => setMistakeSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status filter */}
              {(['All', 'Reviewed', 'Retest Required', 'Understood'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setMistakeStatusFilter(st)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    mistakeStatusFilter === st
                      ? 'bg-rose-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  {st}
                </button>
              ))}

              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
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

          {/* Mistakes Cards List */}
          <div className="space-y-4">
            {filteredMistakes.length === 0 ? (
              <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900">
                No mistakes found matching your filters.
              </div>
            ) : (
              filteredMistakes.map((m) => {
                const subject = syllabus.find((s) => s.id === m.subjectId);
                const topic = subject?.topics.find((t) => t.id === m.topicId);

                return (
                  <div
                    key={m.id}
                    className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="flex flex-col justify-between gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800 sm:flex-row sm:items-center">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {subject?.name || 'Subject'} → {topic?.name || 'Topic'}
                        </span>
                        <span className="text-xs font-bold text-neutral-500">
                          Concept: {m.concept}
                        </span>
                        <span className="text-[10px] text-neutral-400">• {m.date}</span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <select
                          value={m.status}
                          onChange={(e) =>
                            updateMistakeStatus(
                              m.id,
                              e.target.value as 'Reviewed' | 'Understood' | 'Retest Required'
                            )
                          }
                          className={`rounded-xl px-2.5 py-1 text-xs font-bold ${
                            m.status === 'Understood'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : m.status === 'Retest Required'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          <option value="Reviewed">Reviewed</option>
                          <option value="Retest Required">Retest Required</option>
                          <option value="Understood">Understood (Resolved)</option>
                        </select>

                        <button
                          onClick={() => deleteMistake(m.id)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                          title="Delete Mistake"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question and answers */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-neutral-900 leading-relaxed dark:text-white sm:text-sm">
                        {m.questionText}
                      </p>

                      <div className="grid grid-cols-1 gap-2 rounded-2xl bg-neutral-50 p-3 text-xs dark:bg-neutral-800/40 sm:grid-cols-2">
                        <div className="text-rose-600 dark:text-rose-400">
                          <strong>Your selected answer:</strong> {m.selectedAnswer}
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400">
                          <strong>Correct answer:</strong> {m.correctAnswer}
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="rounded-2xl border border-neutral-100 bg-white p-3.5 text-xs text-neutral-700 leading-relaxed dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                        <span className="font-bold text-neutral-900 dark:text-white block mb-1">
                          💡 Why it was incorrect & mathematical derivation:
                        </span>
                        {m.explanation}
                      </div>

                      {/* Personal Reflection Note */}
                      <div className="mt-2">
                        {editingNoteId === m.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingNoteText}
                              onChange={(e) => setEditingNoteText(e.target.value)}
                              placeholder="Why did you make this mistake? (e.g., misread formula, arithmetic error)"
                              className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-xs text-neutral-900 focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            />
                            <button
                              onClick={() => handleSaveUserNote(m.id)}
                              className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                            >
                              Save Note
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs text-neutral-500">
                            <span>
                              {m.userNote ? (
                                <>
                                  📝 <strong>My Insight:</strong> {m.userNote}
                                </>
                              ) : (
                                <span className="italic text-neutral-400">
                                  No personal reflection note added yet.
                                </span>
                              )}
                            </span>
                            <button
                              onClick={() => {
                                setEditingNoteId(m.id);
                                setEditingNoteText(m.userNote || '');
                              }}
                              className="text-[11px] font-bold text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {m.userNote ? 'Edit Insight' : '+ Add Insight Note'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
