
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApiContext } from '@/context/ApiContext';

interface UseVoiceSettingsSyncProps {
  slug: string | undefined;
  settingsLoaded: boolean;
  setSettingsLoaded: (loaded: boolean) => void;
  setVoiceModel: (model: string) => void;
  setVoiceSpeed: (speed: number) => void;
  setVoiceTemperature: (temp: number) => void;
  setVoiceVolume: (volume: number) => void;
}

export function useVoiceSettingsSync({
  slug,
  settingsLoaded,
  setSettingsLoaded,
  setVoiceModel,
  setVoiceSpeed,
  setVoiceTemperature,
  setVoiceVolume
}: UseVoiceSettingsSyncProps) {
  const { fetchWithAuth } = useApiContext();

  // Load voice settings if available when the agent data changes
  useEffect(() => {
    const fetchAgentVoiceSettings = async () => {
      if (!slug || settingsLoaded) return;
      
      try {
        const agentData = await fetchWithAuth(`/get-agent/${slug}`);
        console.log('Fetched agent data for voice settings:', agentData);
        
        if (agentData && agentData.voice_settings) {
          const settings = agentData.voice_settings;
          
          if (settings.voice_model) {
            setVoiceModel(settings.voice_model);
          }
          
          if (settings.voice_speed !== undefined) {
            setVoiceSpeed(settings.voice_speed);
          }
          
          if (settings.voice_temperature !== undefined) {
            setVoiceTemperature(settings.voice_temperature);
          }
          
          if (settings.volume !== undefined) {
            setVoiceVolume(settings.volume);
          }
          
          setSettingsLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching agent voice settings:', error);
      }
    };
    
    fetchAgentVoiceSettings();
  }, [slug, fetchWithAuth, settingsLoaded, setSettingsLoaded, setVoiceModel, setVoiceSpeed, setVoiceTemperature, setVoiceVolume]);
}
