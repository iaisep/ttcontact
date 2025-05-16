
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { CallHistoryItem } from '../types';
import { generateMockCallHistory } from '../utils/mockCallData';
import { formatTimestamp } from '@/lib/utils';
import { buildQueryParams } from '../utils/callRequestUtils';

/**
 * Service for handling call history API requests
 */
export const useCallHistoryService = () => {
  const { fetchWithAuth } = useApiContext();

  /**
   * Parse a date safely, returning a valid date string
   * @param dateValue The date to parse
   * @returns A valid date string or current date if invalid
   */
  const safelyParseDate = (dateValue: any): string => {
    if (!dateValue) return new Date().toLocaleDateString();
    
    try {
      const date = new Date(dateValue);
      // Check if the resulting date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', dateValue);
        return new Date().toLocaleDateString();
      }
      return date.toLocaleDateString();
    } catch (e) {
      console.warn('Error parsing date:', dateValue);
      return new Date().toLocaleDateString();
    }
  };

  /**
   * Process timestamp from API data
   * @param timestamp Timestamp in milliseconds or ISO string
   * @returns Formatted date and time
   */
  const processTimestamp = (timestamp: string | number | undefined): { date: string, time: string } => {
    // If no timestamp, return current date/time
    if (!timestamp) {
      console.log('Missing timestamp, using current date/time');
      return formatTimestamp(Date.now());
    }
    
    console.log('Processing timestamp:', timestamp, typeof timestamp);
    
    try {
      // If it's a number as string (typical API response)
      if (typeof timestamp === 'string' && /^\d+$/.test(timestamp)) {
        return formatTimestamp(parseInt(timestamp, 10));
      }
      
      // If it's already a number
      if (typeof timestamp === 'number') {
        return formatTimestamp(timestamp);
      }
      
      // Otherwise try to parse as a date string
      const dateObj = new Date(timestamp);
      if (!isNaN(dateObj.getTime())) {
        return formatTimestamp(dateObj.getTime());
      }
      
      console.warn('Could not parse timestamp:', timestamp);
      return { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() };
    } catch (e) {
      console.error('Error processing timestamp:', e, timestamp);
      return { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() };
    }
  };

  /**
   * Fetch call history data from API
   * @param requestData Request data for API call
   * @returns API response or mock data on failure
   */
  const fetchCallHistory = async (requestData: Record<string, any>) => {
    try {
      console.log('Fetching call history with data:', requestData);
      
      // Convert request data to query parameters for GET request
      const queryParams = buildQueryParams(requestData);
      const url = `/v2/list-calls${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Call history API response:', response);
      
      // Check if we have valid response data
      if (response && Array.isArray(response)) {
        // Transform API response to match CallHistoryItem type
        const transformedData = response.map(item => {
          // Get date from timestamp or use current date as fallback
          let dateInfo = { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() };
          
          if (item.start_timestamp) {
            console.log('Processing start_timestamp:', item.start_timestamp, typeof item.start_timestamp);
            dateInfo = processTimestamp(item.start_timestamp);
          }

          return {
            id: item.id || item.callId || item.call_id || `call-${Math.random().toString(36).substring(2, 9)}`,
            callId: item.callId || item.call_id || `call-${Math.random().toString(36).substring(2, 9)}`,
            batchCallId: item.batchCallId || item.batch_call_id,
            agentName: item.agentName || item.agent_name,
            agentId: item.agentId || item.agent_id,
            phoneNumber: item.phoneNumber || item.phone_number || '',
            from: item.from || item.from_number || 'Unknown',
            to: item.to || item.to_number || 'Unknown',
            date: dateInfo.date,
            time: dateInfo.time,
            duration: item.duration || (item.duration_ms ? `${Math.floor(Number(item.duration_ms) / 1000)}s` : '0s'),
            type: item.type || item.call_type || 'unknown',
            cost: item.cost || '0.00',
            status: item.status || item.call_status || 'ended',
            disconnectionReason: item.disconnectionReason || item.disconnection_reason || '',
            userSentiment: item.userSentiment || item.user_sentiment || 'Unknown',
            callSuccessful: item.callSuccessful || item.call_successful || false,
            callSuccessfulStatus: item.callSuccessfulStatus || item.call_successful_status,
            endToEndLatency: item.endToEndLatency || item.end_to_end_latency,
            oportunidad: item.oportunidad || false,
            opportunidad: item.opportunidad || '',
            resumen_2da_llamada: item.resumen_2da_llamada || ''
          };
        });

        return {
          data: transformedData as CallHistoryItem[],
          total: response.length,
          success: true
        };
      } else {
        console.warn('Unexpected API response format:', response);
        // Fall back to mock data if response format is unexpected
        const mockData = generateMockCallHistory();
        return {
          data: mockData,
          total: mockData.length,
          success: false
        };
      }
    } catch (error) {
      console.error('Error fetching call history:', error);
      toast.error('Failed to fetch call history. Using mock data instead.');
      
      // Fallback to mock data on error
      const mockData = generateMockCallHistory();
      return {
        data: mockData,
        total: mockData.length,
        success: false
      };
    }
  };

  return { fetchCallHistory };
};
