
import { useState } from 'react';
import { UseVoiceSettingsProps } from './types';

export function useVoiceState({ initialVoice }: UseVoiceSettingsProps) {
  // Basic voice UI state
  const [selectedVoice, setSelectedVoice] = useState(initialVoice);
  const [voiceAvatarUrl, setVoiceAvatarUrl] = useState<string | undefined>(undefined);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  
  // Voice settings state with default values
  // Default to "auto" instead of "eleven_turbo_v2"
  const [voiceModel, setVoiceModel] = useState('auto');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voiceTemperature, setVoiceTemperature] = useState(1.0);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  
  return {
    selectedVoice,
    setSelectedVoice,
    voiceAvatarUrl,
    setVoiceAvatarUrl,
    isVoiceModalOpen,
    setIsVoiceModalOpen,
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
    settingsLoaded,
    setSettingsLoaded
  };
}
