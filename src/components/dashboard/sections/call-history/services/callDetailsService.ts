
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
      // Usar el endpoint correcto con GET para obtener detalles de llamada
      const callDetails = await fetchWithAuth(`/v2/get-call/${callId}`, {
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
      // Usar el endpoint correcto con GET para obtener detalles del agente
      const agentResponse = await fetchWithAuth(`/get-agent/${agentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Procesar la respuesta del agente para asegurar que se use agent_name
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
    fetchCallDetailsData,
    fetchAgentDetails
  };
};
