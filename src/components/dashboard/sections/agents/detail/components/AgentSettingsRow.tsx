
import React, { useEffect } from 'react';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import SelectorsRow from './SelectorsRow';
import { VoiceSelectionModal } from '../voice-selection';

interface AgentSettingsRowProps {
  agent: RetellAgent;
  llmId?: string;
  llmSettings: any;
  voiceSettings: any;
  languageSelector: any;
  voice?: RetellVoice | null;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const AgentSettingsRow: React.FC<AgentSettingsRowProps> = ({
  agent,
  llmId,
  llmSettings,
  voiceSettings,
  languageSelector,
  voice,
  updateAgentField
}) => {
  // Fetch LLM data when component mounts or llmId changes
  useEffect(() => {
    if (llmId) {
      llmSettings.fetchLlmData();
    }
  }, [llmId]);

  // Set voice avatar URL from the voice object if available
  useEffect(() => {
    if (voice?.avatar_url) {
      voiceSettings.setVoiceAvatarUrl(voice.avatar_url);
    }
  }, [voice]);

  // Update selected voice when agent voice changes
  useEffect(() => {
    if (agent.voice) {
      voiceSettings.setSelectedVoice(agent.voice);
    } else if (voice?.name || voice?.voice_name) {
      voiceSettings.setSelectedVoice(voice.name || voice.voice_name || 'Select Voice');
    }
  }, [agent.voice, voice]);

  return (
    <>
      <SelectorsRow
        // LLM settings props
        llmId={llmId}
        selectedModel={llmSettings.selectedModel}
        isLlmSettingsOpen={llmSettings.isLlmSettingsOpen}
        setIsLlmSettingsOpen={llmSettings.setIsLlmSettingsOpen}
        llmTemperature={llmSettings.llmTemperature}
        setLlmTemperature={llmSettings.setLlmTemperature}
        structuredOutput={llmSettings.structuredOutput}
        setStructuredOutput={llmSettings.setStructuredOutput}
        highPriority={llmSettings.highPriority}
        setHighPriority={llmSettings.setHighPriority}
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
        voiceAvatarUrl={voiceSettings.voiceAvatarUrl || voice?.avatar_url}
        
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
        agent={agent}
        updateAgentField={updateAgentField}
      />
    </>
  );
};
