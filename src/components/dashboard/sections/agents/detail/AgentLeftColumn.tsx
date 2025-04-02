
import React from 'react';
import EditablePrompt from './EditablePrompt';
import { WelcomeMessageEditor } from './welcome-message';
import GeneralPromptEditor from './GeneralPromptEditor';
import { RetellAgent, RetellLLM, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { VoiceSelectionModal } from './voice-selection';
import { AgentSettingsRow } from './components/AgentSettingsRow';
import { useVoiceSettings } from './hooks/useVoiceSettings';
import { useLlmSettings } from './hooks/useLlmSettings';
import { useLanguageSelector } from './hooks/useLanguageSelector';
import { useAgentPrompt } from './hooks/useAgentPrompt';

interface AgentLeftColumnProps {
  agent: RetellAgent;
  llm?: RetellLLM | null;
  updateAgentField: (fieldName: string, value: any) => void;
  refreshData?: () => void;
  voice?: RetellVoice | null;
}

const AgentLeftColumn: React.FC<AgentLeftColumnProps> = ({
  agent,
  llm,
  updateAgentField,
  refreshData,
  voice
}) => {
  // Get the LLM ID safely
  const llmId = agent.response_engine?.llm_id || llm?.id;
  
  // Use custom hooks to manage state and logic
  const voiceSettings = useVoiceSettings({ 
    initialVoice: agent.voice || (voice?.name || voice?.voice_name || 'Select Voice'), 
    updateAgentField 
  });
  
  const llmSettings = useLlmSettings({ 
    llmId,
    updateAgentField 
  });
  
  const languageSelector = useLanguageSelector({ 
    initialLanguage: agent.language || 'Spanish', 
    updateAgentField 
  });

  const promptManager = useAgentPrompt({
    initialPrompt: agent.prompt,
    onUpdate: (value) => updateAgentField('prompt', value)
  });

  return (
    <div className="space-y-15 width: 600px"> {/* Increased from space-y-6 to space-y-8 */}
      <AgentSettingsRow
        agent={agent}
        llmId={llmId}
        llmSettings={llmSettings}
        voiceSettings={voiceSettings}
        languageSelector={languageSelector}
        voice={voice}
        updateAgentField={updateAgentField}
      />

      {/* Display LLM General Prompt if available */}
      {llm?.general_prompt && (
        <div className="mt-8 bg-gray-50 p-4 rounded-lg"> {/* Increased from mt-6 to mt-8 */}
          <GeneralPromptEditor 
            generalPrompt={llm.general_prompt}
            onUpdate={(value) => updateAgentField('general_prompt', value)}
            llmId={llmId}
          />
        </div>
      )}

      {/* Welcome Message */}
      <div className="mt-8"> {/* Increased from mt-6 to mt-8 */}
        <h3 className="text-[10px] font-medium mb-2">Welcome Message</h3>
        <div className="text-[10px]">
          <WelcomeMessageEditor 
            welcomeMessage={agent.welcome_message || 'User initiates: AI remains silent until users speak first.'}
            onUpdate={(value) => updateAgentField('welcome_message', value)}
            llmId={llmId}
          />
        </div>
      </div>

      {/* Agent Prompt */}
      <div className="mt-8"> {/* Increased from mt-6 to mt-8 */}
        <EditablePrompt
          prompt={promptManager.prompt}
          onUpdate={promptManager.updatePrompt}
        />
      </div>
    </div>
  );
};

export default AgentLeftColumn;

