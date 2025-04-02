
import React from 'react';
import { Separator } from '@/components/ui/separator';
import LlmSelector from './LlmSelector';
import VoiceSelector from './VoiceSelector';
import LanguageSelector from './LanguageSelector';
import LlmSettingsPopover from './LlmSettingsPopover';
import VoiceSettingsPopover from '../components/VoiceSettingsPopover';
import { VoiceModelOption } from '../hooks/useVoiceSettings';

interface SelectorsRowProps {
  // LLM props
  llmId?: string;
  selectedModel: string;
  isLlmSettingsOpen: boolean;
  setIsLlmSettingsOpen: (isOpen: boolean) => void;
  llmTemperature: number;
  setLlmTemperature: (temp: number) => void;
  structuredOutput: boolean;
  setStructuredOutput: (val: boolean) => void;
  highPriority: boolean;
  setHighPriority: (val: boolean) => void;
  handleLlmChange?: (llmId: string) => Promise<void>;
  handleSaveLlmSettings: () => Promise<void>;
  
  // Voice props
  selectedVoice: string;
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
  voiceModelOptions: VoiceModelOption[];
  openVoiceModal: () => void;
  handleSaveVoiceSettings: () => Promise<void>;
  voiceAvatarUrl?: string;
  
  // Language props
  selectedLanguage: string;
  languageOptions: { value: string; label: string; icon: string }[];
  handleLanguageChange: (language: string) => Promise<void>;
}

const SelectorsRow: React.FC<SelectorsRowProps> = ({
  // LLM props
  llmId,
  selectedModel,
  isLlmSettingsOpen,
  setIsLlmSettingsOpen,
  llmTemperature,
  setLlmTemperature,
  structuredOutput,
  setStructuredOutput,
  highPriority,
  setHighPriority,
  handleLlmChange,
  handleSaveLlmSettings,
  
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
  voiceAvatarUrl,
  
  // Language props
  selectedLanguage,
  languageOptions,
  handleLanguageChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {/* LLM Selector */}
      <div>
        <h3 className="text-[10px] font-medium mb-2">LLM</h3>
        <div className="relative">
          <LlmSelector 
            selectedModel={selectedModel}
            llmId={llmId}
            onLlmChange={handleLlmChange}
            onSettingsClick={() => setIsLlmSettingsOpen(true)}
          />
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
        </div>
      </div>
      
      {/* Voice Selector */}
      <div>
        <h3 className="text-[10px] font-medium mb-2">Voice</h3>
        <div className="relative">
          <VoiceSelector 
            selectedVoice={selectedVoice} 
            openVoiceModal={openVoiceModal}
            onSettingsClick={() => setIsVoiceSettingsOpen(true)}
            voiceAvatarUrl={voiceAvatarUrl}
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
      </div>
      
      {/* Language Selector */}
      <div>
        <h3 className="text-[10px] font-medium mb-2">Language</h3>
        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          languageOptions={languageOptions}
          handleLanguageChange={handleLanguageChange}
        />
      </div>
    </div>
  );
};

export default SelectorsRow;
