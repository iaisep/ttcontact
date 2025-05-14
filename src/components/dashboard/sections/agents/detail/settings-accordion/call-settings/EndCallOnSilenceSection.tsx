
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { AccordionSectionProps } from '../types';

const EndCallOnSilenceSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  // Add the end_call_after_silence property to the agent type
  const typedAgent = agent as typeof agent & { end_call_after_silence?: boolean };
  
  const handleEndCallOnSilenceChange = (checked: boolean) => {
    // Only update the boolean value
    updateAgentField('end_call_after_silence', checked);
  };

  const handleSilenceDurationChange = (values: number[]) => {
    const duration = values[0];
    updateAgentField('end_call_after_silence_ms', duration * 1000); // Convert to milliseconds
  };

  // Determine if the feature is enabled by checking the boolean value
  const isEnabled = typedAgent.end_call_after_silence === true;
  
  // Get the current value in seconds to display
  const currentValueInSeconds = agent.end_call_after_silence_ms ? agent.end_call_after_silence_ms / 1000 : 40;

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
            {currentValueInSeconds} s
          </span>
        </div>
      </div>
      
      {/* Only show the slider if the feature is enabled */}
      {isEnabled && (
        <Slider 
          defaultValue={[currentValueInSeconds]} 
          min={0} 
          max={120} 
          step={1} 
          className="w-full"
          onValueChange={handleSilenceDurationChange}
          agentId={agent.agent_id}
          fieldName="end_call_after_silence_ms"
          debounceMs={300}
        />
      )}
    </div>
  );
};

export default EndCallOnSilenceSection;
