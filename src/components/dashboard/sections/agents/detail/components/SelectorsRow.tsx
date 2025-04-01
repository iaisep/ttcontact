
import React from 'react';
import VoiceSelector from './VoiceSelector';
import LlmSelector from './LlmSelector';
import LanguageSelector from './LanguageSelector';
import LlmSettingsPopover from './LlmSettingsPopover';
import VoiceSettingsPopover from './VoiceSettingsPopover';
import { LlmOption } from '../hooks/useLlmSettings';

interface SelectorsRowProps {
  // LLM props
  selectedLlmOption: LlmOption;
  isLlmSettingsOpen: boolean;
  setIsLlmSettingsOpen: (open: boolean) => void;
  llmTemperature: number;
  setLlmTemperature: (temp: number) => void;
  structuredOutput: boolean;
  setStructuredOutput: (structured: boolean) => void;
  highPriority: boolean;
  setHighPriority: (priority: boolean) => void;
  llmOptions: LlmOption[];
  handleModelChange: (option: LlmOption) => void;
  handleSaveLlmSettings: () => void;
  isLoadingLlmOptions?: boolean;
  
  // Voice props
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
  voiceModelOptions: string[];
  openVoiceModal: () => void;
  handleSaveVoiceSettings: () => void;
  
  // Language props
  selectedLanguage: string;
  languageOptions: Array<{ value: string; label: string; icon: string }>;
  handleLanguageChange: (language: string) => void;
}

const SelectorsRow: React.FC<SelectorsRowProps> = ({
  // LLM props
  selectedLlmOption,
  isLlmSettingsOpen,
  setIsLlmSettingsOpen,
  llmTemperature,
  setLlmTemperature,
  structuredOutput,
  setStructuredOutput,
  highPriority,
  setHighPriority,
  llmOptions,
  handleModelChange,
  handleSaveLlmSettings,
  isLoadingLlmOptions,
  
  // Voice props
  selectedVoice,
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
  openVoiceModal,
  handleSaveVoiceSettings,
  
  // Language props
  selectedLanguage,
  languageOptions,
  handleLanguageChange,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* LLM Model Selector with Settings */}
      <div className="relative">
        <LlmSelector
          selectedLlmOption={selectedLlmOption}
          llmOptions={llmOptions}
          handleModelChange={handleModelChange}
          isLoadingLlmOptions={isLoadingLlmOptions}
        />
        <LlmSettingsPopover
          isOpen={isLlmSettingsOpen}
          setIsOpen={setIsLlmSettingsOpen}
          temperature={llmTemperature}
          setTemperature={setLlmTemperature}
          structuredOutput={structuredOutput}
          setStructuredOutput={setStructuredOutput}
          highPriority={highPriority}
          setHighPriority={setHighPriority}
          onSave={handleSaveLlmSettings}
        />
      </div>
      
      {/* Voice Selector with Settings */}
      <div className="relative">
        <VoiceSelector
          selectedVoice={selectedVoice}
          openVoiceModal={openVoiceModal}
        />
        <VoiceSettingsPopover
          isOpen={isVoiceSettingsOpen}
          setIsOpen={setIsVoiceSettingsOpen}
          voiceModel={voiceModel}
          setVoiceModel={setVoiceModel}
          voiceSpeed={voiceSpeed}
          setVoiceSpeed={setVoiceSpeed}
          voiceTemperature={voiceTemperature}
          setVoiceTemperature={setVoiceTemperature}
          voiceVolume={voiceVolume}
          setVoiceVolume={setVoiceVolume}
          voiceModelOptions={voiceModelOptions}
          onSave={handleSaveVoiceSettings}
        />
      </div>
      
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
