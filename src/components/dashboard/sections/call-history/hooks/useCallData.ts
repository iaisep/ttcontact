
import { useState, useEffect } from 'react';
import { CallHistoryItem, FilterOption } from '../types';
import { useCallHistoryService } from '../services/callHistoryService';
import { prepareCallHistoryRequest } from '../utils/callRequestUtils';

/**
 * Hook for managing call history data, including fetching and state
 */
export const useCallData = (
  currentPage: number,
  pageSize: number,
  searchQuery: string,
  filters: FilterOption[],
  dateRange: {start: Date | null, end: Date | null},
  setTotalItems: (total: number) => void
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  const { fetchCallHistory } = useCallHistoryService();

  // Fetch call history data
  const loadCallHistory = async () => {
    setIsLoading(true);
    
    // Prepare request data
    const requestData = prepareCallHistoryRequest(
      currentPage,
      pageSize,
      searchQuery,
      filters,
      dateRange
    );
    
    // Fetch data from API or get mock data
    const result = await fetchCallHistory(requestData);
    
    setCallHistory(result.data);
    setTotalItems(result.total);
    setIsLoading(false);
  };

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    loadCallHistory();
  }, [currentPage, pageSize, searchQuery, filters, dateRange.start, dateRange.end]);

  return {
    isLoading,
    callHistory,
    refreshData: loadCallHistory
  };
};
