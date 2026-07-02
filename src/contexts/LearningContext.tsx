/**
 * LearningContext — React Context providing learning system state and actions.
 * 
 * This replaces the scattered state management in App.tsx with a centralized
 * context that all components can consume.
 */
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { 
  LearningData, ItemProgress, UserSettings, ReviewRating, 
  LearningAnalytics, SessionPlan, DailyStats, ReviewLog
} from '../types';
import { 
  loadLearningData, saveLearningData, getOrCreateProgress, 
  DEFAULT_SETTINGS, exportLearningData, importLearningData 
} from '../stores/learningStore';
import { processReview, buildReviewQueue, getDueCount, createDefaultProgress } from '../engine/srsEngine';
import { getWeakestItems } from '../engine/masteryEngine';
import { computeAnalytics, updateDailyStats, computeLessonProgressWithMapping } from '../engine/analyticsEngine';
import { planSession } from '../engine/sessionPlanner';
import { processExerciseResult } from '../engine/exerciseEngine';
import { vocabularyData, kanjiData, lessons } from '../data';

interface LearningContextType {
  // Data
  data: LearningData;
  settings: UserSettings;
  
  // Progress access
  getProgress: (itemId: string, itemType: 'vocab' | 'kanji') => ItemProgress;
  getAllProgress: () => ItemProgress[];
  
  // Review actions
  recordReview: (itemId: string, itemType: 'vocab' | 'kanji', rating: ReviewRating, responseTimeMs?: number) => void;
  recordExerciseResult: (itemId: string, itemType: 'vocab' | 'kanji', isCorrect: boolean) => void;
  
  // Bookmark
  toggleStar: (itemId: string, itemType: 'vocab' | 'kanji') => void;
  isStarred: (itemId: string) => boolean;
  getStarredIds: (type: 'vocab' | 'kanji') => Set<string>;
  
  // SRS
  getReviewQueue: (maxItems?: number) => ItemProgress[];
  getDueCount: () => number;
  
  // Session planning
  getSessionPlan: (maxSize?: number) => SessionPlan;
  
  // Analytics
  getAnalytics: () => LearningAnalytics;
  getDailyStats: () => DailyStats | undefined;
  
  // Settings
  updateSettings: (partial: Partial<UserSettings>) => void;
  
  // Export/Import
  exportData: () => string;
  importData: (json: string) => boolean;
}

const LearningContext = createContext<LearningContextType | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<LearningData>(() => loadLearningData());
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Build item-to-lesson mapping
  const itemToLessonMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const v of vocabularyData) {
      map[v.id] = v.lessonId;
    }
    for (const k of kanjiData) {
      map[k.id] = k.lessonId;
    }
    return map;
  }, []);

  // All item IDs
  const allItemIds = useMemo(() => {
    return [...vocabularyData.map(v => v.id), ...kanjiData.map(k => k.id)];
  }, []);

  // Debounced save
  const debouncedSave = useCallback((newData: LearningData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveLearningData(newData);
    }, 300);
  }, []);

  // Save on data change
  useEffect(() => {
    debouncedSave(data);
  }, [data, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const getProgress = useCallback((itemId: string, itemType: 'vocab' | 'kanji'): ItemProgress => {
    if (data.progress[itemId]) {
      return data.progress[itemId];
    }
    return createDefaultProgress(itemId, itemType);
  }, [data.progress]);

  const getAllProgress = useCallback((): ItemProgress[] => {
    // Return progress for ALL items (creating defaults for unseen ones)
    return allItemIds.map(id => {
      if (data.progress[id]) return data.progress[id];
      const isKanji = kanjiData.some(k => k.id === id);
      return createDefaultProgress(id, isKanji ? 'kanji' : 'vocab');
    });
  }, [data.progress, allItemIds]);

  const recordReview = useCallback((
    itemId: string, 
    itemType: 'vocab' | 'kanji', 
    rating: ReviewRating,
    responseTimeMs?: number
  ) => {
    setData(prev => {
      const progress = getOrCreateProgress(prev, itemId, itemType);
      const isNewItem = progress.totalReviews === 0;
      
      const { updatedProgress, reviewLog } = processReview(
        progress,
        rating,
        prev.settings.srsAlgorithm,
        prev.settings.fsrsRequestRetention,
        responseTimeMs
      );

      const newDailyStats = updateDailyStats(
        prev.dailyStats,
        reviewLog,
        isNewItem,
        prev.settings
      );

      return {
        ...prev,
        progress: {
          ...prev.progress,
          [itemId]: updatedProgress,
        },
        reviewLogs: [...prev.reviewLogs, reviewLog],
        dailyStats: newDailyStats,
      };
    });
  }, []);

  const recordExerciseResult = useCallback((
    itemId: string,
    itemType: 'vocab' | 'kanji',
    isCorrect: boolean
  ) => {
    setData(prev => {
      const progress = getOrCreateProgress(prev, itemId, itemType);
      const updatedProgress = processExerciseResult(progress, isCorrect);

      return {
        ...prev,
        progress: {
          ...prev.progress,
          [itemId]: updatedProgress,
        },
      };
    });
  }, []);

  const toggleStar = useCallback((itemId: string, itemType: 'vocab' | 'kanji') => {
    setData(prev => {
      const progress = getOrCreateProgress(prev, itemId, itemType);
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [itemId]: {
            ...progress,
            isStarred: !progress.isStarred,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const isStarredFn = useCallback((itemId: string): boolean => {
    return data.progress[itemId]?.isStarred ?? false;
  }, [data.progress]);

  const getStarredIds = useCallback((type: 'vocab' | 'kanji'): Set<string> => {
    const ids = new Set<string>();
    for (const progress of Object.values(data.progress) as ItemProgress[]) {
      if (progress.isStarred && progress.itemType === type) {
        ids.add(progress.itemId);
      }
    }
    return ids;
  }, [data.progress]);

  const getReviewQueueFn = useCallback((maxItems: number = 30): ItemProgress[] => {
    return buildReviewQueue(Object.values(data.progress), maxItems);
  }, [data.progress]);

  const getDueCountFn = useCallback((): number => {
    return getDueCount(Object.values(data.progress));
  }, [data.progress]);

  const getSessionPlanFn = useCallback((maxSize: number = 20): SessionPlan => {
    return planSession(
      Object.values(data.progress),
      allItemIds,
      data.settings,
      maxSize
    );
  }, [data.progress, data.settings, allItemIds]);

  const getAnalyticsFn = useCallback((): LearningAnalytics => {
    const allProgress = getAllProgress();
    const analytics = computeAnalytics(allProgress, data.dailyStats, lessons, data.settings);
    // Override lesson progress with proper mapping
    analytics.lessonProgress = computeLessonProgressWithMapping(allProgress, lessons, itemToLessonMap);
    return analytics;
  }, [data.dailyStats, data.settings, getAllProgress, itemToLessonMap]);

  const getDailyStatsFn = useCallback((): DailyStats | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return data.dailyStats[today];
  }, [data.dailyStats]);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
      },
    }));
  }, []);

  const exportDataFn = useCallback((): string => {
    return exportLearningData(data);
  }, [data]);

  const importDataFn = useCallback((json: string): boolean => {
    const imported = importLearningData(json);
    if (imported) {
      setData(imported);
      return true;
    }
    return false;
  }, []);

  const contextValue: LearningContextType = {
    data,
    settings: data.settings,
    getProgress,
    getAllProgress,
    recordReview,
    recordExerciseResult,
    toggleStar,
    isStarred: isStarredFn,
    getStarredIds,
    getReviewQueue: getReviewQueueFn,
    getDueCount: getDueCountFn,
    getSessionPlan: getSessionPlanFn,
    getAnalytics: getAnalyticsFn,
    getDailyStats: getDailyStatsFn,
    updateSettings,
    exportData: exportDataFn,
    importData: importDataFn,
  };

  return (
    <LearningContext.Provider value={contextValue}>
      {children}
    </LearningContext.Provider>
  );
}

/**
 * Hook to access the learning context.
 */
export function useLearning(): LearningContextType {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}
