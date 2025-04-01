
import { useState, useCallback, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

interface UseLlmSettingsProps {
  llmId: string | undefined;
  updateAgentField: (field: string, value: any) => void;
}

export const useLlmSettings = ({ llmId, updateAgentField }: UseLlmSettingsProps) => {
  // State for LLM settings
  const [isLlmSettingsOpen, setIsLlmSettingsOpen] = useState(false);
  const [llmTemperature, setLlmTemperature] = useState(0.7);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  
  const { fetchWithAuth } = useApiContext();
  const { t } = useLanguage();

  // Fetch LLM model on load and when llmId changes
  useEffect(() => {
    const fetchLlmModel = async () => {
      if (!llmId) return;
      
      try {
        const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
        if (llmData && llmData.model) {
          setSelectedModel(llmData.model);
        }
        
        // Update other LLM settings if available
        if (llmData && llmData.temperature !== undefined) {
          setLlmTemperature(llmData.temperature);
        }
        
        if (llmData && llmData.structured_output !== undefined) {
          setStructuredOutput(llmData.structured_output);
        }
        
        if (llmData && llmData.high_priority !== undefined) {
          setHighPriority(llmData.high_priority);
        }
      } catch (error) {
        console.error('Error fetching LLM model:', error);
        toast.error(t('error_fetching_llm_model'));
      }
    };
    
    fetchLlmModel();
  }, [llmId, fetchWithAuth, t]);

  // Handler for saving LLM settings
  const handleSaveLlmSettings = useCallback(() => {
    if (!llmId) return;
    
    // Update the agent's response engine with the current settings
    updateAgentField('response_engine', {
      llm_id: llmId,
      temperature: llmTemperature,
      structured_output: structuredOutput,
      high_priority: highPriority
    });
    
    toast.success(t('llm_settings_saved'));
  }, [llmId, llmTemperature, structuredOutput, highPriority, updateAgentField, t]);

  // Handler for changing the LLM
  const handleLlmChange = useCallback((newLlmId: string) => {
    // Update the agent's response engine with the new LLM ID
    updateAgentField('response_engine', {
      llm_id: newLlmId,
      temperature: llmTemperature,
      structured_output: structuredOutput,
      high_priority: highPriority
    });
    
    // Refresh the LLM model data
    const fetchLlmModel = async () => {
      try {
        const llmData = await fetchWithAuth(`/get-retell-llm/${newLlmId}`);
        if (llmData && llmData.model) {
          setSelectedModel(llmData.model);
        }
      } catch (error) {
        console.error('Error fetching updated LLM model:', error);
      }
    };
    
    fetchLlmModel();
  }, [fetchWithAuth, llmTemperature, structuredOutput, highPriority, updateAgentField]);

  return {
    isLlmSettingsOpen,
    setIsLlmSettingsOpen,
    llmTemperature,
    setLlmTemperature,
    structuredOutput,
    setStructuredOutput,
    highPriority,
    setHighPriority,
    selectedModel,
    handleLlmChange,
    handleSaveLlmSettings
  };
};
