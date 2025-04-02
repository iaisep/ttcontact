
import React, { useState } from 'react';
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
  
  const formatSliderValue = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={id} className="text-sm">{label}</Label>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{leftLabel}</span>
          <span className="font-medium bg-muted px-2 py-1 rounded-md">
            {formatSliderValue(value)}
          </span>
          <span className="text-muted-foreground text-xs">{rightLabel}</span>
        </div>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onValueChange(values[0])}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        className={isActive ? "cursor-pointer" : ""}
      />
    </div>
  );
};

export default VoiceSliderControl;
