
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PressDigitFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: RetellAgent;
  onSuccess?: () => void;
}

const PressDigitFunctionModal: React.FC<PressDigitFunctionModalProps> = ({
  isOpen,
  onClose,
  agent,
  onSuccess
}) => {
  const { fetchWithAuth } = useApiContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [functionName, setFunctionName] = useState('press_digit');
  const [description, setDescription] = useState('Navigate to the human agent of sales department');
  const [digit, setDigit] = useState('');
  const [pauseDetectionDelay, setPauseDetectionDelay] = useState('1000');
  const [error, setError] = useState<string | null>(null);

  // Get LLM ID from the agent
  const llmId = agent?.response_engine?.llm_id;

  const handleSubmit = async () => {
    if (!functionName.trim()) {
      setError('Function name is required');
      return;
    }
    
    if (!digit.trim()) {
      setError('Digit is required');
      return;
    }
    
    if (!llmId) {
      toast.error('LLM ID not found for this agent');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // First fetch all existing tools to preserve them
      const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      
      if (!llmData) {
        throw new Error('Failed to fetch LLM data');
      }
      
      // Extract existing tools
      const existingTools = llmData.general_tools || [];
      
      // Check if a function with the same name already exists
      const nameExists = existingTools.some((tool: any) => tool.name === functionName);
      
      if (nameExists) {
        setError(`Tool name "${functionName}" already exists. Please use a different name.`);
        setIsSubmitting(false);
        return;
      }
      
      // Prepare the new press digit function
      const newFunction: any = {
        name: functionName,
        description: description || "Press a digit for IVR navigation.",
        digit: digit.trim(),
        type: "press_digit"
      };
      
      // Add pause detection delay if provided
      if (pauseDetectionDelay.trim()) {
        newFunction.pause_detection_delay_ms = parseInt(pauseDetectionDelay.trim(), 10);
      }
      
      // Combine existing tools with the new one
      const updatedTools = [...existingTools, newFunction];
      
      // Prepare the payload with all tools
      const payload = {
        general_tools: updatedTools
      };
      
      // Make the API call
      const response = await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      
      if (response && response.status === 'error') {
        // Handle specific error for duplicate function name
        if (response.message && response.message.includes('Duplicate name found')) {
          setError('Tool name already exists. Please use a different name.');
        } else {
          setError(response.message || 'An error occurred while adding the function');
        }
        return;
      }
      
      toast.success('Press Digit function added successfully');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error adding press digit function:', error);
      
      // Check if the error is about duplicate function name
      if (error.message && error.message.includes('Duplicate name found')) {
        setError('Tool name already exists. Please use a different name.');
      } else {
        setError(error.message || 'An error occurred while adding the function');
        toast.error('Failed to add press digit function');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Press Digit (IVR Navigation)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
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
          
          <div className="space-y-2">
            <Label htmlFor="digit">Digit</Label>
            <Input
              id="digit"
              value={digit}
              onChange={(e) => setDigit(e.target.value)}
              placeholder="e.g. 1, 2, #, *"
              maxLength={1}
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
              />
              <span className="text-sm text-gray-500">milliseconds</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PressDigitFunctionModal;
