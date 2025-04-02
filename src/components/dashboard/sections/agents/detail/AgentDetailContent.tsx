
import React from 'react';
import { RetellAgent, RetellVoice, RetellLLM } from '@/components/dashboard/sections/agents/types/retell-types';
import AgentDetailHeader from './AgentDetailHeader';
import AgentLeftColumn from './AgentLeftColumn';
import AgentRightColumn from './AgentRightColumn';
import AgentSettingsAccordion from './AgentSettingsAccordion';
import KnowledgeBaseSummary from './KnowledgeBaseSummary';

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
  return (
    <div className="min-h-screen bg-background">
      <AgentDetailHeader 
        agent={agent}
        voice={voice}
        updateAgentField={updateAgentField}
      />

      <div className="container py-6 px-4">
        <KnowledgeBaseSummary knowledgeBases={knowledgeBases} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Prompt Editor */}
          <div className="md:col-span-8">
            <AgentLeftColumn 
              agent={agent}
              llm={llm}
              voice={voice}
              updateAgentField={updateAgentField}
              refreshData={refreshData}
            />
          </div>

          {/* Middle Column - Accordion Settings */}
          <div className="md:col-span-4">
            <AgentSettingsAccordion 
              agent={agent}
              knowledgeBases={knowledgeBases}
              updateAgentField={updateAgentField}
            />
          </div>

          {/* Right Column - Test Panel */}
          <div className="md:col-span-3">
            <AgentRightColumn 
              agent={agent}
              voice={voice}
              updateAgentField={updateAgentField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailContent;
