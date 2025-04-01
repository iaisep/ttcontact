
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';

interface UseLlmSettingsProps {
  initialModel?: string;
  llmId?: string;
  updateAgentField: (fieldName: string, value: any) => void;
  availableLlms?: { name: string; model: string }[];
}

// Helper function to map UI model names to API model values
const getApiModelValue = (uiModelName: string): { model: string; s2s_model: null } => {
  // This maps the UI-friendly names to the API values
  // Format required is { model: "gpt-4o", s2s_model: null }
  let modelValue = "gpt-4o"; // Default value
  
  switch (uiModelName) {
    case 'GPT 4o':
      modelValue = "gpt-4o";
      break;
    case 'GPT 4o Mini':
      modelValue = "gpt-4o-mini";
      break;
    case 'Claude 3 Opus':
      modelValue = "claude-3-opus-20240229";
      break;
    case 'Claude 3 Sonnet':
      modelValue = "claude-3-sonnet-20240229";
      break;
    default:
      // Check if the uiModelName is actually the API model value itself
      if (uiModelName && uiModelName.includes('-')) {
        modelValue = uiModelName;
      } else {
        modelValue = "gpt-4o"; // Default to GPT-4o if no match
      }
  }
  
  return {
    model: modelValue,
    s2s_model: null
  };
};

// Helper function to get the display name for an API model value
const getDisplayName = (apiModelValue: string): string => {
  switch (apiModelValue) {
    case "gpt-4o":
      return 'GPT 4o';
    case "gpt-4o-mini":
      return 'GPT 4o Mini';
    case "claude-3-opus-20240229":
      return 'Claude 3 Opus';
    case "claude-3-sonnet-20240229":
      return 'Claude 3 Sonnet';
    default:
      return apiModelValue; // Return the API value itself if no match
  }
};

export const useLlmSettings = ({ 
  initialModel = 'GPT 4o', 
  llmId, 
  updateAgentField,
  availableLlms = []
}: UseLlmSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  const [selectedLlmModel, setSelectedLlmModel] = useState(initialModel);
  const [isLlmSettingsOpen, setIsLlmSettingsOpen] = useState(false);
  const [llmTemperature, setLlmTemperature] = useState(0.0);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [highPriority, setHighPriority] = useState(false);

  // Generate LLM options from available LLMs
  const llmOptions = availableLlms.length > 0 
    ? availableLlms.map(llm => getDisplayName(llm.model))
    : [
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
