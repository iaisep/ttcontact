
import React from 'react';
import { Label } from '@/components/ui/label';
import { Cog } from 'lucide-react';

interface BackgroundSoundSectionProps {
  sound?: string;
}

export const BackgroundSoundSection: React.FC<BackgroundSoundSectionProps> = ({ 
  sound = 'Call Center'
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-amber-600">Background Sound</Label>
      <div className="flex items-center justify-between">
        <span className="text-sm">{sound}</span>
        <Cog className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default BackgroundSoundSection;
