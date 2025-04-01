
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
      className="flex items-center justify-between w-full gap-2 bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-4 py-2 h-auto"
      onClick={openVoiceModal}
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-white">
          <User className="h-3 w-3" />
        </div>
        <span>{selectedVoice}</span>
      </div>
    </Button>
  );
};

export default VoiceSelector;
