
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getCompatibleVoiceModels } from './voiceModelUtils';

interface VoiceModel {
  id: string;
  label: string;
  description: string;
}

interface VoiceModelSelectorProps {
  voiceModel: string;
  setVoiceModel: (value: string) => void;
  selectedLanguage?: string;
}

const VoiceModelSelector: React.FC<VoiceModelSelectorProps> = ({
  voiceModel,
  setVoiceModel,
  selectedLanguage = 'en-US'
}) => {
  // Get compatible voice models based on selected language
  const compatibleModels = getCompatibleVoiceModels(selectedLanguage);
  
  // Convert to VoiceModel interface format
  const voiceModels: VoiceModel[] = compatibleModels.map(model => ({
    id: model.id,
    label: model.label,
    description: model.description
  }));

  // If current voiceModel is not compatible with selected language, auto-select first compatible one
  React.useEffect(() => {
    const isCurrentModelCompatible = voiceModels.some(model => model.id === voiceModel);
    if (!isCurrentModelCompatible && voiceModels.length > 0) {
      setVoiceModel(voiceModels[0].id);
    }
  }, [selectedLanguage, voiceModel, setVoiceModel, voiceModels]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Voice Model</h3>
      <RadioGroup 
        value={voiceModel} 
        onValueChange={setVoiceModel}
        className="space-y-1"
      >
        {voiceModels.map((model) => (
          <div key={model.id} className="flex items-start space-x-2 rounded-md p-2 hover:bg-muted">
            <RadioGroupItem value={model.id} id={model.id} />
            <div className="grid gap-1">
              <Label htmlFor={model.id} className="text-sm font-medium">
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
