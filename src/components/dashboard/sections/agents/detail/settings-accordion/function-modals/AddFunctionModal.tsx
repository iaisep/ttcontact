
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AgentFunction } from '../FunctionsSection';
import { Sparkles, Plus } from 'lucide-react';

interface AddFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newFunction: AgentFunction) => void;
  functionData: AgentFunction | null;
}

export const AddFunctionModal: React.FC<AddFunctionModalProps> = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  functionData 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [timeoutMs, setTimeoutMs] = useState('30000'); // Renamed from setTimeout to avoid shadowing
  const [parameters, setParameters] = useState('{}');
  const [speakDuring, setSpeakDuring] = useState(false);
  const [speakAfter, setSpeakAfter] = useState(true);
  const [type, setType] = useState('custom');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && functionData) {
      setName(functionData.name || '');
      setDescription(functionData.description || '');
      setUrl(functionData.url || '');
      setType(functionData.type || 'custom');
      setTimeoutMs(functionData.timeout_ms?.toString() || '30000');
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
    } else if (isOpen) {
      // Reset form for new function
      setName('');
      setDescription('');
      setUrl('');
      setType('custom');
      setTimeoutMs('30000');
      setSpeakDuring(false);
      setSpeakAfter(true);
      setParameters('{}');
    }
    
    // Clear errors when modal opens/closes
    setErrors({});
    // Reset submission state
    setIsSubmitting(false);
  }, [functionData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Function name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (type === 'custom' && !url.trim()) {
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
    if (isSubmitting) return; // Prevent multiple submissions
    
    if (!validate()) return;
    
    let parsedParameters;
    try {
      parsedParameters = parameters ? JSON.parse(parameters) : undefined;
    } catch (e) {
      setErrors({ ...errors, parameters: 'Invalid JSON format' });
      return;
    }
    
    setIsSubmitting(true);
    
    const newFunction: AgentFunction = {
      name,
      description,
      type,
    };
    
    if (type === 'custom') {
      newFunction.url = url;
      newFunction.timeout_ms = parseInt(timeoutMs, 10);
      newFunction.parameters = parsedParameters;
      newFunction.speak_during_execution = speakDuring;
      newFunction.speak_after_execution = speakAfter;
    }
    
    // First close the modal cleanly to prevent UI freezes
    onClose();
    
    // Use a small delay to ensure the UI updates before processing the add operation
    window.setTimeout(() => {
      onAdd(newFunction);
      setIsSubmitting(false);
    }, 100);
  };

  const handleCleanClose = () => {
    // Prevent processing if already in closing state
    if (isSubmitting) return;
    
    onClose();
  };

  const isCustomFunction = type === 'custom';

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isSubmitting) handleCleanClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Function
          </DialogTitle>
          <DialogDescription>
            Create a new function or tool for your agent to use during conversations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
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
                <Label htmlFor="timeoutMs" className="text-right">Timeout (ms)</Label>
                <Input
                  id="timeoutMs"
                  type="number"
                  value={timeoutMs}
                  onChange={(e) => setTimeoutMs(e.target.value)}
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
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCleanClose();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Add Function
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
