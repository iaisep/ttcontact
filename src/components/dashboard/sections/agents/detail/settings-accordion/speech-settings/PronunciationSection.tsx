
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const PronunciationSection: React.FC = () => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-amber-600">Pronunciation</Label>
      <p className="text-xs text-gray-500">Guide the model to pronounce a word, name, or phrase in a specific way. (Learn more)</p>
      <div className="flex justify-start">
        <Button variant="outline" size="sm" className="text-xs">
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
};

export default PronunciationSection;
