
import React, { useState } from 'react';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SpeechSettings from './SpeechSettings';
import AgentFunctionsPanel from './AgentFunctionsPanel';
import KnowledgeBaseEditor from './KnowledgeBaseEditor';
import { useLanguage } from '@/context/LanguageContext';
import { VoiceSelectionModal } from './voice-selection';
import { Voice } from './voice-selection/types';
import VoiceSelector from './components/VoiceSelector';

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
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  
  // Ensure speech settings are complete with defaults
  const speechSettings = {
    ...defaultSpeechSettings,
    ...(agent.speech_settings || {})
  };

  const handleVoiceSelect = (voice: Voice) => {
    updateAgentField('voice_id', voice.voice_id);
  };
  
  return (
    <>
      <Accordion type="single" defaultValue="knowledge-base" className="w-full">
        <AccordionItem value="voice-settings" className="mt-4">
          <AccordionTrigger className="px-4 py-2 text-[10px] font-medium rounded-t-md bg-gray-50 hover:bg-gray-100">
            {t('voice')}
          </AccordionTrigger>
          <AccordionContent className="border border-t-0 rounded-b-md p-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">{t('selected_voice')}</label>
              <VoiceSelector 
                selectedVoice={agent.voice_id || 'Select a voice'} 
                openVoiceModal={() => setVoiceModalOpen(true)}
                onSettingsClick={() => setVoiceModalOpen(true)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="knowledge-base" className="mt-4">
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

      <VoiceSelectionModal
        open={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSelectVoice={handleVoiceSelect}
        selectedVoice={agent.voice_id}
        agent={agent}
        updateAgentField={updateAgentField}
      />
    </>
  );
};

export default AgentSettingsAccordion;
