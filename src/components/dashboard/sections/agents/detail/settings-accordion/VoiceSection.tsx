
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';
import VoiceSelector from '../../detail/components/VoiceSelector';
import { AccordionSectionProps } from './types';

interface VoiceSectionProps extends AccordionSectionProps {
  openVoiceModal: () => void;
  selectedVoice: string;
}

const VoiceSection: React.FC<VoiceSectionProps> = ({ 
  agent, 
  openVoiceModal, 
  selectedVoice 
}) => {
  const { t } = useLanguage();

  return (
    <AccordionItem value="voice-settings" className="hidden">
      <AccordionTrigger>
        {t('voice')}
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">{t('selected_voice')}</label>
          <VoiceSelector 
            selectedVoice={selectedVoice || 'Select a voice'} 
            openVoiceModal={openVoiceModal}
            onSettingsClick={openVoiceModal}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default VoiceSection;
