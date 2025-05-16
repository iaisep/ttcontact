
import { useApiContext } from '@/context/ApiContext';

/**
 * Service for handling agent-related API operations
 */
export const useAgentService = () => {
  const { fetchWithAuth } = useApiContext();

  /**
   * Fetch agents data to map agent IDs to names
   * @returns Object mapping agent IDs to agent names
   */
  const fetchAgentData = async (): Promise<Record<string, string>> => {
    try {
      // Use GET method to fetch agents
      const response = await fetchWithAuth('/list-agents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Agents data response:', response);
      
      if (Array.isArray(response)) {
        // Create a mapping of agent IDs to agent names
        return response.reduce((mapping, agent) => {
          if (agent.id || agent.agent_id) {
            mapping[agent.id || agent.agent_id] = agent.agent_name || agent.name || 'Unknown Agent';
          }
          return mapping;
        }, {} as Record<string, string>);
      }
      
      return {};
    } catch (error) {
      console.error('Error fetching agents:', error);
      return {};
    }
  };

  return { fetchAgentData };
};
