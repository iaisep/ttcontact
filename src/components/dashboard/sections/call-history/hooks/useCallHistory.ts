import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { CallHistoryItem, FilterOption, CallDetailInfo, ColumnVisibility } from '../types';

export const useCallHistory = () => {
  const { fetchWithAuth } = useApiContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  const [selectedCall, setSelectedCall] = useState<CallDetailInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({
    start: null,
    end: null
  });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    time: true,
    callDuration: true,
    type: true,
    cost: true,
    callId: true,
    disconnectionReason: true,
    callStatus: true,
    userSentiment: true,
    from: true,
    to: true,
    callSuccessful: true,
    endToEndLatency: true,
    oportunidad: true,
    opportunidad: true,
    resumen_2da_llamada: true
  });

  // Fetch call history data
  const fetchCallHistory = async () => {
    setIsLoading(true);
    try {
      // Format date range for API request
      const params = new URLSearchParams();
      if (dateRange.start) {
        params.append('start_date', dateRange.start.toISOString());
      }
      if (dateRange.end) {
        params.append('end_date', dateRange.end.toISOString());
      }
      
      params.append('page', currentPage.toString());
      params.append('page_size', pageSize.toString());
      
      // Add filters if any
      filters.forEach(filter => {
        if (filter.value !== null && filter.value !== '') {
          params.append(`filter_${filter.field}`, String(filter.value));
        }
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      // In a real app, we'd make the API call
      const response = await fetchWithAuth(`/v2/list-calls?${params.toString()}`);
      
      // For now, we'll use mock data since the API call might fail in development
      // This is a fallback for development environment
      const mockData = generateMockCallHistory();
      
      setCallHistory(response?.data || mockData);
      setTotalItems(response?.total || mockData.length);
    } catch (error) {
      console.error('Error fetching call history:', error);
      toast.error('Failed to fetch call history. Using mock data instead.');
      
      // Fallback to mock data on error
      const mockData = generateMockCallHistory();
      setCallHistory(mockData);
      setTotalItems(mockData.length);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch call details when a call is selected
  const fetchCallDetails = async (callId: string) => {
    try {
      // Find the basic call info from our existing data
      const callInfo = callHistory.find(call => call.callId === callId);
      
      if (!callInfo) {
        toast.error('Call information not found');
        return;
      }
      
      setSelectedCall({ ...callInfo, transcript: 'Loading transcript...' });
      
      // Fetch detailed call info
      const callDetails = await fetchWithAuth(`/v2/get-call-details/${callId}`);
      
      // Fetch agent details if we have an agent ID
      let agentDetails = null;
      if (callInfo.agentId) {
        const agentResponse = await fetchWithAuth(`/list-agents?id=${callInfo.agentId}`);
        if (agentResponse && agentResponse.length > 0) {
          agentDetails = agentResponse[0];
        }
      }
      
      setSelectedCall({
        ...callInfo,
        ...callDetails,
        agentDetails
      });
    } catch (error) {
      console.error('Error fetching call details:', error);
      toast.error('Failed to fetch call details');
      
      // Keep the basic info we have
      if (callHistory.find(call => call.callId === callId)) {
        setSelectedCall({
          ...callHistory.find(call => call.callId === callId)!,
          transcript: 'Transcript not available'
        });
      }
    }
  };

  // Apply filters function
  const applyFilters = (newFilters: FilterOption[]) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Add a filter
  const addFilter = (filter: FilterOption) => {
    setFilters([...filters, filter]);
    setCurrentPage(1); // Reset to first page when filters change
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
  const updateDateRange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
    setCurrentPage(1); // Reset to first page when date range changes
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Update multiple column visibility settings
  const updateColumnVisibility = (settings: ColumnVisibility) => {
    setColumnVisibility(settings);
  };

  // Close call details
  const closeCallDetails = () => {
    setSelectedCall(null);
  };

  // Generate mock data for development
  const generateMockCallHistory = (): CallHistoryItem[] => {
    return [
      {
        id: '1',
        callId: 'call_4398a3f010eb19d1b08668339c',
        agentName: 'CO-MOR6-ES',
        agentId: 'agent_dde27f3660ffe32c7a76bc2ada',
        phoneNumber: '+5521923670247',
        from: '+5521923670247',
        to: '+551194714271',
        date: '2025-05-08',
        time: '05:03',
        duration: '0:11',
        type: 'phone_call',
        cost: '$0.020',
        status: 'ended',
        disconnectionReason: 'user hangup',
        userSentiment: 'Neutral',
        callSuccessful: false,
        callSuccessfulStatus: 'Unsuccessful',
        endToEndLatency: '2633ms',
        oportunidad: false,
        opportunidad: 'No hay información suficiente'
      },
      {
        id: '2',
        callId: 'call_808dfc183c183bd8dcd49e6b8',
        agentName: 'AD-1LLAMADA-MX-ES 2da llamada',
        agentId: 'agent_edbde15f93f34de1297c28603b',
        phoneNumber: '+12564176339',
        from: '+12564176339',
        to: '+551194714271',
        date: '2025-05-08',
        time: '04:51',
        duration: '0:25',
        type: 'phone_call',
        cost: '$0.056',
        status: 'ended',
        disconnectionReason: 'user hangup',
        userSentiment: 'Positive',
        callSuccessful: false,
        callSuccessfulStatus: 'Unsuccessful',
        oportunidad: false
      },
      {
        id: '3',
        callId: 'call_3e2aed3e6adbc9a3459b19108b0',
        agentName: 'AD-1LLAMADA-MX-ES Bta',
        agentId: 'agent_2156403e6c90ad9b51643af960',
        phoneNumber: '+12564176339',
        from: '+12564176339',
        to: '+551194714271',
        date: '2025-05-08',
        time: '00:00',
        duration: '0:26',
        type: 'phone_call',
        cost: '$0.058',
        status: 'ended',
        disconnectionReason: 'user hangup',
        userSentiment: 'Neutral',
        callSuccessful: false,
        callSuccessfulStatus: 'Unsuccessful',
        opportunidad: 'No se pudo determinar el interés'
      },
      {
        id: '4',
        callId: 'call_0a6afb4dd6095cb6c94e20755b',
        agentName: 'CO-MOR4-ES',
        agentId: 'agent_d2851e6b5bb19e9e0127355749',
        phoneNumber: '+12564176339',
        from: '+12564176339',
        to: '+551194714271',
        date: '2025-05-07',
        time: '23:59',
        duration: '0:91',
        type: 'phone_call',
        cost: '$0.104',
        status: 'ended',
        disconnectionReason: 'user hangup',
        userSentiment: 'Unknown',
        callSuccessful: false,
        callSuccessfulStatus: 'Unsuccessful',
        oportunidad: false
      },
      {
        id: '5',
        callId: 'call_d3113faa791836428622c1cad3658',
        agentName: 'AD-1LLAMADA-USD-ES Btassss',
        agentId: 'agent_53c15d2530f34cd194154068ad',
        phoneNumber: '+12564176339',
        from: '+12564176339',
        to: '+551194714271',
        date: '2025-05-07',
        time: '23:42',
        duration: '0:00',
        type: 'phone_call',
        cost: '$0.000',
        status: 'error',
        disconnectionReason: 'dial no answer',
        userSentiment: 'Unknown',
        callSuccessful: false,
        callSuccessfulStatus: 'Unsuccessful'
      },
      {
        id: '6',
        callId: 'call_1ba1cb4bda9b0215f81be172220',
        agentName: 'AD-1LLAMADA-COL-ES',
        agentId: 'agent_f32f12a5d5618225bd67876d5f',
        phoneNumber: '+12564176339',
        from: '+12564176339',
        to: '+551194714271',
        date: '2025-05-07',
        time: '23:37',
        duration: '1:00',
        type: 'phone_call',
        cost: '$0.132',
        status: 'ended',
        disconnectionReason: 'user hangup',
        userSentiment: 'Positive',
        callSuccessful: false,
        callSuccessfulStatus: 'Unsuccessful',
        endToEndLatency: '2040ms',
        oportunidad: true,
        opportunidad: 'Investigar'
      },
      {
        id: '7',
        callId: 'call_753cf1236a3c8bffbad67b267c',
        agentName: 'AD-1LLAMADA-USD-ES',
        agentId: 'agent_0df490fa4b36ea481dc8c198ee',
        phoneNumber: '+5521923670247',
        from: '+5521923670247',
        to: '+551194714271',
        date: '2025-05-07',
        time: '20:52',
        duration: '0:00',
        type: 'phone_call',
        cost: '$0.000',
        status: 'error',
        disconnectionReason: 'dial no answer',
        userSentiment: 'Unknown',
        callSuccessful: false,
        callSuccessfulStatus: 'Unsuccessful'
      },
      {
        id: '8',
        callId: 'call_c18ef9e6a4dc549c40da12b41f',
        agentName: 'CO-MOR6-ES',
        agentId: 'agent_dde27f3660ffe32c7a76bc2ada',
        phoneNumber: '+12564176339',
        from: '+12564176339',
        to: '+551194714271',
        date: '2025-05-07',
        time: '20:11',
        duration: '0:34',
        type: 'phone_call',
        cost: '$0.076',
        status: 'ended',
        disconnectionReason: 'user hangup',
        userSentiment: 'Positive',
        callSuccessful: true,
        callSuccessfulStatus: 'Successful',
        endToEndLatency: '1553ms',
        oportunidad: true,
        opportunidad: 'The user showed interest in our services'
      }
    ];
  };

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    fetchCallHistory();
  }, [currentPage, pageSize, searchQuery, filters, dateRange.start, dateRange.end]);

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
    closeCallDetails
  };
};
