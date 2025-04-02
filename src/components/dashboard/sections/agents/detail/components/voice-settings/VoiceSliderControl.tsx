
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface VoiceSliderControlProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
}

const VoiceSliderControl: React.FC<VoiceSliderControlProps> = ({
  id,
  label,
  min,
  max,
  step,
  value,
  onValueChange,
  leftLabel,
  rightLabel,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  
  // Update display value when actual value changes
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);
  
  const formatSliderValue = (value: number) => {
    return value.toFixed(2);
  };

  const handleValueChange = (values: number[]) => {
    const newValue = values[0];
    setDisplayValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={id} className="text-sm">{label}</Label>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{leftLabel}</span>
          <span className="font-medium bg-muted px-2 py-1 rounded-md">
            {formatSliderValue(displayValue)}
          </span>
          <span className="text-muted-foreground text-xs">{rightLabel}</span>
        </div>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[displayValue]}
        onValueChange={handleValueChange}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      />
    </div>
  );
};

export default VoiceSliderControl;
