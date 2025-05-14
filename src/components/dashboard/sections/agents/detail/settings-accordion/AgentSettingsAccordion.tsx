
// This file now imports from the modular implementation
import PostCallAnalysisSection from './post-call-analysis/PostCallAnalysisSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AgentSettingsAccordionProps } from './types';
import React, { useState } from 'react';
import { useVoiceSettings } from '../hooks/useVoiceSettings';

// Import all section components
import VoiceSection from './VoiceSection';
import CallSettingsSection from './call-settings';
import KnowledgeBaseSection from './KnowledgeBaseSection';
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
    initialVoice: agent?.voice_name || 'Select a voice',
    updateAgentField
  });

  return (
    <Accordion type="multiple" className="w-full" defaultValue={["voice"]}>
      <AccordionItem value="voice">
        <AccordionTrigger className="hover:no-underline">Voice Settings</AccordionTrigger>
        <AccordionContent>
          <VoiceSection 
            agent={agent} 
            updateAgentField={updateAgentField}
            selectedVoice={voiceSettings.selectedVoice}
            openVoiceModal={voiceSettings.openVoiceModal}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="call-settings">
        <AccordionTrigger className="hover:no-underline">Call Settings</AccordionTrigger>
        <AccordionContent>
          <CallSettingsSection agent={agent} updateAgentField={updateAgentField} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="knowledge-base">
        <AccordionTrigger className="hover:no-underline">Knowledge Base</AccordionTrigger>
        <AccordionContent>
          <KnowledgeBaseSection 
            agent={agent} 
            updateAgentField={updateAgentField} 
            knowledgeBases={knowledgeBases} 
          />
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
