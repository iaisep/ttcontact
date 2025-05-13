
import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface UseEndCallFormProps {
  agent: RetellAgent;
  onClose: () => void;
  onSuccess?: () => void;
}

export const useEndCallForm = ({ agent, onClose, onSuccess }: UseEndCallFormProps) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [name, setName] = useState("end_call");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error(t('function_name_required'));
      return;
    }

    const llmId = agent?.response_engine?.llm_id;
    if (!llmId) {
      toast.error(t('no_llm_id_found'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // First, fetch existing tools to preserve them
      const llmResponse = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      const existingTools = llmResponse.general_tools || [];
      
      // Check if function name already exists
      const nameExists = existingTools.some((tool: any) => tool.name === name);
      if (nameExists) {
        setError(`Tool name must be unique across general tools + tools of the state + state transitions. Duplicate name found: ${name}`);
        toast.error(`Function name "${name}" already exists`);
        setIsSubmitting(false);
        return;
      }
      
      // Create new end call function
      const newFunction = {
        name: name,
        description: description,
        type: "end_call"
      };
      
      // Add new function to existing tools
      const updatedTools = [...existingTools, newFunction];
      
      const payload = {
        general_tools: updatedTools
      };
      
      // Update the API with all tools
      const response = await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      
      // Check if there's an error response with a specific message pattern
      if (response && response.status === 'error' && response.message && response.message.includes('Duplicate name found')) {
        setError(response.message);
        toast.error(`Function name "${name}" already exists`);
        setIsSubmitting(false);
        return;
      }
      
      toast.success(t('end_call_function_added'));
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving End Call function:", error);
      
      // Check if the error is related to duplicate function name
      if (error.message && typeof error.message === 'string' && error.message.includes('Duplicate name found')) {
        setError(error.message);
        toast.error(`Function name "${name}" already exists`);
      } else {
        toast.error(t('error_adding_end_call_function'));
        setError(error.message || t('error_adding_end_call_function'));
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
