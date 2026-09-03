import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProgressStatus, Question } from '../types';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  FileText,
  Brain,
  Star,
  Plus,
  Save,
  Check,
  AlertCircle,
  TrendingUp,
  HelpCircle,
  Play,
  RotateCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TopicDetailPage: React.FC = () => {
  const {
    selectedTopicId,
    topicDetailTab,
    setTopicDetailTab,
    syllabus,
    studySessions,
    quizAttempts,
    mistakes,
    setActiveTab,
    updateTopicProgress,
    toggleTopicRevisionMark,
    getTopicNote,
    saveTopicNote,
    setIsAddSessionOpen,
    getUnusedQuestionsForTopic,
    resetTopicQuestionHistory,
    recordQuizAttempt,
    addGeneratedQuestions,
    questionBank,
    todayStr,
  } = useApp();

  // Find subject and topic
  const { currentSubject, currentTopic } = useMemo(() => {
    for (const subj of syllabus) {
      const top = subj.topics.find((t) => t.id === selectedTopicId);
      if (top) return { currentSubject: subj, currentTopic: top };
    }
    return { currentSubject: syllabus[0], currentTopic: syllabus[0]?.topics[0] };
  }, [syllabus, selectedTopicId]);

  // Notes state
  const existingNote = getTopicNote(currentTopic?.id || '');
  const [importantConcepts, setImportantConcepts] = useState(existingNote.importantConcepts || '');
  const [importantFormulas, setImportantFormulas] = useState(existingNote.importantFormulas || '');
  const [examples, setExamples] = useState(existingNote.examples || '');
  const [myUnderstanding, setMyUnderstanding] = useState(existingNote.myUnderstanding || '');
  const [doubts, setDoubts] = useState(existingNote.doubts || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isAiGeneratingNotes, setIsAiGeneratingNotes] = useState(false);

  useEffect(() => {
    if (currentTopic) {
      const note = getTopicNote(currentTopic.id);
      setImportantConcepts(note.importantConcepts || '');
      setImportantFormulas(note.importantFormulas || '');
      setExamples(note.examples || '');
      setMyUnderstanding(note.myUnderstanding || '');
      setDoubts(note.doubts || '');
    }
  }, [currentTopic?.id, getTopicNote]);

  // Quiz Player State
  const [quizSize, setQuizSize] = useState<number>(5);
  const [quizState, setQuizState] = useState<'setup' | 'running' | 'completed'>('setup');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isGeneratingAiQuestions, setIsGeneratingAiQuestions] = useState<boolean>(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [topicResetMsg, setTopicResetMsg] = useState<string>('');

  const topicQuestionsInBank = useMemo(() => {
    if (!currentTopic) return [];
    return questionBank.filter((q) => q.topicId === currentTopic.id);
  }, [questionBank, currentTopic]);

  const unusedQuestions = useMemo(() => {
    if (!currentTopic) return [];
    return getUnusedQuestionsForTopic(currentTopic.id);
  }, [getUnusedQuestionsForTopic, currentTopic]);

  const handleResetTopicHistory = () => {
    if (!currentTopic) return;
    resetTopicQuestionHistory(currentTopic.id);
    setTopicResetMsg(`Attempt history for "${currentTopic.name}" reset! All ${topicQuestionsInBank.length} questions are now unattempted.`);
    setTimeout(() => setTopicResetMsg(''), 4500);
  };

  if (!currentTopic || !currentSubject) {
    return (
      <div className="py-12 text-center text-xs text-neutral-400">
        Topic not found. Please select a topic from the syllabus.
      </div>
    );
  }

  // Topic-specific analytics
  const topicSessions = studySessions.filter((s) => s.topicId === currentTopic.id);
  const topicTotalMinutes = topicSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const topicQuizAttempts = quizAttempts.filter((q) => q.topicId === currentTopic.id);
  const topicMistakes = mistakes.filter((m) => m.topicId === currentTopic.id);
  const topicAvgAccuracy =
    topicQuizAttempts.length > 0
      ? Math.round(
          topicQuizAttempts.reduce((acc, q) => acc + q.accuracy, 0) / topicQuizAttempts.length
        )
      : null;

  // Save notes handler
  const handleSaveNotes = () => {
    saveTopicNote(currentTopic.id, {
      importantConcepts,
      importantFormulas,
      examples,
      myUnderstanding,
      doubts,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // AI Notes Generator
  const handleAiGenerateNotes = async () => {
    setIsAiGeneratingNotes(true);
    try {
      const response = await fetch('/api/ai/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicName: currentTopic.name,
          subjectName: currentSubject.name,
        }),
      });
      const data = await response.json();
      if (data.notes) {
        if (data.notes.importantConcepts) setImportantConcepts(data.notes.importantConcepts);
        if (data.notes.importantFormulas) setImportantFormulas(data.notes.importantFormulas);
        if (data.notes.examples) setExamples(data.notes.examples);
        if (data.notes.myUnderstanding) setMyUnderstanding(data.notes.myUnderstanding);
        saveTopicNote(currentTopic.id, {
          importantConcepts: data.notes.importantConcepts,
          importantFormulas: data.notes.importantFormulas,
          examples: data.notes.examples,
          myUnderstanding: data.notes.myUnderstanding,
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      }
    } catch (e) {
      console.error('Failed to generate AI notes', e);
    } finally {
      setIsAiGeneratingNotes(false);
    }
  };

  // Start Quiz
  const handleStartQuiz = async () => {
    // 1. Get unused questions first (guarantee NO REPETITION!)
    let available = getUnusedQuestionsForTopic(currentTopic.id);

    // If not enough questions, generate new ones on-the-fly with AI or fallback
    if (available.length < quizSize) {
      setIsGeneratingAiQuestions(true);
      try {
        const needed = quizSize - available.length;
        const res = await fetch('/api/ai/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topicName: currentTopic.name,
            subjectName: currentSubject.name,
            count: Math.max(needed, 5),
            difficulty: 'Medium',
            excludeQuestions: available.map((q) => q.question),
          }),
        });
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          const formattedQuestions: Question[] = data.questions.map((q: any, i: number) => ({
            id: `ai-q-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
            topicId: currentTopic.id,
            subjectId: currentSubject.id,
            question: q.question,
            options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: q.correctAnswer || q.correctOption || 'A',
            explanation: q.explanation || 'Detailed GATE conceptual explanation.',
            difficulty: q.difficulty || 'Medium',
            concept: q.concept || currentTopic.name,
            isPYQ: false,
          }));
          addGeneratedQuestions(formattedQuestions);
          available = [...available, ...formattedQuestions];
        }
      } catch (err) {
        console.error('AI question generation error:', err);
      } finally {
        setIsGeneratingAiQuestions(false);
      }
    }

    // 3. If still less than quizSize, backfill with questions from topic bank
    if (available.length < quizSize) {
      const allTopicQs = questionBank.filter((q) => q.topicId === currentTopic.id);
      const existingIds = new Set(available.map((q) => q.id));
      for (const q of allTopicQs) {
        if (!existingIds.has(q.id)) {
          available.push(q);
          if (available.length >= quizSize) break;
        }
      }
    }

    // 4. If still less than quizSize, backfill from sibling topics in the same subject
    if (available.length < quizSize) {
      const sisterTopicIds = new Set(currentSubject.topics.map((t) => t.id));
      const sisterQs = questionBank.filter((q) => sisterTopicIds.has(q.topicId) && q.topicId !== currentTopic.id);
      const existingIds = new Set(available.map((q) => q.id));
      for (const q of sisterQs) {
        if (!existingIds.has(q.id)) {
          available.push(q);
          if (available.length >= quizSize) break;
        }
      }
    }

    // 5. Ultimate guarantee: if available has items but still fewer than quizSize, cycle with fresh IDs
    if (available.length > 0 && available.length < quizSize) {
      const basePool = [...available];
      let k = 0;
      while (available.length < quizSize) {
        const item = basePool[k % basePool.length];
        available.push({
          ...item,
          id: `${item.id}-cycle-${Date.now()}-${k}`,
        });
        k++;
      }
    }

    // Shuffle pool to ensure fresh order
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, quizSize);
    setActiveQuizQuestions(selected);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizStartTime(Date.now());
    setQuizState('running');
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    const elapsedSeconds = Math.round((Date.now() - quizStartTime) / 1000);
    setTimeSpentSeconds(elapsedSeconds);

    let correctCount = 0;
    activeQuizQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (!ans) return;

      const trimmedAns = ans.trim();
      const trimmedCorrect = (q.correctAnswer || '').trim();

      // Check 1: Exact letter match ('A', 'B', 'C', 'D')
      const isLetterMatch = trimmedAns.toUpperCase() === trimmedCorrect.toUpperCase();

      // Check 2: Option text match if correctAnswer is letter 'A', 'B', 'C', 'D'
      const letterIdx = ['A', 'B', 'C', 'D'].indexOf(trimmedCorrect.toUpperCase());
      const isTextMatch = letterIdx >= 0 && q.options && q.options[letterIdx] === trimmedAns;

      // Check 3: If correctAnswer is the full text
      const isFullMatch = trimmedAns === trimmedCorrect;

      if (isLetterMatch || isTextMatch || isFullMatch) {
        correctCount++;
      }
    });

    const accuracy = activeQuizQuestions.length > 0 ? Math.round((correctCount / activeQuizQuestions.length) * 100) : 0;

    // Trigger celebration if high score
    if (accuracy >= 80) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    recordQuizAttempt(
      {
        subjectId: currentSubject.id,
        topicId: currentTopic.id,
        date: todayStr,
        totalQuestions: activeQuizQuestions.length,
        score: correctCount,
        accuracy,
        durationSeconds: elapsedSeconds,
      },
      activeQuizQuestions,
      userAnswers
    );

    setQuizState('completed');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button & Breadcrumbs */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <button
            onClick={() => setActiveTab('syllabus')}
            className="flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Syllabus</span>
          </button>
          <span>/</span>
          <span>{currentSubject.name}</span>
          <span>/</span>
          <span className="font-bold text-neutral-800 dark:text-white">
            {currentTopic.name}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => toggleTopicRevisionMark(currentTopic.id)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
            currentTopic.isMarkedForRevision
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>
            {currentTopic.isMarkedForRevision ? 'Marked for Revision' : 'Mark for Revision'}
          </span>
        </button>
      </div>

      {/* Topic Title Card */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {currentSubject.name}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  currentTopic.status === 'mastered'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : currentTopic.status === 'practiced'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : currentTopic.status === 'learning'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                }`}
              >
                {currentTopic.status === 'not_started'
                  ? 'Not Started'
                  : currentTopic.status === 'learning'
                  ? 'Learning'
                  : currentTopic.status === 'practiced'
                  ? 'Practiced'
                  : 'Mastered'}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
              {currentTopic.name}
            </h1>
          </div>

          <button
            onClick={() => setIsAddSessionOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
          >
            <Clock className="h-4 w-4" />
            <span>+ Log Study Session</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex border-b border-neutral-200 text-xs font-bold dark:border-neutral-800">
          {[
            { id: 'overview', label: '📌 Overview & Progress' },
            { id: 'notes', label: '📝 Digital Notes' },
            { id: 'quiz', label: '🧠 Practice Quiz & PYQs' },
            { id: 'history', label: '⏱️ Study History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTopicDetailTab(tab.id)}
              className={`border-b-2 px-4 py-3 transition ${
                topicDetailTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {topicDetailTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500">Total Study Time</span>
              <div className="mt-1 text-xl font-black text-neutral-900 dark:text-white">
                {Math.floor(topicTotalMinutes / 60)}h {topicTotalMinutes % 60}m
              </div>
              <span className="text-[10px] text-neutral-400">
                {topicSessions.length} recorded session{topicSessions.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500">Quiz Accuracy</span>
              <div className="mt-1 text-xl font-black text-neutral-900 dark:text-white">
                {topicAvgAccuracy !== null ? `${topicAvgAccuracy}%` : '—'}
              </div>
              <span className="text-[10px] text-neutral-400">
                {topicQuizAttempts.length} quiz attempt{topicQuizAttempts.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500">Mistakes Logged</span>
              <div className="mt-1 text-xl font-black text-rose-600 dark:text-rose-400">
                {topicMistakes.filter((m) => m.status !== 'Understood').length}
              </div>
              <span className="text-[10px] text-neutral-400">
                {topicMistakes.length} total mistakes recorded
              </span>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500">Last Studied</span>
              <div className="mt-1 text-sm font-bold text-neutral-900 dark:text-white">
                {currentTopic.lastStudiedDate || 'Not yet studied'}
              </div>
              <span className="text-[10px] text-neutral-400">Recorded date</span>
            </div>
          </div>

          {/* Progress Sliders & Status Manager */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Topic Preparation Metrics
            </h3>
            <p className="text-xs text-neutral-500">
              Update your understanding, practice and revision levels for accurate scheduling
            </p>

            <div className="mt-6 space-y-5">
              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Topic Status
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(['not_started', 'learning', 'practiced', 'mastered'] as ProgressStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => updateTopicProgress(currentTopic.id, { status: st })}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                          currentTopic.status === st
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {st === 'not_started'
                          ? 'Not Started'
                          : st === 'learning'
                          ? 'In Progress (Learning)'
                          : st === 'practiced'
                          ? 'Practiced'
                          : 'Mastered (Ready for Exam)'}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Understanding Level</span>
                    <span className="text-blue-600">{currentTopic.understandingPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentTopic.understandingPercent}
                    onChange={(e) =>
                      updateTopicProgress(currentTopic.id, {
                        understandingPercent: Number(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Practice Level</span>
                    <span className="text-indigo-600">{currentTopic.practicePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentTopic.practicePercent}
                    onChange={(e) =>
                      updateTopicProgress(currentTopic.id, {
                        practicePercent: Number(e.target.value),
                      })
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Revision Level</span>
                    <span className="text-purple-600">{currentTopic.revisionPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentTopic.revisionPercent}
                    onChange={(e) =>
                      updateTopicProgress(currentTopic.id, {
                        revisionPercent: Number(e.target.value),
                      })
                    }
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subtopics Checklist */}
          {currentTopic.subtopics.length > 0 && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Subtopics & Concepts Checklist
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {currentTopic.subtopics.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3 text-xs font-medium text-neutral-800 dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>{st.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DIGITAL NOTES */}
      {topicDetailTab === 'notes' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            {/* Notes Header with AI Summarizer */}
            <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Topic Digital Notes & Formulas
                </h3>
                <p className="text-xs text-neutral-500">
                  Maintain your formula cheatsheet, examples, and personal insights
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiGenerateNotes}
                  disabled={isAiGeneratingNotes}
                  className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isAiGeneratingNotes ? 'Generating AI Notes...' : '✨ Generate AI Revision Summary'}</span>
                </button>

                <button
                  onClick={handleSaveNotes}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
                >
                  {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  <span>{isSaved ? 'Saved!' : 'Save Notes'}</span>
                </button>
              </div>
            </div>

            {/* Note Fields */}
            <div className="mt-6 space-y-5">
              {/* Important Concepts */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  📌 Important Concepts & Definitions
                </label>
                <textarea
                  rows={4}
                  value={importantConcepts}
                  onChange={(e) => setImportantConcepts(e.target.value)}
                  placeholder="Key concepts, principles, rules..."
                  className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 font-mono leading-relaxed focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              {/* Important Formulas */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  📐 Important Formulas & Equations
                </label>
                <textarea
                  rows={4}
                  value={importantFormulas}
                  onChange={(e) => setImportantFormulas(e.target.value)}
                  placeholder="Mathematical relations, theorems, shortcuts..."
                  className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 font-mono leading-relaxed focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              {/* Examples & Solved PYQs */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  💡 Solved Examples & PYQ Patterns
                </label>
                <textarea
                  rows={4}
                  value={examples}
                  onChange={(e) => setExamples(e.target.value)}
                  placeholder="Standard problem types, counterexamples..."
                  className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 font-mono leading-relaxed focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              {/* My Understanding & Doubts */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    🧠 In My Own Words / Intuition
                  </label>
                  <textarea
                    rows={3}
                    value={myUnderstanding}
                    onChange={(e) => setMyUnderstanding(e.target.value)}
                    placeholder="How would you explain this in simple terms?"
                    className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 leading-relaxed dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    ❓ Unresolved Doubts & Follow-ups
                  </label>
                  <textarea
                    rows={3}
                    value={doubts}
                    onChange={(e) => setDoubts(e.target.value)}
                    placeholder="Questions to ask the AI or review again..."
                    className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 leading-relaxed dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRACTICE QUIZ & PYQS */}
      {topicDetailTab === 'quiz' && (
        <div className="space-y-6">
          {quizState === 'setup' && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Topic Practice Quiz
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Solve authentic GATE DA questions and test your conceptual mastery
                  </p>
                </div>
              </div>

              <div className="mt-6 max-w-md space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Number of Questions
                  </label>
                  <div className="mt-2 flex gap-3">
                    {[5, 10, 15, 20].map((num) => (
                      <button
                        key={num}
                        onClick={() => setQuizSize(num)}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                          quizSize === num
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'border border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {num} Questions
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Question Bank Availability & Reset Option */}
                <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4 dark:border-purple-900/60 dark:bg-purple-950/30">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-950 dark:text-purple-200">
                        <span>📚 Topic Question Pool</span>
                      </span>
                      <p className="mt-0.5 text-[11px] text-purple-800/80 dark:text-purple-300/80">
                        <span className="font-bold text-purple-900 dark:text-purple-100">{unusedQuestions.length}</span> unattempted ready &bull; <span className="font-bold text-purple-900 dark:text-purple-100">{topicQuestionsInBank.length}</span> total GATE DA questions in bank
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetTopicHistory}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-white px-3 py-1.5 text-[11px] font-bold text-purple-700 shadow-2xs transition hover:bg-purple-100 active:scale-95 dark:border-purple-800 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/70"
                      title="Reset attempts for this topic so all questions can be attempted fresh"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset History</span>
                    </button>
                  </div>

                  {topicResetMsg && (
                    <div className="mt-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-2 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      ✓ {topicResetMsg}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartQuiz}
                  disabled={isGeneratingAiQuestions}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3 text-xs font-bold text-white shadow-md transition hover:bg-purple-700 active:scale-95 disabled:opacity-50 sm:text-sm"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>{isGeneratingAiQuestions ? 'Preparing Questions...' : `Start Practice Quiz (${quizSize} Questions)`}</span>
                </button>
              </div>
            </div>
          )}

          {quizState === 'running' && activeQuizQuestions.length > 0 && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              {/* Quiz Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
                <span className="text-xs font-bold text-neutral-500">
                  Question {currentQuestionIndex + 1} of {activeQuizQuestions.length}
                </span>
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {activeQuizQuestions[currentQuestionIndex].difficulty}
                </span>
              </div>

              {/* Current Question */}
              <div className="mt-6 space-y-6">
                <div className="text-sm font-semibold text-neutral-900 leading-relaxed dark:text-white sm:text-base">
                  {activeQuizQuestions[currentQuestionIndex].question}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {activeQuizQuestions[currentQuestionIndex].options.map((option, optIdx) => {
                    const qId = activeQuizQuestions[currentQuestionIndex].id;
                    const isSelected = userAnswers[qId] === option;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => setUserAnswers((prev) => ({ ...prev, [qId]: option }))}
                        className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-xs font-semibold transition sm:text-sm ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 text-purple-950 shadow-sm dark:border-purple-500 dark:bg-purple-950/80 dark:text-purple-100'
                            : 'border-neutral-200 bg-white text-neutral-900 hover:border-purple-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-purple-500'
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'border border-neutral-300 bg-neutral-100 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((i) => i - 1)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    Previous
                  </button>

                  {currentQuestionIndex < activeQuizQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((i) => i + 1)}
                      className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {quizState === 'completed' && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
              {/* Results Summary */}
              <div className="rounded-2xl bg-neutral-50 p-6 text-center dark:bg-neutral-800/40">
                <h3 className="text-xl font-black text-neutral-900 dark:text-white">
                  Quiz Completed!
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Time spent: {timeSpentSeconds} seconds
                </p>

                <div className="mt-4 flex justify-center gap-6">
                  <div>
                    <span className="block text-2xl font-black text-purple-600 dark:text-purple-400">
                      {
                        activeQuizQuestions.filter(
                          (q) =>
                            userAnswers[q.id] === q.correctAnswer ||
                            (q.options && q.options[['A', 'B', 'C', 'D'].indexOf(q.correctAnswer)] === userAnswers[q.id])
                        ).length
                      }{' '}
                      / {activeQuizQuestions.length}
                    </span>
                    <span className="text-[11px] text-neutral-400">Score</span>
                  </div>

                  <div className="h-10 w-px bg-neutral-200 dark:bg-neutral-700" />

                  <div>
                    <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {Math.round(
                        (activeQuizQuestions.filter(
                          (q) =>
                            userAnswers[q.id] === q.correctAnswer ||
                            (q.options && q.options[['A', 'B', 'C', 'D'].indexOf(q.correctAnswer)] === userAnswers[q.id])
                        ).length /
                          activeQuizQuestions.length) *
                          100
                      )}
                      %
                    </span>
                    <span className="text-[11px] text-neutral-400">Accuracy</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setQuizState('setup')}
                    className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-700"
                  >
                    Take Another Quiz
                  </button>
                  <button
                    onClick={() => setTopicDetailTab('overview')}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    Back to Overview
                  </button>
                </div>
              </div>

              {/* Detailed Question Review with Explanations */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Detailed Solutions & Mathematical Explanations
                </h4>

                {activeQuizQuestions.map((q, idx) => {
                  const userAns = userAnswers[q.id] || 'Not answered';
                  const isCorrect =
                    userAns === q.correctAnswer ||
                    (q.options && q.options[['A', 'B', 'C', 'D'].indexOf(q.correctAnswer)] === userAns);

                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border p-4 space-y-3 ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-950 dark:bg-emerald-950/20'
                          : 'border-rose-200 bg-rose-50/30 dark:border-rose-950 dark:bg-rose-950/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          Q{idx + 1}. {q.question}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {isCorrect ? 'Correct' : 'Incorrect (Added to Mistakes)'}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
                        <p>
                          Your answer:{' '}
                          <strong className={isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                            {userAns}
                          </strong>
                        </p>
                        <p>
                          Correct answer:{' '}
                          <strong className="text-emerald-600">{q.correctAnswer}</strong>
                        </p>
                      </div>

                      <div className="rounded-xl border border-neutral-200/60 bg-white p-3 text-xs leading-relaxed text-neutral-700 dark:border-neutral-700/60 dark:bg-neutral-800 dark:text-neutral-300">
                        <span className="font-bold text-neutral-900 dark:text-white block mb-1">
                          💡 Explanation:
                        </span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STUDY HISTORY */}
      {topicDetailTab === 'history' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Study History for {currentTopic.name}
            </h3>
            <p className="text-xs text-neutral-500">
              Total {topicSessions.length} session{topicSessions.length === 1 ? '' : 's'} logged
            </p>

            <div className="mt-4 space-y-3">
              {topicSessions.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  No study sessions recorded for this topic yet.
                </div>
              ) : (
                topicSessions.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">
                        {s.date} ({s.startTime} - {s.endTime})
                      </span>
                      <span className="font-extrabold text-blue-600">
                        {s.durationMinutes} mins
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
                      {s.description}
                    </p>
                    {s.importantPoints && (
                      <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                        📌 {s.importantPoints}
                      </p>
                    )}
                    {s.doubts && (
                      <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                        ❓ Doubts: {s.doubts}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
