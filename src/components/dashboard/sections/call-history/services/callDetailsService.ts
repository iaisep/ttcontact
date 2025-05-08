
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { CallDetailInfo, CallHistoryItem } from '../types';

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
      // Fetch detailed call info using POST method
      const callDetails = await fetchWithAuth(`/v2/get-call-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ callId })
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
      const agentResponse = await fetchWithAuth(`/list-agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: agentId })
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
