
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

interface BackchannelSectionProps {
  agentId?: string;
  enabled: boolean;
  frequency: number;
  words: string[];
  onUpdateEnabled: (value: boolean) => void;
  onUpdateFrequency: (value: number) => void;
  onUpdateWords: (value: string[]) => void;
}

export const BackchannelSection: React.FC<BackchannelSectionProps> = ({
  agentId,
  enabled = false,
  frequency = 0.8,
  words = ["Vale", "entiendo", "aja", "comprendo", "mmmm"],
  onUpdateEnabled,
  onUpdateFrequency,
  onUpdateWords
}) => {
  const [localFrequency, setLocalFrequency] = useState(frequency);

  useEffect(() => {
    setLocalFrequency(frequency);
  }, [frequency]);

  const handleFrequencyChange = (values: number[]) => {
    const newValue = values[0];
    setLocalFrequency(newValue);
    // La actualización al servidor ocurrirá cuando el usuario suelte el control deslizante
  };

  return (
    <div className="space-y-6">
      {/* Enable Backchanneling */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium text-amber-600">Enable Backchanneling</Label>
            <p className="text-xs text-gray-500">Enables the agent to use affirmatives like 'yeah' or 'uh-huh' during conversations, indicating active listening and engagement.</p>
          </div>
          <Switch 
            checked={enabled}
            onCheckedChange={onUpdateEnabled}
          />
        </div>
      </div>

      {/* Only show these settings when backchanneling is enabled */}
      {enabled && (
        <>
          {/* Backchannel Frequency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-amber-600">Backchannel Frequency</Label>
              <span className="text-xs text-gray-500">{localFrequency.toFixed(2)}</span>
            </div>
            <Slider 
              value={[localFrequency]}
              max={1} 
              step={0.01} 
              className="w-full"
              agentId={agentId}
              fieldName="backchannel_frequency"
              debounceMs={800}
              onValueChange={handleFrequencyChange}
            />
          </div>

          {/* Backchannel Words */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Backchannel Words</Label>
            <p className="text-xs text-gray-500">A list of words that the agent would use for backchanneling</p>
            <Textarea 
              placeholder="Vale, entiendo, aja, comprendo, mmmm"
              defaultValue={words.join(", ")}
              className="w-full text-sm"
              rows={2}
              onChange={(e) => {
                const newWords = e.target.value.split(',').map(word => word.trim());
                onUpdateWords(newWords);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BackchannelSection;
