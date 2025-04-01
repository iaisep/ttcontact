import { useEffect, useState } from "react";

export interface LlmOption {
  displayName: string;
  model: string;
  provider: string;
  isRealtime?: boolean;
  pricing?: string;
}

export const useLlmSettings = () => {
  const [llmOptions] = useState<LlmOption[]>([
    { displayName: "GPT 4o", model: "gpt-4o", provider: "openai" },
    { displayName: "GPT 4o Mini", model: "gpt-4o-mini", provider: "openai" },
    { displayName: "Claude 3 Opus", model: "claude-3-opus-20240229", provider: "anthropic" },
    { displayName: "Claude 3 Sonnet", model: "claude-3-sonnet-20240229", provider: "anthropic" },
  ]);

  const [selectedLlmOption, setSelectedLlmOption] = useState<LlmOption | null>(null);
  const [llmData, setLlmData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCurrentLlm = async () => {
    try {
      const res = await fetch("/get-retell-llm/");
      const data = await res.json();
      setLlmData(data);

      const matchedOption = llmOptions.find(opt => opt.model === data.model);
      if (matchedOption) {
        setSelectedLlmOption(matchedOption);
      }
    } catch (err) {
      console.error("Error fetching LLM:", err);
    }
  };

  const handleModelChange = async (option: LlmOption) => {
    setLoading(true);
    try {
      await fetch("/update-retell-llm/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: option.model,
          s2s_model: null
        })
      });
      await fetchCurrentLlm(); // Refresh info
    } catch (err) {
      console.error("Error updating LLM:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentLlm();
  }, []);

  return {
    llmOptions,
    selectedLlmOption,
    llmData,
    loading,
    handleModelChange
  };
};

