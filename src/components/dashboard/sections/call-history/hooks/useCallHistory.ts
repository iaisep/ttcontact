
import { useCallFilters } from './useCallFilters';
import { useCallPagination } from './useCallPagination';
import { useColumnVisibility } from './useColumnVisibility';
import { useCallDetails } from './useCallDetails';
import { useCallData } from './useCallData';
import { CallHistoryItem } from '../types';

export const useCallHistory = () => {
  // Use our separated hooks
  const {
    searchQuery,
    setSearchQuery,
    filters,
    applyFilters,
    addFilter,
    removeFilter,
    clearFilters,
    dateRange,
    updateDateRange
  } = useCallFilters();

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    setTotalItems,
    resetPagination
  } = useCallPagination();

  const {
    columnVisibility,
    toggleColumnVisibility,
    updateColumnVisibility
  } = useColumnVisibility();

  // Fetch call data
  const { isLoading, callHistory, refreshData } = useCallData(
    currentPage,
    pageSize,
    searchQuery,
    filters,
    dateRange,
    setTotalItems
  );

  // Call details handling
  const {
    selectedCall,
    fetchCallDetails: fetchCallDetailsBase,
    closeCallDetails
  } = useCallDetails();

  // Wrapper for fetchCallDetails to provide the current callHistory
  const fetchCallDetails = (callId: string) => {
    fetchCallDetailsBase(callId, callHistory);
  };

  return {
    isLoading,
    callHistory,
    searchQuery,
    setSearchQuery,
    filters,
    applyFilters,
    addFilter,
    removeFilter,
    clearFilters,
    dateRange,
    updateDateRange,
    columnVisibility,
    toggleColumnVisibility,
    updateColumnVisibility,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    selectedCall,
    fetchCallDetails,
    closeCallDetails,
    refreshData
  };
};
