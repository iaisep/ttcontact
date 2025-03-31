
import React from 'react';
import EditablePrompt from './EditablePrompt';
import WelcomeMessageEditor from './WelcomeMessageEditor';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { VoiceSelectionModal } from './voice-selection';
import SelectorsRow from './components/SelectorsRow';
import { useVoiceSettings } from './hooks/useVoiceSettings';
import { useLlmSettings } from './hooks/useLlmSettings';
import { useLanguageSelector } from './hooks/useLanguageSelector';

interface AgentLeftColumnProps {
  agent: RetellAgent;
  updateAgentField: (fieldName: string, value: any) => void;
}

const AgentLeftColumn: React.FC<AgentLeftColumnProps> = ({
  agent,
  updateAgentField
}) => {
  // Use custom hooks to manage state and logic
  const voiceSettings = useVoiceSettings({ 
    initialVoice: agent.voice || 'Adrian', 
    updateAgentField 
  });
  
  const llmSettings = useLlmSettings({ 
    initialModel: agent.llm_model || 'GPT 4o', 
    updateAgentField 
  });
  
  const languageSelector = useLanguageSelector({ 
    initialLanguage: agent.language || 'Spanish', 
    updateAgentField 
  });

  return (
    <div className="space-y-6">
      <SelectorsRow
        // LLM settings props
        selectedLlmModel={llmSettings.selectedLlmModel}
        isLlmSettingsOpen={llmSettings.isLlmSettingsOpen}
        setIsLlmSettingsOpen={llmSettings.setIsLlmSettingsOpen}
        llmTemperature={llmSettings.llmTemperature}
        setLlmTemperature={llmSettings.setLlmTemperature}
        structuredOutput={llmSettings.structuredOutput}
        setStructuredOutput={llmSettings.setStructuredOutput}
        highPriority={llmSettings.highPriority}
        setHighPriority={llmSettings.setHighPriority}
        llmOptions={llmSettings.llmOptions}
        handleLlmChange={llmSettings.handleLlmChange}
        handleSaveLlmSettings={llmSettings.handleSaveLlmSettings}
        
        // Voice settings props
        selectedVoice={voiceSettings.selectedVoice}
        isVoiceSettingsOpen={voiceSettings.isVoiceSettingsOpen}
        setIsVoiceSettingsOpen={voiceSettings.setIsVoiceSettingsOpen}
        voiceModel={voiceSettings.voiceModel}
        setVoiceModel={voiceSettings.setVoiceModel}
        voiceSpeed={voiceSettings.voiceSpeed}
        setVoiceSpeed={voiceSettings.setVoiceSpeed}
        voiceTemperature={voiceSettings.voiceTemperature}
        setVoiceTemperature={voiceSettings.setVoiceTemperature}
        voiceVolume={voiceSettings.voiceVolume}
        setVoiceVolume={voiceSettings.setVoiceVolume}
        voiceModelOptions={voiceSettings.voiceModelOptions}
        openVoiceModal={voiceSettings.openVoiceModal}
        handleSaveVoiceSettings={voiceSettings.handleSaveVoiceSettings}
        
        // Language settings props
        selectedLanguage={languageSelector.selectedLanguage}
        languageOptions={languageSelector.languageOptions}
        handleLanguageChange={languageSelector.handleLanguageChange}
      />

      {/* Voice Selection Modal */}
      <VoiceSelectionModal
        open={voiceSettings.isVoiceModalOpen}
        onClose={() => voiceSettings.setIsVoiceModalOpen(false)}
        onSelectVoice={voiceSettings.handleVoiceChange}
        selectedVoice={agent.voice_id}
      />

      {/* Prompt Editor */}
      <EditablePrompt
        prompt={agent.prompt || ''}
        onUpdate={(value) => updateAgentField('prompt', value)}
      />

      {/* Welcome Message */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Welcome Message</h3>
        <WelcomeMessageEditor
          welcomeMessage={agent.welcome_message || 'User initiates: AI remains silent until users speak first.'}
          onUpdate={(value) => updateAgentField('welcome_message', value)}
        />
      </div>
    </div>
  );
};

export default AgentLeftColumn;
