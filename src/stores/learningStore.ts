/**
 * Learning Store — Centralized persistence layer for all learning data.
 * 
 * Handles localStorage read/write with migration support.
 * Replaces scattered localStorage calls in App.tsx.
 */
import { 
  LearningData, ItemProgress, ReviewLog, DailyStats, 
  UserSettings, SRSAlgorithm 
} from '../types';
import { createDefaultProgress } from '../engine/srsEngine';

const STORAGE_KEY = 'dekiru_learning_data';
const CURRENT_VERSION = 1;

/**
 * Default user settings.
 */
export const DEFAULT_SETTINGS: UserSettings = {
  srsAlgorithm: 'fsrs' as SRSAlgorithm,
  dailyNewItemGoal: 5,
  dailyReviewGoal: 20,
  sessionNewRatio: 0.3,
  sessionReviewRatio: 0.5,
  sessionWeakRatio: 0.2,
  fsrsRequestRetention: 0.9,
  enableNotifications: false,
};

/**
 * Create empty learning data.
 */
function createEmptyData(): LearningData {
  return {
    version: CURRENT_VERSION,
    progress: {},
    reviewLogs: [],
    dailyStats: {},
    settings: { ...DEFAULT_SETTINGS },
    lastSyncedAt: null,
  };
}

/**
 * Load learning data from localStorage.
 */
export function loadLearningData(): LearningData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Try migrating old starred data
      return migrateFromOldFormat();
    }
    
    const parsed = JSON.parse(raw) as LearningData;
    
    // Version migration
    if (parsed.version < CURRENT_VERSION) {
      return migrateData(parsed);
    }
    
    return parsed;
  } catch {
    return createEmptyData();
  }
}

/**
 * Save learning data to localStorage.
 */
export function saveLearningData(data: LearningData): void {
  try {
    data.lastSyncedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save learning data:', e);
    // If storage is full, try trimming old review logs
    if (data.reviewLogs.length > 1000) {
      data.reviewLogs = data.reviewLogs.slice(-500);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        console.error('Still failed after trimming. Storage may be full.');
      }
    }
  }
}

/**
 * Get or create progress for an item.
 */
export function getOrCreateProgress(
  data: LearningData,
  itemId: string,
  itemType: 'vocab' | 'kanji'
): ItemProgress {
  if (data.progress[itemId]) {
    return data.progress[itemId];
  }
  
  const newProgress = createDefaultProgress(itemId, itemType);
  data.progress[itemId] = newProgress;
  return newProgress;
}

/**
 * Migrate from old format (sakura_starred / sakura_kanji_starred).
 */
function migrateFromOldFormat(): LearningData {
  const data = createEmptyData();
  
  try {
    // Migrate starred vocab
    const starredRaw = localStorage.getItem('sakura_starred');
    if (starredRaw) {
      const starredIds: string[] = JSON.parse(starredRaw);
      for (const id of starredIds) {
        const progress = createDefaultProgress(id, 'vocab');
        progress.isStarred = true;
        data.progress[id] = progress;
      }
    }

    // Migrate starred kanji
    const kanjiStarredRaw = localStorage.getItem('sakura_kanji_starred');
    if (kanjiStarredRaw) {
      const starredIds: string[] = JSON.parse(kanjiStarredRaw);
      for (const id of starredIds) {
        const progress = createDefaultProgress(id, 'kanji');
        progress.isStarred = true;
        data.progress[id] = progress;
      }
    }
  } catch {
    // Ignore migration errors
  }

  return data;
}

/**
 * Migrate data between versions.
 */
function migrateData(data: LearningData): LearningData {
  // Future version migrations go here
  data.version = CURRENT_VERSION;
  return data;
}

/**
 * Export learning data as a downloadable JSON file.
 */
export function exportLearningData(data: LearningData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Import learning data from JSON string.
 */
export function importLearningData(jsonString: string): LearningData | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.version && parsed.progress && parsed.settings) {
      return parsed as LearningData;
    }
    return null;
  } catch {
    return null;
  }
}
