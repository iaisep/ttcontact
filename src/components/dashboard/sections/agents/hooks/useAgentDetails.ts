
import { useState, useEffect, useCallback } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { RetellAgent, RetellVoice, RetellLLM } from '../types/retell-types';

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface AgentDetailsState {
  agent: RetellAgent | null;
  llm: RetellLLM | null;
  voice: RetellVoice | null;
  knowledgeBases: KnowledgeBase[];
  availableVoices: RetellVoice[];
  isLoading: boolean;
  error: string | null;
}

export const useAgentDetails = (agentId: string | undefined) => {
  const { fetchWithAuth } = useApiContext();
  const { t } = useLanguage();
  const [state, setState] = useState<AgentDetailsState>({
    agent: null,
    llm: null,
    voice: null,
    knowledgeBases: [],
    isLoading: false,
    error: null,
    availableVoices: []
  });

  const fetchAgentData = useCallback(async () => {
    if (!agentId) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Step 1: Fetch the agent details using fetchWithAuth
      const agentData = await fetchWithAuth(`/get-agent/${agentId}`);
      
      // Ensure we have a consistent agent object format
      const formattedAgent = {
        ...agentData,
        agent_id: agentData.agent_id || agentData.id,
        agent_name: agentData.agent_name || agentData.name
      };
      
      setState(prev => ({ ...prev, agent: formattedAgent }));
      
      // Extract IDs needed for subsequent requests
      const llmId = formattedAgent.response_engine?.llm_id;
      const voiceId = formattedAgent.voice_id;
      const knowledgeBaseIds = formattedAgent.knowledge_base_ids || [];
      
      // Step 2: Fetch LLM, voice, and knowledge bases in parallel using fetchWithAuth
      const [llmData, voiceData, allKnowledgeBases, voicesList] = await Promise.all([
        llmId ? fetchWithAuth(`/get-retell-llm/${llmId}`) : null,
        voiceId ? fetchWithAuth(`/get-voice/${voiceId}`) : null,
        fetchWithAuth('/list-knowledge-bases'),
        fetchWithAuth('/list-voices') 
      ]);
      
      // If the LLM data doesn't contain the ID, add it from the agent
      if (llmData && llmId && !llmData.id) {
        llmData.id = llmId;
      }
      
      // Filter knowledge bases to only include those associated with the agent
      const agentKnowledgeBases = Array.isArray(allKnowledgeBases) 
        ? allKnowledgeBases.filter((kb: KnowledgeBase) => 
            knowledgeBaseIds.includes(kb.id))
        : [];
      
      // Update state with all fetched data
      setState(prev => ({
        ...prev,
        llm: llmData,
        voice: voiceData,
        knowledgeBases: agentKnowledgeBases,
        availableVoices: voicesList ?? [],
        isLoading: false
      }));
      
    } catch (error) {
      console.error('Error fetching agent details:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: t('error_loading_agent_details') 
      }));
      toast.error(t('error_loading_agent_details'));
    }
  }, [agentId, fetchWithAuth, t]);

  // Only fetch agent data on initial load and when agent ID changes
  useEffect(() => {
    fetchAgentData();
  }, [agentId, fetchAgentData]);

  // Method to update agent data without full refresh
  const updateAgentField = async (fieldName: string, value: any) => {
    if (!state.agent) return;
    
    try {
      // Create a copy of the agent with the updated field
      const updatedAgent = {
        ...state.agent,
        [fieldName]: value
      };
      
      // Update local state immediately for responsiveness
      setState(prev => ({
        ...prev,
        agent: updatedAgent
      }));
      
      // Handle special case for voice_id which requires fetching voice details
      if (fieldName === 'voice_id' && value) {
        try {
          const voiceData = await fetchWithAuth(`/get-voice/${value}`);
          if (voiceData) {
            setState(prev => ({
              ...prev,
              voice: voiceData
            }));
          }
        } catch (error) {
          console.error('Error fetching voice details:', error);
        }
      }
      
      // Send the update to the server in the background
      await fetchWithAuth(`/update-agent/${state.agent.agent_id || state.agent.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ [fieldName]: value })
      });
      
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      toast.error(t('error_updating_field'));
      
      // Revert to previous state in case of error
      fetchAgentData();
    }
  };

  return {
    ...state,
    refreshData: fetchAgentData,
    updateAgentField
  };
};
