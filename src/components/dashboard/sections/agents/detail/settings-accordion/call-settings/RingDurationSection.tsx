import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AccordionSectionProps } from '../types';

const RingDurationSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const [ringDuration, setRingDuration] = useState(
    agent.ring_duration_ms ? agent.ring_duration_ms / 1000 : 30
  );

  // Sincroniza el estado local si cambia agent.ring_duration_ms
  useEffect(() => {
    setRingDuration(agent.ring_duration_ms ? agent.ring_duration_ms / 1000 : 30);
  }, [agent.ring_duration_ms]);

  // Actualiza el estado local en tiempo real
  const handleRingDurationChange = (values: number[]) => {
    setRingDuration(values[0]);
  };

  // Solo actualiza el servidor cuando el usuario suelta el slider
  const handleRingDurationCommit = (values: number[]) => {
    const duration = values[0];
    updateAgentField('ring_duration_ms', duration * 1000); // Siempre en milisegundos
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium text-amber-600">Ring Duration</Label>
          <p className="text-xs text-gray-500">The duration for which the phone will ring before the call is answered or terminated.</p>
        </div>
        <span className="text-xs text-gray-500">{ringDuration} s</span>
      </div>
      <Slider 
        value={[ringDuration]}
        min={0} 
        max={60} 
        step={1} 
        className="w-full"
        onValueChange={handleRingDurationChange}
        onValueCommit={handleRingDurationCommit}
      />
    </div>
  );
};

export default RingDurationSection;
