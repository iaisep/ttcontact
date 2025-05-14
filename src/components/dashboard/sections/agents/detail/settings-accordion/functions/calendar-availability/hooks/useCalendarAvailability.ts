
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { AgentFunction } from '../../types';

interface UseCalendarAvailabilityProps {
  agent: RetellAgent;
  onSuccess?: () => void;
  onClose: () => void;
  initialData?: AgentFunction;
}

export const useCalendarAvailability = ({
  agent,
  onSuccess,
  onClose,
  initialData
}: UseCalendarAvailabilityProps) => {
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
    if (initialData && (initialData.type === 'calendar_availability' || initialData.type === 'check_calendar_availability' || initialData.type === 'check_availability_cal')) {
      setFunctionName(initialData.name || 'check_calendar_availability');
      setDescription(initialData.description || '');
      setApiKey(initialData.cal_api_key || '');
      setEventTypeId(initialData.event_type_id ? initialData.event_type_id.toString() : '');
      setTimezone(initialData.timezone || 'America/Los_Angeles');
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    if (!functionName.trim()) {
      setError('Function name is required');
      return false;
    }
    
    if (!apiKey.trim()) {
      setError('API Key is required');
      return false;
    }
    
    if (!eventTypeId.trim()) {
      setError('Event Type ID is required');
      return false;
    }
    
    if (!llmId) {
      toast.error('LLM ID not found for this agent');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
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
      
      // Determine the function type - preserve original if editing
      const functionType = initialData ? initialData.type : "check_availability_cal";
      
      // Prepare the new calendar availability function
      const newFunction = {
        name: functionName,
        description: description || "When users ask for availability, check the calendar and provide available slots.",
        event_type_id: parseInt(eventTypeId, 10),
        cal_api_key: apiKey,
        type: functionType,
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

  return {
    isSubmitting,
    functionName,
    setFunctionName,
    description,
    setDescription,
    apiKey,
    setApiKey,
    eventTypeId,
    setEventTypeId,
    timezone,
    setTimezone,
    error,
    setError,
    handleSubmit
  };
};
