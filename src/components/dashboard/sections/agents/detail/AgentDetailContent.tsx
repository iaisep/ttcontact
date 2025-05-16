
import React, { useEffect } from 'react';
import { RetellAgent, RetellVoice, RetellLLM } from '@/components/dashboard/sections/agents/types/retell-types';
import AgentDetailHeader from './AgentDetailHeader';
import AgentLeftColumn from './AgentLeftColumn';
import AgentRightColumn from './AgentRightColumn';
import AgentSettingsAccordion from './settings-accordion';
import { Toaster } from '@/components/ui/sonner';

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface AgentDetailContentProps {
  agent: RetellAgent;
  llm: RetellLLM | null;
  voice: RetellVoice | null;
  knowledgeBases: KnowledgeBase[];
  updateAgentField: (fieldName: string, value: any) => void;
  refreshData: () => void;
}

const AgentDetailContent: React.FC<AgentDetailContentProps> = ({
  agent,
  llm,
  voice,
  knowledgeBases,
  updateAgentField,
  refreshData
}) => {
  // Debug logs
  useEffect(() => {
    console.log('Agent Detail Content - knowledgeBases:', knowledgeBases);
  }, [knowledgeBases]);

  return (
    <div className="min-h-screen bg-background">
      <AgentDetailHeader 
        agent={agent}
        voice={voice}
        updateAgentField={updateAgentField}
      />

      <div className="container py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Prompt Editor */}
          <div className="lg:col-span-5">
            <AgentLeftColumn 
              agent={agent}
              llm={llm}
              voice={voice}
              updateAgentField={updateAgentField}
              refreshData={refreshData}
            />
          </div>

          {/* Middle Column - Accordion Settings */}
          <div className="lg:col-span-4">
            <AgentSettingsAccordion 
              agent={agent}
              knowledgeBases={knowledgeBases}
              updateAgentField={updateAgentField}
            />
          </div>

          {/* Right Column - Test Panel */}
          <div className="lg:col-span-3">
            <AgentRightColumn 
              agent={agent}
              voice={voice}
              updateAgentField={updateAgentField}
            />
          </div>
        </div>
      </div>
      
      {/* Add Sonner Toaster for toast notifications */}
      <Toaster />
    </div>
  );
};

export default AgentDetailContent;
