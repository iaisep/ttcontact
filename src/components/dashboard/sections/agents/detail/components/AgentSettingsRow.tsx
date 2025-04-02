
import React, { useEffect, useState } from 'react';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import SelectorsRow from './SelectorsRow';
import { VoiceSelectionModal } from '../voice-selection';
import VoiceSettingsModal from './VoiceSettingsModal';

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
        llmTemperature={llmSettings.llmTemperature}
        structuredOutput={llmSettings.structuredOutput}
        highPriority={llmSettings.highPriority}
        handleLlmChange={llmSettings.handleLlmChange}
        onLlmSettingsUpdated={llmSettings.fetchLlmData}
        
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

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        open={voiceSettings.isVoiceSettingsOpen}
        onClose={() => voiceSettings.setIsVoiceSettingsOpen(false)}
        voiceModel={voiceSettings.voiceModel}
        setVoiceModel={voiceSettings.setVoiceModel}
        voiceSpeed={voiceSettings.voiceSpeed}
        setVoiceSpeed={voiceSettings.setVoiceSpeed}
        voiceTemperature={voiceSettings.voiceTemperature}
        setVoiceTemperature={voiceSettings.setVoiceTemperature}
        voiceVolume={voiceSettings.voiceVolume}
        setVoiceVolume={voiceSettings.setVoiceVolume}
        onSettingsUpdated={() => {
          // Refresh agent data to get updated voice settings
          updateAgentField('voice_settings', {
            voice_model: voiceSettings.voiceModel,
            voice_speed: voiceSettings.voiceSpeed,
            voice_temperature: voiceSettings.voiceTemperature,
            volume: voiceSettings.voiceVolume
          });
        }}
      />
    </>
  );
};
