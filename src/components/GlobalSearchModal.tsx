import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  BookOpen,
  FileText,
  AlertTriangle,
  Clock,
  Brain,
  ChevronRight,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    syllabus,
    notes,
    mistakes,
    studySessions,
    navigateToTopic,
    setActiveTab,
  } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener: Cmd/Ctrl + K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const query = searchQuery.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) {
      return {
        topics: [],
        notes: [],
        mistakes: [],
        sessions: [],
      };
    }

    // 1. Topics match
    const matchingTopics: Array<{ topic: any; subject: any }> = [];
    syllabus.forEach((s) => {
      s.topics.forEach((t) => {
        if (
          t.name.toLowerCase().includes(query) ||
          s.name.toLowerCase().includes(query) ||
          t.subtopics.some((st) => st.name.toLowerCase().includes(query))
        ) {
          matchingTopics.push({ topic: t, subject: s });
        }
      });
    });

    // 2. Notes match
    const matchingNotes: Array<{ topic: any; subject: any; note: any; matchedText: string }> = [];
    Object.entries(notes).forEach(([tId, note]) => {
      let foundSubject: any = null;
      let foundTopic: any = null;
      for (const s of syllabus) {
        const t = s.topics.find((x) => x.id === tId);
        if (t) {
          foundSubject = s;
          foundTopic = t;
          break;
        }
      }
      if (foundTopic) {
        const combined = `${note.importantConcepts} ${note.importantFormulas} ${note.examples} ${note.myUnderstanding} ${note.doubts}`;
        if (combined.toLowerCase().includes(query)) {
          matchingNotes.push({
            topic: foundTopic,
            subject: foundSubject,
            note,
            matchedText: combined.substring(0, 120) + '...',
          });
        }
      }
    });

    // 3. Mistakes match
    const matchingMistakes = mistakes.filter(
      (m) =>
        m.questionText.toLowerCase().includes(query) ||
        m.explanation.toLowerCase().includes(query) ||
        m.concept.toLowerCase().includes(query)
    );

    // 4. Study Sessions match
    const matchingSessions = studySessions.filter(
      (s) =>
        s.description.toLowerCase().includes(query) ||
        s.importantPoints.toLowerCase().includes(query) ||
        s.doubts.toLowerCase().includes(query)
    );

    return {
      topics: matchingTopics.slice(0, 5),
      notes: matchingNotes.slice(0, 4),
      mistakes: matchingMistakes.slice(0, 4),
      sessions: matchingSessions.slice(0, 4),
    };
  }, [query, syllabus, notes, mistakes, studySessions]);

  const hasAnyResults =
    results.topics.length > 0 ||
    results.notes.length > 0 ||
    results.mistakes.length > 0 ||
    results.sessions.length > 0;

  if (!isSearchOpen) return null;

  return (
    <div
      onClick={() => setIsSearchOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-16 backdrop-blur-xs cursor-pointer"
    >
      <div
        id="modal-global-search"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl cursor-default rounded-2xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            id="input-global-search"
            type="text"
            placeholder="Search topics, formulas, notes, mistakes, sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                setIsSearchOpen(false);
              }
            }}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              title="Clear text"
              className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            id="btn-esc-close-search"
            type="button"
            onClick={() => setIsSearchOpen(false)}
            title="Close search (Esc)"
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
          >
            <span className="text-[11px] font-bold tracking-tight">ESC</span>
            <X className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[65vh] overflow-y-auto p-3 space-y-4">
          {!query ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                Quick Search across all GATE 2028 DA preparation
              </p>
              <p className="mt-1">
                Try searching "Normalization", "Eigenvalues", "Bayes", "PCA", "A* search"
              </p>
            </div>
          ) : !hasAnyResults ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found for "{searchQuery}".
            </div>
          ) : (
            <>
              {/* Topics Matches */}
              {results.topics.length > 0 && (
                <div>
                  <h3 className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Syllabus Topics
                  </h3>
                  <div className="space-y-1">
                    {results.topics.map(({ topic, subject }) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          navigateToTopic(topic.id, 'overview');
                          setIsSearchOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl p-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">
                              {topic.name}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {subject.name}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Matches */}
              {results.notes.length > 0 && (
                <div>
                  <h3 className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Digital Notes
                  </h3>
                  <div className="space-y-1">
                    {results.notes.map(({ topic, subject, matchedText }) => (
                      <button
                        key={`note-${topic.id}`}
                        onClick={() => {
                          navigateToTopic(topic.id, 'notes');
                          setIsSearchOpen(false);
                        }}
                        className="flex w-full items-start justify-between rounded-xl p-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">
                              {topic.name} Notes
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 dark:text-slate-400">
                              {matchedText}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mistakes Matches */}
              {results.mistakes.length > 0 && (
                <div>
                  <h3 className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Mistakes Notebook
                  </h3>
                  <div className="space-y-1">
                    {results.mistakes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setActiveTab('revision');
                          setIsSearchOpen(false);
                        }}
                        className="flex w-full items-start justify-between rounded-xl p-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {m.questionText}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              Concept: {m.concept} • Status: {m.status}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Study Sessions Matches */}
              {results.sessions.length > 0 && (
                <div>
                  <h3 className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Logged Study Sessions
                  </h3>
                  <div className="space-y-1">
                    {results.sessions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveTab('study-sessions');
                          setIsSearchOpen(false);
                        }}
                        className="flex w-full items-start justify-between rounded-xl p-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {s.description}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {s.date} • {s.durationMinutes} mins
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
