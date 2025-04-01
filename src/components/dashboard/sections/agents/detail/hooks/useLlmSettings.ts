
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';

export interface LlmOption {
  displayName: string;
  model: string;
  provider: 'openai' | 'anthropic' | 'google' | 'mistral';
  isRealtime?: boolean;
  pricing?: string;
}

// Define the props interface
interface UseLlmSettingsProps {
  initialModel?: string;
  llmId?: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

const DEFAULT_LLM_OPTIONS: LlmOption[] = [
  {
    displayName: 'GPT 4o Realtime',
    model: 'gpt-4o',
    provider: 'openai',
    isRealtime: true,
    pricing: '($0.5/min)'
  },
  {
    displayName: 'GPT 4o',
    model: 'gpt-4o',
    provider: 'openai',
    pricing: '($0.05/min)'
  },
  {
    displayName: 'GPT 4o mini Realtime',
    model: 'gpt-4o-mini',
    provider: 'openai',
    isRealtime: true,
    pricing: '($0.125/min)'
  },
  {
    displayName: 'GPT 4o mini',
    model: 'gpt-4o-mini',
    provider: 'openai',
    pricing: '($0.005/min)'
  },
  {
    displayName: 'Claude 3.7 Sonnet',
    model: 'claude-3-sonnet-20240229',
    provider: 'anthropic',
    pricing: '($0.06/min)'
  },
  {
    displayName: 'Claude 3.5 Haiku',
    model: 'claude-3.5-haiku',
    provider: 'anthropic',
    pricing: '($0.02/min)'
  },
  {
    displayName: 'Gemini 1.5 Pro',
    model: 'gemini-1.5-pro',
    provider: 'google'
  },
  {
    displayName: 'Mistral 7B',
    model: 'mistral-7b',
    provider: 'mistral'
  }
];

const findOptionByModel = (modelValue: string, options: LlmOption[]): LlmOption => {
  const exactMatch = options.find(opt => opt.model === modelValue);
  if (exactMatch) return exactMatch;
  
  const partialMatch = options.find(opt => 
    modelValue.includes(opt.model) || 
    opt.model.includes(modelValue)
  );
  
  return partialMatch || options[0];
};

export const useLlmSettings = ({ initialModel = 'gpt-4o', llmId, updateAgentField }: UseLlmSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  
  const [llmOptions, setLlmOptions] = useState<LlmOption[]>(DEFAULT_LLM_OPTIONS);
  const [selectedLlmOption, setSelectedLlmOption] = useState<LlmOption>(
    findOptionByModel(initialModel, DEFAULT_LLM_OPTIONS)
  );
  
  const [isLlmSettingsOpen, setIsLlmSettingsOpen] = useState(false);
  const [llmTemperature, setLlmTemperature] = useState(0.0);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLlmModels = async () => {
      setIsLoading(true);
      try {
        const response = await fetchWithAuth('/list-retell-llms');
        
        if (Array.isArray(response)) {
          const apiModels = response.map(llm => llm.model);
          const updatedOptions = [...DEFAULT_LLM_OPTIONS];
          
          apiModels.forEach(apiModel => {
            if (!updatedOptions.some(opt => opt.model === apiModel)) {
              let provider: 'openai' | 'anthropic' | 'google' | 'mistral' = 'openai';
              if (apiModel.includes('claude')) provider = 'anthropic';
              else if (apiModel.includes('gemini')) provider = 'google';
              else if (apiModel.includes('mistral')) provider = 'mistral';
              
              updatedOptions.push({
                displayName: apiModel,
                model: apiModel,
                provider
              });
            }
          });
          
          setLlmOptions(updatedOptions);
        }
      } catch (error) {
        console.error('Error fetching LLM models:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLlmModels();
  }, [fetchWithAuth]);

  useEffect(() => {
    if (llmId) {
      const fetchLlmSettings = async () => {
        try {
          const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
          if (llmData) {
            if (typeof llmData.temperature === 'number') {
              setLlmTemperature(llmData.temperature);
            }
            
            if (typeof llmData.structured_output === 'boolean') {
              setStructuredOutput(llmData.structured_output);
            }
            
            if (typeof llmData.high_priority === 'boolean') {
              setHighPriority(llmData.high_priority);
            }
            
            if (llmData.model) {
              const matchedOption = findOptionByModel(llmData.model, llmOptions);
              setSelectedLlmOption(matchedOption);
            }
          }
        } catch (error) {
          console.error('Error fetching LLM settings:', error);
        }
      };
      
      fetchLlmSettings();
    }
  }, [llmId, fetchWithAuth, llmOptions]);

  const handleModelChange = async (option: LlmOption) => {
    if (!llmId) {
      setSelectedLlmOption(option);
      return;
    }

    try {
      toast.loading(`Updating to ${option.displayName}...`);
      
      const modelPayload = {
        model: option.model,
        s2s_model: null
      };
      
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify(modelPayload)
      });
      
      setSelectedLlmOption(option);
      toast.success(`Updated to ${option.displayName}`);
    } catch (error) {
      console.error('Error updating LLM model:', error);
      toast.error('Failed to update LLM model');
    }
  };

  const handleSaveLlmSettings = async () => {
    try {
      if (llmId) {
        toast.loading('Saving LLM settings...');
        
        await fetchWithAuth(`/update-retell-llm/${llmId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            temperature: llmTemperature,
            structured_output: structuredOutput,
            high_priority: highPriority
          })
        });
        
        updateAgentField('llm_temperature', llmTemperature);
        updateAgentField('structured_output', structuredOutput);
        updateAgentField('high_priority', highPriority);
        
        toast.success('LLM settings saved successfully');
      } else {
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
    handleModelChange,
    handleSaveLlmSettings,
    isLoading
  };
};
