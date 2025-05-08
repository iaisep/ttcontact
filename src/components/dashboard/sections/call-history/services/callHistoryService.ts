
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { CallHistoryItem } from '../types';
import { generateMockCallHistory } from '../utils/mockCallData';

/**
 * Service for handling call history API requests
 */
export const useCallHistoryService = () => {
  const { fetchWithAuth } = useApiContext();

  /**
   * Fetch call history data from API
   * @param requestData Request data for API call
   * @returns API response or mock data on failure
   */
  const fetchCallHistory = async (requestData: Record<string, any>) => {
    try {
      console.log('Fetching call history with data:', requestData);
      
      const response = await fetchWithAuth('/v2/list-calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      console.log('Call history API response:', response);
      
      // Check if we have valid response data
      if (response && Array.isArray(response)) {
        // Transform API response to match CallHistoryItem type
        const transformedData = response.map(item => ({
          id: item.id || item.callId || item.call_id || `call-${Math.random().toString(36).substring(2, 9)}`,
          callId: item.callId || item.call_id || `call-${Math.random().toString(36).substring(2, 9)}`,
          batchCallId: item.batchCallId || item.batch_call_id,
          agentName: item.agentName || item.agent_name,
          agentId: item.agentId || item.agent_id,
          phoneNumber: item.phoneNumber || item.phone_number || '',
          from: item.from || item.from_number || 'Unknown',
          to: item.to || item.to_number || 'Unknown',
          date: item.date || new Date(item.start_timestamp || Date.now()).toLocaleDateString(),
          time: item.time || new Date(item.start_timestamp || Date.now()).toLocaleTimeString(),
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
        }));

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
