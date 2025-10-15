// src/hooks/useEnhancedNavigation.js - CLEANED VERSION
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Enhanced Navigation Hook with State Persistence
export const useEnhancedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [pageState, setPageState] = useState({});

  // Save page state when navigating
  const savePageState = useCallback((path, state) => {
    setPageState(prev => ({
      ...prev,
      [path]: state
    }));

    // Store in sessionStorage for browser refresh recovery
    sessionStorage.setItem('pageState', JSON.stringify({
      ...JSON.parse(sessionStorage.getItem('pageState') || '{}'),
      [path]: state
    }));
  }, []);

  // Restore page state
  const getPageState = useCallback((path) => {
    const sessionState = JSON.parse(sessionStorage.getItem('pageState') || '{}');
    return pageState[path] || sessionState[path] || {};
  }, [pageState]);

  // Enhanced navigation with state persistence
  const navigateTo = useCallback((path, options = {}) => {
    const { state, replace = false } = options;

    if (state) {
      savePageState(path, state);
    }

    // Update navigation history for smart back button
    if (!replace) {
      setNavigationHistory(prev => [...prev, location.pathname]);
    }

    navigate(path, { replace, state });
  }, [navigate, location.pathname, savePageState]);

  // Smart back navigation
  const goBack = useCallback(() => {
    if (navigationHistory.length > 0) {
      const previousPath = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      navigate(previousPath);
    } else {
      // Fallback to browser back or dashboard
      if (window.history.length > 1) {
        window.history.back();
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigationHistory, navigate]);

  return {
    navigateTo,
    goBack,
    savePageState,
    getPageState,
    currentPath: location.pathname,
    canGoBack: navigationHistory.length > 0 || window.history.length > 1
  };
};
