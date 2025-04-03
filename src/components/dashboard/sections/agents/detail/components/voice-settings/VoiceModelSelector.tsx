
import React from 'react';
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
  // Make sure all models have unique IDs for the radio group
  const voiceModels: VoiceModel[] = [
    { id: 'eleven_turbo_v2_auto', label: 'Auto(Elevenlabs Turbo V2)', description: 'English only, fast, high quality' },
    { id: 'eleven_turbo_v2', label: 'Elevenlabs Turbo V2', description: 'English only, fast, high quality' },
    { id: 'eleven_flash_v2', label: 'Elevenlabs Flash V2', description: 'English only, fastest, medium quality' },
    { id: 'eleven_turbo_v2_5', label: 'Elevenlabs Turbo V2.5', description: 'Multilingual, fast, high quality' },
    { id: 'eleven_flash_v2_5', label: 'Elevenlabs Flash V2.5', description: 'Multilingual, fastest, medium quality' },
    { id: 'eleven_multilingual_v2', label: 'Elevenlabs Multilingual v2', description: 'Multilingual, slow, highest quality' },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Voice Model</h3>
      <RadioGroup 
        value={voiceModel} 
        onValueChange={setVoiceModel}
        className="space-y-1"
      >
        {voiceModels.map((model) => {
          // For the first "Auto" option, use eleven_turbo_v2 as value
          const radioValue = model.id === 'eleven_turbo_v2_auto' ? 'eleven_turbo_v2' : model.id;
          
          return (
            <div key={model.id} className="flex items-start space-x-2 rounded-md p-2 hover:bg-muted">
              <RadioGroupItem value={radioValue} id={model.id} />
              <div className="grid gap-1">
                <Label htmlFor={model.id} className="text-sm font-medium">
                  {model.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {model.description}
                </p>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default VoiceModelSelector;
