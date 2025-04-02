
import { useState, useCallback, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

interface UseLlmSettingsProps {
  llmId: string | undefined;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useLlmSettings = ({ llmId, updateAgentField }: UseLlmSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  const { t } = useLanguage();
  
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [llmTemperature, setLlmTemperature] = useState<number>(0.7);
  const [structuredOutput, setStructuredOutput] = useState<boolean>(false);
  const [highPriority, setHighPriority] = useState<boolean>(false);
  const [isLlmSettingsOpen, setIsLlmSettingsOpen] = useState<boolean>(false);
  
  // Fetch LLM data when llmId changes
  const fetchLlmData = useCallback(async () => {
    if (!llmId) return;
    
    try {
      const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      if (llmData && llmData.model) {
        setSelectedModel(llmData.model);
        
        // Set other LLM settings if available
        if (llmData.model_temperature !== undefined) {
          setLlmTemperature(llmData.model_temperature);
        }
        if (llmData.tool_call_strict_mode !== undefined) {
          setStructuredOutput(llmData.tool_call_strict_mode);
        }
        if (llmData.model_high_priority !== undefined) {
          setHighPriority(llmData.model_high_priority);
        }
      }
    } catch (error) {
      console.error('Error fetching LLM data:', error);
    }
  }, [llmId, fetchWithAuth]);

  // Initial fetch when component mounts
  useEffect(() => {
    fetchLlmData();
  }, [fetchLlmData]);

  // Handle LLM change
  const handleLlmChange = async (newLlmId: string) => {
    setSelectedModel(newLlmId);
    // The actual API call is handled in the LlmSelector component
    return Promise.resolve();
  };

  return {
    selectedModel,
    llmTemperature,
    setLlmTemperature,
    structuredOutput,
    setStructuredOutput,
    highPriority,
    setHighPriority,
    handleLlmChange,
    fetchLlmData,
    isLlmSettingsOpen,
    setIsLlmSettingsOpen
  };
};
