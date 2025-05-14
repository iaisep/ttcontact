
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { AccordionSectionProps } from '../types';

const EndCallOnSilenceSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const handleEndCallOnSilenceChange = (checked: boolean) => {
    // This will send a payload like { "end_call_after_silence_ms": 40000 } or { "end_call_after_silence_ms": 0 }
    if (checked && !agent.end_call_after_silence_ms) {
      updateAgentField('end_call_after_silence_ms', 40000); // 40 seconds in milliseconds
    } else if (!checked) {
      updateAgentField('end_call_after_silence_ms', 0); // Disable the feature
    }
  };

  const handleSilenceDurationChange = (values: number[]) => {
    const duration = values[0];
    updateAgentField('end_call_after_silence_ms', duration * 1000); // Convert to milliseconds
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium text-amber-600">End Call on Silence</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={!!agent.end_call_after_silence_ms} 
            onCheckedChange={handleEndCallOnSilenceChange}
          />
          <span className="text-xs text-gray-500">
            {agent.end_call_after_silence_ms ? (agent.end_call_after_silence_ms / 1000) : 40} s
          </span>
        </div>
      </div>
      <Slider 
        defaultValue={[agent.end_call_after_silence_ms ? (agent.end_call_after_silence_ms / 1000) : 40]} 
        min={0} 
        max={120} 
        step={1} 
        className="w-full"
        onValueChange={handleSilenceDurationChange}
        agentId={agent.agent_id}
        fieldName="end_call_after_silence_ms"
        debounceMs={300}
      />
    </div>
  );
};

export default EndCallOnSilenceSection;
