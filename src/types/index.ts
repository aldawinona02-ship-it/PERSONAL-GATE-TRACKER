export type ProgressStatus = 'not_started' | 'learning' | 'practiced' | 'revised' | 'mastered';

export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard' | 'GATE Level';

export interface Subtopic {
  id: string;
  name: string;
  isCompleted?: boolean;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description?: string;
  subtopics: Subtopic[];
  status: ProgressStatus;
  understandingPercent: number; // 0 - 100
  practicePercent: number; // 0 - 100
  revisionPercent: number; // 0 - 100
  lastStudiedDate?: string; // YYYY-MM-DD
  isMarkedForRevision?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  iconName: string;
  color: string;
  description: string;
  topics: Topic[];
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  topicId: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  durationMinutes: number;
  description: string; // "What did I study?"
  importantPoints: string;
  doubts: string;
  confidence: number; // 1 to 5
  completed: boolean;
  createdAt: string; // ISO string
}

export interface DailyTask {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  completed: boolean;
  subjectId?: string;
  topicId?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface TopicNote {
  topicId: string;
  importantConcepts: string;
  importantFormulas: string;
  examples: string;
  myUnderstanding: string;
  doubts: string;
  mistakes: string;
  lastUpdated: string;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  question: string;
  options: string[]; // 4 options
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D' or option string or '0' | '1' | '2' | '3'
  explanation: string;
  concept: string;
  isPYQ?: boolean;
  pyqYear?: number;
  pyqPaper?: string; // e.g. "GATE DA 2024", "GATE CS 2023"
}

export interface QuestionAttemptRecord {
  topicId: string;
  questionId: string;
  attemptId: string;
  date: string; // YYYY-MM-DD
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface QuizAttempt {
  id: string;
  topicId: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  questionIds: string[];
  userAnswers: Record<string, string>; // questionId -> selected answer
  score: number;
  totalQuestions: number;
  accuracy: number; // 0 - 100
  durationSeconds: number;
}

export interface Mistake {
  id: string;
  topicId: string;
  subjectId: string;
  questionId: string;
  questionText: string;
  options: string[];
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  concept: string;
  date: string; // YYYY-MM-DD
  status: 'Reviewed' | 'Understood' | 'Retest Required';
  userNote?: string;
}

export interface UserSettings {
  examName: string;
  examDate: string; // YYYY-MM-DD (e.g., 2028-02-05)
  dailyStudyTargetMinutes: number;
  weeklyStudyTargetMinutes: number;
  quizQuestionCount: number;
  theme: 'light' | 'dark' | 'system';
  hasCompletedSetup: boolean;
  isDemoLoaded?: boolean;
}

export type ViewTab =
  | 'dashboard'
  | 'calendar'
  | 'syllabus'
  | 'topic-detail'
  | 'study-sessions'
  | 'notes'
  | 'quizzes'
  | 'revision'
  | 'analytics'
  | 'settings';
