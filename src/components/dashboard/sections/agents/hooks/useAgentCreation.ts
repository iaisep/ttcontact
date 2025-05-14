
import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

export const useAgentCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { fetchWithAuth } = useApiContext();

  const createSinglePromptAgent = async (agentName = "Single-Prompt Agent") => {
    try {
      setIsCreating(true);
      
      // Step 1: Create the LLM
      const llmResponse = await fetchWithAuth('/create-retell-llm', {
        method: 'POST',
        body: JSON.stringify({
          begin_message: "",
          model: "gpt-4.1"
        })
      });
      
      // Make sure we have a valid LLM response with an ID before proceeding
      if (!llmResponse) {
        throw new Error('Failed to create LLM. No response received.');
      }
      
      console.log('LLM creation response:', llmResponse);
      
      // Check if llm_id exists in the response
      const llmId = llmResponse.llm_id;
      if (!llmId) {
        throw new Error('Failed to create LLM. No ID returned in response.');
      }
      
      // Step 2: Create the Agent
      const agentResponse = await fetchWithAuth('/create-agent', {
        method: 'POST',
        body: JSON.stringify({
          agent_name: agentName,
          voice_id: "11labs-Cimo",
          interruption_sensitivity: 0.8,
          response_engine: {
            type: "retell-llm",
            llm_id: llmId,
            version: 0
          }
        })
      });
      
      if (!agentResponse || !agentResponse.agent_id) {
        throw new Error('Failed to create agent. No agent ID returned.');
      }
      
      toast.success('Agent created successfully');
      
      return agentResponse;
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent. Please try again.');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createSinglePromptAgent,
    isCreating
  };
};
