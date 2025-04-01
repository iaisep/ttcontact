import React from 'react';
import { Settings } from 'lucide-react';
import VoiceSelector from './VoiceSelector';
import LanguageSelector from './LanguageSelector';
import LlmSelector from './LlmSelector';
import LlmSettingsPopover from './LlmSettingsPopover';
import VoiceSettingsPopover from './VoiceSettingsPopover';
import { VoiceModelOption } from '../hooks/useVoiceSettings';
import { Button } from '@/components/ui/button';

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
      <div className="relative flex items-center space-x-2">
        <LlmSelector
          llmId={llmId}
          selectedModel={selectedModel}
          onLlmChange={handleLlmChange}
          onSettingsClick={() => setIsLlmSettingsOpen(true)}
        />
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-gray-50 border-gray-200 hover:bg-gray-100 h-8 w-8"
          onClick={() => setIsLlmSettingsOpen(true)}
        >
          <Settings className="h-4 w-4 text-gray-500" />
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
      <div className="relative flex items-center space-x-2">
        <VoiceSelector
          selectedVoice={selectedVoice}
          openVoiceModal={openVoiceModal}
        />
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-gray-50 border-gray-200 hover:bg-gray-100 h-8 w-8"
          onClick={() => setIsVoiceSettingsOpen(true)}
        >
          <Settings className="h-4 w-4 text-gray-500" />
        </Button>
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
      <div className="relative flex items-center space-x-2">
        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          languageOptions={languageOptions}
          handleLanguageChange={handleLanguageChange}
        />
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-gray-50 border-gray-200 hover:bg-gray-100 h-8 w-8"
        >
          <Settings className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

export default SelectorsRow;
