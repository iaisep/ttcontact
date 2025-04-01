
import React from 'react';
import LlmSettingsPopover from './LlmSettingsPopover';

interface LlmControlProps {
  isLlmSettingsOpen: boolean;
  setIsLlmSettingsOpen: (open: boolean) => void;
  llmTemperature: number;
  setLlmTemperature: (temp: number) => void;
  structuredOutput: boolean;
  setStructuredOutput: (structured: boolean) => void;
  highPriority: boolean;
  setHighPriority: (priority: boolean) => void;
  handleSaveLlmSettings: () => void;
}

const LlmControl: React.FC<LlmControlProps> = ({
  isLlmSettingsOpen,
  setIsLlmSettingsOpen,
  llmTemperature,
  setLlmTemperature,
  structuredOutput,
  setStructuredOutput,
  highPriority,
  setHighPriority,
  handleSaveLlmSettings,
}) => {
  return (
    <LlmSettingsPopover
      isLlmSettingsOpen={isLlmSettingsOpen}
      setIsLlmSettingsOpen={setIsLlmSettingsOpen}
      llmTemperature={llmTemperature}
      setLlmTemperature={setLlmTemperature}
      structuredOutput={structuredOutput}
      setStructuredOutput={setStructuredOutput}
      highPriority={highPriority}
      setHighPriority={setHighPriority}
      handleSaveLlmSettings={handleSaveLlmSettings}
    />
  );
};

export default LlmControl;
