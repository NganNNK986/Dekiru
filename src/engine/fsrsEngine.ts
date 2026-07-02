/**
 * FSRS (Free Spaced Repetition Scheduler) Engine
 * 
 * Wraps the ts-fsrs library to provide the same interface as SM-2.
 * FSRS is a modern, neural-network-based algorithm that is more accurate
 * than SM-2 for predicting memory retention.
 * 
 * Reference: https://github.com/open-spaced-repetition/ts-fsrs
 */
import { createEmptyCard, fsrs, Rating, type Card as FSRSCard, type Grade } from 'ts-fsrs';
import { ReviewRating } from '../types';

/** FSRS scheduler instance (lazy initialized) */
let schedulerInstance: ReturnType<typeof fsrs> | null = null;

/**
 * Get or create the FSRS scheduler with given retention target.
 */
export function getFSRSScheduler(requestRetention: number = 0.9) {
  if (!schedulerInstance) {
    schedulerInstance = fsrs({
      request_retention: requestRetention,
      maximum_interval: 365,
      enable_fuzz: true,
    });
  }
  return schedulerInstance;
}

/**
 * Reset the scheduler (e.g., when user changes retention settings).
 */
export function resetFSRSScheduler() {
  schedulerInstance = null;
}

/**
 * Create a new empty FSRS card.
 */
export function createNewFSRSCard(): FSRSCard {
  return createEmptyCard();
}

/**
 * Map ReviewRating to FSRS Rating.
 */
export function ratingToFSRSGrade(rating: ReviewRating): Grade {
  switch (rating) {
    case 'again': return Rating.Again;
    case 'hard': return Rating.Hard;
    case 'good': return Rating.Good;
    case 'easy': return Rating.Easy;
  }
}

/**
 * Process a review using FSRS algorithm.
 * 
 * @param cardJson - JSON-serialized FSRS Card state (null for new card)
 * @param rating - User's rating of their recall
 * @param requestRetention - Target retention rate (0-1)
 * @returns Updated card JSON and next review date
 */
export function fsrsReview(
  cardJson: string | null,
  rating: ReviewRating,
  requestRetention: number = 0.9
): { cardJson: string; nextReviewDate: string; interval: number } {
  const scheduler = getFSRSScheduler(requestRetention);
  
  let card: FSRSCard;
  if (cardJson) {
    try {
      const parsed = JSON.parse(cardJson);
      // Reconstruct dates from serialized strings
      card = {
        ...parsed,
        due: new Date(parsed.due),
        last_review: parsed.last_review ? new Date(parsed.last_review) : undefined,
      };
    } catch {
      card = createEmptyCard();
    }
  } else {
    card = createEmptyCard();
  }

  const now = new Date();
  const grade = ratingToFSRSGrade(rating);
  const result = scheduler.next(card, now, grade);
  
  const updatedCard = result.card;
  
  return {
    cardJson: JSON.stringify(updatedCard),
    nextReviewDate: updatedCard.due instanceof Date 
      ? updatedCard.due.toISOString() 
      : new Date(updatedCard.due).toISOString(),
    interval: typeof updatedCard.scheduled_days === 'number' 
      ? updatedCard.scheduled_days 
      : 1,
  };
}

/**
 * Preview all possible outcomes for a card without committing.
 */
export function fsrsPreview(
  cardJson: string | null,
  requestRetention: number = 0.9
): Record<ReviewRating, { interval: number; nextReviewDate: string }> {
  const scheduler = getFSRSScheduler(requestRetention);
  
  let card: FSRSCard;
  if (cardJson) {
    try {
      const parsed = JSON.parse(cardJson);
      card = {
        ...parsed,
        due: new Date(parsed.due),
        last_review: parsed.last_review ? new Date(parsed.last_review) : undefined,
      };
    } catch {
      card = createEmptyCard();
    }
  } else {
    card = createEmptyCard();
  }

  const now = new Date();
  const preview = scheduler.repeat(card, now);

  const mapResult = (grade: Grade) => {
    const result = preview[grade];
    const c = result.card;
    return {
      interval: typeof c.scheduled_days === 'number' ? c.scheduled_days : 1,
      nextReviewDate: c.due instanceof Date 
        ? c.due.toISOString() 
        : new Date(c.due).toISOString(),
    };
  };

  return {
    again: mapResult(Rating.Again),
    hard: mapResult(Rating.Hard),
    good: mapResult(Rating.Good),
    easy: mapResult(Rating.Easy),
  };
}
