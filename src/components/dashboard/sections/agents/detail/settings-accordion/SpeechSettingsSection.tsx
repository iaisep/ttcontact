
import React, { useState, useEffect } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Settings2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from './types';

// Import all speech settings components
import {
  BackgroundSoundSection,
  ResponsivenessSection,
  InterruptionSection,
  BackchannelSection,
  KeywordsSection,
  SpeechNormalizationSection,
  ReminderSection,
  PronunciationSection
} from './speech-settings';

const SpeechSettingsSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const { t } = useLanguage();
  const agentId = agent?.agent_id || agent?.id;
  
  // Derived state from agent props
  const [responsiveness, setResponsiveness] = useState(agent?.responsiveness || 0.85);
  const [interruptionSensitivity, setInterruptionSensitivity] = useState(agent?.interruption_sensitivity || 0.8);
  const [backchannelFrequency, setBackchannelFrequency] = useState(agent?.backchannel_frequency || 0.8);
  const [backgroundSound, setBackgroundSound] = useState(agent?.ambient_sound || 'summer-outdoor');
  const [backgroundSoundVolume, setBackgroundSoundVolume] = useState(agent?.ambient_sound_volume || 1);

  // Update local state when agent props change
  useEffect(() => {
    setResponsiveness(agent?.responsiveness || 0.85);
    setInterruptionSensitivity(agent?.interruption_sensitivity || 0.8);
    setBackchannelFrequency(agent?.backchannel_frequency || 0.8);
    setBackgroundSound(agent?.ambient_sound || 'summer-outdoor');
    setBackgroundSoundVolume(agent?.ambient_sound_volume || 1);
  }, [agent?.responsiveness, agent?.interruption_sensitivity, agent?.backchannel_frequency, agent?.ambient_sound, agent?.ambient_sound_volume]);

  return (
    <AccordionItem value="speech-settings" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <Settings2 className="h-4 w-4 mr-2" />
        {t('speech_settings')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-6">
          {/* Background Sound Setting */}
          <BackgroundSoundSection 
            sound={backgroundSound}
            volume={backgroundSoundVolume}
            agentId={agentId}
            onUpdateSound={(value) => {
              setBackgroundSound(value);
              updateAgentField('ambient_sound', value);
            }}
            onUpdateVolume={(value) => {
              setBackgroundSoundVolume(value);
              updateAgentField('ambient_sound_volume', value);
            }}
          />

          {/* Responsiveness Setting */}
          <ResponsivenessSection 
            agentId={agentId}
            responsiveness={responsiveness}
            onUpdate={(value) => updateAgentField('responsiveness', value)}
          />

          {/* Interruption Sensitivity */}
          <InterruptionSection 
            agentId={agentId}
            sensitivity={interruptionSensitivity}
            onUpdate={(value) => updateAgentField('interruption_sensitivity', value)}
          />

          {/* Backchanneling Settings */}
          <BackchannelSection 
            agentId={agentId}
            enabled={agent?.enable_backchannel || false}
            frequency={backchannelFrequency}
            words={agent?.backchannel_words || ['Vale', 'entiendo', 'aja', 'comprendo', 'mmmm']}
            onUpdateEnabled={(value) => updateAgentField('enable_backchannel', value)}
            onUpdateFrequency={(value) => updateAgentField('backchannel_frequency', value)}
            onUpdateWords={(words) => updateAgentField('backchannel_words', words)}
          />

          {/* Boosted Keywords */}
          <KeywordsSection 
            keywords={agent?.boosted_keywords || ['información de mi cuenta']}
            onUpdate={(keywords) => updateAgentField('boosted_keywords', keywords)}
          />

          {/* Speech Normalization Settings */}
          <SpeechNormalizationSection 
            normalized={agent?.normalize_for_speech || false}
            transcriptFormatting={agent?.enable_transcription_formatting || false}
            onUpdateNormalized={(value) => updateAgentField('normalize_for_speech', value)}
            onUpdateTranscriptFormatting={(value) => updateAgentField('enable_transcription_formatting', value)}
          />

          {/* Reminder Message Frequency */}
          <ReminderSection 
            triggerSeconds={agent?.reminder_trigger_ms ? Math.round(agent.reminder_trigger_ms / 1000) : 5}
            maxCount={agent?.reminder_max_count || 1}
            onUpdateTrigger={(seconds) => updateAgentField('reminder_trigger_ms', seconds * 1000)}
            onUpdateMaxCount={(count) => updateAgentField('reminder_max_count', count)}
          />

          {/* Pronunciation */}
          <PronunciationSection />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SpeechSettingsSection;
