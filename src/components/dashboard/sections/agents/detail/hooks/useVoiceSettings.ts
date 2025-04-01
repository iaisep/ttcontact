
import { useState } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';

// Define VoiceModelOption type
export interface VoiceModelOption {
  value: string;
  label: string;
}

interface UseVoiceSettingsProps {
  initialVoice: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useVoiceSettings = ({ initialVoice, updateAgentField }: UseVoiceSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  
  const [selectedVoice, setSelectedVoice] = useState(initialVoice);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  
  // Voice settings state
  const [voiceModel, setVoiceModel] = useState('eleven-labs-v2');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voiceTemperature, setVoiceTemperature] = useState(0.3);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  
  // Voice model options with proper typing
  const voiceModelOptions: VoiceModelOption[] = [
    { value: 'eleven-labs-v2', label: 'ElevenLabs V2' },
    { value: 'playht', label: 'PlayHT' },
    { value: 'deepgram', label: 'Deepgram' }
  ];
  
  const handleVoiceChange = async (voiceId: string) => {
    try {
      toast.loading('Updating voice...');
      
      // Update the agent
      await fetchWithAuth(`/update-agent/${voiceId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          voice_id: voiceId
        })
      });
      
      setSelectedVoice(voiceId);
      updateAgentField('voice_id', voiceId);
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
      
      updateAgentField('voice_settings', voiceSettings);
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
