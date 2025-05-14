
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface KeywordsSectionProps {
  keywords: string[];
  onUpdate: (value: string[]) => void;
}

export const KeywordsSection: React.FC<KeywordsSectionProps> = ({
  keywords = ["información de mi cuenta"],
  onUpdate
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-amber-600">Boosted Keywords</Label>
      <p className="text-xs text-gray-500">Provide a customized list of keywords to expand our model's vocabulary.</p>
      <Input 
        placeholder="Keywords separated by commas"
        defaultValue={keywords.join(", ")}
        className="w-full text-sm"
        onChange={(e) => {
          const newKeywords = e.target.value.split(',').map(keyword => keyword.trim());
          onUpdate(newKeywords);
        }}
      />
    </div>
  );
};

export default KeywordsSection;
