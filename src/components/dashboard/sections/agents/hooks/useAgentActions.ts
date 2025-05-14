
import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { Agent } from '../types';
import { useAgentCreation } from './useAgentCreation';

export const useAgentActions = (
  agents: Agent[],
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchRetellData: () => Promise<void>
) => {
  const { fetchWithAuth } = useApiContext();
  const { t } = useLanguage();
  const [isAgentFormOpen, setIsAgentFormOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { createSinglePromptAgent, isCreating } = useAgentCreation();

  const handleAddAgent = () => {
    // This will now be triggered from the template dialog
    // when the user selects a template
    setSelectedAgent(null);
    setIsAgentFormOpen(true);
  };

  const handleCreateFromTemplate = async (templateType: string) => {
    if (templateType === 'blank') {
      await createSinglePromptAgent();
    }
    // In the future, add more template types here
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsAgentFormOpen(true);
  };

  const handleDeleteAgent = async (agentId: string) => {
    setIsLoading(true);
    try {
      // Call API to delete agent
      await fetchWithAuth(`/delete-agent/${agentId}`, {
        method: 'DELETE'
      });
      
      // Update local state after successful deletion
      setAgents(agents.filter(agent => agent.id !== agentId));
      toast.success(t('agent_deleted'));
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error(t('error_deleting_agent'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAgent = async (agent: Agent) => {
    setIsLoading(true);
    try {
      if (agent.id) {
        // Update existing agent
        const updatedAgent = await fetchWithAuth(`/update-agent/${agent.id}`, {
          method: 'PUT',
          body: JSON.stringify(agent)
        });
        
        // Update local state with updated agent
        setAgents(agents.map(a => (a.id === agent.id ? { ...a, ...updatedAgent } : a)));
        toast.success(t('agent_updated'));
      } else {
        // Create new agent
        const newAgent = await fetchWithAuth('/create-agent', {
          method: 'POST',
          body: JSON.stringify(agent)
        });
        
        // Add new agent to local state
        setAgents([...agents, newAgent]);
        toast.success(t('agent_added'));
      }
    } catch (error) {
      console.error('Error submitting agent:', error);
      toast.error(agent.id ? t('error_updating_agent') : t('error_adding_agent'));
    } finally {
      setIsLoading(false);
      setIsAgentFormOpen(false);
    }
  };

  const handleCancelAgentForm = () => {
    setIsAgentFormOpen(false);
  };

  const handleImportAgents = async () => {
    try {
      setIsLoading(true);
      // Simulate import process (placeholder for real implementation)
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('agents_imported'));
      // Reload agents after import
      fetchRetellData();
    } catch (error) {
      console.error('Error importing agents:', error);
      toast.error(t('error_importing_agents'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAgentFormOpen,
    selectedAgent,
    isCreating,
    handleAddAgent,
    handleEditAgent,
    handleDeleteAgent,
    handleSubmitAgent,
    handleCancelAgentForm,
    handleImportAgents,
    handleCreateFromTemplate
  };
};
