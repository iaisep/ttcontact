
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ResponsivenessSectionProps {
  agentId?: string;
  responsiveness: number;
  onUpdate?: (value: number) => void;
}

export const ResponsivenessSection: React.FC<ResponsivenessSectionProps> = ({ 
  agentId,
  responsiveness = 0.85,
  onUpdate 
}) => {
  const [value, setValue] = useState(responsiveness);

  useEffect(() => {
    setValue(responsiveness);
  }, [responsiveness]);

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
        <Label className="text-xs font-medium text-amber-600">Responsiveness</Label>
        <span className="text-xs text-gray-500">{value.toFixed(2)}</span>
      </div>
      <p className="text-xs text-gray-500">Control how fast the agent responds after users finish speaking.</p>
      <Slider 
        defaultValue={[value]} 
        value={[value]}
        max={1} 
        step={0.01} 
        className="w-full"
        agentId={agentId}
        fieldName="responsiveness"
        onValueChange={handleValueChange}
      />
    </div>
  );
};

export default ResponsivenessSection;
