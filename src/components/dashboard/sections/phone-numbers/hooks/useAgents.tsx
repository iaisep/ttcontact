
import { useCallback, useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

export interface Agent {
  id: string;
  name: string;
}

export const useAgents = () => {
  const { fetchWithAuth } = useApiContext();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWithAuth('/list-agents');
      console.log('Agents data:', data);
      if (Array.isArray(data)) {
        setAgents(data);
      } else {
        console.error('Expected array but got:', data);
        setAgents([]);
        setError('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      setError('Failed to fetch agents');
      toast.error('Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const addAgent = async (name: string): Promise<boolean> => {
    try {
      const newAgent = await fetchWithAuth('/add-agent', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      
      setAgents(prev => [...prev, newAgent]);
      toast.success('Agent added successfully');
      return true;
    } catch (error) {
      console.error('Failed to add agent:', error);
      toast.error('Failed to add agent');
      return false;
    }
  };

  const updateAgent = async (id: string, name: string): Promise<boolean> => {
    try {
      await fetchWithAuth(`/update-agent/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });
      
      setAgents(prev => prev.map(agent => 
        agent.id === id ? { ...agent, name } : agent
      ));
      
      toast.success('Agent updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update agent:', error);
      toast.error('Failed to update agent');
      return false;
    }
  };

  const deleteAgent = async (id: string): Promise<boolean> => {
    try {
      await fetchWithAuth(`/delete-agent/${id}`, {
        method: 'DELETE',
      });
      
      setAgents(prev => prev.filter(agent => agent.id !== id));
      toast.success('Agent deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete agent:', error);
      toast.error('Failed to delete agent');
      return false;
    }
  };

  return {
    agents,
    loading,
    error,
    fetchAgents,
    addAgent,
    updateAgent,
    deleteAgent
  };
};
