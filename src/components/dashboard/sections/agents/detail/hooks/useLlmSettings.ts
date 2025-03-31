
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';

interface UseLlmSettingsProps {
  initialModel?: string;
  llmId?: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

// Helper function to map UI model names to API model values
const getApiModelValue = (uiModelName: string): { s2s_model: string; model: null } => {
  // This maps the UI-friendly names to the API values
  // For all models we're currently setting s2s_model to "gpt-4o-realtime" and model to null
  // according to the requirement
  return {
    s2s_model: "gpt-4o-realtime",
    model: null
  };
};

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
    try {
      if (llmId) {
        toast.loading('Updating LLM model...');
        
        // Get the API model value based on UI selection
        const modelPayload = getApiModelValue(llm);
        
        // Update the LLM using the update-retell-llm endpoint with PATCH method
        await fetchWithAuth(`/update-retell-llm/${llmId}`, {
          method: 'PATCH',
          body: JSON.stringify(modelPayload)
        });
        
        // Fetch the updated LLM data to ensure changes are reflected
        await fetchWithAuth(`/get-retell-llm/${llmId}`);
        
        // Just update the local state without updating the agent
        setSelectedLlmModel(llm);
        toast.success('LLM model updated successfully');
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
        await fetchWithAuth(`/get-retell-llm/${llmId}`);
        
        // Update agent fields only for temperature, structured output and high priority
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
