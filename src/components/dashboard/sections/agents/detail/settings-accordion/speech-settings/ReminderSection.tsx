
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ReminderSectionProps {
  triggerSeconds: number;
  maxCount: number;
  onUpdateTrigger: (value: number) => void;
  onUpdateMaxCount: (value: number) => void;
}

export const ReminderSection: React.FC<ReminderSectionProps> = ({
  triggerSeconds = 5,
  maxCount = 1,
  onUpdateTrigger,
  onUpdateMaxCount
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-amber-600">Reminder Message Frequency</Label>
      <p className="text-xs text-gray-500">Control how often AI will send a reminder message.</p>
      <div className="flex items-center space-x-2">
        <Input 
          type="number"
          value={triggerSeconds}
          className="w-16 text-sm"
          onChange={(e) => {
            const seconds = parseInt(e.target.value);
            if (!isNaN(seconds)) {
              onUpdateTrigger(seconds);
            }
          }}
        />
        <span className="text-xs text-gray-500">seconds</span>
        <Input 
          type="number"
          value={maxCount}
          className="w-16 text-sm"
          onChange={(e) => {
            const count = parseInt(e.target.value);
            if (!isNaN(count)) {
              onUpdateMaxCount(count);
            }
          }}
        />
        <span className="text-xs text-gray-500">times</span>
      </div>
    </div>
  );
};

export default ReminderSection;
