
import React from 'react';
import { VoiceSelector as RefactoredVoiceSelector } from './voice-selector';

interface VoiceSelectorProps {
  selectedVoice: string;
  openVoiceModal: () => void;
  onSettingsClick?: () => void;
  voiceAvatarUrl?: string;
  selectedLanguage?: string;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = (props) => {
  return <RefactoredVoiceSelector {...props} />;
};

export default VoiceSelector;
