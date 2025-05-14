// This file now imports from the modular implementation
import PostCallAnalysisSection from './post-call-analysis/PostCallAnalysisSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AgentSettingsAccordionProps } from './types';
import React, { useState, useEffect, useCallback } from 'react';
import { useVoiceSettings } from '../hooks/useVoiceSettings';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Import all section components
import CallSettingsSection from './call-settings';
import KnowledgeBaseSection from './knowledge-base';
import SpeechSettingsSection from './SpeechSettingsSection';
import FunctionsSection from './functions';
import SecurityFallbackSection from './SecurityFallbackSection';
import WebhookSettingsSection from './WebhookSettingsSection';

const AgentSettingsAccordion: React.FC<AgentSettingsAccordionProps> = ({
  agent,
  knowledgeBases,
  updateAgentField
}) => {
  // Use the voice settings hook to get voice-related functionality
  const voiceSettings = useVoiceSettings({
    initialVoice: agent?.voice?.name || 'Select a voice',
    updateAgentField
  });

  const { fetchWithAuth } = useApiContext();
  const [llmKnowledgeBaseIds, setLlmKnowledgeBaseIds] = useState<string[]>([]);
  const [filteredKnowledgeBases, setFilteredKnowledgeBases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading=true to show loading state
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Function to fetch LLM data to get knowledge base IDs
  const fetchLlmData = useCallback(async () => {
    if (!agent?.response_engine?.llm_id) {
      console.log('[AgentSettingsAccordion] No LLM ID found in agent data', agent);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadingError(null);
      const llmId = agent.response_engine.llm_id;
      console.log('[AgentSettingsAccordion] Fetching LLM data for ID:', llmId);
      
      const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      console.log('[AgentSettingsAccordion] LLM data retrieved:', llmData);
      
      if (llmData && llmData.knowledge_base_ids && Array.isArray(llmData.knowledge_base_ids)) {
        setLlmKnowledgeBaseIds(llmData.knowledge_base_ids);
        console.log('[AgentSettingsAccordion] Knowledge base IDs from LLM:', llmData.knowledge_base_ids);

        // If we already have the knowledge bases, use them
        if (knowledgeBases && knowledgeBases.length > 0) {
          console.log('[AgentSettingsAccordion] Using provided knowledge bases');
          setFilteredKnowledgeBases(knowledgeBases);
        }
        // Otherwise, fetch the knowledge bases
        else {
          console.log('[AgentSettingsAccordion] No knowledge bases provided, fetching them');
          await fetchKnowledgeBases();
        }
      } else {
        console.log('[AgentSettingsAccordion] No knowledge_base_ids found in LLM data');
        setLlmKnowledgeBaseIds([]);
        // Still set the knowledge bases to show all available ones
        if (knowledgeBases && knowledgeBases.length > 0) {
          setFilteredKnowledgeBases(knowledgeBases);
        } else {
          await fetchKnowledgeBases();
        }
      }
    } catch (error) {
      console.error('[AgentSettingsAccordion] Error fetching LLM data:', error);
      setLoadingError('Failed to load LLM data');
      toast.error('Failed to load LLM data');
    } finally {
      setLoading(false);
    }
  }, [agent?.response_engine?.llm_id, fetchWithAuth, knowledgeBases]);

  // Effect to fetch LLM data when agent is loaded or LLM ID changes
  useEffect(() => {
    fetchLlmData();
  }, [fetchLlmData]);

  // Secondary effect to update filtered knowledge bases when knowledgeBases prop changes
  useEffect(() => {
    if (knowledgeBases && knowledgeBases.length > 0) {
      console.log('[AgentSettingsAccordion] Updated knowledge bases from prop:', knowledgeBases);
      setFilteredKnowledgeBases(knowledgeBases);
    }
  }, [knowledgeBases]);

  // Function to fetch knowledge bases if not provided
  const fetchKnowledgeBases = async () => {
    try {
      console.log('[AgentSettingsAccordion] Fetching all knowledge bases');
      
      const allKnowledgeBases = await fetchWithAuth('/list-knowledge-bases');
      console.log('[AgentSettingsAccordion] All knowledge bases:', allKnowledgeBases);
      
      if (Array.isArray(allKnowledgeBases)) {
        // Format the data consistently
        const formattedData = allKnowledgeBases.map((kb: any) => ({
          id: kb.knowledge_base_id || kb.id,
          name: kb.knowledge_base_name || kb.name,
          created_at: kb.user_modified_timestamp 
            ? new Date(kb.user_modified_timestamp).toISOString() 
            : kb.created_at,
          sources: kb.knowledge_base_sources || []
        }));
        
        console.log('[AgentSettingsAccordion] Formatted knowledge bases:', formattedData);
        setFilteredKnowledgeBases(formattedData);
      }
    } catch (error) {
      console.error('[AgentSettingsAccordion] Error fetching knowledge bases:', error);
      toast.error('Failed to load knowledge bases');
    }
  };

  // Debug logs
  useEffect(() => {
    console.log('[AgentSettingsAccordion] Knowledge bases in AgentSettingsAccordion:', knowledgeBases);
    console.log('[AgentSettingsAccordion] LLM knowledge base IDs:', llmKnowledgeBaseIds);
    console.log('[AgentSettingsAccordion] Filtered knowledge bases:', filteredKnowledgeBases);
    
    // Update agent with LLM knowledge base IDs if they don't exist already
    if (llmKnowledgeBaseIds.length > 0 && (!agent.knowledge_base_ids || agent.knowledge_base_ids.length === 0)) {
      console.log('[AgentSettingsAccordion] Setting agent knowledge_base_ids from LLM:', llmKnowledgeBaseIds);
      updateAgentField('knowledge_base_ids', llmKnowledgeBaseIds);
    }
  }, [llmKnowledgeBaseIds, knowledgeBases, filteredKnowledgeBases, agent, updateAgentField]);

  // Render a loader while loading data
  const renderKnowledgeBaseContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }
    
    if (loadingError) {
      return (
        <div className="p-4 text-center">
          <p className="text-red-500">{loadingError}</p>
          <button 
            className="mt-2 px-4 py-2 bg-primary text-white rounded"
            onClick={() => {
              // Re-fetch data on button click
              if (agent?.response_engine?.llm_id) {
                setLoading(true);
                fetchLlmData();
              }
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    
    return (
      <KnowledgeBaseSection 
        agent={agent} 
        updateAgentField={updateAgentField} 
        knowledgeBases={filteredKnowledgeBases.length > 0 ? filteredKnowledgeBases : knowledgeBases} 
      />
    );
  };

  return (
    <Accordion type="multiple" className="w-full">
      {/* Voice section is now hidden */}
      
      <AccordionItem value="call-settings">
        <AccordionTrigger className="hover:no-underline">Call Settings</AccordionTrigger>
        <AccordionContent>
          <CallSettingsSection agent={agent} updateAgentField={updateAgentField} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="knowledge-base">
        <AccordionTrigger className="hover:no-underline">Knowledge Base</AccordionTrigger>
        <AccordionContent>
          {renderKnowledgeBaseContent()}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="speech-settings">
        <AccordionTrigger className="hover:no-underline">Speech Settings</AccordionTrigger>
        <AccordionContent>
          <SpeechSettingsSection agent={agent} updateAgentField={updateAgentField} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="functions">
        <AccordionTrigger className="hover:no-underline">Functions</AccordionTrigger>
        <AccordionContent>
          <FunctionsSection agent={agent} updateAgentField={updateAgentField} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="security-fallback">
        <AccordionTrigger className="hover:no-underline">Security & Fallback</AccordionTrigger>
        <AccordionContent>
          <SecurityFallbackSection agent={agent} updateAgentField={updateAgentField} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="post-call-analysis">
        <AccordionTrigger className="hover:no-underline">Post-Call Analysis</AccordionTrigger>
        <AccordionContent>
          <PostCallAnalysisSection agent={agent} updateAgentField={updateAgentField} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="webhooks">
        <AccordionTrigger className="hover:no-underline">Webhooks</AccordionTrigger>
        <AccordionContent>
          <WebhookSettingsSection agent={agent} updateAgentField={updateAgentField} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AgentSettingsAccordion;
