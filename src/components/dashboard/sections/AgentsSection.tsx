
import React, { useState, useEffect } from 'react';
import AgentsTable from './agents/AgentsTable';
import AgentsToolbar from './agents/AgentsToolbar';
import AgentForm from './agents/AgentForm';
import { useRetellData } from './agents/hooks/useRetellData';
import { useAgentActions } from './agents/hooks/useAgentActions';
import { useAgentCreation } from './agents/hooks/useAgentCreation';
import AgentTemplateDialog from './agents/AgentTemplateDialog';

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
  
  // State for the template selection dialog
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  // Add searchQuery state to filter agents
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleOpenTemplateDialog = () => {
    setIsTemplateDialogOpen(true);
  };
  
  const handleCloseTemplateDialog = () => {
    setIsTemplateDialogOpen(false);
  };

  const handleTemplateSelection = async (templateType: string) => {
    console.log('Template selected:', templateType);
    // The actual creation logic is now handled in the dialog component
  };

  // Filter agents based on search query
  const filteredAgents = searchQuery.trim() === '' 
    ? agents 
    : agents.filter(agent => 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="p-6 space-y-6">
      <AgentsToolbar 
        onAddAgent={handleOpenTemplateDialog}
        onImportAgents={handleImportAgents}
        onRefreshAgents={fetchRetellData}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <AgentsTable 
        agents={filteredAgents} 
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
      
      <AgentTemplateDialog
        open={isTemplateDialogOpen}
        onClose={handleCloseTemplateDialog}
        onSelectTemplate={handleTemplateSelection}
      />
    </div>
  );
};

export default AgentsSection;
