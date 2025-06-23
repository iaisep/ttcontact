
import { useState, useEffect } from 'react';

interface ChatAgentDetails {
  id: string;
  name: string;
  description: string;
  outgoing_url: string;
  account_id: string;
  created_at: string;
  updated_at: string;
}

export const useChatAgentDetails = (agentId?: string) => {
  const [agent, setAgent] = useState<ChatAgentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setIsLoading(false);
      return;
    }

    const fetchAgentDetails = async () => {
      console.log('Fetching agent details for ID:', agentId);
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/agent_bots/${agentId}`, {
          method: 'GET',
          headers: {
            'api_access_token': 'YZEKfqAJsnEWoshpdRCq9yZn',
            'Content-Type': 'application/json'
          }
        });

        console.log('API Response status:', response.status);

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Demasiadas solicitudes. Por favor intenta nuevamente en unos momentos.');
          }
          throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        console.log('Agent details received:', data);
        
        setAgent(data);
      } catch (error) {
        console.error('Error fetching agent details:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar el agente';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to help with rate limiting
    const timeoutId = setTimeout(fetchAgentDetails, 100);
    return () => clearTimeout(timeoutId);
  }, [agentId]);

  return { agent, isLoading, error };
};
