import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AgentsTable from './agents/AgentsTable';
import AgentsToolbar from './agents/AgentsToolbar';
import AgentForm from './agents/AgentForm';
import { Agent } from './agents/types';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AgentsSection: React.FC = () => {
  const { t } = useLanguage();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAgentFormOpen, setIsAgentFormOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading agents from an API
    const loadAgents = async () => {
      setIsLoading(true);
      // Replace this with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockAgents: Agent[] = [
        { id: '1', name: 'Agent 1', description: 'Description 1' },
        { id: '2', name: 'Agent 2', description: 'Description 2' },
      ];
      setAgents(mockAgents);
      setIsLoading(false);
    };

    loadAgents();
  }, []);

  const handleAddAgent = () => {
    setSelectedAgent(null);
    setIsAgentFormOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsAgentFormOpen(true);
  };

  const handleDeleteAgent = async (agentId: string) => {
    setIsLoading(true);
    // Simulate deleting an agent from an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAgents(agents.filter(agent => agent.id !== agentId));
    setIsLoading(false);
    toast.success(t('agent_deleted'));
  };

  const handleSubmitAgent = async (agent: Agent) => {
    setIsLoading(true);
    // Simulate saving an agent to an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (agent.id) {
      // Update existing agent
      setAgents(agents.map(a => (a.id === agent.id ? agent : a)));
      toast.success(t('agent_updated'));
    } else {
      // Add new agent
      agent.id = Math.random().toString(); // Simulate ID generation
      setAgents([...agents, agent]);
      toast.success(t('agent_added'));
    }
    setIsLoading(false);
    setIsAgentFormOpen(false);
  };

  const handleCancelAgentForm = () => {
    setIsAgentFormOpen(false);
  };

  const handleImportAgents = () => {
    // Handle import agents logic
    toast.success(t('agents_imported'));
  };

  return (
    <div className="p-6 space-y-6">
      <AgentsToolbar 
        onAddAgent={handleAddAgent} 
        onImportAgents={handleImportAgents} 
      />
      <AgentsTable 
        agents={agents} 
        onEditAgent={handleEditAgent} 
        onDeleteAgent={handleDeleteAgent}
        isLoading={isLoading}
      />
      {isAgentFormOpen && (
        <AgentForm 
          initialAgent={selectedAgent} 
          onSubmit={handleSubmitAgent}
          onCancel={handleCancelAgentForm}
        />
      )}
    </div>
  );
};

export default AgentsSection;
