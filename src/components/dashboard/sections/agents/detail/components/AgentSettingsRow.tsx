
import React from 'react';
import SelectorsRow from './SelectorsRow';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

interface LlmSettings {
  selectedModel: string;
  llmTemperature: number;
  structuredOutput: boolean;
  highPriority: boolean;
  handleLlmChange: (newLlmId: string) => Promise<void>;
  isLlmSettingsOpen: boolean;
  setIsLlmSettingsOpen: (open: boolean) => void;
}

interface VoiceSettings {
  selectedVoice: string;
  isVoiceSettingsOpen: boolean;
  setIsVoiceSettingsOpen: (open: boolean) => void;
  voiceModel: string;
  setVoiceModel: (model: string) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  voiceTemperature: number;
  setVoiceTemperature: (temp: number) => void;
  voiceVolume: number;
  setVoiceVolume: (volume: number) => void;
  voiceModelOptions: any[];
  openVoiceModal: () => void;
  handleSaveVoiceSettings: () => void;
  voiceAvatarUrl?: string;
}

interface LanguageSelector {
  selectedLanguage: string;
  languageOptions: {value: string; label: string; icon?: string}[];
  handleLanguageChange: (newLanguage: string) => void;
}

interface AgentSettingsRowProps {
  agent: RetellAgent;
  llmId?: string;
  llmSettings: LlmSettings;
  voiceSettings: VoiceSettings;
  languageSelector: LanguageSelector;
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
  return (
    <SelectorsRow
      agent={agent}
      // LLM Settings
      llmId={llmId}
      selectedModel={llmSettings.selectedModel}
      llmTemperature={llmSettings.llmTemperature}
      structuredOutput={llmSettings.structuredOutput}
      highPriority={llmSettings.highPriority}
      handleLlmChange={llmSettings.handleLlmChange}
      isLlmSettingsOpen={llmSettings.isLlmSettingsOpen}
      setIsLlmSettingsOpen={llmSettings.setIsLlmSettingsOpen}
      
      // Voice Settings
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
      voiceAvatarUrl={voice?.avatar_url}
      
      // Language Settings
      selectedLanguage={languageSelector.selectedLanguage}
      languageOptions={languageSelector.languageOptions}
      handleLanguageChange={languageSelector.handleLanguageChange}
    />
  );
};
