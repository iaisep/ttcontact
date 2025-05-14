
import { useParams } from 'react-router-dom';
import { useVoiceState } from './useVoiceState';
import { useVoiceActions } from './useVoiceActions';
import { useVoiceModelOptions } from './useVoiceModelOptions';
import { useVoiceSettingsSync } from './useVoiceSettingsSync';
import { UseVoiceSettingsProps, VoiceSettings } from './types';

export function useVoiceSettings({ initialVoice, updateAgentField }: UseVoiceSettingsProps): VoiceSettings {
  const { slug } = useParams<{ slug: string }>();
  
  // Get state from custom hooks
  const voiceState = useVoiceState({ initialVoice, updateAgentField });
  
  const voiceActions = useVoiceActions({
    selectedVoice: voiceState.selectedVoice,
    setSelectedVoice: voiceState.setSelectedVoice,
    setVoiceAvatarUrl: voiceState.setVoiceAvatarUrl,
    setIsVoiceModalOpen: voiceState.setIsVoiceModalOpen,
    voiceModel: voiceState.voiceModel,
    voiceSpeed: voiceState.voiceSpeed,
    voiceTemperature: voiceState.voiceTemperature, 
    voiceVolume: voiceState.voiceVolume,
    setIsVoiceSettingsOpen: voiceState.setIsVoiceSettingsOpen,
    updateAgentField
  });
  
  const voiceModelOptions = useVoiceModelOptions();
  
  // Sync settings with API
  useVoiceSettingsSync({
    slug,
    settingsLoaded: voiceState.settingsLoaded,
    setSettingsLoaded: voiceState.setSettingsLoaded,
    setVoiceModel: voiceState.setVoiceModel,
    setVoiceSpeed: voiceState.setVoiceSpeed,
    setVoiceTemperature: voiceState.setVoiceTemperature,
    setVoiceVolume: voiceState.setVoiceVolume
  });

  // Return consolidated hook API
  return {
    ...voiceState,
    ...voiceActions,
    voiceModelOptions
  };
}

export type { UseVoiceSettingsProps, VoiceSettings, VoiceModelOption } from './types';
