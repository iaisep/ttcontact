
import React from 'react';
import EditablePrompt from './EditablePrompt';
import WelcomeMessageEditor from './WelcomeMessageEditor';
import AgentSettingsToolbar from './AgentSettingsToolbar';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface AgentLeftColumnProps {
  agent: RetellAgent;
  defaultLanguage: string;
  selectedLlmModel: string;
  onLanguageChange: (value: string) => void;
  onLlmModelChange: (value: string) => void;
  updateAgentField: (fieldName: string, value: any) => void;
}

const AgentLeftColumn: React.FC<AgentLeftColumnProps> = ({
  agent,
  defaultLanguage,
  selectedLlmModel,
  onLanguageChange,
  onLlmModelChange,
  updateAgentField
}) => {
  return (
    <div className="space-y-4">
      <AgentSettingsToolbar 
        defaultLanguage={defaultLanguage}
        selectedLlmModel={selectedLlmModel}
        onLanguageChange={onLanguageChange}
        onLlmModelChange={onLlmModelChange}
      />

      <EditablePrompt
        prompt={agent.prompt || ''}
        onUpdate={(value) => updateAgentField('prompt', value)}
      />

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Welcome Message</h3>
        <WelcomeMessageEditor
          welcomeMessage={agent.welcome_message || 'Hola {name}, que gusto volver a saludarte.'}
          onUpdate={(value) => updateAgentField('welcome_message', value)}
        />
      </div>
    </div>
  );
};

export default AgentLeftColumn;
