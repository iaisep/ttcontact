
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldsProps {
  functionName: string;
  setFunctionName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  digit: string;
  setDigit: (value: string) => void;
  pauseDetectionDelay: string;
  setPauseDetectionDelay: (value: string) => void;
  isSubmitting: boolean;
}

const FormFields = ({
  functionName,
  setFunctionName,
  description,
  setDescription,
  digit,
  setDigit,
  pauseDetectionDelay,
  setPauseDetectionDelay,
  isSubmitting
}: FormFieldsProps) => {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="functionName">Name</Label>
        <Input
          id="functionName"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="digit">Digit</Label>
        <Input
          id="digit"
          value={digit}
          onChange={(e) => setDigit(e.target.value)}
          placeholder="e.g. 1, 2, #, *"
          maxLength={1}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pauseDetectionDelay">
          Pause Detection Delay <span className="text-gray-400 text-xs">(Optional)</span>
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            id="pauseDetectionDelay"
            value={pauseDetectionDelay}
            onChange={(e) => setPauseDetectionDelay(e.target.value)}
            placeholder="1000"
            type="number"
            min="0"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-500">milliseconds</span>
        </div>
      </div>
    </div>
  );
};

export default FormFields;
