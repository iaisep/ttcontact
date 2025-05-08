
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
        return {
          data: response as CallHistoryItem[],
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
