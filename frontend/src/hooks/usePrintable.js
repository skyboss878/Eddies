// src/hooks/usePrintable.js
import { useEffect } from 'react';

/**
 * usePrintable
 * Hook to manage document title and timestamp when printing
 * @param {string} title - Title to show in print header
 * @param {boolean} isActive - Whether printing is active
 */
export const usePrintable = (title, isActive = false) => {
  useEffect(() => {
    if (!isActive) return;

    // Save original document title
    const originalTitle = document.title;
    document.title = title;

    // Add timestamp attribute to body
    const timestamp = new Date().toLocaleString();
    document.body.setAttribute('data-print-timestamp', timestamp);

    return () => {
      // Cleanup
      document.title = originalTitle;
      document.body.removeAttribute('data-print-timestamp');
    };
  }, [title, isActive]);

  const handlePrint = () => {
    window.print();
  };

  return { handlePrint };
};
