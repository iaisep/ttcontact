
import { useState, useCallback } from 'react';

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

  // Handler for saving LLM settings
  const handleSaveLlmSettings = useCallback(() => {
    if (!llmId) return;
    
    // En una implementación real, aquí actualizaríamos también el campo "llm_id"
    updateAgentField('response_engine', {
      llm_id: llmId,
      temperature: llmTemperature,
      structured_output: structuredOutput,
      high_priority: highPriority
    });
  }, [llmId, llmTemperature, structuredOutput, highPriority, updateAgentField]);

  return {
    isLlmSettingsOpen,
    setIsLlmSettingsOpen,
    llmTemperature,
    setLlmTemperature,
    structuredOutput,
    setStructuredOutput,
    highPriority,
    setHighPriority,
    handleSaveLlmSettings
  };
};
