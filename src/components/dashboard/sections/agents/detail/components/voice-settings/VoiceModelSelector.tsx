
import React, { useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface VoiceModel {
  id: string;
  label: string;
  description: string;
}

interface VoiceModelSelectorProps {
  voiceModel: string;
  setVoiceModel: (value: string) => void;
}

const VoiceModelSelector: React.FC<VoiceModelSelectorProps> = ({
  voiceModel,
  setVoiceModel,
}) => {
  const voiceModels: VoiceModel[] = [
    { id: 'eleven_turbo_v2', label: 'Auto(Elevenlabs Turbo V2)', description: 'English only, fast, high quality' },
    { id: 'eleven_turbo_v2', label: 'Elevenlabs Turbo V2', description: 'English only, fast, high quality' },
    { id: 'eleven_flash_v2', label: 'Elevenlabs Flash V2', description: 'English only, fastest, medium quality' },
    { id: 'eleven_turbo_v2_5', label: 'Elevenlabs Turbo V2.5', description: 'Multilingual, fast, high quality' },
    { id: 'eleven_flash_v2_5', label: 'Elevenlabs Flash V2.5', description: 'Multilingual, fastest, medium quality' },
    { id: 'eleven_multilingual_v2', label: 'Elevenlabs Multilingual v2', description: 'Multilingual, slow, highest quality' },
  ];

  // Find the model with the closest ID match
  const getDisplayModel = () => {
    // Exact match first
    const exactMatch = voiceModels.find(model => model.id === voiceModel);
    if (exactMatch) return exactMatch.id;
    
    // Fallback to eleven_turbo_v2 if no match
    return 'eleven_turbo_v2';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Voice Model</h3>
      <RadioGroup 
        value={getDisplayModel()} 
        onValueChange={setVoiceModel}
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
  );
};

export default VoiceModelSelector;
