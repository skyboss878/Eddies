// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Safely get a stored value from localStorage.
 * Falls back to defaultValue if missing or invalid.
 */
function getStorageValue(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.warn(`useLocalStorage: Error parsing value for key "${key}"`, error);
    return defaultValue;
  }
}

/**
 * React hook that syncs state with localStorage.
 * Automatically updates localStorage when the state changes.
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => getStorageValue(key, defaultValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`useLocalStorage: Failed to set key "${key}" in localStorage`, error);
    }
  }, [key, value]);

  return [value, setValue];
};
