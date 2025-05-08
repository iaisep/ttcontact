
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
    
    try {
      // Prepare request data
      const requestData = prepareCallHistoryRequest(
        currentPage,
        pageSize,
        searchQuery,
        filters,
        dateRange
      );
      
      console.log('Preparing to fetch call history with request:', requestData);
      
      // Fetch data from API or get mock data
      const result = await fetchCallHistory(requestData);
      
      console.log('Call history fetch result:', result);
      
      if (result.success) {
        // Map API data to our internal format if needed
        const formattedData = result.data.map(call => {
          // Basic validation to ensure required fields
          if (!call.callId) {
            console.warn('Call data missing callId:', call);
          }
          
          // Format as needed
          return {
            ...call,
            id: call.id || call.callId || `call-${Math.random().toString(36).substring(2, 9)}`,
            callId: call.callId || call.call_id || `call-${Math.random().toString(36).substring(2, 9)}`,
            from: call.from || call.from_number || 'Unknown',
            to: call.to || call.to_number || 'Unknown',
            date: call.date || new Date(call.start_timestamp || Date.now()).toLocaleDateString(),
            time: call.time || new Date(call.start_timestamp || Date.now()).toLocaleTimeString(),
            status: call.status || call.call_status || 'ended',
            duration: call.duration || call.duration_ms ? `${Math.floor(Number(call.duration_ms) / 1000)}s` : '0s',
            type: call.type || call.call_type || 'unknown'
          } as CallHistoryItem;
        });
      
        setCallHistory(formattedData);
        setTotalItems(result.total);
      } else {
        console.warn('Using fallback data due to API error');
        setCallHistory(result.data);
        setTotalItems(result.total);
      }
    } catch (error) {
      console.error('Critical error in loadCallHistory:', error);
      setCallHistory([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    console.log('Triggering call history load based on filters/pagination change');
    loadCallHistory();
  }, [currentPage, pageSize, searchQuery, filters, dateRange.start, dateRange.end]);

  return {
    isLoading,
    callHistory,
    refreshData: loadCallHistory
  };
};
