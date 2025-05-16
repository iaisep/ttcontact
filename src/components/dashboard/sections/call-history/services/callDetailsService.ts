
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { CallDetailInfo, CallHistoryItem } from '../types';
import { buildQueryParams } from '../utils/callRequestUtils';

/**
 * Service for handling call details API operations
 */
export const useCallDetailsService = () => {
  const { fetchWithAuth } = useApiContext();

  /**
   * Fetch detailed information about a specific call
   * @param callId The ID of the call to get details for
   * @returns Call details response or error information
   */
  const fetchCallDetailsData = async (callId: string) => {
    try {
      // Use GET method with query parameters
      const queryParams = buildQueryParams({ callId });
      const url = `/v2/get-call-details${queryParams}`;
      
      console.log('Calling API for call details with URL:', url);
      
      const callDetails = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return {
        data: callDetails,
        success: true
      };
    } catch (error) {
      console.error('Error fetching call details:', error);
      toast.error('Failed to fetch call details');
      return {
        data: null,
        success: false
      };
    }
  };

  /**
   * Fetch information about an agent by ID
   * @param agentId The ID of the agent to retrieve
   * @returns Agent data response or error information
   */
  const fetchAgentDetails = async (agentId: string) => {
    try {
      // Build query params specifically for list-agents endpoint
      // Use agent_name to match the field name required by the API
      const queryParams = buildQueryParams({ agent_name: agentId });
      const url = `/list-agents${queryParams}`;
      
      console.log('Calling API for agent details with URL:', url);
      
      const agentResponse = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return {
        data: agentResponse && agentResponse.length > 0 ? agentResponse[0] : null,
        success: true
      };
    } catch (error) {
      console.error('Error fetching agent details:', error);
      return {
        data: null,
        success: false
      };
    }
  };

  return {
    fetchCallDetailsData,
    fetchAgentDetails
  };
};
