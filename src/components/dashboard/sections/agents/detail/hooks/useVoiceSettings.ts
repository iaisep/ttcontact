
import { useState } from 'react';

export interface VoiceModelOption {
  id: string;
  label: string;
  description: string;
}

interface UseVoiceSettingsProps {
  initialVoice?: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useVoiceSettings = ({ initialVoice = 'Adrian', updateAgentField }: UseVoiceSettingsProps) => {
  const [selectedVoice, setSelectedVoice] = useState(initialVoice);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  
  // Voice settings state
  const [voiceModel, setVoiceModel] = useState('elevenlabs_turbo_v2.5');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voiceTemperature, setVoiceTemperature] = useState(1.0);
  const [voiceVolume, setVoiceVolume] = useState(1.0);

  const voiceModelOptions: VoiceModelOption[] = [
    { id: 'auto_elevenlabs_multilingual_v2', label: 'Auto(Elevenlabs Multilingual v2)', description: 'Multilingual, fast, high quality' },
    { id: 'elevenlabs_turbo_v2.5', label: 'Elevenlabs Turbo V2.5', description: 'Multilingual, fast, high quality' },
    { id: 'elevenlabs_flash_v2.5', label: 'Elevenlabs Flash V2.5', description: 'Multilingual, fastest, medium quality' },
    { id: 'elevenlabs_multilingual_v2', label: 'Elevenlabs Multilingual v2', description: 'Multilingual, slow, highest quality' },
  ];

  const openVoiceModal = () => {
    setIsVoiceModalOpen(true);
  };

  const handleVoiceChange = (voice: any) => {
    setSelectedVoice(voice.name);
    updateAgentField('voice', voice.name);
    updateAgentField('voice_id', voice.voice_id);
  };

  const handleSaveVoiceSettings = () => {
    updateAgentField('voice_model', voiceModel);
    updateAgentField('voice_speed', voiceSpeed);
    updateAgentField('voice_temperature', voiceTemperature);
    updateAgentField('voice_volume', voiceVolume);
    setIsVoiceSettingsOpen(false);
  };

  return {
    selectedVoice,
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
    voiceModelOptions,
    openVoiceModal,
    handleVoiceChange,
    handleSaveVoiceSettings
  };
};
