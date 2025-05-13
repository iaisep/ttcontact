
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FunctionFormErrors } from '../../types';

interface CustomFunctionSettingsProps {
  url: string;
  timeoutMs: string;
  speakDuring: boolean;
  speakAfter: boolean;
  executionMessage?: string;
  errors: FunctionFormErrors;
  onChange: (field: string, value: any) => void;
}

const CustomFunctionSettings: React.FC<CustomFunctionSettingsProps> = ({
  url,
  timeoutMs,
  speakDuring,
  speakAfter,
  executionMessage,
  errors,
  onChange
}) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url" className="text-right">Webhook URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => onChange('url', e.target.value)}
          className="col-span-3"
          placeholder="https://example.com/webhook"
        />
        {errors.url && <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.url}</p>}
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="timeoutMs" className="text-right">Timeout (ms)</Label>
        <Input
          id="timeoutMs"
          type="number"
          value={timeoutMs}
          onChange={(e) => onChange('timeoutMs', e.target.value)}
          className="col-span-3"
          placeholder="30000"
        />
      </div>
      
      <SpeakSettings 
        speakDuring={speakDuring}
        speakAfter={speakAfter}
        executionMessage={executionMessage}
        onChange={onChange}
      />
    </>
  );
};

// Nested component for speak settings
const SpeakSettings: React.FC<{
  speakDuring: boolean;
  speakAfter: boolean;
  executionMessage?: string;
  onChange: (field: string, value: any) => void;
}> = ({
  speakDuring,
  speakAfter,
  executionMessage,
  onChange
}) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="speakDuring" className="text-right">Speak During Execution</Label>
        <div className="flex items-center space-x-2 col-span-3">
          <Switch
            id="speakDuring"
            checked={speakDuring}
            onCheckedChange={(checked) => onChange('speakDuring', checked)}
          />
          <Label htmlFor="speakDuring" className="text-sm text-gray-500">Agent speaks while function is running</Label>
        </div>
      </div>
      
      {speakDuring && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="executionMessage" className="text-right">Execution Message</Label>
          <Input
            id="executionMessage"
            value={executionMessage || ''}
            onChange={(e) => onChange('executionMessage', e.target.value)}
            className="col-span-3"
            placeholder="Enter the execution message description"
          />
          <div className="col-start-2 col-span-3">
            <p className="text-xs text-amber-600">
              If the function takes over 2 seconds, the agent can say something like: "Let me check that for you."
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="speakAfter" className="text-right">Speak After Execution</Label>
        <div className="flex items-center space-x-2 col-span-3">
          <Switch
            id="speakAfter"
            checked={speakAfter}
            onCheckedChange={(checked) => onChange('speakAfter', checked)}
          />
          <Label htmlFor="speakAfter" className="text-sm text-gray-500">Agent speaks after function completes</Label>
        </div>
      </div>
    </>
  );
};

export default CustomFunctionSettings;
