
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Headphones } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from '../types';
import VoicemailDetectionSection from './VoicemailDetectionSection';
import EndCallOnSilenceSection from './EndCallOnSilenceSection';
import MaxCallDurationSection from './MaxCallDurationSection';
import PauseBeforeSpeakingSection from './PauseBeforeSpeakingSection';
import RingDurationSection from './RingDurationSection';

const CallSettingsSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const { t } = useLanguage();
  
  return (
    <AccordionItem value="call-settings" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <Headphones className="h-4 w-4 mr-2" />
        {t('call_settings')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-6">
          {/* Voicemail Detection */}
          <VoicemailDetectionSection 
            agent={agent} 
            updateAgentField={updateAgentField}
          />

          {/* End Call on Silence */}
          <EndCallOnSilenceSection
            agent={agent}
            updateAgentField={updateAgentField}
          />

          {/* Max Call Duration */}
          <MaxCallDurationSection
            agent={agent}
            updateAgentField={updateAgentField}
          />

          {/* Pause Before Speaking */}
          <PauseBeforeSpeakingSection
            agent={agent}
            updateAgentField={updateAgentField}
          />

          {/* Ring Duration */}
          <RingDurationSection
            agent={agent}
            updateAgentField={updateAgentField}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CallSettingsSection;
