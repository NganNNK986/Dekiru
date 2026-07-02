/**
 * SM-2 Spaced Repetition Algorithm
 * 
 * Based on the SuperMemo 2 algorithm by Piotr Wozniak.
 * Reference: https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
 */
import { SM2Quality, ReviewRating } from '../types';

export interface SM2Result {
  easeFactor: number;
  interval: number;     // in days
  repetition: number;
}

/**
 * Map user-facing ReviewRating to SM-2 quality grades (0-5).
 * 
 * - again (0-1): Complete blackout or very wrong
 * - hard (2-3):  Recalled with serious difficulty  
 * - good (4):    Recalled with some hesitation
 * - easy (5):    Perfect recall
 */
export function ratingToSM2Quality(rating: ReviewRating): SM2Quality {
  switch (rating) {
    case 'again': return 1;
    case 'hard': return 2;
    case 'good': return 4;
    case 'easy': return 5;
  }
}

/**
 * Check if a rating counts as "correct" for mastery tracking.
 */
export function isCorrectRating(rating: ReviewRating): boolean {
  return rating === 'good' || rating === 'easy';
}

/**
 * Calculate the next review parameters using SM-2 algorithm.
 * 
 * @param quality - Quality of recall (0-5)
 * @param currentEase - Current ease factor (minimum 1.3)
 * @param currentInterval - Current interval in days
 * @param currentRepetition - Current number of consecutive correct answers
 * @returns New ease factor, interval, and repetition count
 */
export function sm2Calculate(
  quality: SM2Quality,
  currentEase: number,
  currentInterval: number,
  currentRepetition: number
): SM2Result {
  let easeFactor = currentEase;
  let interval: number;
  let repetition: number;

  if (quality >= 3) {
    // Correct response
    if (currentRepetition === 0) {
      interval = 1;
    } else if (currentRepetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(currentInterval * easeFactor);
    }
    repetition = currentRepetition + 1;
  } else {
    // Incorrect response - reset
    repetition = 0;
    interval = 1;
  }

  // Update ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Minimum ease factor is 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval: Math.max(1, interval),
    repetition,
  };
}

/**
 * Calculate the next review date based on interval.
 */
export function getNextReviewDate(intervalDays: number, fromDate?: Date): string {
  const now = fromDate || new Date();
  const next = new Date(now);
  next.setDate(next.getDate() + intervalDays);
  return next.toISOString();
}

/** Default SM-2 ease factor for new items */
export const SM2_DEFAULT_EASE = 2.5;

/** Default SM-2 interval for new items */
export const SM2_DEFAULT_INTERVAL = 0;

/** Default SM-2 repetition for new items */
export const SM2_DEFAULT_REPETITION = 0;
