
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { useLanguage } from '@/context/LanguageContext';
import { AgentFunction } from '../types';

interface UseEndCallFormProps {
  agent: RetellAgent;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: AgentFunction;
}

export const useEndCallForm = ({ agent, onClose, onSuccess, initialData }: UseEndCallFormProps) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('end_call');
  const [description, setDescription] = useState('End the call');
  const [error, setError] = useState<string | null>(null);

  // Initialize form with initialData if provided
  useEffect(() => {
    if (initialData && initialData.type === 'end_call') {
      setName(initialData.name || 'end_call');
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t('function_name_required'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get LLM ID from the agent - this is crucial for making the correct API calls
      const llmId = agent?.response_engine?.llm_id;
      
      if (!llmId) {
        toast.error(t('no_llm_id_found'));
        setIsSubmitting(false);
        return;
      }

      // First fetch all existing tools using the correct llmId
      console.log("Fetching LLM data with ID:", llmId);
      const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      
      if (!llmData) {
        throw new Error(t('failed_to_fetch_llm_data'));
      }
      
      // Extract existing tools
      const existingTools = llmData.general_tools || [];
      console.log("Existing tools:", existingTools);
      
      // Handle editing vs creating new
      let updatedTools;
      if (initialData) {
        console.log("Updating existing function:", initialData.name);
        // Remove the original function and add the updated one
        updatedTools = existingTools.filter((tool: any) => tool.name !== initialData.name);

        // Prepare the updated function
        const updatedFunction = {
          name,
          description,
          type: "end_call"
        };

        // Add the updated function to tools
        updatedTools.push(updatedFunction);
      } else {
        // Check if a function with the same name already exists
        const nameExists = existingTools.some((tool: any) => tool.name === name);
        
        if (nameExists) {
          setError(t('tool_name_exists').replace('{name}', name));
          setIsSubmitting(false);
          return;
        }

        console.log("Creating new function:", name);
        // Prepare the new function
        const endCallFunction = {
          name,
          description,
          type: "end_call"
        };

        // Add to tools
        updatedTools = [...existingTools, endCallFunction];
      }

      console.log("Updating LLM with ID:", llmId);
      console.log("Updated tools payload:", { general_tools: updatedTools });
      
      // Update the LLM with the updated tools - using the correct llmId
      const response = await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify({ general_tools: updatedTools })
      });
      
      console.log("Update response:", response);

      // Check for error response
      if (response && response.status === 'error') {
        if (response.message && response.message.includes('Duplicate name found')) {
          setError(t('tool_name_exists').replace('{name}', name));
        } else {
          setError(response.message || t('error_adding_end_call_function'));
        }
        setIsSubmitting(false);
        return;
      }

      // Show success message
      toast.success(initialData ? t('end_call_function_updated') : t('end_call_function_added'));
      
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the modal
      onClose();
    } catch (error: any) {
      console.error('Error updating end call function:', error);
      
      // Format error message
      if (error.message && error.message.includes('Duplicate name found')) {
        setError(t('tool_name_exists').replace('{name}', name));
      } else {
        setError(error.message || t('error_adding_end_call_function'));
        toast.error(t('error_adding_end_call_function'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState: {
      name,
      description
    },
    setters: {
      setName,
      setDescription
    },
    isSubmitting,
    error,
    handleSubmit
  };
};
