
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { useParams } from 'react-router-dom';

interface VoiceModel {
  id: string;
  label: string;
  description: string;
}

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
  onSettingsUpdated
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const { slug } = useParams<{ slug: string }>();
  
  const [tempVoiceModel, setTempVoiceModel] = useState(voiceModel || 'eleven_turbo_v2');
  const [tempVoiceSpeed, setTempVoiceSpeed] = useState(voiceSpeed || 1.0);
  const [tempVoiceTemperature, setTempVoiceTemperature] = useState(voiceTemperature || 0.3);
  const [tempVoiceVolume, setTempVoiceVolume] = useState(voiceVolume || 1.0);
  const [isSaving, setIsSaving] = useState(false);
  const [hoveredSlider, setHoveredSlider] = useState<string | null>(null);

  // Reset temporary settings when modal opens
  useEffect(() => {
    if (open) {
      setTempVoiceModel(voiceModel || 'eleven_turbo_v2');
      setTempVoiceSpeed(voiceSpeed || 1.0);
      setTempVoiceTemperature(voiceTemperature || 0.3);
      setTempVoiceVolume(voiceVolume || 1.0);
    }
  }, [open, voiceModel, voiceSpeed, voiceTemperature, voiceVolume]);

  const voiceModels: VoiceModel[] = [
    { id: 'eleven_turbo_v2', label: 'Auto(Elevenlabs Turbo V2)', description: 'English only, fast, high quality' },
    { id: 'eleven_turbo_v2', label: 'Elevenlabs Turbo V2', description: 'English only, fast, high quality' },
    { id: 'eleven_flash_v2', label: 'Elevenlabs Flash V2', description: 'English only, fastest, medium quality' },
    { id: 'eleven_turbo_v2_5', label: 'Elevenlabs Turbo V2.5', description: 'Multilingual, fast, high quality' },
    { id: 'eleven_flash_v2_5', label: 'Elevenlabs Flash V2.5', description: 'Multilingual, fastest, medium quality' },
    { id: 'eleven_multilingual_v2', label: 'Elevenlabs Multilingual v2', description: 'Multilingual, slow, highest quality' },
  ];

  const handleSave = async () => {
    if (!slug) {
      toast.error('Agent ID is missing');
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare payload according to the required format
      const payload = {
        voice_speed: tempVoiceSpeed,
        volume: tempVoiceVolume,
        voice_temperature: tempVoiceTemperature,
        voice_model: tempVoiceModel
      };

      console.log('Updating agent voice settings with payload:', payload);
      
      // Make the API call to update the agent
      const response = await fetchWithAuth(`/update-agent/${slug}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });

      console.log('Update agent response:', response);

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

  const formatSliderValue = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Voice Settings</DialogTitle>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Voice Model</h3>
            <RadioGroup 
              value={tempVoiceModel} 
              onValueChange={setTempVoiceModel}
              className="space-y-1"
            >
              {voiceModels.map((model) => (
                <div key={model.id + model.label} className="flex items-start space-x-2 rounded-md p-2 hover:bg-muted">
                  <RadioGroupItem value={model.id} id={model.id + model.label} />
                  <div className="grid gap-1">
                    <Label htmlFor={model.id + model.label} className="text-sm font-medium">
                      {model.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {model.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="voice-speed" className="text-sm">Voice Speed</Label>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Slow</span>
                {hoveredSlider === 'speed' ? (
                  <span className="font-medium">{formatSliderValue(tempVoiceSpeed)}</span>
                ) : (
                  <span className="font-medium">{tempVoiceSpeed.toFixed(2)}</span>
                )}
                <span className="text-muted-foreground text-xs">Fast</span>
              </div>
            </div>
            <Slider
              id="voice-speed"
              min={0.5}
              max={2}
              step={0.01}
              value={[tempVoiceSpeed]}
              onValueChange={(values) => setTempVoiceSpeed(values[0])}
              onMouseEnter={() => setHoveredSlider('speed')}
              onMouseLeave={() => setHoveredSlider(null)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="voice-temperature" className="text-sm">Voice Temperature</Label>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Calm</span>
                {hoveredSlider === 'temperature' ? (
                  <span className="font-medium">{formatSliderValue(tempVoiceTemperature)}</span>
                ) : (
                  <span className="font-medium">{tempVoiceTemperature.toFixed(2)}</span>
                )}
                <span className="text-muted-foreground text-xs">Emotional</span>
              </div>
            </div>
            <Slider
              id="voice-temperature"
              min={0}
              max={2}
              step={0.01}
              value={[tempVoiceTemperature]}
              onValueChange={(values) => setTempVoiceTemperature(values[0])}
              onMouseEnter={() => setHoveredSlider('temperature')}
              onMouseLeave={() => setHoveredSlider(null)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="voice-volume" className="text-sm">Voice Volume</Label>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Low</span>
                {hoveredSlider === 'volume' ? (
                  <span className="font-medium">{formatSliderValue(tempVoiceVolume)}</span>
                ) : (
                  <span className="font-medium">{tempVoiceVolume.toFixed(2)}</span>
                )}
                <span className="text-muted-foreground text-xs">High</span>
              </div>
            </div>
            <Slider
              id="voice-volume"
              min={0}
              max={2}
              step={0.01}
              value={[tempVoiceVolume]}
              onValueChange={(values) => setTempVoiceVolume(values[0])}
              onMouseEnter={() => setHoveredSlider('volume')}
              onMouseLeave={() => setHoveredSlider(null)}
            />
          </div>
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
            className="bg-black text-white hover:bg-gray-800"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSettingsModal;
