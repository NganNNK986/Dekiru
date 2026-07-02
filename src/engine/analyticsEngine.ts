/**
 * Analytics Engine — Computes learning statistics and trends (#11).
 */
import { 
  ItemProgress, DailyStats, LearningAnalytics, 
  LessonProgressSummary, ReviewLog, UserSettings, Lesson 
} from '../types';
import { getWeakestItems, getAccuracy } from './masteryEngine';

/**
 * Get today's date string in YYYY-MM-DD format.
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Compute comprehensive analytics from all learning data.
 */
export function computeAnalytics(
  allProgress: ItemProgress[],
  dailyStatsMap: Record<string, DailyStats>,
  lessons: Lesson[],
  settings: UserSettings
): LearningAnalytics {
  const today = getTodayString();
  const todayStats = dailyStatsMap[today];

  // Overall mastery distribution
  let totalMastered = 0;
  let totalKnown = 0;
  let totalLearning = 0;
  let totalNew = 0;
  let totalCorrect = 0;
  let totalReviews = 0;

  for (const p of allProgress) {
    if (p.masteryLevel === 5) totalMastered++;
    else if (p.masteryLevel >= 4) totalKnown++;
    else if (p.masteryLevel >= 1) totalLearning++;
    else totalNew++;

    totalCorrect += p.correctCount;
    totalReviews += p.totalReviews;
  }

  // Streak calculation
  const { currentStreak, longestStreak } = calculateStreaks(dailyStatsMap, settings);

  // Daily history (last 30 days)
  const dailyHistory = getLast30DaysStats(dailyStatsMap);

  // Per-lesson progress
  const lessonProgress = computeLessonProgress(allProgress, lessons);

  // Weakest items
  const weakestItems = getWeakestItems(allProgress, 10);

  return {
    todayReviewed: todayStats?.totalReviewed || 0,
    todayCorrect: todayStats?.correctCount || 0,
    todayNewLearned: todayStats?.newLearned || 0,
    totalMastered,
    totalKnown,
    totalLearning,
    totalNew,
    overallAccuracy: totalReviews > 0 ? totalCorrect / totalReviews : 0,
    currentStreak,
    longestStreak,
    dailyHistory,
    lessonProgress,
    weakestItems,
  };
}

/**
 * Update daily stats after a review.
 */
export function updateDailyStats(
  currentStats: Record<string, DailyStats>,
  log: ReviewLog,
  isNewItem: boolean,
  settings: UserSettings
): Record<string, DailyStats> {
  const today = getTodayString();
  const existing = currentStats[today] || {
    date: today,
    totalReviewed: 0,
    correctCount: 0,
    newLearned: 0,
    timeSpentMinutes: 0,
    goalMet: false,
  };

  const updated: DailyStats = {
    ...existing,
    totalReviewed: existing.totalReviewed + 1,
    correctCount: existing.correctCount + (log.isCorrect ? 1 : 0),
    newLearned: existing.newLearned + (isNewItem ? 1 : 0),
  };

  // Check if daily goal is met
  updated.goalMet = updated.totalReviewed >= settings.dailyReviewGoal;

  return {
    ...currentStats,
    [today]: updated,
  };
}

/**
 * Calculate current and longest streaks.
 */
function calculateStreaks(
  dailyStats: Record<string, DailyStats>,
  settings: UserSettings
): { currentStreak: number; longestStreak: number } {
  const sortedDates = Object.keys(dailyStats).sort().reverse();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Check from today backwards
  const today = new Date();
  const checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const stats = dailyStats[dateStr];

    if (stats && stats.goalMet) {
      tempStreak++;
      if (i <= currentStreak + 1) {
        currentStreak = tempStreak;
      }
    } else if (stats && stats.totalReviewed > 0) {
      // Reviewed but didn't meet goal — still counts for streak
      tempStreak++;
      if (i <= currentStreak + 1) {
        currentStreak = tempStreak;
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
      if (i > 0 && currentStreak === 0) {
        // No streak today, but maybe yesterday
      } else if (currentStreak > 0) {
        break; // Current streak is over
      }
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak };
}

/**
 * Get stats for the last 30 days (fill gaps with zeroes).
 */
function getLast30DaysStats(
  dailyStats: Record<string, DailyStats>
): DailyStats[] {
  const result: DailyStats[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    result.push(dailyStats[dateStr] || {
      date: dateStr,
      totalReviewed: 0,
      correctCount: 0,
      newLearned: 0,
      timeSpentMinutes: 0,
      goalMet: false,
    });
  }

  return result;
}

/**
 * Compute per-lesson progress summaries.
 */
function computeLessonProgress(
  allProgress: ItemProgress[],
  lessons: Lesson[]
): LessonProgressSummary[] {
  // Group progress by lesson — we need item-to-lesson mapping
  // Since ItemProgress doesn't store lessonId directly, we'll use
  // the itemId prefix pattern. This should be called with external mapping.
  return lessons.map(lesson => {
    const lessonItems = allProgress.filter(p => {
      // Items in this lesson based on a mapping that should be passed externally
      // For now, we'll handle this through the context layer
      return true; // Will be filtered at context level
    });

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      totalItems: 0,
      masteredCount: 0,
      knownCount: 0,
      learningCount: 0,
      newCount: 0,
      averageAccuracy: 0,
    };
  });
}

/**
 * Compute lesson progress with explicit item-to-lesson mapping.
 */
export function computeLessonProgressWithMapping(
  allProgress: ItemProgress[],
  lessons: Lesson[],
  itemToLessonMap: Record<string, string>
): LessonProgressSummary[] {
  return lessons.map(lesson => {
    const lessonItemIds = Object.entries(itemToLessonMap)
      .filter(([_, lessonId]) => lessonId === lesson.id)
      .map(([itemId]) => itemId);

    const items = allProgress.filter(p => lessonItemIds.includes(p.itemId));
    
    let masteredCount = 0;
    let knownCount = 0;
    let learningCount = 0;
    let newCount = 0;
    let totalCorrect = 0;
    let totalReviews = 0;

    for (const p of items) {
      if (p.masteryLevel === 5) masteredCount++;
      else if (p.masteryLevel >= 4) knownCount++;
      else if (p.masteryLevel >= 1) learningCount++;
      else newCount++;
      totalCorrect += p.correctCount;
      totalReviews += p.totalReviews;
    }

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      totalItems: lessonItemIds.length,
      masteredCount,
      knownCount,
      learningCount,
      newCount,
      averageAccuracy: totalReviews > 0 ? totalCorrect / totalReviews : 0,
    };
  });
}
