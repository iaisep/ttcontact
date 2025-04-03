
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FunctionFormProps } from '../types';

const FunctionForm: React.FC<FunctionFormProps> = ({ 
  formData, 
  errors, 
  onChange, 
  isCustomFunction 
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="col-span-3"
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
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="parameters" className="text-right pt-2">Parameters (JSON)</Label>
            <Textarea
              id="parameters"
              value={formData.parameters}
              onChange={(e) => onChange('parameters', e.target.value)}
              className="col-span-3 font-mono text-xs"
              rows={8}
            />
            {errors.parameters && <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.parameters}</p>}
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
