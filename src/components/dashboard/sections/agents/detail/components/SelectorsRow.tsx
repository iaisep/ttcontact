import React from 'react';
import VoiceSelector from './VoiceSelector';
import LanguageSelector from './LanguageSelector';
import LlmSelector from './LlmSelector';
import LlmSettingsPopover from './LlmSettingsPopover';
import VoiceSettingsPopover from './VoiceSettingsPopover';
import { VoiceModelOption } from '../hooks/useVoiceSettings';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface SelectorsRowProps {
  // LLM props
  llmId: string | undefined;
  selectedModel: string;
  isLlmSettingsOpen: boolean;
  setIsLlmSettingsOpen: (open: boolean) => void;
  llmTemperature: number;
  setLlmTemperature: (temp: number) => void;
  structuredOutput: boolean;
  setStructuredOutput: (structured: boolean) => void;
  highPriority: boolean;
  setHighPriority: (priority: boolean) => void;
  handleLlmChange: (llmId: string) => void;
  handleSaveLlmSettings: () => void;
  
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
  voiceModelOptions: VoiceModelOption[]; 
  openVoiceModal: () => void;
  handleSaveVoiceSettings: () => void;
  
  // Language props
  selectedLanguage: string;
  languageOptions: Array<{ value: string; label: string; icon: string }>;
  handleLanguageChange: (language: string) => void;
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
  
  // Language props
  selectedLanguage,
  languageOptions,
  handleLanguageChange,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {/* LLM Selector */}
      <div className="flex items-center space-x-2">
        <div className="flex-grow">
          <LlmSelector
            llmId={llmId}
            selectedModel={selectedModel}
            onLlmChange={handleLlmChange}
            onSettingsClick={() => setIsLlmSettingsOpen(true)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9 rounded-full"
          onClick={() => setIsLlmSettingsOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
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
      
      {/* Voice Selector */}
      <div className="flex items-center space-x-2">
        <div className="flex-grow">
          <VoiceSelector
            selectedVoice={selectedVoice}
            openVoiceModal={openVoiceModal}
            onSettingsClick={() => setIsVoiceSettingsOpen(true)}
          />
        </div>
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
      <div className="flex items-center space-x-2">
        <div className="flex-grow">
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            languageOptions={languageOptions}
            handleLanguageChange={handleLanguageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectorsRow;
