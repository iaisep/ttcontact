
import React from 'react';
import { cn } from '@/lib/utils';

interface UsageProgressBarProps {
  label: string;
  current: number;
  max: number;
  unit: string;
}

const UsageProgressBar = ({ label, current, max, unit }: UsageProgressBarProps) => {
  const percentage = Math.min((current || 0) / max * 100, 100);
  
  // Determine color based on usage percentage
  const getProgressColor = (percent: number) => {
    if (percent < 50) return 'bg-green-500'; // Low usage (under 50%)
    if (percent < 80) return 'bg-yellow-500'; // Medium usage (50-80%)
    return 'bg-red-500'; // High usage (above 80%)
  };

  // Determine text color for percentage display
  const getTextColor = (percent: number) => {
    if (percent < 50) return 'text-green-600'; // Low usage
    if (percent < 80) return 'text-yellow-600'; // Medium usage
    return 'text-red-600'; // High usage
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">{current?.toLocaleString()} {unit}</span>
          <span className={cn("text-xs font-medium", getTextColor(percentage))}>
            ({percentage.toFixed(0)}%)
          </span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-300", getProgressColor(percentage))}
          style={{ width: `${percentage}%` }} 
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
