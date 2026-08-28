import {
  Subject,
  StudySession,
  DailyTask,
  TopicNote,
  Question,
  QuizAttempt,
  QuestionAttemptRecord,
  Mistake,
  UserSettings,
} from '../types';
import { INITIAL_SYLLABUS } from '../data/syllabusData';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';
import { DEMO_SESSIONS, DEMO_TASKS, DEMO_NOTES, DEMO_MISTAKES } from '../data/demoData';

const STORAGE_KEYS = {
  SYLLABUS: 'gate2028_syllabus_v1',
  SESSIONS: 'gate2028_sessions_v1',
  TASKS: 'gate2028_tasks_v1',
  NOTES: 'gate2028_notes_v1',
  QUESTIONS: 'gate2028_questions_v1',
  ATTEMPTS: 'gate2028_attempts_v1',
  QUESTION_HISTORY: 'gate2028_qhistory_v1',
  MISTAKES: 'gate2028_mistakes_v1',
  SETTINGS: 'gate2028_settings_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  examName: 'GATE 2028 – Data Science & Artificial Intelligence',
  examDate: '2028-02-05',
  dailyStudyTargetMinutes: 180, // 3 hours
  weeklyStudyTargetMinutes: 1260, // 21 hours
  quizQuestionCount: 10,
  theme: 'light',
  hasCompletedSetup: false,
};

export class StorageService {
  private static safeGet<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return fallback;
    }
  }

  private static safeSet<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
    }
  }

  static getSyllabus(): Subject[] {
    const saved = this.safeGet<Subject[] | null>(STORAGE_KEYS.SYLLABUS, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      this.safeSet(STORAGE_KEYS.SYLLABUS, INITIAL_SYLLABUS);
      return INITIAL_SYLLABUS;
    }
    return saved;
  }

  static saveSyllabus(syllabus: Subject[]): void {
    this.safeSet(STORAGE_KEYS.SYLLABUS, syllabus);
  }

  static getSessions(): StudySession[] {
    return this.safeGet<StudySession[]>(STORAGE_KEYS.SESSIONS, []);
  }

  static saveSessions(sessions: StudySession[]): void {
    this.safeSet(STORAGE_KEYS.SESSIONS, sessions);
  }

  static getTasks(): DailyTask[] {
    return this.safeGet<DailyTask[]>(STORAGE_KEYS.TASKS, []);
  }

  static saveTasks(tasks: DailyTask[]): void {
    this.safeSet(STORAGE_KEYS.TASKS, tasks);
  }

  static getNotes(): Record<string, TopicNote> {
    return this.safeGet<Record<string, TopicNote>>(STORAGE_KEYS.NOTES, {});
  }

  static saveNotes(notes: Record<string, TopicNote>): void {
    this.safeSet(STORAGE_KEYS.NOTES, notes);
  }

  static getQuestions(): Question[] {
    const saved = this.safeGet<Question[] | null>(STORAGE_KEYS.QUESTIONS, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      this.safeSet(STORAGE_KEYS.QUESTIONS, DEFAULT_QUESTIONS);
      return DEFAULT_QUESTIONS;
    }
    return saved;
  }

  static saveQuestions(questions: Question[]): void {
    this.safeSet(STORAGE_KEYS.QUESTIONS, questions);
  }

  static getAttempts(): QuizAttempt[] {
    return this.safeGet<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
  }

  static saveAttempts(attempts: QuizAttempt[]): void {
    this.safeSet(STORAGE_KEYS.ATTEMPTS, attempts);
  }

  static getQuestionHistory(): QuestionAttemptRecord[] {
    return this.safeGet<QuestionAttemptRecord[]>(STORAGE_KEYS.QUESTION_HISTORY, []);
  }

  static saveQuestionHistory(history: QuestionAttemptRecord[]): void {
    this.safeSet(STORAGE_KEYS.QUESTION_HISTORY, history);
  }

  static getMistakes(): Mistake[] {
    return this.safeGet<Mistake[]>(STORAGE_KEYS.MISTAKES, []);
  }

  static saveMistakes(mistakes: Mistake[]): void {
    this.safeSet(STORAGE_KEYS.MISTAKES, mistakes);
  }

  static getSettings(): UserSettings {
    const saved = this.safeGet<UserSettings | null>(STORAGE_KEYS.SETTINGS, null);
    if (!saved) {
      this.safeSet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...saved };
  }

  static saveSettings(settings: UserSettings): void {
    this.safeSet(STORAGE_KEYS.SETTINGS, settings);
  }

  static loadDemoDataset(): {
    syllabus: Subject[];
    sessions: StudySession[];
    tasks: DailyTask[];
    notes: Record<string, TopicNote>;
    mistakes: Mistake[];
    settings: UserSettings;
  } {
    // Clone syllabus and mark some topics with demo progress
    const syllabusWithDemo = INITIAL_SYLLABUS.map((subj) => ({
      ...subj,
      topics: subj.topics.map((top) => {
        if (top.id === 'db-normalization') {
          return {
            ...top,
            status: 'practiced' as const,
            understandingPercent: 75,
            practicePercent: 65,
            revisionPercent: 40,
            lastStudiedDate: '2026-08-28',
          };
        }
        if (top.id === 'ps-probability-basics') {
          return {
            ...top,
            status: 'learning' as const,
            understandingPercent: 85,
            practicePercent: 70,
            revisionPercent: 30,
            lastStudiedDate: '2026-08-28',
          };
        }
        if (top.id === 'la-eigen-decomp') {
          return {
            ...top,
            status: 'learning' as const,
            understandingPercent: 60,
            practicePercent: 50,
            revisionPercent: 20,
            lastStudiedDate: '2026-08-27',
          };
        }
        if (top.id === 'ml-unsupervised') {
          return {
            ...top,
            status: 'learning' as const,
            understandingPercent: 45,
            practicePercent: 30,
            revisionPercent: 10,
            lastStudiedDate: '2026-08-26',
            isMarkedForRevision: true,
          };
        }
        return top;
      }),
    }));

    const settings: UserSettings = {
      ...DEFAULT_SETTINGS,
      hasCompletedSetup: true,
      isDemoLoaded: true,
    };

    this.saveSyllabus(syllabusWithDemo);
    this.saveSessions(DEMO_SESSIONS);
    this.saveTasks(DEMO_TASKS);
    this.saveNotes(DEMO_NOTES);
    this.saveMistakes(DEMO_MISTAKES);
    this.saveSettings(settings);

    return {
      syllabus: syllabusWithDemo,
      sessions: DEMO_SESSIONS,
      tasks: DEMO_TASKS,
      notes: DEMO_NOTES,
      mistakes: DEMO_MISTAKES,
      settings,
    };
  }

  static resetAll(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }

  static exportAllData(): string {
    const data = {
      syllabus: this.getSyllabus(),
      sessions: this.getSessions(),
      tasks: this.getTasks(),
      notes: this.getNotes(),
      questions: this.getQuestions(),
      attempts: this.getAttempts(),
      questionHistory: this.getQuestionHistory(),
      mistakes: this.getMistakes(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(data, null, 2);
  }

  static importAllData(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.syllabus) this.saveSyllabus(data.syllabus);
      if (data.sessions) this.saveSessions(data.sessions);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.notes) this.saveNotes(data.notes);
      if (data.questions) this.saveQuestions(data.questions);
      if (data.attempts) this.saveAttempts(data.attempts);
      if (data.questionHistory) this.saveQuestionHistory(data.questionHistory);
      if (data.mistakes) this.saveMistakes(data.mistakes);
      if (data.settings) this.saveSettings(data.settings);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
}
