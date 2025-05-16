
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SpeechNormalizationSectionProps {
  normalized: boolean;
  transcriptFormatting: boolean;
  onUpdateNormalized: (value: boolean) => void;
  onUpdateTranscriptFormatting: (value: boolean) => void;
}

export const SpeechNormalizationSection: React.FC<SpeechNormalizationSectionProps> = ({
  normalized = false,
  transcriptFormatting = false,
  onUpdateNormalized,
  onUpdateTranscriptFormatting
}) => {
  return (
    <div className="space-y-6">
      {/* Enable Speech Normalization */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium text-amber-600">Enable Speech Normalization</Label>
            <p className="text-xs text-gray-500">It converts text elements like numbers, currency, and dates into human-like spoken expressions.</p>
          </div>
          <Switch 
            checked={normalized}
            onCheckedChange={onUpdateNormalized}
          />
        </div>
      </div>

      {/* Enable Transcript Formatting */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium text-amber-600">Enable Transcript Formatting</Label>
            <p className="text-xs text-gray-500">The agent writes like phone numbers being formatted as timestamps.</p>
          </div>
          <Switch 
            checked={transcriptFormatting}
            onCheckedChange={onUpdateTranscriptFormatting}
          />
        </div>
      </div>
    </div>
  );
};

export default SpeechNormalizationSection;
