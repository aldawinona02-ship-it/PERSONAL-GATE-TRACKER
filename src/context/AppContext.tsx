import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Subject,
  Topic,
  StudySession,
  DailyTask,
  TopicNote,
  Question,
  QuizAttempt,
  QuestionAttemptRecord,
  Mistake,
  UserSettings,
  ViewTab,
  ProgressStatus,
} from '../types';
import { StorageService, DEFAULT_SETTINGS } from '../services/storage';

interface AppContextType {
  // State
  syllabus: Subject[];
  studySessions: StudySession[];
  dailyTasks: DailyTask[];
  notes: Record<string, TopicNote>;
  questionBank: Question[];
  quizAttempts: QuizAttempt[];
  questionHistory: QuestionAttemptRecord[];
  mistakes: Mistake[];
  settings: UserSettings;
  activeTab: ViewTab;
  selectedTopicId: string | null;
  topicDetailTab: string;
  isAddSessionOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;

  // Actions
  setActiveTab: (tab: ViewTab) => void;
  setSelectedTopicId: (topicId: string | null) => void;
  setTopicDetailTab: (tab: string) => void;
  setIsAddSessionOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  navigateToTopic: (topicId: string, subTab?: string) => void;

  updateTopicProgress: (
    topicId: string,
    updates: Partial<{
      status: ProgressStatus;
      understandingPercent: number;
      practicePercent: number;
      revisionPercent: number;
      isMarkedForRevision: boolean;
    }>
  ) => void;
  toggleTopicRevisionMark: (topicId: string) => void;

  addStudySession: (session: Omit<StudySession, 'id' | 'createdAt'>) => void;
  deleteStudySession: (sessionId: string) => void;

  addTask: (title: string, date?: string, subjectId?: string, topicId?: string, priority?: 'low' | 'medium' | 'high') => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;

  saveTopicNote: (topicId: string, note: Partial<TopicNote>) => void;
  getTopicNote: (topicId: string) => TopicNote;

  recordQuizAttempt: (
    attempt: Omit<QuizAttempt, 'id' | 'timestamp' | 'questionIds' | 'userAnswers'>,
    questions: Question[],
    userAnswers: Record<string, string>
  ) => void;
  getUnusedQuestionsForTopic: (topicId: string) => Question[];
  addGeneratedQuestions: (questions: Question[]) => void;
  resetTopicQuestionHistory: (topicId: string) => void;

  updateMistakeStatus: (mistakeId: string, status: 'Reviewed' | 'Understood' | 'Retest Required', userNote?: string) => void;
  deleteMistake: (mistakeId: string) => void;

  updateSettings: (newSettings: Partial<UserSettings>) => void;
  loadDemoData: () => void;
  resetAllData: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;

  // Computed
  todayStr: string;
  daysToExam: number;
  currentStreak: number;
  longestStreak: number;
  todaySessions: StudySession[];
  todayStudyMinutes: number;
  todayTopicsCount: number;
  todayQuizAttempts: QuizAttempt[];
  todayAccuracy: number;
  todayTasks: DailyTask[];
  overallCompletion: number;
  allTopics: Topic[];
  subjectProgressList: Array<{
    subject: Subject;
    progressPercent: number;
    topicsCount: number;
    completedCount: number;
  }>;
  needsAttentionTopics: Array<{
    topic: Topic;
    subject: Subject;
    reason: string;
    accuracy?: number;
    mistakeCount: number;
    daysSinceStudy?: number;
  }>;
  dailyRecommendations: Array<{
    topic: Topic;
    subject: Subject;
    tag: string;
    reason: string;
    priority: number;
  }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syllabus, setSyllabus] = useState<Subject[]>(() => StorageService.getSyllabus());
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => StorageService.getSessions());
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => StorageService.getTasks());
  const [notes, setNotes] = useState<Record<string, TopicNote>>(() => StorageService.getNotes());
  const [questionBank, setQuestionBank] = useState<Question[]>(() => StorageService.getQuestions());
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => StorageService.getAttempts());
  const [questionHistory, setQuestionHistory] = useState<QuestionAttemptRecord[]>(() =>
    StorageService.getQuestionHistory()
  );
  const [mistakes, setMistakes] = useState<Mistake[]>(() => StorageService.getMistakes());
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());

  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [topicDetailTab, setTopicDetailTab] = useState<string>('overview');
  const [isAddSessionOpen, setIsAddSessionOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Save changes to localStorage
  useEffect(() => {
    StorageService.saveSyllabus(syllabus);
  }, [syllabus]);

  useEffect(() => {
    StorageService.saveSessions(studySessions);
  }, [studySessions]);

  useEffect(() => {
    StorageService.saveTasks(dailyTasks);
  }, [dailyTasks]);

  useEffect(() => {
    StorageService.saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    StorageService.saveQuestions(questionBank);
  }, [questionBank]);

  useEffect(() => {
    StorageService.saveAttempts(quizAttempts);
  }, [quizAttempts]);

  useEffect(() => {
    StorageService.saveQuestionHistory(questionHistory);
  }, [questionHistory]);

  useEffect(() => {
    StorageService.saveMistakes(mistakes);
  }, [mistakes]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  // Synchronize document theme class and colorScheme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [settings.theme]);

  // Today Date string YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Countdown to Exam Date (dynamic)
  const daysToExam = useMemo(() => {
    const target = new Date(settings.examDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [settings.examDate]);

  // All topics flat list
  const allTopics = useMemo(() => {
    return syllabus.flatMap((s) => s.topics);
  }, [syllabus]);

  // Streak calculations
  const { currentStreak, longestStreak } = useMemo(() => {
    if (studySessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Set of unique study dates (YYYY-MM-DD)
    const uniqueDates = Array.from(new Set(studySessions.map((s) => s.date))).sort();
    if (uniqueDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

    // Calculate longest streak
    let maxStreak = 1;
    let currentRun = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        currentRun++;
        if (currentRun > maxStreak) maxStreak = currentRun;
      } else if (diffDays > 1) {
        currentRun = 1;
      }
    }

    // Calculate current streak relative to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];

    const hasStudiedToday = uniqueDates.includes(todayString);
    const hasStudiedYesterday = uniqueDates.includes(yesterdayString);

    let activeStreak = 0;
    if (hasStudiedToday || hasStudiedYesterday) {
      let checkDate = hasStudiedToday ? new Date(today) : new Date(yesterday);
      while (true) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (uniqueDates.includes(checkStr)) {
          activeStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      currentStreak: activeStreak,
      longestStreak: Math.max(maxStreak, activeStreak),
    };
  }, [studySessions]);

  // Today's stats
  const todaySessions = useMemo(() => {
    return studySessions.filter((s) => s.date === todayStr);
  }, [studySessions, todayStr]);

  const todayStudyMinutes = useMemo(() => {
    return todaySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  }, [todaySessions]);

  const todayTopicsCount = useMemo(() => {
    return new Set(todaySessions.map((s) => s.topicId)).size;
  }, [todaySessions]);

  const todayQuizAttempts = useMemo(() => {
    return quizAttempts.filter((a) => a.date === todayStr);
  }, [quizAttempts, todayStr]);

  const todayAccuracy = useMemo(() => {
    if (todayQuizAttempts.length === 0) return 0;
    const sum = todayQuizAttempts.reduce((acc, q) => acc + q.accuracy, 0);
    return Math.round(sum / todayQuizAttempts.length);
  }, [todayQuizAttempts]);

  const todayTasks = useMemo(() => {
    return dailyTasks.filter((t) => t.date === todayStr);
  }, [dailyTasks, todayStr]);

  // Overall syllabus completion
  const overallCompletion = useMemo(() => {
    if (allTopics.length === 0) return 0;
    const totalScore = allTopics.reduce((acc, t) => {
      // Weight: understanding (40%), practice (40%), revision (20%)
      const score = (t.understandingPercent * 0.4) + (t.practicePercent * 0.4) + (t.revisionPercent * 0.2);
      return acc + score;
    }, 0);
    return Math.round(totalScore / allTopics.length);
  }, [allTopics]);

  // Subject Progress breakdown
  const subjectProgressList = useMemo(() => {
    return syllabus.map((subj) => {
      const count = subj.topics.length;
      if (count === 0) {
        return { subject: subj, progressPercent: 0, topicsCount: 0, completedCount: 0 };
      }
      const sum = subj.topics.reduce((acc, t) => {
        const score = (t.understandingPercent * 0.4) + (t.practicePercent * 0.4) + (t.revisionPercent * 0.2);
        return acc + score;
      }, 0);
      const completed = subj.topics.filter((t) => t.status === 'mastered' || t.understandingPercent >= 80).length;
      return {
        subject: subj,
        progressPercent: Math.round(sum / count),
        topicsCount: count,
        completedCount: completed,
      };
    });
  }, [syllabus]);

  // Revision & Needs Attention topics
  const needsAttentionTopics = useMemo(() => {
    const list: Array<{
      topic: Topic;
      subject: Subject;
      reason: string;
      accuracy?: number;
      mistakeCount: number;
      daysSinceStudy?: number;
    }> = [];

    syllabus.forEach((subj) => {
      subj.topics.forEach((topic) => {
        const topicAttempts = quizAttempts.filter((a) => a.topicId === topic.id);
        const topicMistakes = mistakes.filter((m) => m.topicId === topic.id && m.status !== 'Understood');

        let avgAccuracy: number | undefined = undefined;
        if (topicAttempts.length > 0) {
          const totalAcc = topicAttempts.reduce((acc, a) => acc + a.accuracy, 0);
          avgAccuracy = Math.round(totalAcc / topicAttempts.length);
        }

        let daysSinceStudy: number | undefined = undefined;
        if (topic.lastStudiedDate) {
          const diff = Math.round(
            (new Date(todayStr).getTime() - new Date(topic.lastStudiedDate).getTime()) / (1000 * 3600 * 24)
          );
          daysSinceStudy = diff >= 0 ? diff : 0;
        }

        let reason = '';
        if (topic.isMarkedForRevision) {
          reason = 'Marked for Revision';
        } else if (avgAccuracy !== undefined && avgAccuracy < 65) {
          reason = `Low Quiz Accuracy (${avgAccuracy}%)`;
        } else if (topicMistakes.length >= 2) {
          reason = `${topicMistakes.length} Unresolved Mistakes`;
        } else if (daysSinceStudy !== undefined && daysSinceStudy >= 7) {
          reason = `Last studied ${daysSinceStudy} days ago`;
        }

        if (reason) {
          list.push({
            topic,
            subject: subj,
            reason,
            accuracy: avgAccuracy,
            mistakeCount: topicMistakes.length,
            daysSinceStudy,
          });
        }
      });
    });

    return list;
  }, [syllabus, quizAttempts, mistakes, todayStr]);

  // Daily Recommendations ("What should I study today?")
  const dailyRecommendations = useMemo(() => {
    const list: Array<{
      topic: Topic;
      subject: Subject;
      tag: string;
      reason: string;
      priority: number;
    }> = [];

    syllabus.forEach((subj) => {
      subj.topics.forEach((topic) => {
        const topicAttempts = quizAttempts.filter((a) => a.topicId === topic.id);
        const topicMistakes = mistakes.filter((m) => m.topicId === topic.id && m.status !== 'Understood');

        let avgAccuracy = 100;
        if (topicAttempts.length > 0) {
          const totalAcc = topicAttempts.reduce((acc, a) => acc + a.accuracy, 0);
          avgAccuracy = Math.round(totalAcc / topicAttempts.length);
        }

        let daysSince = 999;
        if (topic.lastStudiedDate) {
          daysSince = Math.max(
            0,
            Math.round((new Date(todayStr).getTime() - new Date(topic.lastStudiedDate).getTime()) / (1000 * 3600 * 24))
          );
        }

        // Priority calculation
        if (topic.isMarkedForRevision) {
          list.push({
            topic,
            subject: subj,
            tag: 'Revision Due',
            reason: 'You scheduled this topic for priority revision.',
            priority: 100,
          });
        } else if (topicAttempts.length > 0 && avgAccuracy < 60) {
          list.push({
            topic,
            subject: subj,
            tag: 'Needs Reinforcement',
            reason: `Accuracy is currently ${avgAccuracy}% with ${topicMistakes.length} mistakes.`,
            priority: 90 + (100 - avgAccuracy) / 10,
          });
        } else if (topic.status === 'not_started') {
          list.push({
            topic,
            subject: subj,
            tag: 'New Topic',
            reason: 'Not started yet in your syllabus roadmap.',
            priority: 60,
          });
        } else if (daysSince >= 6 && topic.status !== 'mastered') {
          list.push({
            topic,
            subject: subj,
            tag: 'Spaced Recall',
            reason: `Last reviewed ${daysSince} days ago.`,
            priority: 70 + Math.min(daysSince, 20),
          });
        } else if (topic.understandingPercent > 0 && topic.practicePercent < 50) {
          list.push({
            topic,
            subject: subj,
            tag: 'Practice Needed',
            reason: `Concept understood (${topic.understandingPercent}%), but practice is low (${topic.practicePercent}%).`,
            priority: 65,
          });
        }
      });
    });

    return list.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }, [syllabus, quizAttempts, mistakes, todayStr]);

  // Actions
  const navigateToTopic = useCallback((topicId: string, subTab: string = 'overview') => {
    setSelectedTopicId(topicId);
    setTopicDetailTab(subTab);
    setActiveTab('topic-detail');
  }, []);

  const updateTopicProgress = useCallback(
    (
      topicId: string,
      updates: Partial<{
        status: ProgressStatus;
        understandingPercent: number;
        practicePercent: number;
        revisionPercent: number;
        isMarkedForRevision: boolean;
      }>
    ) => {
      setSyllabus((prev) =>
        prev.map((subj) => ({
          ...subj,
          topics: subj.topics.map((t) => {
            if (t.id === topicId) {
              return { ...t, ...updates };
            }
            return t;
          }),
        }))
      );
    },
    []
  );

  const toggleTopicRevisionMark = useCallback((topicId: string) => {
    setSyllabus((prev) =>
      prev.map((subj) => ({
        ...subj,
        topics: subj.topics.map((t) => {
          if (t.id === topicId) {
            return { ...t, isMarkedForRevision: !t.isMarkedForRevision };
          }
          return t;
        }),
      }))
    );
  }, []);

  const addStudySession = useCallback(
    (sessionData: Omit<StudySession, 'id' | 'createdAt'>) => {
      const newSession: StudySession = {
        ...sessionData,
        id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };

      setStudySessions((prev) => [newSession, ...prev]);

      // Update topic status and lastStudiedDate
      setSyllabus((prev) =>
        prev.map((subj) => ({
          ...subj,
          topics: subj.topics.map((t) => {
            if (t.id === sessionData.topicId) {
              const currentStatus = t.status;
              const newStatus = currentStatus === 'not_started' ? 'learning' : currentStatus;
              const newUnderstanding = Math.min(100, Math.max(t.understandingPercent, sessionData.confidence * 20));
              return {
                ...t,
                status: newStatus,
                understandingPercent: newUnderstanding,
                lastStudiedDate: sessionData.date,
              };
            }
            return t;
          }),
        }))
      );
    },
    []
  );

  const deleteStudySession = useCallback((sessionId: string) => {
    setStudySessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  const addTask = useCallback(
    (
      title: string,
      date: string = todayStr,
      subjectId?: string,
      topicId?: string,
      priority: 'low' | 'medium' | 'high' = 'medium'
    ) => {
      const newTask: DailyTask = {
        id: `task-${Date.now()}`,
        date,
        title,
        completed: false,
        subjectId,
        topicId,
        priority,
        createdAt: new Date().toISOString(),
      };
      setDailyTasks((prev) => [newTask, ...prev]);
    },
    [todayStr]
  );

  const toggleTask = useCallback((taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setDailyTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const saveTopicNote = useCallback((topicId: string, noteData: Partial<TopicNote>) => {
    setNotes((prev) => {
      const existing = prev[topicId] || {
        topicId,
        importantConcepts: '',
        importantFormulas: '',
        examples: '',
        myUnderstanding: '',
        doubts: '',
        mistakes: '',
        lastUpdated: new Date().toISOString(),
      };
      return {
        ...prev,
        [topicId]: {
          ...existing,
          ...noteData,
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  }, []);

  const getTopicNote = useCallback(
    (topicId: string): TopicNote => {
      return (
        notes[topicId] || {
          topicId,
          importantConcepts: '',
          importantFormulas: '',
          examples: '',
          myUnderstanding: '',
          doubts: '',
          mistakes: '',
          lastUpdated: '',
        }
      );
    },
    [notes]
  );

  // Filter out any questions already attempted for this topic to ensure NO REPEATED QUESTIONS!
  const getUnusedQuestionsForTopic = useCallback(
    (topicId: string): Question[] => {
      const attemptedQuestionIds = new Set(
        questionHistory.filter((h) => h.topicId === topicId).map((h) => h.questionId)
      );

      const allMatching = questionBank.filter((q) => q.topicId === topicId);
      return allMatching.filter((q) => !attemptedQuestionIds.has(q.id));
    },
    [questionBank, questionHistory]
  );

  const addGeneratedQuestions = useCallback((newQuestions: Question[]) => {
    setQuestionBank((prev) => {
      const existingIds = new Set(prev.map((q) => q.id));
      const filtered = newQuestions.filter((q) => !existingIds.has(q.id));
      return [...prev, ...filtered];
    });
  }, []);

  const resetTopicQuestionHistory = useCallback((topicId: string) => {
    setQuestionHistory((prev) => prev.filter((h) => h.topicId !== topicId));
  }, []);

  const recordQuizAttempt = useCallback(
    (
      attemptData: Omit<QuizAttempt, 'id' | 'timestamp' | 'questionIds' | 'userAnswers'>,
      questions: Question[],
      userAnswers: Record<string, string>
    ) => {
      const attemptId = `attempt-${Date.now()}`;
      const newAttempt: QuizAttempt = {
        ...attemptData,
        id: attemptId,
        questionIds: questions.map((q) => q.id),
        userAnswers,
        timestamp: new Date().toISOString(),
      };

      setQuizAttempts((prev) => [newAttempt, ...prev]);

      // Record each question into questionHistory for non-repetition tracking
      const newHistoryRecords: QuestionAttemptRecord[] = [];
      const newMistakes: Mistake[] = [];

      questions.forEach((q) => {
        const selected = userAnswers[q.id] || '';
        // Normalizing correct answer matching (A vs full text or index)
        const isCorrect =
          selected.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase() ||
          (q.options && q.options[['A', 'B', 'C', 'D'].indexOf(q.correctAnswer)] === selected);

        newHistoryRecords.push({
          topicId: q.topicId,
          questionId: q.id,
          attemptId,
          date: attemptData.date,
          selectedAnswer: selected,
          correctAnswer: q.correctAnswer,
          isCorrect,
          timestamp: Date.now(),
        });

        if (!isCorrect) {
          newMistakes.push({
            id: `mst-${Date.now()}-${q.id}`,
            topicId: q.topicId,
            subjectId: q.subjectId,
            questionId: q.id,
            questionText: q.question,
            options: q.options,
            selectedAnswer: selected || 'Skipped',
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            concept: q.concept,
            date: attemptData.date,
            status: 'Reviewed',
          });
        }
      });

      setQuestionHistory((prev) => [...prev, ...newHistoryRecords]);

      if (newMistakes.length > 0) {
        setMistakes((prev) => {
          // Avoid duplicate question IDs in mistakes
          const existingQIds = new Set(prev.map((m) => m.questionId));
          const toAdd = newMistakes.filter((m) => !existingQIds.has(m.questionId));
          return [...toAdd, ...prev];
        });
      }

      // Update topic practice & status
      setSyllabus((prev) =>
        prev.map((subj) => ({
          ...subj,
          topics: subj.topics.map((t) => {
            if (t.id === attemptData.topicId) {
              const currentPractice = t.practicePercent;
              const newPractice = Math.min(100, currentPractice + 20);
              let newStatus: ProgressStatus = t.status;
              if (t.status === 'not_started' || t.status === 'learning') {
                newStatus = 'practiced';
              }
              if (attemptData.accuracy >= 80 && t.understandingPercent >= 80) {
                newStatus = 'mastered';
              }
              return {
                ...t,
                status: newStatus,
                practicePercent: newPractice,
                lastStudiedDate: attemptData.date,
              };
            }
            return t;
          }),
        }))
      );
    },
    []
  );

  const updateMistakeStatus = useCallback(
    (mistakeId: string, status: 'Reviewed' | 'Understood' | 'Retest Required', userNote?: string) => {
      setMistakes((prev) =>
        prev.map((m) => {
          if (m.id === mistakeId) {
            return {
              ...m,
              status,
              ...(userNote !== undefined ? { userNote } : {}),
            };
          }
          return m;
        })
      );
    },
    []
  );

  const deleteMistake = useCallback((mistakeId: string) => {
    setMistakes((prev) => prev.filter((m) => m.id !== mistakeId));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const loadDemoData = useCallback(() => {
    const loaded = StorageService.loadDemoDataset();
    setSyllabus(loaded.syllabus);
    setStudySessions(loaded.sessions);
    setDailyTasks(loaded.tasks);
    setNotes(loaded.notes);
    setMistakes(loaded.mistakes);
    setSettings(loaded.settings);
  }, []);

  const resetAllData = useCallback(() => {
    StorageService.resetAll();
    setSyllabus(StorageService.getSyllabus());
    setStudySessions([]);
    setDailyTasks([]);
    setNotes({});
    setQuestionBank(StorageService.getQuestions());
    setQuizAttempts([]);
    setQuestionHistory([]);
    setMistakes([]);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const exportData = useCallback(() => {
    return StorageService.exportAllData();
  }, []);

  const importData = useCallback((json: string) => {
    const success = StorageService.importAllData(json);
    if (success) {
      setSyllabus(StorageService.getSyllabus());
      setStudySessions(StorageService.getSessions());
      setDailyTasks(StorageService.getTasks());
      setNotes(StorageService.getNotes());
      setQuestionBank(StorageService.getQuestions());
      setQuizAttempts(StorageService.getAttempts());
      setQuestionHistory(StorageService.getQuestionHistory());
      setMistakes(StorageService.getMistakes());
      setSettings(StorageService.getSettings());
    }
    return success;
  }, []);

  return (
    <AppContext.Provider
      value={{
        syllabus,
        studySessions,
        dailyTasks,
        notes,
        questionBank,
        quizAttempts,
        questionHistory,
        mistakes,
        settings,
        activeTab,
        selectedTopicId,
        topicDetailTab,
        isAddSessionOpen,
        isSearchOpen,
        searchQuery,
        setActiveTab,
        setSelectedTopicId,
        setTopicDetailTab,
        setIsAddSessionOpen,
        setIsSearchOpen,
        setSearchQuery,
        navigateToTopic,
        updateTopicProgress,
        toggleTopicRevisionMark,
        addStudySession,
        deleteStudySession,
        addTask,
        toggleTask,
        deleteTask,
        saveTopicNote,
        getTopicNote,
        recordQuizAttempt,
        getUnusedQuestionsForTopic,
        addGeneratedQuestions,
        resetTopicQuestionHistory,
        updateMistakeStatus,
        deleteMistake,
        updateSettings,
        loadDemoData,
        resetAllData,
        exportData,
        importData,
        todayStr,
        daysToExam,
        currentStreak,
        longestStreak,
        todaySessions,
        todayStudyMinutes,
        todayTopicsCount,
        todayQuizAttempts,
        todayAccuracy,
        todayTasks,
        overallCompletion,
        allTopics,
        subjectProgressList,
        needsAttentionTopics,
        dailyRecommendations,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
