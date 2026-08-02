import { useState, useEffect, useCallback } from 'react';

export function useQuizSession<T>(key: string, initializer: () => T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored) as T;
      }
    } catch (e) {
      console.error('Failed to parse quiz session from storage', e);
    }
    return initializer();
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save quiz session to storage', e);
    }
  }, [key, state]);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(key);
    setState(initializer());
  }, [key, initializer]);

  return [state, setState, clearSession] as const;
}
