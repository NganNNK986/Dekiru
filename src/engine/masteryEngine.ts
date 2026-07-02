/**
 * Mastery Engine — Calculates objective mastery levels based on review data.
 * Replaces subjective self-assessment (#9) with data-driven mastery tracking (#6).
 */
import { ItemProgress, MasteryLevel } from '../types';

/**
 * Calculate mastery level based on objective metrics.
 * 
 * Level 0 (New):      Never reviewed
 * Level 1 (Seen):     totalReviews >= 1
 * Level 2 (Learning): correctCount >= 2 AND accuracy >= 40%
 * Level 3 (Familiar): correctCount >= 5 AND accuracy >= 60% AND streak >= 2
 * Level 4 (Known):    correctCount >= 8 AND accuracy >= 75% AND interval >= 3 days
 * Level 5 (Mastered): correctCount >= 12 AND accuracy >= 85% AND interval >= 7 days
 */
export function calculateMasteryLevel(progress: ItemProgress): MasteryLevel {
  const { totalReviews, correctCount, streak, sm2Interval } = progress;
  
  if (totalReviews === 0) return 0;

  const accuracy = totalReviews > 0 ? correctCount / totalReviews : 0;

  if (correctCount >= 12 && accuracy >= 0.85 && sm2Interval >= 7) return 5;
  if (correctCount >= 8 && accuracy >= 0.75 && sm2Interval >= 3) return 4;
  if (correctCount >= 5 && accuracy >= 0.60 && streak >= 2) return 3;
  if (correctCount >= 2 && accuracy >= 0.40) return 2;
  if (totalReviews >= 1) return 1;

  return 0;
}

/**
 * Get accuracy ratio for an item.
 * Used to prioritize weak items for review (#12).
 */
export function getAccuracy(progress: ItemProgress): number {
  if (progress.totalReviews === 0) return 0;
  return progress.correctCount / progress.totalReviews;
}

/**
 * Get items sorted by weakness (lowest accuracy first).
 * Prioritizes items that are frequently answered incorrectly (#12).
 */
export function getWeakestItems(
  allProgress: ItemProgress[],
  limit: number = 10
): ItemProgress[] {
  return allProgress
    .filter(p => p.totalReviews >= 2) // Need at least 2 reviews to judge
    .sort((a, b) => {
      const accA = getAccuracy(a);
      const accB = getAccuracy(b);
      // Sort by accuracy ascending (weakest first), then by lapses descending
      if (accA !== accB) return accA - accB;
      return b.lapses - a.lapses;
    })
    .slice(0, limit);
}

/**
 * Check if a mastery level was downgraded (lapse detected).
 */
export function detectLapse(
  previousLevel: MasteryLevel,
  newLevel: MasteryLevel
): boolean {
  return newLevel < previousLevel && previousLevel >= 3;
}

/**
 * Get mastery distribution summary for a set of items.
 */
export function getMasteryDistribution(
  allProgress: ItemProgress[]
): Record<MasteryLevel, number> {
  const distribution: Record<MasteryLevel, number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  };
  
  for (const p of allProgress) {
    distribution[p.masteryLevel]++;
  }
  
  return distribution;
}
