
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';

interface UseLlmSettingsProps {
  initialModel?: string;
  llmId?: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

// Helper function to map API model values to UI-friendly names
const getUiModelName = (apiModelValue: string): string => {
  switch (apiModelValue) {
    case "gpt-4o":
      return 'GPT 4o';
    case "gpt-4o-mini":
      return 'GPT 4o Mini';
    case "gpt-4-turbo":
      return 'GPT-4 Turbo';
    case "gpt-3.5-turbo":
      return 'GPT-3.5 Turbo';
    case "claude-3-opus-20240229":
      return 'Claude 3 Opus';
    case "claude-3-sonnet-20240229":
      return 'Claude 3 Sonnet';
    case "claude-3.5-haiku":
      return 'Claude 3 Haiku';
    case "gemini-1.5-pro":
      return 'Gemini 1.5 Pro';
    case "gemini-1.0-pro":
      return 'Gemini 1.0 Pro';
    case "mistral-7b":
      return 'Mistral 7B';
    case "mixtral-8x7b":
      return 'Mixtral 8x7B';
    default:
      // If model doesn't match any known value, return it as is
      return apiModelValue;
  }
};

// Helper function to map UI model names to API model values
const getApiModelValue = (uiModelName: string): { model: string; s2s_model: null } => {
  // This maps the UI-friendly names to the API values
  // Format required is { model: "gpt-4o", s2s_model: null }
  let modelValue = ["gpt-4o","gpt-4o","gpt-4o"]; // Default value
  
  switch (uiModelName) {
    case 'GPT 4o':
      modelValue = "gpt-4o";
      break;
    case 'GPT 4o Mini':
      modelValue = "gpt-4o-mini";
      break;
    case 'GPT-4 Turbo':
      modelValue = "gpt-4-turbo";
      break;
    case 'GPT-3.5 Turbo':
      modelValue = "gpt-3.5-turbo";
      break;
    case 'Claude 3 Opus':
      modelValue = "claude-3-opus-20240229";
      break;
    case 'Claude 3 Sonnet':
      modelValue = "claude-3-sonnet-20240229";
      break;
    case 'Claude 3 Haiku':
      modelValue = "claude-3.5-haiku";
      break;
    case 'Gemini 1.5 Pro':
      modelValue = "gemini-1.5-pro";
      break;
    case 'Gemini 1.0 Pro':
      modelValue = "gemini-1.0-pro";
      break;
    case 'Mistral 7B':
      modelValue = "mistral-7b";
      break;
    case 'Mixtral 8x7B':
      modelValue = "mixtral-8x7b";
      break;
    default:
      modelValue = uiModelName; // Use as is if not in the map
  }
  
  return {
    model: modelValue,
    s2s_model: null
  };
};

export const useLlmSettings = ({ initialModel = 'GPT 4o', llmId, updateAgentField }: UseLlmSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  const [selectedLlmModel, setSelectedLlmModel] = useState(initialModel);
  const [isLlmSettingsOpen, setIsLlmSettingsOpen] = useState(false);
  const [llmTemperature, setLlmTemperature] = useState(0.0);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  const [llmOptions, setLlmOptions] = useState<{ value: string; label: string }[]>([
  { value: "gpt-4o", label: "GPT 4o" },
  { value: "gpt-4o-mini", label: "GPT 4o Mini" },
  { value: "claude-3-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "claude-3-opus", label: "Claude 3.7 Opus" },
]);

  const [isLoading, setIsLoading] = useState(false);

  // Fetch available LLM models from the API
  useEffect(() => {
    const fetchLlmModels = async () => {
      setIsLoading(true);
      try {
        const response = await fetchWithAuth('/list-retell-llms');
        if (Array.isArray(response)) {
          // Map API model values to UI-friendly names
          const mappedOptions = response.map(llm => getUiModelName(llm.model));
          // Remove duplicates
          const uniqueOptions = Array.from(new Set(mappedOptions));
          setLlmOptions(uniqueOptions);
        }
      } catch (error) {
        console.error('Error fetching LLM models:', error);
        // Set default options in case of error
        setLlmOptions([
          'GPT 4o',
          'GPT 4o Mini',
          'GPT-4 Turbo',
          'GPT-3.5 Turbo',
          'Claude 3 Opus',
          'Claude 3 Sonnet',
          'Claude 3 Haiku',
          'Gemini 1.5 Pro',
          'Gemini 1.0 Pro',
          'Mistral 7B',
          'Mixtral 8x7B'
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLlmModels();
  }, [fetchWithAuth]);

  // Set initial values based on the LLM data
  useEffect(() => {
    if (llmId) {
      const fetchLlmSettings = async () => {
        try {
          const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
          if (llmData) {
            // Set temperature, structured output, and high priority from LLM data
            if (typeof llmData.temperature === 'number') {
              setLlmTemperature(llmData.temperature);
            }
            
            if (typeof llmData.structured_output === 'boolean') {
              setStructuredOutput(llmData.structured_output);
            }
            
            if (typeof llmData.high_priority === 'boolean') {
              setHighPriority(llmData.high_priority);
            }
            
            // Set the selected LLM model using the API model value
            if (llmData.model) {
              const uiModelName = getUiModelName(llmData.model);
              setSelectedLlmModel(uiModelName);
            }
          }
        } catch (error) {
          console.error('Error fetching LLM settings:', error);
        }
      };
      
      fetchLlmSettings();
    }
  }, [llmId, fetchWithAuth]);

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
    handleSaveLlmSettings,
    isLoading
  };
};

