import React from 'react';
import { Separator } from '@/components/ui/separator';
import LlmSelector from './LlmSelector';
import VoiceSelector from './VoiceSelector';
import LanguageSelector from './LanguageSelector';
import { VoiceModelOption } from '../hooks/useVoiceSettings';

interface SelectorsRowProps {
  // LLM props
  llmId?: string;
  selectedModel: string;
  llmTemperature: number;
  structuredOutput: boolean;
  highPriority: boolean;
  handleLlmChange?: (llmId: string) => Promise<void>;
  onLlmSettingsUpdated: () => void;

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
  languageOptions: {
    value: string;
    label: string;
    icon: string;
  }[];
  handleLanguageChange: (language: string) => Promise<void>;
}

const SelectorsRow: React.FC<SelectorsRowProps> = ({
  // LLM props
  llmId,
  selectedModel,
  llmTemperature,
  structuredOutput,
  highPriority,
  handleLlmChange,
  onLlmSettingsUpdated,
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
  handleLanguageChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
      {/* LLM Selector */}
      <div>
        <h3 className="text-[10px] font-medium mb-2 text-center">LLM</h3>
        <div className="relative">
          <LlmSelector 
            selectedModel={selectedModel} 
            llmId={llmId} 
            onLlmChange={handleLlmChange}
            onSettingsClick={() => {}} 
            temperature={llmTemperature}
            structuredOutput={structuredOutput}
            highPriority={highPriority}
            onSettingsUpdated={onLlmSettingsUpdated}
          />
        </div>
      </div>
      
      {/* Voice Selector */}
      <div>
        <h3 className="text-[10px] font-medium mb-2 text-center">Voice</h3>
        <div className="relative">
          <VoiceSelector 
            selectedVoice={selectedVoice} 
            openVoiceModal={openVoiceModal} 
            onSettingsClick={() => setIsVoiceSettingsOpen(true)} 
            voiceAvatarUrl={voiceAvatarUrl} 
          />
        </div>
      </div>
      
      {/* Language Selector */}
      <div>
        <h3 className="text-[10px] font-medium mb-2 text-center">Language</h3>
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
