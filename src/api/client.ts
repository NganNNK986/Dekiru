/**
 * API Client — Frontend client for communicating with the backend.
 * 
 * Falls back to localStorage-only mode if backend is unavailable.
 */
import { LearningData, ItemProgress, ReviewLog, DailyStats } from '../types';

const API_BASE = '/api';

/**
 * Check if the backend API is available.
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/progress`, {
      method: 'GET',
      headers: { 'X-User-Id': getUserId() },
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get current user ID (simple implementation — could be enhanced with auth).
 */
function getUserId(): string {
  let userId = localStorage.getItem('dekiru_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('dekiru_user_id', userId);
  }
  return userId;
}

/**
 * Load learning data from the backend.
 */
export async function loadFromServer(): Promise<LearningData | null> {
  try {
    const response = await fetch(`${API_BASE}/progress`, {
      headers: { 'X-User-Id': getUserId() },
    });
    
    if (!response.ok) return null;
    
    const result = await response.json();
    if (result.exists && result.data) {
      return result.data as LearningData;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save learning data to the backend.
 */
export async function saveToServer(data: LearningData): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': getUserId(),
      },
      body: JSON.stringify(data),
    });
    
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Sync a single review event to the backend (incremental sync).
 */
export async function syncReview(
  itemId: string,
  updatedProgress: ItemProgress,
  reviewLog: ReviewLog,
  dailyStats: Record<string, DailyStats>
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/progress/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': getUserId(),
      },
      body: JSON.stringify({ itemId, updatedProgress, reviewLog, dailyStats }),
    });
    
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Export data via the backend (triggers download).
 */
export function getExportUrl(): string {
  return `${API_BASE}/progress/export?userId=${getUserId()}`;
}
