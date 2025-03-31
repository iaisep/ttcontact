
import { useState } from 'react';
import { toast } from 'sonner';

interface UseLlmSettingsProps {
  initialModel?: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useLlmSettings = ({ initialModel = 'GPT 4o', updateAgentField }: UseLlmSettingsProps) => {
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

  const handleLlmChange = (llm: string) => {
    setSelectedLlmModel(llm);
    updateAgentField('llm_model', llm);
  };

  const handleSaveLlmSettings = () => {
    updateAgentField('llm_temperature', llmTemperature);
    updateAgentField('structured_output', structuredOutput);
    updateAgentField('high_priority', highPriority);
    toast.success('LLM settings saved');
    setIsLlmSettingsOpen(false);
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
