
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { useParams } from 'react-router-dom';

// Define VoiceModelOption type
export interface VoiceModelOption {
  value: string;
  label: string;
  id: string;
  description: string;
}

interface UseVoiceSettingsProps {
  initialVoice: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useVoiceSettings = ({ initialVoice, updateAgentField }: UseVoiceSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  const { slug } = useParams<{ slug: string }>();
  
  const [selectedVoice, setSelectedVoice] = useState(initialVoice);
  const [voiceAvatarUrl, setVoiceAvatarUrl] = useState<string | undefined>(undefined);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  
  // Voice settings state with default values
  const [voiceModel, setVoiceModel] = useState('eleven_turbo_v2');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voiceTemperature, setVoiceTemperature] = useState(1.0);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  
  // Voice model options with proper typing
  const voiceModelOptions: VoiceModelOption[] = [
    { value: 'eleven_turbo_v2', label: 'Auto(Elevenlabs Turbo V2)', id: 'eleven_turbo_v2', description: 'English only, fast, high quality' },
    { value: 'eleven_turbo_v2', label: 'Elevenlabs Turbo V2', id: 'eleven_turbo_v2-normal', description: 'English only, fast, high quality' },
    { value: 'eleven_flash_v2', label: 'Elevenlabs Flash V2', id: 'eleven_flash_v2', description: 'English only, fastest, medium quality' },
    { value: 'eleven_turbo_v2_5', label: 'Elevenlabs Turbo V2.5', id: 'eleven_turbo_v2_5', description: 'Multilingual, fast, high quality' },
    { value: 'eleven_flash_v2_5', label: 'Elevenlabs Flash V2.5', id: 'eleven_flash_v2_5', description: 'Multilingual, fastest, medium quality' },
    { value: 'eleven_multilingual_v2', label: 'Elevenlabs Multilingual v2', id: 'eleven_multilingual_v2', description: 'Multilingual, slow, highest quality' },
  ];
  
  // Update to handle RetellVoice object without triggering unnecessary fetches
  const handleVoiceChange = async (voice: RetellVoice) => {
    if (!slug) {
      toast.error('Agent ID is missing');
      return;
    }
    
    try {
      const voiceId = voice.voice_id || voice.id;
      
      if (!voiceId) {
        toast.error('Voice ID is missing');
        return;
      }
      
      toast.info('Updating voice...');
      
      // Update the agent with the correct agent ID from the URL
      await fetchWithAuth(`/update-agent/${slug}`, {
        method: 'PATCH',
        body: JSON.stringify({
          voice_id: voiceId
        })
      });
      
      // Set the voice avatar URL
      if (voice.avatar_url) {
        setVoiceAvatarUrl(voice.avatar_url);
      }
      
      // Update local state with voice name
      // Use name rather than voice_name since it's in the interface
      const voiceName = voice.name || voiceId;
      setSelectedVoice(voiceName);
      
      // Update the agent field in the parent component without triggering a full page refresh
      updateAgentField('voice_id', voiceId);
      updateAgentField('voice', { name: voiceName, avatar_url: voice.avatar_url });
      
      setIsVoiceModalOpen(false);
      
      toast.success('Voice updated successfully');
    } catch (error) {
      console.error('Error updating voice:', error);
      toast.error('Failed to update voice');
    }
  };
  
  const handleSaveVoiceSettings = async () => {
    if (!slug) {
      toast.error('Agent ID is missing');
      return;
    }
    
    try {
      toast.info('Saving voice settings...');
      
      // Prepare the payload for the update-agent endpoint
      const payload = {
        voice_speed: voiceSpeed,
        volume: voiceVolume,
        voice_temperature: voiceTemperature,
        voice_model: voiceModel
      };
      
      console.log('Sending voice settings update with payload:', payload);
      
      // Call the update-agent endpoint with the payload
      await fetchWithAuth(`/update-agent/${slug}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      
      // Update agent field in the parent component
      updateAgentField('voice_settings', {
        voice_model: voiceModel,
        voice_speed: voiceSpeed,
        voice_temperature: voiceTemperature,
        volume: voiceVolume
      });
      
      setIsVoiceSettingsOpen(false);
      
      toast.success('Voice settings saved');
    } catch (error) {
      console.error('Error saving voice settings:', error);
      toast.error('Failed to save voice settings');
    }
  };
  
  const openVoiceModal = () => {
    setIsVoiceModalOpen(true);
  };
  
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
  }, [slug, fetchWithAuth, settingsLoaded]);
  
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
    voiceModelOptions,
    handleVoiceChange,
    handleSaveVoiceSettings,
    openVoiceModal,
    settingsLoaded
  };
};
