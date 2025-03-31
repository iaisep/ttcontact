
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';

interface UseLlmSettingsProps {
  initialModel?: string;
  llmId?: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useLlmSettings = ({ initialModel = 'GPT 4o', llmId, updateAgentField }: UseLlmSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  const [selectedLlmModel, setSelectedLlmModel] = useState(initialModel);
  const [isLlmSettingsOpen, setIsLlmSettingsOpen] = useState(false);
  const [llmTemperature, setLlmTemperature] = useState(0.0);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [highPriority, setHighPriority] = useState(false);

  const llmOptions = [
    'GPT 4o',
    'GPT 4o Mini',
    'Claude 3 Opus',
    'Claude 3 Sonnet',
  ];

  const handleLlmChange = async (llm: string) => {
    setSelectedLlmModel(llm);
    
    try {
      if (llmId) {
        toast.loading('Updating LLM model...');
        
        // Update the LLM using the update-retell-llm endpoint with PATCH method
        // Using the correct request body format
        await fetchWithAuth(`/update-retell-llm/${llmId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            s2s_model: "gpt-4o-realtime",
            model: null
          })
        });
        
        // Fetch the updated LLM data to ensure changes are reflected
        const updatedLlmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
        
        // Update local state
        updateAgentField('llm_model', llm);
        toast.success('LLM model updated successfully');
      } else {
        // If no LLM ID is available, just update the local state
        updateAgentField('llm_model', llm);
      }
    } catch (error) {
      console.error('Error updating LLM model:', error);
      toast.error('Failed to update LLM model');
    }
  };

  const handleSaveLlmSettings = async () => {
    try {
      if (llmId) {
        toast.loading('Saving LLM settings...');
        
        // Update the LLM settings using the update-retell-llm endpoint with PATCH method
        await fetchWithAuth(`/update-retell-llm/${llmId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            temperature: llmTemperature,
            structured_output: structuredOutput,
            high_priority: highPriority
          })
        });
        
        // Fetch the updated LLM data to ensure changes are reflected
        const updatedLlmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
        
        // Update local state
        updateAgentField('llm_temperature', llmTemperature);
        updateAgentField('structured_output', structuredOutput);
        updateAgentField('high_priority', highPriority);
        
        toast.success('LLM settings saved successfully');
      } else {
        // If no LLM ID is available, just update the local state
        updateAgentField('llm_temperature', llmTemperature);
        updateAgentField('structured_output', structuredOutput);
        updateAgentField('high_priority', highPriority);
        toast.success('LLM settings saved');
      }
      
      setIsLlmSettingsOpen(false);
    } catch (error) {
      console.error('Error saving LLM settings:', error);
      toast.error('Failed to save LLM settings');
    }
  };

  return {
    selectedLlmModel,
    isLlmSettingsOpen,
    setIsLlmSettingsOpen,
    llmTemperature,
    setLlmTemperature,
    structuredOutput,
    setStructuredOutput,
    highPriority,
    setHighPriority,
    llmOptions,
    handleLlmChange,
    handleSaveLlmSettings
  };
};
