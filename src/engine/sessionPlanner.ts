/**
 * Session Planner — Balances new and review content in each learning session (#13).
 * 
 * Default allocation:
 * - 30% new items (max 5 per session)
 * - 50% review items (SRS due)
 * - 20% weak items (low accuracy)
 * 
 * The ratios auto-adjust based on current workload.
 */
import { ItemProgress, SessionPlan, UserSettings } from '../types';
import { buildReviewQueue } from './srsEngine';
import { getWeakestItems } from './masteryEngine';

/**
 * Generate a balanced session plan.
 * 
 * @param allProgress - All item progress records
 * @param allItemIds - All available item IDs
 * @param settings - User's learning settings
 * @param maxSessionSize - Maximum total items in a session
 * @returns A balanced session plan
 */
export function planSession(
  allProgress: ItemProgress[],
  allItemIds: string[],
  settings: UserSettings,
  maxSessionSize: number = 20
): SessionPlan {
  const progressMap = new Map(allProgress.map(p => [p.itemId, p]));
  
  // 1. Get new items (never reviewed)
  const newItemIds = allItemIds.filter(id => {
    const p = progressMap.get(id);
    return !p || p.totalReviews === 0;
  });

  // 2. Get review queue (due items, sorted by priority)
  const reviewQueue = buildReviewQueue(allProgress, maxSessionSize);
  const reviewItemIds = reviewQueue.map(p => p.itemId);

  // 3. Get weak items (low accuracy, but not in review queue)
  const weakItems = getWeakestItems(allProgress, maxSessionSize);
  const weakItemIds = weakItems
    .filter(p => !reviewItemIds.includes(p.itemId))
    .map(p => p.itemId);

  // Calculate target counts based on settings
  let targetNew = Math.min(
    Math.round(maxSessionSize * settings.sessionNewRatio),
    settings.dailyNewItemGoal,
    newItemIds.length
  );
  
  let targetReview = Math.min(
    Math.round(maxSessionSize * settings.sessionReviewRatio),
    reviewItemIds.length
  );
  
  let targetWeak = Math.min(
    Math.round(maxSessionSize * settings.sessionWeakRatio),
    weakItemIds.length
  );

  // Auto-adjust if not enough items in some category
  const totalTarget = targetNew + targetReview + targetWeak;
  if (totalTarget < maxSessionSize) {
    // If we have room, add more review items
    const extra = maxSessionSize - totalTarget;
    const additionalReview = Math.min(extra, reviewItemIds.length - targetReview);
    targetReview += Math.max(0, additionalReview);
    
    // Then add more new items
    const remaining = maxSessionSize - targetNew - targetReview - targetWeak;
    if (remaining > 0) {
      targetNew = Math.min(targetNew + remaining, newItemIds.length);
    }
  }

  // If review queue is very large (> 2x daily goal), reduce new items
  if (reviewItemIds.length > settings.dailyReviewGoal * 2) {
    targetNew = Math.min(targetNew, 2); // Only allow 2 new items when backlog is large
    targetReview = Math.min(maxSessionSize - targetNew - targetWeak, reviewItemIds.length);
  }

  return {
    newItems: shuffleArray(newItemIds).slice(0, targetNew),
    reviewItems: reviewItemIds.slice(0, targetReview),
    weakItems: weakItemIds.slice(0, targetWeak),
    totalItems: targetNew + targetReview + targetWeak,
  };
}

/**
 * Fisher-Yates shuffle.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
