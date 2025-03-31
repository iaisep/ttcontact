
import React from 'react';
import AgentsTable from './agents/AgentsTable';
import AgentsToolbar from './agents/AgentsToolbar';
import AgentForm from './agents/AgentForm';
import { useRetellData } from './agents/hooks/useRetellData';
import { useAgentActions } from './agents/hooks/useAgentActions';

const AgentsSection: React.FC = () => {
  // Use custom hooks to manage state and actions
  const { 
    agents, 
    voices, 
    folders, 
    llms, 
    isLoading, 
    setAgents, 
    setIsLoading,
    fetchRetellData 
  } = useRetellData();

  const {
    isAgentFormOpen,
    selectedAgent,
    handleAddAgent,
    handleEditAgent,
    handleDeleteAgent,
    handleSubmitAgent,
    handleCancelAgentForm,
    handleImportAgents
  } = useAgentActions(agents, setAgents, setIsLoading, fetchRetellData);

  return (
    <div className="p-6 space-y-6">
      <AgentsToolbar 
        onAddAgent={handleAddAgent} 
        onImportAgents={handleImportAgents}
        onRefreshAgents={fetchRetellData}
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
          voices={voices}
          folders={folders}
          llms={llms}
        />
      )}
    </div>
  );
};

export default AgentsSection;
