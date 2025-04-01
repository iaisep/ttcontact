
import React from 'react';
import { Button } from '@/components/ui/button';
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
      <PopoverContent className="w-80 p-5">
        <div className="grid gap-5">
          <div>
            <h3 className="text-[10px] font-medium mb-3">Voice Model</h3>
            <RadioGroup 
              value={voiceModel} 
              onValueChange={setVoiceModel}
              className="grid gap-3"
            >
              {voiceModelOptions.map((option) => (
                <div key={option.id} className="flex items-start gap-3">
                  <RadioGroupItem value={option.value} id={option.id} className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor={option.id} className="font-medium">{option.label}</Label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Voice Speed</Label>
                <span className="text-xs bg-muted px-2 py-1 rounded-md">{voiceSpeed.toFixed(2)}</span>
              </div>
              <Slider
                value={[voiceSpeed]}
                min={0.25}
                max={2.0}
                step={0.01}
                onValueChange={([value]) => setVoiceSpeed(value)}
                className="my-1"
              />
            </div>

            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Voice Temperature</Label>
                <span className="text-xs bg-muted px-2 py-1 rounded-md">{voiceTemperature.toFixed(2)}</span>
              </div>
              <Slider
                value={[voiceTemperature]}
                min={0}
                max={1.0}
                step={0.01}
                onValueChange={([value]) => setVoiceTemperature(value)}
                className="my-1"
              />
            </div>

            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Voice Volume</Label>
                <span className="text-xs bg-muted px-2 py-1 rounded-md">{voiceVolume.toFixed(2)}</span>
              </div>
              <Slider
                value={[voiceVolume]}
                min={0}
                max={1.0}
                step={0.01}
                onValueChange={([value]) => setVoiceVolume(value)}
                className="my-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
