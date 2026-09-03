import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import {
  Brain,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  ChevronRight,
  Filter,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizzesPage: React.FC = () => {
  const {
    syllabus,
    questionBank,
    quizAttempts,
    getUnusedQuestionsForTopic,
    resetTopicQuestionHistory,
    recordQuizAttempt,
    addGeneratedQuestions,
    todayStr,
    navigateToTopic,
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(syllabus[0]?.id || '');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(syllabus[0]?.topics[0]?.id || '');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [pyqOnly, setPyqOnly] = useState<boolean>(false);
  const [historyResetMsg, setHistoryResetMsg] = useState<string>('');

  // Quiz running state
  const [quizState, setQuizState] = useState<'setup' | 'running' | 'completed'>('setup');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Keep topic cascading with subject
  const currentSubject = syllabus.find((s) => s.id === selectedSubjectId) || syllabus[0];
  const currentTopics = currentSubject?.topics || [];
  const activeTopic = currentTopics.find((t) => t.id === selectedTopicId) || currentTopics[0];

  const topicQuestionsInBank = useMemo(() => {
    if (!activeTopic) return [];
    return questionBank.filter((q) => q.topicId === activeTopic.id);
  }, [questionBank, activeTopic]);

  const unusedQuestions = useMemo(() => {
    if (!activeTopic) return [];
    return getUnusedQuestionsForTopic(activeTopic.id);
  }, [getUnusedQuestionsForTopic, activeTopic]);

  const handleSubjectChange = (sId: string) => {
    setSelectedSubjectId(sId);
    const subj = syllabus.find((s) => s.id === sId);
    if (subj && subj.topics.length > 0) {
      setSelectedTopicId(subj.topics[0].id);
    }
  };

  const handleResetTopicHistory = () => {
    if (!activeTopic) return;
    resetTopicQuestionHistory(activeTopic.id);
    setHistoryResetMsg(`Attempt history for "${activeTopic.name}" reset! All ${topicQuestionsInBank.length} questions are now unattempted.`);
    setTimeout(() => setHistoryResetMsg(''), 4500);
  };

  const handleStartQuiz = async () => {
    if (!activeTopic) return;

    // 1. Get unused questions first (guarantee non-repetition)
    let pool = getUnusedQuestionsForTopic(activeTopic.id);

    if (difficultyFilter !== 'All') {
      const diffFiltered = pool.filter((q) => q.difficulty === difficultyFilter);
      if (diffFiltered.length >= questionCount) {
        pool = diffFiltered;
      }
    }
    if (pyqOnly) {
      const pyqFiltered = pool.filter((q) => q.isPYQ);
      if (pyqFiltered.length >= questionCount) {
        pool = pyqFiltered;
      }
    }

    // 2. Generate with AI or backend if needed to fill the requested questionCount
    if (pool.length < questionCount) {
      setIsAiLoading(true);
      try {
        const needed = questionCount - pool.length;
        const res = await fetch('/api/ai/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topicName: activeTopic.name,
            subjectName: currentSubject.name,
            count: Math.max(needed, 5),
            difficulty: difficultyFilter === 'All' ? 'Medium' : difficultyFilter,
            excludeQuestions: pool.map((q) => q.question),
          }),
        });
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          const newQs: Question[] = data.questions.map((q: any, i: number) => ({
            id: `ai-quiz-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
            topicId: activeTopic.id,
            subjectId: currentSubject.id,
            question: q.question,
            options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: q.correctAnswer || q.correctOption || 'A',
            explanation: q.explanation || 'Detailed GATE conceptual explanation.',
            difficulty: q.difficulty || (difficultyFilter === 'All' ? 'Medium' : difficultyFilter),
            concept: q.concept || activeTopic.name,
            isPYQ: false,
          }));
          addGeneratedQuestions(newQs);
          pool = [...pool, ...newQs];
        }
      } catch (e) {
        console.error('AI question generation error:', e);
      } finally {
        setIsAiLoading(false);
      }
    }

    // 3. If pool still has fewer than questionCount, backfill with questions from this topic bank
    if (pool.length < questionCount) {
      const allTopicQs = questionBank.filter((q) => q.topicId === activeTopic.id);
      const existingIds = new Set(pool.map((q) => q.id));
      for (const q of allTopicQs) {
        if (!existingIds.has(q.id)) {
          pool.push(q);
          if (pool.length >= questionCount) break;
        }
      }
    }

    // 4. If pool still has fewer than questionCount, backfill from sibling topics in the same subject
    if (pool.length < questionCount) {
      const sisterTopicIds = new Set(currentTopics.map((t) => t.id));
      const sisterQs = questionBank.filter((q) => sisterTopicIds.has(q.topicId) && q.topicId !== activeTopic.id);
      const existingIds = new Set(pool.map((q) => q.id));
      for (const q of sisterQs) {
        if (!existingIds.has(q.id)) {
          pool.push(q);
          if (pool.length >= questionCount) break;
        }
      }
    }

    // 5. Ultimate guarantee: if pool has items but still fewer than questionCount, cycle with fresh IDs
    if (pool.length > 0 && pool.length < questionCount) {
      const basePool = [...pool];
      let k = 0;
      while (pool.length < questionCount) {
        const item = basePool[k % basePool.length];
        pool.push({
          ...item,
          id: `${item.id}-cycle-${Date.now()}-${k}`,
        });
        k++;
      }
    }

    // Shuffle pool to ensure varied, fresh experience
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, questionCount);
    setActiveQuestions(selected);
    setCurrentIdx(0);
    setUserAnswers({});
    setQuizStartTime(Date.now());
    setQuizState('running');
  };

  const handleSubmitQuiz = () => {
    const totalSec = Math.round((Date.now() - quizStartTime) / 1000);
    setElapsedTime(totalSec);

    let score = 0;
    activeQuestions.forEach((q) => {
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
        score++;
      }
    });

    const accuracy = activeQuestions.length > 0 ? Math.round((score / activeQuestions.length) * 100) : 0;

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
        topicId: activeTopic.id,
        date: todayStr,
        totalQuestions: activeQuestions.length,
        score,
        accuracy,
        durationSeconds: totalSec,
      },
      activeQuestions,
      userAnswers
    );

    setQuizState('completed');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            Quizzes & PYQ Bank
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Topic-wise practice quizzes, non-repeating tests & authentic GATE PYQs
          </p>
        </div>

        {/* Total quiz attempts summary */}
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-right">
            <span className="block text-[11px] font-bold text-neutral-500">
              Total Attempts
            </span>
            <span className="text-base font-black text-purple-600 dark:text-purple-400">
              {quizAttempts.length}
            </span>
          </div>
          <div className="h-7 w-px bg-neutral-200 dark:bg-neutral-800" />
          <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {quizAttempts.length > 0
              ? `${Math.round(
                  quizAttempts.reduce((acc, q) => acc + q.accuracy, 0) / quizAttempts.length
                )}% Avg Accuracy`
              : '0% Avg Accuracy'}
          </div>
        </div>
      </div>

      {quizState === 'setup' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left 2 Cols: Setup Quiz Form */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Configure Practice Quiz
                </h3>
                <p className="text-xs text-neutral-500">
                  Select your subject, topic, and difficulty to begin
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Subject & Topic Selector */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Select Subject
                  </label>
                  <select
                    id="select-quiz-subject"
                    value={selectedSubjectId}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    {syllabus.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Select Topic
                  </label>
                  <select
                    id="select-quiz-topic"
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    {currentTopics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Question count */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Number of Questions
                </label>
                <div className="mt-1.5 flex gap-2">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                        questionCount === num
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'border border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty & PYQ filter */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Difficulty Level
                  </label>
                  <div className="mt-1.5 flex gap-1.5">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficultyFilter(diff)}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                          difficultyFilter === diff
                            ? 'bg-purple-700 text-white shadow-xs dark:bg-purple-600'
                            : 'border border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer mt-5">
                    <input
                      type="checkbox"
                      checked={pyqOnly}
                      onChange={(e) => setPyqOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      Authentic GATE PYQs Only
                    </span>
                  </label>
                </div>
              </div>

              {/* Topic Question Bank Availability & Reset Option */}
              <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4 dark:border-purple-900/60 dark:bg-purple-950/30">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-950 dark:text-purple-200">
                      <span>📚 Topic Question Pool:</span>
                      <span className="font-extrabold text-purple-700 dark:text-purple-300">{activeTopic?.name}</span>
                    </span>
                    <p className="mt-0.5 text-[11px] text-purple-800/80 dark:text-purple-300/80">
                      <span className="font-bold text-purple-900 dark:text-purple-100">{unusedQuestions.length}</span> unattempted questions ready &bull; <span className="font-bold text-purple-900 dark:text-purple-100">{topicQuestionsInBank.length}</span> total authentic GATE DA questions in topic bank
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetTopicHistory}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-white px-3 py-1.5 text-[11px] font-bold text-purple-700 shadow-2xs transition hover:bg-purple-100 active:scale-95 dark:border-purple-800 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/70"
                    title="Mark all questions in this topic as unattempted so you can test them again"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Topic History</span>
                  </button>
                </div>

                {historyResetMsg && (
                  <div className="mt-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-2 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    ✓ {historyResetMsg}
                  </div>
                )}
              </div>

              <button
                id="btn-start-practice-quiz"
                onClick={handleStartQuiz}
                disabled={isAiLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3 text-xs font-bold text-white shadow-md transition hover:bg-purple-700 active:scale-95 disabled:opacity-50 sm:text-sm"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>{isAiLoading ? 'Preparing Questions...' : `Start Practice Quiz (${questionCount} Questions)`}</span>
              </button>
            </div>
          </div>

          {/* Right Col: Recent Quiz Attempts */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white border-b border-neutral-100 pb-3 dark:border-neutral-800">
              Recent Quiz History
            </h3>

            <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {quizAttempts.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400">
                  No quizzes attempted yet. Configure and start your first test!
                </div>
              ) : (
                quizAttempts.map((attempt) => {
                  const subject = syllabus.find((s) => s.id === attempt.subjectId);
                  const topic = subject?.topics.find((t) => t.id === attempt.topicId);

                  return (
                    <div
                      key={attempt.id}
                      className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {topic?.name || 'Topic'}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            attempt.accuracy >= 80
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : attempt.accuracy >= 50
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {attempt.accuracy}% Acc
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500">
                        <span>
                          Score: {attempt.score}/{attempt.totalQuestions}
                        </span>
                        <span>{attempt.date}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Running Quiz Player */}
      {quizState === 'running' && activeQuestions.length > 0 && (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {currentSubject.name} → {activeTopic.name}
              </span>
              <p className="text-xs text-neutral-500">
                Question {currentIdx + 1} of {activeQuestions.length}
              </p>
            </div>
            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              {activeQuestions[currentIdx].difficulty}
            </span>
          </div>

          <div className="mt-6 space-y-6">
            <div className="text-sm font-semibold text-neutral-900 leading-relaxed dark:text-white sm:text-base">
              {activeQuestions[currentIdx].question}
            </div>

            <div className="space-y-3">
              {activeQuestions[currentIdx].options.map((opt, optIdx) => {
                const qId = activeQuestions[currentIdx].id;
                const isSelected = userAnswers[qId] === opt;
                return (
                  <button
                    key={optIdx}
                    onClick={() => setUserAnswers((prev) => ({ ...prev, [qId]: opt }))}
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
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => i - 1)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                Previous
              </button>

              {currentIdx < activeQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((i) => i + 1)}
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

      {/* Completed Quiz Screen */}
      {quizState === 'completed' && (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
          <div className="rounded-2xl bg-neutral-50 p-6 text-center dark:bg-neutral-800/40">
            <h3 className="text-xl font-black text-neutral-900 dark:text-white">
              Quiz Completed!
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Time spent: {elapsedTime} seconds
            </p>

            <div className="mt-4 flex justify-center gap-6">
              <div>
                <span className="block text-2xl font-black text-purple-600 dark:text-purple-400">
                  {
                    activeQuestions.filter(
                      (q) =>
                        userAnswers[q.id] === q.correctAnswer ||
                        (q.options && q.options[['A', 'B', 'C', 'D'].indexOf(q.correctAnswer)] === userAnswers[q.id])
                    ).length
                  }{' '}
                  / {activeQuestions.length}
                </span>
                <span className="text-[11px] text-neutral-400">Score</span>
              </div>

              <div className="h-10 w-px bg-neutral-200 dark:bg-neutral-700" />

              <div>
                <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {Math.round(
                    (activeQuestions.filter(
                      (q) =>
                        userAnswers[q.id] === q.correctAnswer ||
                        (q.options && q.options[['A', 'B', 'C', 'D'].indexOf(q.correctAnswer)] === userAnswers[q.id])
                    ).length /
                      activeQuestions.length) *
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
                Configure New Quiz
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              Detailed Solutions & Explanations
            </h4>

            {activeQuestions.map((q, idx) => {
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
                      {isCorrect ? 'Correct' : 'Incorrect'}
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
  );
};
