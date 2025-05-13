
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface FunctionMetaSectionProps {
  functionName: string;
  description: string;
  setFunctionName: (value: string) => void;
  setDescription: (value: string) => void;
}

const FunctionMetaSection: React.FC<FunctionMetaSectionProps> = ({
  functionName,
  description,
  setFunctionName,
  setDescription
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="functionName">Name</Label>
        <Input
          id="functionName"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-gray-400 text-xs">(Optional)</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

export default FunctionMetaSection;
