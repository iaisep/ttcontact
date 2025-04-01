
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { VoiceModelOption } from '../hooks/useVoiceSettings';

interface VoiceSettingsPopoverProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  voiceModel: string;
  setVoiceModel: (model: string) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  voiceTemperature: number;
  setVoiceTemperature: (temp: number) => void;
  voiceVolume: number;
  setVoiceVolume: (volume: number) => void;
  voiceModelOptions: VoiceModelOption[];
  onSave: () => void;
}

const VoiceSettingsPopover: React.FC<VoiceSettingsPopoverProps> = ({
  isOpen,
  setIsOpen,
  voiceModel,
  setVoiceModel,
  voiceSpeed,
  setVoiceSpeed,
  voiceTemperature,
  setVoiceTemperature,
  voiceVolume,
  setVoiceVolume,
  voiceModelOptions,
  onSave,
}) => {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full bg-gray-50">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h3 className="font-medium">Voice Model</h3>
          <RadioGroup 
            value={voiceModel} 
            onValueChange={setVoiceModel}
            className="space-y-2"
          >
            {voiceModelOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <RadioGroupItem value={option.value} id={option.id} className="mt-1" />
                <div className="grid gap-1">
                  <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Voice Speed</Label>
              <span className="text-sm">{voiceSpeed.toFixed(2)}</span>
            </div>
            <Slider
              value={[voiceSpeed]}
              min={0.25}
              max={2.0}
              step={0.01}
              onValueChange={([value]) => setVoiceSpeed(value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Voice Temperature</Label>
              <span className="text-sm">{voiceTemperature.toFixed(2)}</span>
            </div>
            <Slider
              value={[voiceTemperature]}
              min={0}
              max={1.0}
              step={0.01}
              onValueChange={([value]) => setVoiceTemperature(value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Voice Volume</Label>
              <span className="text-sm">{voiceVolume.toFixed(2)}</span>
            </div>
            <Slider
              value={[voiceVolume]}
              min={0}
              max={1.0}
              step={0.01}
              onValueChange={([value]) => setVoiceVolume(value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={onSave}
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VoiceSettingsPopover;
