
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { AccordionSectionProps } from '../types';

const EndCallOnSilenceSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  // Add the end_call_after_silence property to the agent type
  const typedAgent = agent as typeof agent & { end_call_after_silence?: boolean };
  
  // Local state for the slider value
  const [silenceDuration, setSilenceDuration] = useState(
    agent.end_call_after_silence_ms ? agent.end_call_after_silence_ms / 1000 : 40
  );
  
  useEffect(() => {
    setSilenceDuration(agent.end_call_after_silence_ms ? agent.end_call_after_silence_ms / 1000 : 40);
  }, [agent.end_call_after_silence_ms]);
  
  const handleEndCallOnSilenceChange = (checked: boolean) => {
    // Only update the boolean value
    updateAgentField('end_call_after_silence', checked);
  };

  const handleSilenceDurationChange = (values: number[]) => {
    const duration = values[0];
    setSilenceDuration(duration);
    // No need to call updateAgentField here as the Slider component will handle it
  };

  // Determine if the feature is enabled by checking the boolean value
  const isEnabled = typedAgent.end_call_after_silence === true;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium text-amber-600">End Call on Silence</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isEnabled} 
            onCheckedChange={handleEndCallOnSilenceChange}
          />
          <span className="text-xs text-gray-500">
            {silenceDuration} s
          </span>
        </div>
      </div>
      
      {/* Only show the slider if the feature is enabled */}
      {isEnabled && (
        <Slider 
          value={[silenceDuration]} 
          min={0} 
          max={120} 
          step={1} 
          className="w-full"
          onValueChange={handleSilenceDurationChange}
          agentId={agent.agent_id}
          fieldName="end_call_after_silence_ms"
          debounceMs={800} // Incrementado para dar más tiempo
        />
      )}
    </div>
  );
};

export default EndCallOnSilenceSection;
