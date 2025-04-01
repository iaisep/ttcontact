
import React from 'react';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SpeechSettings from './SpeechSettings';
import AgentFunctionsPanel from './AgentFunctionsPanel';
import KnowledgeBaseEditor from './KnowledgeBaseEditor';
import { useLanguage } from '@/context/LanguageContext';

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface AgentSettingsAccordionProps {
  agent: RetellAgent;
  knowledgeBases?: KnowledgeBase[];
  updateAgentField: (fieldName: string, value: any) => void;
}

// Default speech settings to use when not provided
const defaultSpeechSettings = {
  stability: 0.5,
  similarity: 0.8,
  style: 0.5,
  speed: 1.0
};

const AgentSettingsAccordion: React.FC<AgentSettingsAccordionProps> = ({
  agent,
  knowledgeBases = [],
  updateAgentField
}) => {
  const { t } = useLanguage();
  
  // Ensure speech settings are complete with defaults
  const speechSettings = {
    ...defaultSpeechSettings,
    ...(agent.speech_settings || {})
  };
  
  return (
    <Accordion type="single" defaultValue="knowledge-base" className="w-full">
      <AccordionItem value="knowledge-base">
        <AccordionTrigger className="px-4 py-2 text-[10px] font-medium rounded-t-md bg-gray-50 hover:bg-gray-100">
          {t('knowledge_base')}
        </AccordionTrigger>
        <AccordionContent className="border border-t-0 rounded-b-md p-4">
          <KnowledgeBaseEditor 
            agent={agent} 
            knowledgeBases={knowledgeBases}
            onUpdate={(value) => updateAgentField('knowledge_base_ids', value)} 
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="speech-settings" className="mt-4">
        <AccordionTrigger className="px-4 py-2 text-[10px] font-medium rounded-t-md bg-gray-50 hover:bg-gray-100">
          {t('speech_settings')}
        </AccordionTrigger>
        <AccordionContent className="border border-t-0 rounded-b-md p-4">
          <SpeechSettings 
            settings={speechSettings} 
            onUpdate={(value) => updateAgentField('speech_settings', value)} 
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="agent-functions" className="mt-4">
        <AccordionTrigger className="px-4 py-2 text-[10px] font-medium rounded-t-md bg-gray-50 hover:bg-gray-100">
          {t('agent_functions')}
        </AccordionTrigger>
        <AccordionContent className="border border-t-0 rounded-b-md p-4">
          <AgentFunctionsPanel 
            functions={agent.functions || []} 
            onUpdate={(value) => updateAgentField('functions', value)} 
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AgentSettingsAccordion;
