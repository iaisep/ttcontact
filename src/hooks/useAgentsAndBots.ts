
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { agentsApi, type Agent, type AgentBot } from '@/services/agentsApi';

export const useAgentsAndBots = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentBots, setAgentBots] = useState<AgentBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching agents and bots data...');
      
      const [agentsData, botsData] = await Promise.all([
        agentsApi.getAgents(),
        agentsApi.getAgentBots()
      ]);

      console.log('Agents data:', agentsData);
      console.log('Bots data:', botsData);
      
      setAgents(agentsData);
      setAgentBots(botsData);
      
    } catch (error) {
      console.error('Error fetching agents and bots:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
      toast.error('Failed to load agents and bots data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    agents,
    agentBots,
    loading,
    error,
    refetch: fetchData
  };
};
