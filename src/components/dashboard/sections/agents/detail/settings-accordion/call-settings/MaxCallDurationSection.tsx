
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AccordionSectionProps } from '../types';

const MaxCallDurationSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const handleMaxCallDurationChange = (values: number[]) => {
    const duration = values[0];
    updateAgentField('max_call_duration_ms', duration * 60 * 1000); // Convert minutes to milliseconds
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-amber-600">Max Call Duration</Label>
        <span className="text-xs text-gray-500">
          {agent.max_call_duration_ms ? (agent.max_call_duration_ms / 1000 / 60).toFixed(1) : 20.6} m
        </span>
      </div>
      <Slider 
        defaultValue={[agent.max_call_duration_ms ? (agent.max_call_duration_ms / 1000 / 60) : 20.6]} 
        min={1} 
        max={60} 
        step={0.1} 
        className="w-full"
        onValueChange={handleMaxCallDurationChange}
        agentId={agent.agent_id}
        fieldName="max_call_duration_ms"
      />
    </div>
  );
};

export default MaxCallDurationSection;
