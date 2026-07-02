/**
 * SRS Engine — Unified interface for SM-2 and FSRS algorithms.
 * 
 * Routes review processing to the appropriate algorithm based on user settings.
 * Also provides review queue building logic (#3, #14, #2).
 */
import { ItemProgress, ReviewRating, SRSAlgorithm, ReviewLog } from '../types';
import { sm2Calculate, ratingToSM2Quality, isCorrectRating, getNextReviewDate, SM2_DEFAULT_EASE, SM2_DEFAULT_INTERVAL, SM2_DEFAULT_REPETITION } from './sm2Engine';
import { fsrsReview, fsrsPreview } from './fsrsEngine';
import { calculateMasteryLevel } from './masteryEngine';

export interface ReviewResult {
  updatedProgress: ItemProgress;
  reviewLog: ReviewLog;
}

/**
 * Process a review for an item using the selected algorithm.
 */
export function processReview(
  progress: ItemProgress,
  rating: ReviewRating,
  algorithm: SRSAlgorithm,
  fsrsRetention: number = 0.9,
  responseTimeMs?: number
): ReviewResult {
  const now = new Date().toISOString();
  const correct = isCorrectRating(rating);

  // Update common fields
  const updated: ItemProgress = {
    ...progress,
    totalReviews: progress.totalReviews + 1,
    correctCount: progress.correctCount + (correct ? 1 : 0),
    incorrectCount: progress.incorrectCount + (correct ? 0 : 1),
    lastReviewDate: now,
    updatedAt: now,
    streak: correct ? progress.streak + 1 : 0,
    lapses: (!correct && progress.streak >= 2) ? progress.lapses + 1 : progress.lapses,
  };

  if (algorithm === 'fsrs') {
    // Use FSRS algorithm
    const result = fsrsReview(progress.fsrsCard, rating, fsrsRetention);
    updated.fsrsCard = result.cardJson;
    updated.nextReviewDate = result.nextReviewDate;
    // Also update SM-2 interval for mastery calculation compatibility
    updated.sm2Interval = result.interval;
  } else {
    // Use SM-2 algorithm
    const quality = ratingToSM2Quality(rating);
    const result = sm2Calculate(
      quality,
      progress.sm2EaseFactor,
      progress.sm2Interval,
      progress.sm2Repetition
    );
    updated.sm2EaseFactor = result.easeFactor;
    updated.sm2Interval = result.interval;
    updated.sm2Repetition = result.repetition;
    updated.nextReviewDate = getNextReviewDate(result.interval);
  }

  // Recalculate mastery level
  updated.masteryLevel = calculateMasteryLevel(updated);

  // Update scaffold stage based on mastery
  if (updated.masteryLevel >= 4) {
    updated.scaffoldStage = 'recall';
  } else if (updated.masteryLevel >= 2) {
    updated.scaffoldStage = 'practice';
  } else {
    updated.scaffoldStage = 'discover';
  }

  const reviewLog: ReviewLog = {
    itemId: progress.itemId,
    itemType: progress.itemType,
    rating,
    isCorrect: correct,
    responseTimeMs,
    reviewedAt: now,
    algorithm,
  };

  return { updatedProgress: updated, reviewLog };
}

/**
 * Create default progress for a new item.
 */
export function createDefaultProgress(
  itemId: string,
  itemType: 'vocab' | 'kanji'
): ItemProgress {
  const now = new Date().toISOString();
  return {
    itemId,
    itemType,
    masteryLevel: 0,
    totalReviews: 0,
    correctCount: 0,
    incorrectCount: 0,
    sm2EaseFactor: SM2_DEFAULT_EASE,
    sm2Interval: SM2_DEFAULT_INTERVAL,
    sm2Repetition: SM2_DEFAULT_REPETITION,
    fsrsCard: null,
    nextReviewDate: now, // Due immediately
    lastReviewDate: null,
    streak: 0,
    lapses: 0,
    scaffoldStage: 'discover',
    isStarred: false,
    exerciseCorrectCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Build a review queue sorted by priority (#14 — personalized scheduling).
 * 
 * Priority order:
 * 1. Overdue items (past nextReviewDate)
 * 2. Low accuracy items (frequently wrong) (#12)
 * 3. Low mastery items
 * 4. Items due today
 * 5. Starred/bookmarked items
 */
export function buildReviewQueue(
  allProgress: ItemProgress[],
  maxItems: number = 30
): ItemProgress[] {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Filter to items that have been seen at least once and are due
  const dueItems = allProgress.filter(p => {
    if (p.totalReviews === 0) return false;
    const reviewDate = new Date(p.nextReviewDate);
    return reviewDate <= now || p.nextReviewDate.startsWith(todayStr);
  });

  // Score each item for priority sorting
  const scored = dueItems.map(item => {
    let score = 0;
    
    // Overdue bonus: more days overdue = higher priority
    const daysOverdue = Math.max(0, 
      (now.getTime() - new Date(item.nextReviewDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    score += daysOverdue * 10;
    
    // Low accuracy penalty: lower accuracy = higher priority (#12)
    const accuracy = item.totalReviews > 0 ? item.correctCount / item.totalReviews : 0;
    score += (1 - accuracy) * 20;
    
    // Lapse bonus
    score += item.lapses * 5;
    
    // Low mastery bonus
    score += (5 - item.masteryLevel) * 3;
    
    // Starred bonus
    if (item.isStarred) score += 5;
    
    return { item, score };
  });

  // Sort by score descending (highest priority first)
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxItems).map(s => s.item);
}

/**
 * Get items that are new (never reviewed) for a given lesson.
 */
export function getNewItems(
  allProgress: ItemProgress[],
  lessonItemIds: string[]
): ItemProgress[] {
  return allProgress.filter(p => 
    lessonItemIds.includes(p.itemId) && p.totalReviews === 0
  );
}

/**
 * Get count of items due for review today.
 */
export function getDueCount(allProgress: ItemProgress[]): number {
  const now = new Date();
  return allProgress.filter(p => {
    if (p.totalReviews === 0) return false;
    return new Date(p.nextReviewDate) <= now;
  }).length;
}
