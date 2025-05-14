
import React, { useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Voice } from '../voice-selection/types';
import { VoiceSelectionModal } from '../voice-selection';
import { AgentSettingsAccordionProps } from './types';

// Import all section components
import FunctionsSection from './FunctionsSection';
import KnowledgeBaseSection from './KnowledgeBaseSection';
import SpeechSettingsSection from './SpeechSettingsSection';
import CallSettingsSection from './call-settings';
import PostCallAnalysisSection from './PostCallAnalysisSection';
import SecurityFallbackSection from './SecurityFallbackSection';
import WebhookSettingsSection from './WebhookSettingsSection';
import VoiceSection from './VoiceSection';

// Default speech settings
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
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  
  // Ensure speech settings are complete with defaults
  const speechSettings = {
    ...defaultSpeechSettings,
    ...(agent.speech_settings || {})
  };

  const handleVoiceSelect = (voice: Voice) => {
    // Use the id property if voice_id is not available
    updateAgentField('voice_id', voice.voice_id || voice.id);
  };
  
  return (
    <>
      <Accordion 
        type="single" 
        collapsible 
        defaultValue=""
        className="w-full"
      >
        {/* Render all section components */}
        <FunctionsSection agent={agent} updateAgentField={updateAgentField} />
        <KnowledgeBaseSection agent={agent} updateAgentField={updateAgentField} />
        <SpeechSettingsSection agent={agent} updateAgentField={updateAgentField} />
        <CallSettingsSection agent={agent} updateAgentField={updateAgentField} />
        <PostCallAnalysisSection agent={agent} updateAgentField={updateAgentField} />
        <SecurityFallbackSection agent={agent} updateAgentField={updateAgentField} />
        <WebhookSettingsSection agent={agent} updateAgentField={updateAgentField} />
        
        {/* Voice Section (hidden but kept for compatibility) */}
        <VoiceSection 
          agent={agent} 
          updateAgentField={updateAgentField} 
          openVoiceModal={() => setVoiceModalOpen(true)}
          selectedVoice={agent.voice_id || 'Select a voice'}
        />
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
