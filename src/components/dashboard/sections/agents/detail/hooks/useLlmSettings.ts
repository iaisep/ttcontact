
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';

interface UseLlmSettingsProps {
  llmId?: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useLlmSettings = ({ llmId, updateAgentField }: UseLlmSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  const [isLlmSettingsOpen, setIsLlmSettingsOpen] = useState(false);
  const [llmTemperature, setLlmTemperature] = useState(0.0);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch LLM settings when the component mounts
  useEffect(() => {
    if (llmId) {
      const fetchLlmSettings = async () => {
        setIsLoading(true);
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
          }
        } catch (error) {
          console.error('Error fetching LLM settings:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchLlmSettings();
    }
  }, [llmId, fetchWithAuth]);

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
    isLlmSettingsOpen,
    setIsLlmSettingsOpen,
    llmTemperature,
    setLlmTemperature,
    structuredOutput,
    setStructuredOutput,
    highPriority,
    setHighPriority,
    handleSaveLlmSettings,
    isLoading
  };
};
