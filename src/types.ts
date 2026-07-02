export interface KanjiPart {
    kanji: string;
    meaning: string;
}

export interface KanjiExample {
    word: string;
    reading: string;
    meaning: string;
}

export interface KanjiWord {
    id: string;
    character: string;
    meaning: string;
    onyomi: string;
    kunyomi: string;
    lessonId: string;
    examples: KanjiExample[];
}

export interface Vocabulary {
    id: string;
    word: string;
    furigana: string;
    meaning: string;
    lessonId: string;
    
    // Method 1: Rote Learning
    visualClue: string;
    soundMnemonic: string;
    wackyStory: string;
    
    // Method 2: Deep Learning
    kanjiDeconstruction: (KanjiPart | string)[];
    logicalAnchor: string;
    collocation: string;
    collocationMeaning?: string;
    reading?: string;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
}

// ========================================
// Learning System Types (Phase 1-5)
// ========================================

/** Mastery levels from 0 (New) to 5 (Mastered) */
export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  0: 'Mới',
  1: 'Đã xem',
  2: 'Đang học',
  3: 'Quen thuộc',
  4: 'Đã thuộc',
  5: 'Thành thạo',
};

export const MASTERY_COLORS: Record<MasteryLevel, string> = {
  0: '#94a3b8', // slate
  1: '#f87171', // red
  2: '#fb923c', // orange
  3: '#facc15', // yellow
  4: '#4ade80', // green
  5: '#60a5fa', // blue
};

export const MASTERY_EMOJI: Record<MasteryLevel, string> = {
  0: '⚪',
  1: '🔴',
  2: '🟠',
  3: '🟡',
  4: '🟢',
  5: '🔵',
};

/** Available SRS algorithms */
export type SRSAlgorithm = 'sm2' | 'fsrs';

/** Scaffold stage for progressive disclosure */
export type ScaffoldStage = 'discover' | 'practice' | 'recall';

/** SM-2 quality grades */
export type SM2Quality = 0 | 1 | 2 | 3 | 4 | 5;

/** Review response quality (user-facing) */
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

/** Progress data for each learnable item */
export interface ItemProgress {
  itemId: string;
  itemType: 'vocab' | 'kanji';
  
  // Mastery Tracking
  masteryLevel: MasteryLevel;
  totalReviews: number;
  correctCount: number;
  incorrectCount: number;
  
  // SM-2 SRS Fields
  sm2EaseFactor: number;     // Default 2.5
  sm2Interval: number;       // Days
  sm2Repetition: number;     // Consecutive correct
  
  // FSRS Fields (serialized Card state)
  fsrsCard: string | null;   // JSON-serialized ts-fsrs Card
  
  // Shared SRS fields
  nextReviewDate: string;    // ISO date string
  lastReviewDate: string | null;
  
  // Streak & Lapse tracking
  streak: number;
  lapses: number;
  
  // Scaffold stage
  scaffoldStage: ScaffoldStage;
  
  // Bookmarked
  isStarred: boolean;

  /** Correct answers in exercises (2+ → "đã thuộc") */
  exerciseCorrectCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/** A single review event log */
export interface ReviewLog {
  itemId: string;
  itemType: 'vocab' | 'kanji';
  rating: ReviewRating;
  isCorrect: boolean;
  responseTimeMs?: number;
  reviewedAt: string;       // ISO date string
  algorithm: SRSAlgorithm;
}

/** Daily aggregated stats */
export interface DailyStats {
  date: string;             // YYYY-MM-DD
  totalReviewed: number;
  correctCount: number;
  newLearned: number;
  timeSpentMinutes: number;
  goalMet: boolean;
}

/** User settings/preferences */
export interface UserSettings {
  srsAlgorithm: SRSAlgorithm;
  dailyNewItemGoal: number;    // Default: 5
  dailyReviewGoal: number;     // Default: 20
  sessionNewRatio: number;     // 0-1, default 0.3
  sessionReviewRatio: number;  // 0-1, default 0.5
  sessionWeakRatio: number;    // 0-1, default 0.2
  fsrsRequestRetention: number; // 0-1, default 0.9
  enableNotifications: boolean;
}

/** Session plan for balanced learning */
export interface SessionPlan {
  newItems: string[];
  reviewItems: string[];
  weakItems: string[];
  totalItems: number;
}

/** Complete learning data persisted to storage */
export interface LearningData {
  version: number;
  progress: Record<string, ItemProgress>;
  reviewLogs: ReviewLog[];
  dailyStats: Record<string, DailyStats>;
  settings: UserSettings;
  lastSyncedAt: string | null;
}

/** Analytics summary computed from LearningData */
export interface LearningAnalytics {
  todayReviewed: number;
  todayCorrect: number;
  todayNewLearned: number;
  totalMastered: number;
  totalKnown: number;
  totalLearning: number;
  totalNew: number;
  overallAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  dailyHistory: DailyStats[];
  lessonProgress: LessonProgressSummary[];
  weakestItems: ItemProgress[];
}

/** Per-lesson progress summary */
export interface LessonProgressSummary {
  lessonId: string;
  lessonTitle: string;
  totalItems: number;
  masteredCount: number;
  knownCount: number;
  learningCount: number;
  newCount: number;
  averageAccuracy: number;
}
