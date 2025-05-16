
import { useState } from 'react';
import { FilterOption } from '../types';

export const useCallFilters = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [dateRange, setDateRange] = useState<{from: Date | null, to: Date | null}>({
    from: null,
    to: null
  });

  // Apply filters function
  const applyFilters = (newFilters: FilterOption[]) => {
    setFilters(newFilters);
  };

  // Add a filter
  const addFilter = (filter: FilterOption) => {
    setFilters([...filters, filter]);
  };

  // Remove a filter
  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters([]);
  };

  // Update date range
  const updateDateRange = (range: { from: Date | null, to: Date | null }) => {
    setDateRange(range);
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    applyFilters,
    addFilter,
    removeFilter,
    clearFilters,
    dateRange,
    updateDateRange
  };
};
