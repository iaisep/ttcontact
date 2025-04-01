
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';

export interface LlmOption {
  displayName: string;
  model: string;
  provider: 'openai' | 'anthropic' | 'google' | 'mistral';
  pricing?: string;
  isRealtime?: boolean;
}

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

// Helper function to determine provider based on model name
const getProviderFromModel = (model: string): 'openai' | 'anthropic' | 'google' | 'mistral' => {
  if (model.startsWith('gpt')) {
    return 'openai';
  } else if (model.startsWith('claude')) {
    return 'anthropic';
  } else if (model.startsWith('gemini')) {
    return 'google';
  } else if (model.startsWith('mistral') || model.startsWith('mixtral')) {
    return 'mistral';
  }
  // Default to OpenAI if we can't determine
  return 'openai';
};

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

// Convert model name to LlmOption with provider info
const createLlmOption = (model: string, isRealtime: boolean = false): LlmOption => {
  const displayName = getUiModelName(model);
  const provider = getProviderFromModel(model);
  
  return {
    displayName,
    model,
    provider,
    isRealtime
  };
};

export const useLlmSettings = ({ initialModel = 'gpt-4o', llmId, updateAgentField }: UseLlmSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  const [selectedLlmOption, setSelectedLlmOption] = useState<LlmOption>({
    displayName: getUiModelName(initialModel),
    model: initialModel,
    provider: getProviderFromModel(initialModel)
  });
  const [isLlmSettingsOpen, setIsLlmSettingsOpen] = useState(false);
  const [llmTemperature, setLlmTemperature] = useState(0.0);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  const [llmOptions, setLlmOptions] = useState<LlmOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available LLM models from the API
  useEffect(() => {
    const fetchLlmModels = async () => {
      setIsLoading(true);
      try {
        const response = await fetchWithAuth('/list-retell-llms');
        if (Array.isArray(response)) {
          // Map API model values to UI-friendly LlmOptions with provider info
          const mappedOptions = response.map(llm => createLlmOption(llm.model));
          // Remove duplicates based on model name
          const uniqueOptions = mappedOptions.filter((option, index, self) => 
            index === self.findIndex(o => o.model === option.model)
          );
          setLlmOptions(uniqueOptions);
        }
      } catch (error) {
        console.error('Error fetching LLM models:', error);
        // Set default options in case of error
        setLlmOptions([
          createLlmOption("gpt-4o"),
          createLlmOption("gpt-4o-mini"),
          createLlmOption("gpt-4-turbo"),
          createLlmOption("gpt-3.5-turbo"),
          createLlmOption("claude-3-opus-20240229"),
          createLlmOption("claude-3-sonnet-20240229"),
          createLlmOption("claude-3.5-haiku"),
          createLlmOption("gemini-1.5-pro"),
          createLlmOption("gemini-1.0-pro"),
          createLlmOption("mistral-7b"),
          createLlmOption("mixtral-8x7b")
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
              setSelectedLlmOption(createLlmOption(llmData.model));
            }
          }
        } catch (error) {
          console.error('Error fetching LLM settings:', error);
        }
      };
      
      fetchLlmSettings();
    }
  }, [llmId, fetchWithAuth]);

  const handleLlmChange = async (option: LlmOption) => {
    try {
      if (llmId) {
        toast.loading('Updating LLM model...');
        
        // Get the API model value based on UI selection
        const modelPayload = {
          model: option.model,
          s2s_model: null
        };
        
        // Update the LLM using the update-retell-llm endpoint with PATCH method
        await fetchWithAuth(`/update-retell-llm/${llmId}`, {
          method: 'PATCH',
          body: JSON.stringify(modelPayload)
        });
        
        // Fetch the updated LLM data to ensure changes are reflected
        await fetchWithAuth(`/get-retell-llm/${llmId}`);
        
        // Just update the local state without updating the agent
        setSelectedLlmOption(option);
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
    selectedLlmOption,
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
