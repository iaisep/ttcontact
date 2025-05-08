
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { FunctionFormProps } from '../types';

const FunctionForm: React.FC<FunctionFormProps> = ({ 
  formData, 
  errors, 
  onChange, 
  isCustomFunction 
}) => {
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleFormatJSON = () => {
    try {
      if (!formData.parameters.trim()) return;
      const parsed = JSON.parse(formData.parameters);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange('parameters', formatted);
      setJsonError(null);
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  };

  const setExampleJSON = (example: number) => {
    let jsonData = '';
    
    switch (example) {
      case 1:
        jsonData = JSON.stringify({
          type: "object",
          properties: {
            appointment_available_ts: {
              type: "string",
              description: "The timestamp of the appointment that is available for booking."
            }
          },
          required: ["appointment_available_ts"]
        }, null, 2);
        break;
      case 2:
        jsonData = JSON.stringify({
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "The city for which the weather is to be fetched."
            }
          },
          required: ["city"]
        }, null, 2);
        break;
      case 3:
        jsonData = JSON.stringify({
          type: "object",
          properties: {
            appointment_available_ts: {
              type: "string",
              description: "The timestamp of the appointment that is available for booking."
            },
            doctor_name: {
              type: "string",
              description: "An optional field to specify the name of the doctor."
            }
          },
          required: ["appointment_available_ts"]
        }, null, 2);
        break;
    }
    
    onChange('parameters', jsonData);
    setJsonError(null);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="col-span-3"
          placeholder="function_name"
        />
        {errors.name && <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.name}</p>}
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="col-span-3"
          placeholder="Brief description of what this function does"
        />
        {errors.description && <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.description}</p>}
      </div>
      
      {isCustomFunction && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">Webhook URL</Label>
            <Input
              id="url"
              value={formData.url}
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
              value={formData.timeoutMs}
              onChange={(e) => onChange('timeoutMs', e.target.value)}
              className="col-span-3"
              placeholder="30000"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="parameters" className="text-right pt-2">Parameters (JSON)</Label>
            <div className="col-span-3 space-y-2">
              <Textarea
                id="parameters"
                value={formData.parameters}
                onChange={(e) => onChange('parameters', e.target.value)}
                className="font-mono text-xs"
                rows={8}
                placeholder='{\n  "type": "object",\n  "properties": {}\n}'
              />
              {(errors.parameters || jsonError) && (
                <p className="text-red-500 text-xs">{errors.parameters || jsonError}</p>
              )}
              <div className="flex gap-2 flex-wrap">
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => setExampleJSON(1)}
                >
                  example 1
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => setExampleJSON(2)}
                >
                  example 2
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => setExampleJSON(3)}
                >
                  example 3
                </Button>
              </div>
              <Button 
                type="button" 
                className="w-full" 
                variant="outline" 
                onClick={handleFormatJSON}
              >
                Format JSON
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="speakDuring" className="text-right">Speak During Execution</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="speakDuring"
                checked={formData.speakDuring}
                onCheckedChange={(checked) => onChange('speakDuring', checked)}
              />
              <Label htmlFor="speakDuring" className="text-sm text-gray-500">Agent speaks while function is running</Label>
            </div>
          </div>
          
          {formData.speakDuring && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="executionMessage" className="text-right">Execution Message</Label>
              <Input
                id="executionMessage"
                value={formData.executionMessage || ''}
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
                checked={formData.speakAfter}
                onCheckedChange={(checked) => onChange('speakAfter', checked)}
              />
              <Label htmlFor="speakAfter" className="text-sm text-gray-500">Agent speaks after function completes</Label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FunctionForm;
