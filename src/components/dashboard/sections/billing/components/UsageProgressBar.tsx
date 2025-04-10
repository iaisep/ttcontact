
import React from 'react';

interface UsageProgressBarProps {
  label: string;
  current: number;
  max: number;
  unit: string;
}

const UsageProgressBar = ({ label, current, max, unit }: UsageProgressBarProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{current?.toLocaleString()} {unit}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary" 
          style={{ width: `${Math.min((current || 0) / max * 100, 100)}%` }} 
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>{max.toLocaleString()} {unit}</span>
      </div>
    </div>
  );
};

export default UsageProgressBar;
