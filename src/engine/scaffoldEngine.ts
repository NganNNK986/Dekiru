/**
 * Scaffold Engine — Progressive disclosure for learning stages (#1, #7).
 * 
 * Each item progresses through 3 stages:
 * - DISCOVER: Full information shown (furigana, meaning, mnemonics)
 * - PRACTICE: Guided exercises (multiple choice, matching)
 * - RECALL: Active recall (typing, fill-blank)
 * 
 * Stage transitions are adaptive (#7) — based on individual performance.
 */
import { ItemProgress, ScaffoldStage } from '../types';

/**
 * Determine the appropriate scaffold stage for an item.
 * 
 * This is called after each review to potentially advance the stage.
 * The stage is primarily driven by mastery level but can be adjusted
 * by user-specific performance patterns.
 */
export function determineScaffoldStage(progress: ItemProgress): ScaffoldStage {
  const { masteryLevel, correctCount, totalReviews, streak } = progress;
  const accuracy = totalReviews > 0 ? correctCount / totalReviews : 0;

  // Stage 3: RECALL — Active recall for well-known items
  if (masteryLevel >= 4 || (correctCount >= 6 && accuracy >= 0.7 && streak >= 3)) {
    return 'recall';
  }

  // Stage 2: PRACTICE — Guided exercises for items in learning
  if (masteryLevel >= 2 || (correctCount >= 2 && accuracy >= 0.4)) {
    return 'practice';
  }

  // Stage 1: DISCOVER — Full information for new/weak items
  return 'discover';
}

/**
 * Get the exercise types available for a scaffold stage.
 */
export function getExerciseTypesForStage(
  stage: ScaffoldStage
): string[] {
  switch (stage) {
    case 'discover':
      return ['flashcard']; // Just show the card with full info
    case 'practice':
      return ['multiple-choice', 'matching']; // Recognition-based
    case 'recall':
      return ['typing', 'fill-blank', 'kanji-writing']; // Active recall
  }
}

/**
 * Get the information display mode for a scaffold stage.
 */
export function getDisplayMode(stage: ScaffoldStage): {
  showFurigana: boolean;
  showMeaning: boolean;
  showMnemonics: boolean;
  showKanjiDecomp: boolean;
  blurLevel: 'none' | 'partial' | 'full';
} {
  switch (stage) {
    case 'discover':
      return {
        showFurigana: true,
        showMeaning: true,
        showMnemonics: true,
        showKanjiDecomp: true,
        blurLevel: 'none',
      };
    case 'practice':
      return {
        showFurigana: false, // Hidden by default, tap to reveal
        showMeaning: true,
        showMnemonics: false,
        showKanjiDecomp: true,
        blurLevel: 'partial',
      };
    case 'recall':
      return {
        showFurigana: false,
        showMeaning: false,
        showMnemonics: false,
        showKanjiDecomp: false,
        blurLevel: 'full',
      };
  }
}

/**
 * Get a description of each scaffold stage (for UI display).
 */
export function getStageInfo(stage: ScaffoldStage): {
  label: string;
  description: string;
  icon: string;
  color: string;
} {
  switch (stage) {
    case 'discover':
      return {
        label: 'Khám phá',
        description: 'Xem đầy đủ thông tin, ghi nhớ qua hình ảnh và âm thanh',
        icon: '🔍',
        color: '#60a5fa',
      };
    case 'practice':
      return {
        label: 'Luyện tập',
        description: 'Làm bài tập nhận diện, củng cố kiến thức',
        icon: '✏️',
        color: '#f59e0b',
      };
    case 'recall':
      return {
        label: 'Ghi nhớ',
        description: 'Chủ động nhớ lại, kiểm tra sâu',
        icon: '🧠',
        color: '#10b981',
      };
  }
}
