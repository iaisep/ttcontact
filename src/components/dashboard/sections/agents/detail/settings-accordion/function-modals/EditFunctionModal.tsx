
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AgentFunction } from '../FunctionsSection';
import { Sparkles } from 'lucide-react';

interface EditFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedFunction: AgentFunction) => void;
  functionData: AgentFunction | null;
}

export const EditFunctionModal: React.FC<EditFunctionModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpdate, 
  functionData 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [timeout, setTimeout] = useState('30000');
  const [parameters, setParameters] = useState('');
  const [speakDuring, setSpeakDuring] = useState(false);
  const [speakAfter, setSpeakAfter] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (functionData) {
      setName(functionData.name || '');
      setDescription(functionData.description || '');
      setUrl(functionData.url || '');
      setTimeout(functionData.timeout_ms?.toString() || '30000');
      setSpeakDuring(functionData.speak_during_execution || false);
      setSpeakAfter(functionData.speak_after_execution || true);
      
      // Format parameters as JSON string for editing
      if (functionData.parameters) {
        try {
          setParameters(JSON.stringify(functionData.parameters, null, 2));
        } catch (e) {
          setParameters('{}');
        }
      } else {
        setParameters('{}');
      }
    }
  }, [functionData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Function name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (functionData?.type === 'custom' && !url.trim()) {
      newErrors.url = 'URL is required for custom functions';
    }
    
    try {
      if (parameters) {
        JSON.parse(parameters);
      }
    } catch (e) {
      newErrors.parameters = 'Invalid JSON format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !functionData) return;
    
    let parsedParameters;
    try {
      parsedParameters = parameters ? JSON.parse(parameters) : undefined;
    } catch (e) {
      setErrors({ ...errors, parameters: 'Invalid JSON format' });
      return;
    }
    
    const updatedFunction: AgentFunction = {
      ...functionData,
      name,
      description,
      speak_during_execution: speakDuring,
      speak_after_execution: speakAfter,
    };
    
    if (functionData.type === 'custom') {
      updatedFunction.url = url;
      updatedFunction.timeout_ms = parseInt(timeout, 10);
      updatedFunction.parameters = parsedParameters;
    }
    
    onUpdate(updatedFunction);
  };

  const isCustomFunction = functionData?.type === 'custom';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
            Edit Function
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              disabled={!isCustomFunction}
            />
            {errors.name && <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="col-span-3"
                  placeholder="https://example.com/webhook"
                />
                {errors.url && <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.url}</p>}
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timeout" className="text-right">Timeout (ms)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={timeout}
                  onChange={(e) => setTimeout(e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="parameters" className="text-right pt-2">Parameters (JSON)</Label>
                <Textarea
                  id="parameters"
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                  className="col-span-3 font-mono text-xs"
                  rows={8}
                />
                {errors.parameters && <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.parameters}</p>}
              </div>
            </>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="speakDuring" className="text-right">Speak During Execution</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="speakDuring"
                checked={speakDuring}
                onCheckedChange={setSpeakDuring}
              />
              <Label htmlFor="speakDuring" className="text-sm text-gray-500">Agent speaks while function is running</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="speakAfter" className="text-right">Speak After Execution</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="speakAfter"
                checked={speakAfter}
                onCheckedChange={setSpeakAfter}
              />
              <Label htmlFor="speakAfter" className="text-sm text-gray-500">Agent speaks after function completes</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Update Function</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
