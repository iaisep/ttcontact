
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

// Define VoiceModelOption type
export interface VoiceModelOption {
  value: string;
  label: string;
  id: string;
  description: string;
}

export interface UseVoiceSettingsProps {
  initialVoice: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export interface VoiceSettings {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  voiceAvatarUrl: string | undefined;
  setVoiceAvatarUrl: (url: string | undefined) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (isOpen: boolean) => void;
  isVoiceSettingsOpen: boolean;
  setIsVoiceSettingsOpen: (isOpen: boolean) => void;
  voiceModel: string;
  setVoiceModel: (model: string) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  voiceTemperature: number;
  setVoiceTemperature: (temperature: number) => void;
  voiceVolume: number;
  setVoiceVolume: (volume: number) => void;
  voiceModelOptions: VoiceModelOption[];
  handleVoiceChange: (voice: RetellVoice) => Promise<void>;
  handleSaveVoiceSettings: () => Promise<void>;
  openVoiceModal: () => void;
  settingsLoaded: boolean;
}
