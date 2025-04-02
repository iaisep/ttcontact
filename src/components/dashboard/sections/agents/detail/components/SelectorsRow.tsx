
import React from 'react';
import LlmSelector from './LlmSelector';
import VoiceSelector from './VoiceSelector';
import LanguageSelector from './LanguageSelector';
import LlmSettingsModal from './LlmSettingsModal';
import VoiceSettingsModal from './VoiceSettingsModal';
import { useLanguage } from '@/context/LanguageContext';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface LlmSettings {
  llmId?: string;
  selectedModel: string;
  llmTemperature: number;
  structuredOutput: boolean;
  highPriority: boolean;
  handleLlmChange: (newLlmId: string) => Promise<void>;
  onLlmSettingsUpdated?: () => void;
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

interface LanguageSettings {
  selectedLanguage: string;
  languageOptions: {value: string; label: string; icon?: string}[];
  handleLanguageChange: (newLanguage: string) => void;
}

interface SelectorsRowProps extends LlmSettings, VoiceSettings, LanguageSettings {
  agent?: RetellAgent;
}

const SelectorsRow: React.FC<SelectorsRowProps> = ({
  // LLM Settings
  llmId = '',
  selectedModel,
  llmTemperature = 0.7,
  structuredOutput = false,
  highPriority = false,
  handleLlmChange,
  onLlmSettingsUpdated,
  
  // Voice Settings
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
  
  // Language Settings
  selectedLanguage,
  languageOptions,
  handleLanguageChange,
  
  // Agent
  agent
}) => {
  const { t } = useLanguage();
  const [isLlmSettingsOpen, setIsLlmSettingsOpen] = React.useState(false);

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gray-500">{t('llm')}</label>
        <LlmSelector 
          selectedModel={selectedModel} 
          onLlmChange={handleLlmChange}
          onSettingsClick={() => setIsLlmSettingsOpen(true)}
          llmId={llmId}
          temperature={llmTemperature}
          structuredOutput={structuredOutput}
          highPriority={highPriority}
          onSettingsUpdated={onLlmSettingsUpdated || (() => {})}
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gray-500">{t('voice')}</label>
        <VoiceSelector 
          selectedVoice={selectedVoice} 
          openVoiceModal={openVoiceModal}
          voiceAvatarUrl={voiceAvatarUrl}
          agent={agent}
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gray-500">{t('language')}</label>
        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          languageOptions={languageOptions}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      {/* LLM Settings Modal */}
      <LlmSettingsModal
        open={isLlmSettingsOpen}
        onClose={() => setIsLlmSettingsOpen(false)}
        llmId={llmId}
        initialTemperature={llmTemperature || 0.7}
        initialStructuredOutput={structuredOutput}
        initialHighPriority={highPriority}
        onSettingsUpdated={onLlmSettingsUpdated || (() => {})}
      />
    </div>
  );
};

export default SelectorsRow;
