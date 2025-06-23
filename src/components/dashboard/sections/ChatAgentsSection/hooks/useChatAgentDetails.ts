
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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Agent details:', data);
        
        setAgent(data);
      } catch (error) {
        console.error('Error fetching agent details:', error);
        setError('Failed to fetch agent details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentDetails();
  }, [agentId]);

  return { agent, isLoading, error };
};
