
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

interface UseVoiceActionsProps {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  setVoiceAvatarUrl: (url: string | undefined) => void;
  setIsVoiceModalOpen: (isOpen: boolean) => void;
  voiceModel: string;
  voiceSpeed: number;
  voiceTemperature: number;
  voiceVolume: number;
  setIsVoiceSettingsOpen: (isOpen: boolean) => void;
  updateAgentField: (fieldName: string, value: any) => void;
}

export function useVoiceActions({
  selectedVoice,
  setSelectedVoice,
  setVoiceAvatarUrl,
  setIsVoiceModalOpen,
  voiceModel,
  voiceSpeed,
  voiceTemperature,
  voiceVolume,
  setIsVoiceSettingsOpen,
  updateAgentField
}: UseVoiceActionsProps) {
  const { fetchWithAuth } = useApiContext();
  const { slug } = useParams<{ slug: string }>();

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

  return {
    handleVoiceChange,
    handleSaveVoiceSettings,
    openVoiceModal
  };
}
