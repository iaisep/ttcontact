import React from 'react';
import { LlmOption } from './useLlmSettings';

interface Props {
  llmOptions: LlmOption[];
  selectedLlmOption: LlmOption | null;
  handleModelChange: (model: LlmOption) => void;
  isLoadingLlmOptions: boolean;
}

const LlmSelector: React.FC<Props> = ({
  llmOptions,
  selectedLlmOption,
  handleModelChange,
  isLoadingLlmOptions
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="llm-model" className="text-sm font-semibold">Selecciona modelo LLM:</label>
      <select
        id="llm-model"
        className="border px-2 py-1 rounded text-sm"
        value={selectedLlmOption?.model || ''}
        onChange={(e) => {
          const selected = llmOptions.find(opt => opt.model === e.target.value);
          if (selected) handleModelChange(selected);
        }}
        disabled={isLoadingLlmOptions}
      >
        {llmOptions.map(option => (
          <option key={option.model} value={option.model}>
            {option.displayName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LlmSelector;
