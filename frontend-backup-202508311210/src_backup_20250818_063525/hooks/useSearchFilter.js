// src/hooks/useSearchFilter.js
import { useState, useMemo } from 'react';

/**
 * Flexible search & filter hook for lists
 * Supports search term, status, date range, and custom filters
 */
export const useSearchFilter = (data = [], options = {}) => {
  const { searchableFields = [], dateField = 'date' } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [customFilters, setCustomFilters] = useState({});

  const getNestedValue = (obj, path) => {
    try {
      return path?.split('.').reduce((acc, key) => acc?.[key], obj);
    } catch {
      return undefined;
    }
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    let filtered = [...data];

    // 1. Search Term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        searchableFields.some(field => {
          const value = getNestedValue(item, field);
          return value?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // 2. Status Filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(
        item => item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // 3. Date Range Filter
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;

    if (startDate || endDate) {
      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter(item => {
        const itemDateVal = getNestedValue(item, dateField);
        if (!itemDateVal) return false;

        const itemDate = new Date(itemDateVal);
        return (!startDate || itemDate >= startDate) &&
               (!endDate || itemDate <= endDate);
      });
    }

    // 4. Custom Filters
    Object.entries(customFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(
          item => String(getNestedValue(item, key)) === String(value)
        );
      }
    });

    return filtered;
  }, [
    data,
    searchTerm,
    statusFilter,
    dateRange,
    customFilters,
    searchableFields,
    dateField
  ]);

  const updateFilter = (key, value) => {
    setCustomFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateRange({ start: '', end: '' });
    setCustomFilters({});
  };

  const getFilterSummary = () => {
    const summary = [];

    if (searchTerm.trim()) summary.push(`Search: "${searchTerm}"`);
    if (statusFilter) summary.push(`Status: ${statusFilter}`);
    if (dateRange.start || dateRange.end) {
      const dateDesc = dateRange.start && dateRange.end
        ? `${dateRange.start} → ${dateRange.end}`
        : dateRange.start
        ? `From ${dateRange.start}`
        : `Until ${dateRange.end}`;
      summary.push(`Date: ${dateDesc}`);
    }
    Object.entries(customFilters).forEach(([key, value]) => {
      if (value && value !== 'all') summary.push(`${key}: ${value}`);
    });

    return summary;
  };

  const hasActiveFilters = !!(
    searchTerm.trim() ||
    statusFilter ||
    dateRange.start ||
    dateRange.end ||
    Object.values(customFilters).some(v => v && v !== 'all')
  );

  const todayStr = new Date().toISOString().split('T')[0];

  const quickFilters = {
    today: () => {
      setDateRange({ start: todayStr, end: todayStr });
    },
    thisWeek: () => {
      const now = new Date();
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
      const lastDay = new Date(firstDay);
      lastDay.setDate(firstDay.getDate() + 6);

      setDateRange({
        start: firstDay.toISOString().split('T')[0],
        end: lastDay.toISOString().split('T')[0],
      });
    },
    thisMonth: () => {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      setDateRange({
        start: firstDay.toISOString().split('T')[0],
        end: lastDay.toISOString().split('T')[0],
      });
    },
  };

  return {
    // Inputs and Setters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    customFilters,
    setCustomFilters,
    updateFilter,
    clearAllFilters,

    // Outputs
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length,
    hasActiveFilters,
    getFilterSummary,

    // Preset date filters
    quickFilters,
  };
};
