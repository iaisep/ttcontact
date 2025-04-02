
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
  
  // Voice settings state
  const [voiceModel, setVoiceModel] = useState('eleven-labs-v2');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voiceTemperature, setVoiceTemperature] = useState(0.3);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  
  // Voice model options with proper typing
  const voiceModelOptions: VoiceModelOption[] = [
    { value: 'eleven-labs-v2', label: 'ElevenLabs V2', id: 'eleven-labs-v2', description: 'High quality voice synthesis' },
    { value: 'playht', label: 'PlayHT', id: 'playht', description: 'Fast voice synthesis' },
    { value: 'deepgram', label: 'Deepgram', id: 'deepgram', description: 'Accurate voice synthesis' }
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
      
      toast.loading('Updating voice...');
      
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
      const voiceName = voice.voice_name || voice.name || voiceId;
      setSelectedVoice(voiceName);
      
      // Update the agent field in the parent component without triggering a full page refresh
      updateAgentField('voice_id', voiceId);
      updateAgentField('voice', voiceName);
      
      setIsVoiceModalOpen(false);
      
      toast.success('Voice updated successfully');
    } catch (error) {
      console.error('Error updating voice:', error);
      toast.error('Failed to update voice');
    }
  };
  
  const handleSaveVoiceSettings = async () => {
    try {
      toast.loading('Saving voice settings...');
      
      // Update voice settings in the agent
      const voiceSettings = {
        model: voiceModel,
        speed: voiceSpeed,
        temperature: voiceTemperature,
        volume: voiceVolume
      };
      
      await updateAgentField('voice_settings', voiceSettings);
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
    openVoiceModal
  };
};
