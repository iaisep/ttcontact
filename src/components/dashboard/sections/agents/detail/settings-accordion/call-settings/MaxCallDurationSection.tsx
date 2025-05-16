import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AccordionSectionProps } from '../types';

const MaxCallDurationSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const initialMinutes = agent.max_call_duration_ms
    ? agent.max_call_duration_ms / 1000 / 60
    : 20.6;

  const [localValue, setLocalValue] = useState(initialMinutes);

  useEffect(() => {
    setLocalValue(initialMinutes);
  }, [agent.max_call_duration_ms]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateAgentField('max_call_duration_ms', Math.round(localValue) * 60 * 1000);;
    }, 500);

    return () => clearTimeout(timeout);
  }, [localValue]);

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    setLocalValue(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-amber-600">Max Call Duration</Label>
        <span className="text-xs text-gray-500">
          {localValue.toFixed(1)} m
        </span>
      </div>
      <Slider 
        defaultValue={[initialMinutes]} 
        value={[localValue]}
        min={1} 
        max={60} 
        step={0.1} 
        className="w-full"
        onValueChange={handleSliderChange}
        agentId={agent.agent_id}
        // ❌ Quitamos fieldName para evitar doble actualización
        // fieldName="max_call_duration_ms"
        debounceMs={0}
      />
    </div>
  );
};

export default MaxCallDurationSection;

