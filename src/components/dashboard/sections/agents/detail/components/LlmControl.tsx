import React from 'react';
import LlmSelector from './LlmSelector';
import { useLlmSettings } from './useLlmSettings';

const LlmControl = () => {
  const {
    llmOptions,
    selectedLlmOption,
    llmData,
    handleModelChange,
    loading
  } = useLlmSettings();

  return (
    <div className="flex gap-4 items-start">
      <div>
        <LlmSelector
          llmOptions={llmOptions}
          selectedLlmOption={selectedLlmOption}
          handleModelChange={handleModelChange}
          isLoadingLlmOptions={loading}
        />
      </div>
      <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded border w-[400px]">
        <pre className="whitespace-pre-wrap text-xs">
          {llmData ? JSON.stringify(llmData, null, 2) : "Cargando modelo..."}
        </pre>
      </div>
    </div>
  );
};

export default LlmControl;
