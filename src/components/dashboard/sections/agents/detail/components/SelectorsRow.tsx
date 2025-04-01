
import React from 'react';
import LlmSelector from './LlmSelector';
import VoiceSelector from './VoiceSelector';
import LanguageSelector from './LanguageSelector';
import LlmSettingsPopover from './LlmSettingsPopover';
import VoiceSettingsPopover from './VoiceSettingsPopover';

interface SelectorsRowProps {
  selectedLlmModel: string;
  selectedVoice: string;
  selectedLanguage: string;
  languageOptions: Array<{ value: string, label: string, icon: string }>;
  llmOptions: string[];
  handleLanguageChange: (lang: string) => void;
  handleLlmChange: (llm: string) => void;
  openVoiceModal: () => void;
  isLoadingLlmOptions?: boolean;
  
  // LLM Settings props
  isLlmSettingsOpen: boolean;
  setIsLlmSettingsOpen: (isOpen: boolean) => void;
  llmTemperature: number;
  setLlmTemperature: (temp: number) => void;
  structuredOutput: boolean;
  setStructuredOutput: (structured: boolean) => void;
  highPriority: boolean;
  setHighPriority: (priority: boolean) => void;
  handleSaveLlmSettings: () => void;
  
  // Voice Settings props
  isVoiceSettingsOpen: boolean;
  setIsVoiceSettingsOpen: (isOpen: boolean) => void;
  voiceModel: string;
  setVoiceModel: (model: string) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  voiceTemperature: number;
  setVoiceTemperature: (temp: number) => void;
  voiceVolume: number;
  setVoiceVolume: (volume: number) => void;
  voiceModelOptions: Array<{ id: string, label: string, description: string }>;
  handleSaveVoiceSettings: () => void;
}

const SelectorsRow: React.FC<SelectorsRowProps> = ({
  // Props for LLM selector
  selectedLlmModel,
  llmOptions,
  handleLlmChange,
  isLoadingLlmOptions = false,
  
  // Props for voice selector
  selectedVoice,
  openVoiceModal,
  
  // Props for language selector
  selectedLanguage,
  languageOptions,
  handleLanguageChange,
  
  // Props for LLM settings
  isLlmSettingsOpen,
  setIsLlmSettingsOpen,
  llmTemperature,
  setLlmTemperature,
  structuredOutput,
  setStructuredOutput,
  highPriority,
  setHighPriority,
  handleSaveLlmSettings,
  
  // Props for voice settings
  isVoiceSettingsOpen,
  setIsVoiceSettingsOpen,
  voiceModel,
  setVoiceModel,
  voiceSpeed,
  setVoiceSpeed,
  voiceTemperature,
  setVoiceTemperature,
  voiceVolume,
  setVoiceVolume,
  voiceModelOptions,
  handleSaveVoiceSettings,
}) => {
  return (
    <div className="flex items-center space-x-3">
      {/* LLM Model Selector */}
      <LlmSelector
        selectedLlmModel={selectedLlmModel}
        llmOptions={llmOptions}
        handleLlmChange={handleLlmChange}
        isLoadingLlmOptions={isLoadingLlmOptions}
      />
      
      {/* LLM Settings Button */}
      <LlmSettingsPopover
        isLlmSettingsOpen={isLlmSettingsOpen}
        setIsLlmSettingsOpen={setIsLlmSettingsOpen}
        llmTemperature={llmTemperature}
        setLlmTemperature={setLlmTemperature}
        structuredOutput={structuredOutput}
        setStructuredOutput={setStructuredOutput}
        highPriority={highPriority}
        setHighPriority={setHighPriority}
        handleSaveLlmSettings={handleSaveLlmSettings}
      />

      {/* Voice Selector */}
      <VoiceSelector
        selectedVoice={selectedVoice}
        openVoiceModal={openVoiceModal}
      />

      {/* Voice Settings Button */}
      <VoiceSettingsPopover
        isVoiceSettingsOpen={isVoiceSettingsOpen}
        setIsVoiceSettingsOpen={setIsVoiceSettingsOpen}
        voiceModel={voiceModel}
        setVoiceModel={setVoiceModel}
        voiceSpeed={voiceSpeed}
        setVoiceSpeed={setVoiceSpeed}
        voiceTemperature={voiceTemperature}
        setVoiceTemperature={setVoiceTemperature}
        voiceVolume={voiceVolume}
        setVoiceVolume={setVoiceVolume}
        voiceModelOptions={voiceModelOptions}
        handleSaveVoiceSettings={handleSaveVoiceSettings}
      />
      
      {/* Language Selector */}
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        languageOptions={languageOptions}
        handleLanguageChange={handleLanguageChange}
      />
    </div>
  );
};

export default SelectorsRow;
