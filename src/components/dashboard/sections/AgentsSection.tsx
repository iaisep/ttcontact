
import React from 'react';
import AgentsTable from './agents/AgentsTable';
import AgentsToolbar from './agents/AgentsToolbar';
import AgentForm from './agents/AgentForm';
import { useRetellData } from './agents/hooks/useRetellData';
import { useAgentActions } from './agents/hooks/useAgentActions';
import { useAgentCreation } from './agents/hooks/useAgentCreation';

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

  const { createSinglePromptAgent, isCreating } = useAgentCreation();
  
  const handleTemplateSelection = async () => {
    // When template is selected from dialog, create a single prompt agent
    await createSinglePromptAgent();
  };

  return (
    <div className="p-6 space-y-6">
      <AgentsToolbar 
        onAddAgent={handleTemplateSelection}
        onImportAgents={handleImportAgents}
        onRefreshAgents={fetchRetellData}
      />
      <AgentsTable 
        agents={agents} 
        onEditAgent={handleEditAgent} 
        onDeleteAgent={handleDeleteAgent}
        isLoading={isLoading || isCreating}
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
