
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AccordionSectionProps } from '../types';

const MaxCallDurationSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const [duration, setDuration] = useState(
    agent.max_call_duration_ms ? (agent.max_call_duration_ms / 1000 / 60) : 20.6
  );

  useEffect(() => {
    setDuration(agent.max_call_duration_ms ? (agent.max_call_duration_ms / 1000 / 60) : 20.6);
  }, [agent.max_call_duration_ms]);

  const handleMaxCallDurationChange = (values: number[]) => {
    const newDuration = values[0];
    setDuration(newDuration);
    // Don't call updateAgentField here, the Slider will handle it with debounce
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-amber-600">Max Call Duration</Label>
        <span className="text-xs text-gray-500">
          {duration.toFixed(1)} m
        </span>
      </div>
      <Slider 
        value={[duration]}
        min={1} 
        max={60} 
        step={0.1} 
        className="w-full"
        onValueChange={handleMaxCallDurationChange}
        agentId={agent.agent_id}
        fieldName="max_call_duration_ms"
        debounceMs={800}
      />
    </div>
  );
};

export default MaxCallDurationSection;
