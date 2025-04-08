
import { useCallback, useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

export interface Agent {
  id: string;
  name: string;
}

export const useAgents = () => {
  const { fetchWithAuth } = useApiContext();
  const [agents, setAgents] = useState<Agent[]>([]);

  const fetchAgents = useCallback(async () => {
    try {
      const data = await fetchWithAuth('/list-agents');
      console.log('Agents data:', data);
      if (Array.isArray(data)) {
        setAgents(data);
      } else {
        console.error('Expected array but got:', data);
        setAgents([]);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      toast.error('Failed to fetch agents');
    }
  }, [fetchWithAuth]);

  return {
    agents,
    fetchAgents
  };
};
