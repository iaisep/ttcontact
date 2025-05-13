
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { X } from 'lucide-react';

interface CalendarAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: RetellAgent;
  onSuccess?: () => void;
}

const CalendarAvailabilityModal: React.FC<CalendarAvailabilityModalProps> = ({ 
  isOpen, 
  onClose, 
  agent,
  onSuccess 
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
      // Prepare the payload
      const payload = {
        general_tools: [
          {
            name: functionName,
            event_type_id: eventTypeId,
            cal_api_key: apiKey,
            type: "check_availability_cal",
            timezone: timezone || "America/Los_Angeles",
            description: description || "When users ask for availability, check the calendar and provide available slots."
          }
        ]
      };
      
      // Make the API call
      const response = await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      
      if (response.status === 'error') {
        // Handle specific error for duplicate function name
        if (response.message && response.message.includes('Duplicate name found')) {
          setError('Tool name already exists. Please use a different name.');
        } else {
          setError(response.message || 'An error occurred while adding the function');
        }
        return;
      }
      
      toast.success('Calendar availability function added successfully');
      
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
            Check Calendar Availability (Cal.com)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarAvailabilityModal;
