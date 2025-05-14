
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const RingDurationSection: React.FC = () => {
  const handleRingDurationChange = (values: number[]) => {
    // This would be implemented if there's a specific field for ring duration
    // For now, we'll assume it's part of the agent configuration
    // updateAgentField('ring_duration_ms', values[0] * 1000); // Convert seconds to milliseconds
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium text-amber-600">Ring Duration</Label>
          <p className="text-xs text-gray-500">The duration for which the phone will ring before the call is answered or terminated.</p>
        </div>
        <span className="text-xs text-gray-500">30 s</span>
      </div>
      <Slider 
        defaultValue={[30]} 
        min={0} 
        max={60} 
        step={1} 
        className="w-full"
        onValueChange={handleRingDurationChange}
      />
    </div>
  );
};

export default RingDurationSection;
