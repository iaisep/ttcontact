
// This file now imports from the modular implementation
import PostCallAnalysisSection from './post-call-analysis/PostCallAnalysisSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AgentSettingsAccordionProps } from './types';
import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true); // Iniciar con loading=true para mostrar el estado de carga

  // Effect to fetch LLM data and associated knowledge base IDs
  useEffect(() => {
    if (!agent?.response_engine?.llm_id) {
      setLoading(false);
      return;
    }

    const fetchLlmData = async () => {
      try {
        setLoading(true);
        console.log('Fetching LLM data for ID:', agent.response_engine.llm_id);
        
        const llmData = await fetchWithAuth(`/get-retell-llm/${agent.response_engine.llm_id}`);
        console.log('LLM data retrieved:', llmData);
        
        if (llmData && llmData.knowledge_base_ids && Array.isArray(llmData.knowledge_base_ids)) {
          setLlmKnowledgeBaseIds(llmData.knowledge_base_ids);
          console.log('Knowledge base IDs from LLM:', llmData.knowledge_base_ids);

          // If we already have the knowledge bases, filter them
          if (knowledgeBases && knowledgeBases.length > 0) {
            const filtered = knowledgeBases.filter(kb => 
              llmData.knowledge_base_ids.includes(kb.id || kb.knowledge_base_id)
            );
            console.log('Filtered knowledge bases:', filtered);
            setFilteredKnowledgeBases(filtered);
          }
          // Otherwise, fetch the knowledge bases
          else {
            await fetchKnowledgeBases(llmData.knowledge_base_ids);
          }
        } else {
          console.log('No knowledge_base_ids found in LLM data');
          setLlmKnowledgeBaseIds([]);
          setFilteredKnowledgeBases([]);
        }
      } catch (error) {
        console.error('Error fetching LLM data:', error);
        toast.error('Failed to load LLM data');
      } finally {
        setLoading(false);
      }
    };

    fetchLlmData();
  }, [agent?.response_engine?.llm_id, fetchWithAuth, knowledgeBases]);

  // Function to fetch knowledge bases if not provided
  const fetchKnowledgeBases = async (kbIds: string[]) => {
    if (!kbIds || kbIds.length === 0) {
      return;
    }

    try {
      console.log('Fetching all knowledge bases to filter by IDs:', kbIds);
      
      const allKnowledgeBases = await fetchWithAuth('/list-knowledge-bases');
      console.log('All knowledge bases:', allKnowledgeBases);
      
      if (Array.isArray(allKnowledgeBases)) {
        const filtered = allKnowledgeBases.filter(kb => 
          kbIds.includes(kb.knowledge_base_id || kb.id)
        );
        console.log('Filtered knowledge bases:', filtered);
        setFilteredKnowledgeBases(filtered);
      }
    } catch (error) {
      console.error('Error fetching knowledge bases:', error);
      toast.error('Failed to load knowledge bases');
    }
  };

  // Log the incoming knowledge bases to check if they're properly received
  console.log('Knowledge bases in AgentSettingsAccordion:', knowledgeBases);
  console.log('LLM knowledge base IDs:', llmKnowledgeBaseIds);
  console.log('Filtered knowledge bases:', filteredKnowledgeBases);

  // Renderizar un loader mientras se cargan los datos
  const renderKnowledgeBaseContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
    <Accordion type="multiple" className="w-full" defaultValue={["call-settings"]}>
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
