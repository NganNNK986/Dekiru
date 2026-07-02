/**
 * Exercise Engine — Business rules for lesson exercises.
 *
 * - Wrong answer → "chưa thuộc" + auto-save to "mục đã lưu"
 * - 2+ correct answers for same item → "đã thuộc" (mastery level 4)
 */
import { ItemProgress, MasteryLevel } from '../types';

export const EXERCISE_KNOWN_THRESHOLD = 2;
export const EXERCISE_KNOWN_MASTERY: MasteryLevel = 4;

/** Mastery cap when item is not yet known via exercises */
const NOT_KNOWN_MASTERY: MasteryLevel = 3;

export function processExerciseResult(
  progress: ItemProgress,
  isCorrect: boolean
): ItemProgress {
  const now = new Date().toISOString();

  if (isCorrect) {
    const exerciseCorrectCount = (progress.exerciseCorrectCount ?? 0) + 1;
    const isKnown = exerciseCorrectCount >= EXERCISE_KNOWN_THRESHOLD;

    return {
      ...progress,
      exerciseCorrectCount,
      masteryLevel: isKnown ? EXERCISE_KNOWN_MASTERY : progress.masteryLevel,
      scaffoldStage: isKnown ? 'recall' : progress.scaffoldStage,
      updatedAt: now,
    };
  }

  return {
    ...progress,
    isStarred: true,
    masteryLevel: Math.min(progress.masteryLevel, NOT_KNOWN_MASTERY) as MasteryLevel,
    incorrectCount: progress.incorrectCount + 1,
    updatedAt: now,
  };
}

export function isExerciseKnown(progress: ItemProgress): boolean {
  return (progress.exerciseCorrectCount ?? 0) >= EXERCISE_KNOWN_THRESHOLD;
}
