
import { useState, useEffect } from 'react';
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
    error: null
  });

  useEffect(() => {
    if (!agentId) return;

    const fetchAgentDetails = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // Step 1: Fetch the agent details using fetchWithAuth
        const agentData = await fetchWithAuth(`/get-agent/${agentId}`);
        setState(prev => ({ ...prev, agent: agentData }));
        
        // Extract IDs needed for subsequent requests
        const llmId = agentData.response_engine?.llm_id;
        const voiceId = agentData.voice_id;
        const knowledgeBaseIds = agentData.knowledge_base_ids || [];
        
        // Step 2: Fetch LLM, voice, and knowledge bases in parallel using fetchWithAuth
        const [llmData, voiceData, allKnowledgeBases] = await Promise.all([
          llmId ? fetchWithAuth(`/get-retell-llm/${llmId}`) : null,
          voiceId ? fetchWithAuth(`/get-voice/${voiceId}`) : null,
          fetchWithAuth('/list-knowledge-bases')
        ]);
        
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
    };

    fetchAgentDetails();
  }, [agentId, fetchWithAuth, t]);

  return state;
};
