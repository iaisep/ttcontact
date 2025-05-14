
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface InterruptionSectionProps {
  agentId?: string;
  sensitivity: number;
  onUpdate?: (value: number) => void;
}

export const InterruptionSection: React.FC<InterruptionSectionProps> = ({ 
  agentId,
  sensitivity = 0.8,
  onUpdate 
}) => {
  const [value, setValue] = useState(sensitivity);

  useEffect(() => {
    setValue(sensitivity);
  }, [sensitivity]);

  const handleValueChange = (values: number[]) => {
    const newValue = values[0];
    setValue(newValue);
    if (onUpdate) {
      onUpdate(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-amber-600">Interruption Sensitivity</Label>
        <span className="text-xs text-gray-500">{value.toFixed(2)}</span>
      </div>
      <p className="text-xs text-gray-500">Control how sensitively AI can be interrupted by human speech.</p>
      <Slider 
        defaultValue={[value]} 
        value={[value]}
        max={1} 
        step={0.01} 
        className="w-full"
        agentId={agentId}
        fieldName="interruption_sensitivity"
        debounceMs={800}
        onValueChange={handleValueChange}
      />
    </div>
  );
};

export default InterruptionSection;
