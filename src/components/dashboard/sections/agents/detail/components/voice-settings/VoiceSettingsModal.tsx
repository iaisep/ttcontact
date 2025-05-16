
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { useParams } from 'react-router-dom';
import { VoiceModelSelector, VoiceSliderControl } from './';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

interface VoiceSettingsModalProps {
  open: boolean;
  onClose: () => void;
  voiceModel: string;
  setVoiceModel: (value: string) => void;
  voiceSpeed: number;
  setVoiceSpeed: (value: number) => void;
  voiceTemperature: number;
  setVoiceTemperature: (value: number) => void;
  voiceVolume: number;
  setVoiceVolume: (value: number) => void;
  onSettingsUpdated?: () => void;
  onVoiceAdded?: (voice: RetellVoice) => void; // Made this prop optional with ?
}

const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  open,
  onClose,
  voiceModel,
  setVoiceModel,
  voiceSpeed,
  setVoiceSpeed,
  voiceTemperature,
  setVoiceTemperature,
  voiceVolume,
  setVoiceVolume,
  onSettingsUpdated,
  onVoiceAdded // Add this prop to the destructured props
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const { slug } = useParams<{ slug: string }>();
  
  const [tempVoiceModel, setTempVoiceModel] = useState(voiceModel);
  const [tempVoiceSpeed, setTempVoiceSpeed] = useState(voiceSpeed);
  const [tempVoiceTemperature, setTempVoiceTemperature] = useState(voiceTemperature);
  const [tempVoiceVolume, setTempVoiceVolume] = useState(voiceVolume);
  const [isSaving, setIsSaving] = useState(false);

  // Reset temporary settings when modal opens or props change
  useEffect(() => {
    if (open) {
      setTempVoiceModel(voiceModel);
      setTempVoiceSpeed(voiceSpeed);
      setTempVoiceTemperature(voiceTemperature);
      setTempVoiceVolume(voiceVolume);
    }
  }, [open, voiceModel, voiceSpeed, voiceTemperature, voiceVolume]);

  const handleSave = async () => {
    if (!slug) {
      toast.error('Agent ID is missing');
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare the payload for the update-agent endpoint
      const payload = {
        voice_speed: tempVoiceSpeed,
        volume: tempVoiceVolume,
        voice_temperature: tempVoiceTemperature,
        voice_model: tempVoiceModel
      };
      
      console.log('Sending update to agent with payload:', payload);
      
      // Call the update-agent endpoint with the payload
      await fetchWithAuth(`/update-agent/${slug}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });

      // Update the parent component's state
      setVoiceModel(tempVoiceModel);
      setVoiceSpeed(tempVoiceSpeed);
      setVoiceTemperature(tempVoiceTemperature);
      setVoiceVolume(tempVoiceVolume);

      // Call callback if provided
      if (onSettingsUpdated) {
        onSettingsUpdated();
      }

      toast.success('Voice settings updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating voice settings:', error);
      toast.error('Failed to update voice settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle custom voice added if the prop is provided
  const handleCustomVoiceAdded = (voice: RetellVoice) => {
    if (onVoiceAdded) {
      onVoiceAdded(voice);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Voice Settings</DialogTitle>
        
        <div className="grid gap-4 py-4">
          <VoiceModelSelector 
            voiceModel={tempVoiceModel}
            setVoiceModel={setTempVoiceModel}
          />

          <VoiceSliderControl
            id="voice-speed"
            label="Voice Speed"
            min={0.5}
            max={2}
            step={0.01}
            value={tempVoiceSpeed}
            onValueChange={setTempVoiceSpeed}
            leftLabel="Slow"
            rightLabel="Fast"
          />

          <VoiceSliderControl
            id="voice-temperature"
            label="Voice Temperature"
            min={0}
            max={2}
            step={0.01}
            value={tempVoiceTemperature}
            onValueChange={setTempVoiceTemperature}
            leftLabel="Calm"
            rightLabel="Emotional"
          />

          <VoiceSliderControl
            id="voice-volume"
            label="Voice Volume"
            min={0}
            max={2}
            step={0.01}
            value={tempVoiceVolume}
            onValueChange={setTempVoiceVolume}
            leftLabel="Low"
            rightLabel="High"
          />
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSettingsModal;
