
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AccordionSectionProps } from '../types';

const PauseBeforeSpeakingSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const initialValue = agent.begin_message_delay_ms
    ? agent.begin_message_delay_ms / 1000
    : 0;

  const [pauseDuration, setPauseDuration] = useState(initialValue);

  useEffect(() => {
    setPauseDuration(initialValue);
  }, [agent.begin_message_delay_ms]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateAgentField('begin_message_delay_ms', Math.round(pauseDuration * 1000));
    }, 500);

    return () => clearTimeout(timeout);
  }, [pauseDuration]);

  const handleSliderChange = (values: number[]) => {
    setPauseDuration(values[0]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium text-amber-600">Pause Before Speaking</Label>
          <p className="text-xs text-gray-500">
            The duration before the assistant starts speaking at the beginning of the call.
          </p>
        </div>
        <span className="text-xs text-gray-500">
          {pauseDuration.toFixed(1)} s
        </span>
      </div>
      <Slider 
        value={[pauseDuration]}
        defaultValue={[initialValue]}
        min={0} 
        max={5} 
        step={0.1} 
        className="w-full"
        onValueChange={handleSliderChange}
        agentId={agent.agent_id}
        // ❌ Quitamos `fieldName` para evitar actualizaciones duplicadas
        // fieldName="begin_message_delay_ms"
        debounceMs={0}
      />
    </div>
  );
};

export default PauseBeforeSpeakingSection;

