
import { useApiContext } from '@/context/ApiContext';

/**
 * Service for handling individual agent details operations
 */
export const useAgentDetailsService = () => {
  const { fetchWithAuth } = useApiContext();

  /**
   * Fetch information about an agent by ID
   * @param agentId The ID of the agent to retrieve
   * @returns Agent data response or error information
   */
  const fetchAgentDetails = async (agentId: string) => {
    try {
      // Use correct GET endpoint to fetch agent details
      const agentResponse = await fetchWithAuth(`/get-agent/${agentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Process the agent response to ensure agent_name is used
      const agentData = agentResponse;
      if (agentData && agentData.agent_name) {
        agentData.name = agentData.agent_name;
      }
      
      return {
        data: agentData || null,
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
    fetchAgentDetails
  };
};
