
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AgentFunction } from '../../types';
import { useApiContext } from '@/context/ApiContext';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface UsePressDigitFormProps {
  agent: RetellAgent;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: AgentFunction;
}

export const usePressDigitForm = ({
  agent,
  onClose,
  onSuccess,
  initialData
}: UsePressDigitFormProps) => {
  const { fetchWithAuth } = useApiContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [functionName, setFunctionName] = useState('press_digit');
  const [description, setDescription] = useState('Navigate to the human agent of sales department');
  const [digit, setDigit] = useState('');
  const [pauseDetectionDelay, setPauseDetectionDelay] = useState('1000');
  const [error, setError] = useState<string | null>(null);

  // Get LLM ID from the agent
  const llmId = agent?.response_engine?.llm_id;
  
  // Initialize form with the initialData if provided (for editing mode)
  useEffect(() => {
    if (initialData && initialData.type === 'press_digit') {
      setFunctionName(initialData.name || 'press_digit');
      setDescription(initialData.description || '');
      setDigit(initialData.digit || '');
      setPauseDetectionDelay(initialData.pause_detection_delay_ms ? 
        initialData.pause_detection_delay_ms.toString() : '1000');
    }
  }, [initialData]);

  const validateForm = () => {
    if (!functionName.trim()) {
      setError('Function name is required');
      return false;
    }
    
    if (!digit.trim()) {
      setError('Digit is required');
      return false;
    }
    
    if (!llmId) {
      toast.error('LLM ID not found for this agent');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
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
      
      // Determine if we're updating an existing function or creating a new one
      let updatedTools;
      if (initialData) {
        // Remove the existing function we're editing
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
      
      toast.success(initialData ? 'Press Digit function updated successfully' : 'Press Digit function added successfully');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error with press digit function:', error);
      
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

  return {
    functionName,
    setFunctionName,
    description,
    setDescription,
    digit,
    setDigit,
    pauseDetectionDelay, 
    setPauseDetectionDelay,
    error,
    isSubmitting,
    handleSubmit,
    isEditMode: !!initialData
  };
};

export default usePressDigitForm;
