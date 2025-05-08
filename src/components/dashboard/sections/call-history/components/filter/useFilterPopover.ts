
import { useState } from 'react';
import { FilterOption } from '../../types';
import { Agent } from '../../../agents/types';
import { useApiContext } from '@/context/ApiContext';

export const useFilterPopover = () => {
  const { fetchWithAuth } = useApiContext();
  const [selectedFilter, setSelectedFilter] = useState<string>('agent');
  const [filterValue, setFilterValue] = useState<string>('');
  const [isAgentFilterOpen, setIsAgentFilterOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  // Fetch agents for the agent filter
  const fetchAgents = async (): Promise<Agent[]> => {
    try {
      const response = await fetchWithAuth('/list-agents');
      return response || [];
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  };

  // Handle agent filter open
  const handleAgentFilterOpen = () => {
    setIsAgentFilterOpen(true);
  };

  // Handle agent filter close
  const handleAgentFilterClose = () => {
    setIsAgentFilterOpen(false);
  };

  // Handle agent filter apply
  const handleApplyAgentFilter = (agentIds: string[], onAddFilter: (filter: FilterOption) => void) => {
    if (agentIds.length > 0) {
      agentIds.forEach(agentId => {
        onAddFilter({
          field: 'agentId',
          value: agentId,
          operator: 'equals'
        });
      });
    }
    setIsAgentFilterOpen(false);
  };

  return {
    selectedFilter,
    setSelectedFilter,
    filterValue,
    setFilterValue,
    isAgentFilterOpen,
    handleAgentFilterOpen,
    handleAgentFilterClose,
    handleApplyAgentFilter,
    fetchAgents
  };
};
