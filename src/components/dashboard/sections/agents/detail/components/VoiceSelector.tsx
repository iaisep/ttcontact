
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: string;
  openVoiceModal: () => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  openVoiceModal,
}) => {
  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 bg-gray-50 text-gray-700"
      onClick={openVoiceModal}
    >
      <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-white">
        <User className="h-3 w-3" />
      </div>
      <span>{selectedVoice}</span>
    </Button>
  );
};

export default VoiceSelector;
