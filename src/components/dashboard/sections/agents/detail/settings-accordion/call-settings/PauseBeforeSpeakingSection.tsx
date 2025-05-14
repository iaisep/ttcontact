
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AccordionSectionProps } from '../types';

const PauseBeforeSpeakingSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const [pauseDuration, setPauseDuration] = useState(
    agent.begin_message_delay_ms ? agent.begin_message_delay_ms / 1000 : 0
  );
  
  useEffect(() => {
    setPauseDuration(agent.begin_message_delay_ms ? agent.begin_message_delay_ms / 1000 : 0);
  }, [agent.begin_message_delay_ms]);

  const handlePauseBeforeSpeakingChange = (values: number[]) => {
    const duration = values[0];
    setPauseDuration(duration);
    // Don't call updateAgentField here, the Slider will handle it with debounce
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium text-amber-600">Pause Before Speaking</Label>
          <p className="text-xs text-gray-500">The duration before the assistant starts speaking at the beginning of the call.</p>
        </div>
        <span className="text-xs text-gray-500">{pauseDuration} s</span>
      </div>
      <Slider 
        value={[pauseDuration]}
        min={0} 
        max={10} 
        step={0.1} 
        className="w-full"
        onValueChange={handlePauseBeforeSpeakingChange}
        agentId={agent.agent_id}
        fieldName="begin_message_delay_ms"
        debounceMs={800}
        valueTransform={(value) => value * 1000} // Convert seconds to milliseconds
      />
    </div>
  );
};

export default PauseBeforeSpeakingSection;
