
import React, { useState } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';
import VoiceSelector from '../../detail/components/VoiceSelector';
import { AccordionSectionProps } from './types';
import { useVoiceSettings } from '../hooks/useVoiceSettings';

export interface VoiceSectionProps extends AccordionSectionProps {
  openVoiceModal?: () => void;
  selectedVoice?: string;
}

const VoiceSection: React.FC<VoiceSectionProps> = ({ 
  agent, 
  updateAgentField,
  openVoiceModal: externalOpenVoiceModal,
  selectedVoice: externalSelectedVoice
}) => {
  const { t } = useLanguage();
  
  // Use the voice settings hook to get voice-related functionality
  const voiceSettings = useVoiceSettings({
    initialVoice: externalSelectedVoice || agent?.voice_name || 'Select a voice',
    updateAgentField
  });

  // Use either the external open modal function or the one from the hook
  const handleOpenVoiceModal = externalOpenVoiceModal || voiceSettings.openVoiceModal;
  const displayVoice = externalSelectedVoice || voiceSettings.selectedVoice;

  return (
    <AccordionItem value="voice-settings">
      <AccordionTrigger>
        {t('voice')}
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">{t('selected_voice')}</label>
          <VoiceSelector 
            selectedVoice={displayVoice} 
            openVoiceModal={handleOpenVoiceModal}
            onSettingsClick={handleOpenVoiceModal}
            voiceAvatarUrl={voiceSettings.voiceAvatarUrl}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default VoiceSection;
