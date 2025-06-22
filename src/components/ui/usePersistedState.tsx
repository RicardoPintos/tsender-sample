import { useState, useEffect } from 'react';

export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(defaultValue);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load from localStorage after client-side hydration
  useEffect(() => {
    if (isClient) {
      try {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          setState(JSON.parse(saved));
        }
      } catch (error) {
        console.warn(`Error loading persisted state for key "${key}":`, error);
      }
    }
  }, [key, isClient]);

  // Save to localStorage whenever state changes (only on client)
  const setPersistedState = (value: T) => {
    setState(value);
    if (isClient) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error saving persisted state for key "${key}":`, error);
      }
    }
  };

  return [state, setPersistedState];
}