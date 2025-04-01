
import { useState } from 'react';
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
  
  const [isLlmSettingsOpen, setIsLlmSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [llmTemperature, setLlmTemperature] = useState(0.7);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  
  // Fetch LLM data when llmId changes
  const fetchLlmData = async () => {
    if (!llmId) return;
    
    try {
      const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      if (llmData && llmData.model) {
        setSelectedModel(llmData.model);
        
        // Set other LLM settings if available
        if (llmData.temperature !== undefined) {
          setLlmTemperature(llmData.temperature);
        }
        if (llmData.structured_output !== undefined) {
          setStructuredOutput(llmData.structured_output);
        }
        if (llmData.high_priority !== undefined) {
          setHighPriority(llmData.high_priority);
        }
      }
    } catch (error) {
      console.error('Error fetching LLM data:', error);
    }
  };

  // Handle LLM change
  const handleLlmChange = async (newLlmId: string) => {
    setSelectedModel(newLlmId);
    // The actual API call is handled in the LlmSelector component
  };

  // Handle saving LLM settings
  const handleSaveLlmSettings = async () => {
    if (!llmId) return;
    
    try {
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          temperature: llmTemperature,
          structured_output: structuredOutput,
          high_priority: highPriority
        })
      });
      
      setIsLlmSettingsOpen(false);
      toast.success(t('llm_settings_updated'));
    } catch (error) {
      console.error('Error updating LLM settings:', error);
      toast.error(t('error_updating_llm_settings'));
    }
  };

  return {
    selectedModel,
    isLlmSettingsOpen,
    setIsLlmSettingsOpen,
    llmTemperature,
    setLlmTemperature,
    structuredOutput,
    setStructuredOutput,
    highPriority,
    setHighPriority,
    handleLlmChange,
    handleSaveLlmSettings,
    fetchLlmData
  };
};
