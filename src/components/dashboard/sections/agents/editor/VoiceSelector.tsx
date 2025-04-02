
import React from 'react';
import { VoiceSelector as RefactoredVoiceSelector } from './voice-selector';
import { Voice } from '@/components/dashboard/sections/agents/detail/voice-selection/types';

interface VoiceSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectVoice: (voice: Voice) => void;
  selectedVoiceId?: string;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = (props) => {
  return <RefactoredVoiceSelector {...props} />;
};

export default VoiceSelector;
