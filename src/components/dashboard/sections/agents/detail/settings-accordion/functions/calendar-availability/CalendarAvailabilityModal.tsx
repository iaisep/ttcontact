import React, { useState, useEffect } from 'react';
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
import { AgentFunction } from '../types';

interface CalendarAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: RetellAgent;
  onSuccess?: () => void;
  initialData?: AgentFunction;
}

const CalendarAvailabilityModal: React.FC<CalendarAvailabilityModalProps> = ({ 
  isOpen, 
  onClose, 
  agent,
  onSuccess,
  initialData
}) => {
  const { fetchWithAuth } = useApiContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [functionName, setFunctionName] = useState('check_calendar_availability');
  const [description, setDescription] = useState('When users ask for availability, check the calendar and provide available slots.');
  const [apiKey, setApiKey] = useState('');
  const [eventTypeId, setEventTypeId] = useState('');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [error, setError] = useState<string | null>(null);

  // Get LLM ID from the agent
  const llmId = agent?.response_engine?.llm_id;

  // Initialize form with initialData if provided
  useEffect(() => {
    if (initialData && initialData.type === 'calendar_availability') {
      setFunctionName(initialData.name || 'check_calendar_availability');
      setDescription(initialData.description || '');
      setApiKey(initialData.cal_api_key || '');
      setEventTypeId(initialData.event_type_id ? initialData.event_type_id.toString() : '');
      setTimezone(initialData.timezone || 'America/Los_Angeles');
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!functionName.trim()) {
      setError('Function name is required');
      return;
    }
    
    if (!apiKey.trim()) {
      setError('API Key is required');
      return;
    }
    
    if (!eventTypeId.trim()) {
      setError('Event Type ID is required');
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
      
      // Handle editing vs creating new
      let updatedTools;
      if (initialData) {
        // Filter out the function we're editing
        updatedTools = existingTools.filter((tool: any) => tool.name !== initialData.name);
      } else {
        // Check if a function with the same name already exists
        const nameExists = existingTools.some((tool: any) => tool.name === functionName);
        
        if (nameExists) {
          setError(`Tool name "${functionName}" already exists. Please use a different name.`);
          setIsSubmitting(false);
          return;
        }
        updatedTools = [...existingTools];
      }
      
      // Prepare the new calendar availability function
      const newFunction = {
        name: functionName,
        description: description || "When users ask for availability, check the calendar and provide available slots.",
        event_type_id: parseInt(eventTypeId, 10),
        cal_api_key: apiKey,
        type: "check_availability_cal",
        timezone: timezone || "America/Los_Angeles"
      };
      
      // Add the new or updated function
      updatedTools.push(newFunction);
      
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
      
      toast.success(initialData ? 'Calendar availability function updated successfully' : 'Calendar availability function added successfully');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error adding calendar availability function:', error);
      
      // Check if the error is about duplicate function name
      if (error.message && error.message.includes('Duplicate name found')) {
        setError('Tool name already exists. Please use a different name.');
      } else {
        setError(error.message || 'An error occurred while adding the function');
        toast.error('Failed to add calendar availability function');
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
            {initialData ? 'Edit Calendar Availability' : 'Check Calendar Availability (Cal.com)'}
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
            <Label htmlFor="apiKey">API Key (Cal.com)</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Cal.com API key"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventTypeId">Event Type ID (Cal.com)</Label>
            <Input
              id="eventTypeId"
              value={eventTypeId}
              onChange={(e) => setEventTypeId(e.target.value)}
              placeholder="Enter Event Type ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timezone">
              Timezone <span className="text-gray-400 text-xs">(Optional)</span>
            </Label>
            <Input
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="America/Los_Angeles"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarAvailabilityModal;
