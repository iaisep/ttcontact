
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: string;
  openVoiceModal: () => void;
  onSettingsClick?: () => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  openVoiceModal,
  onSettingsClick,
}) => {
  return (
    <Button 
      variant="outline" 
      className="flex items-center justify-between w-full max-w-full gap-1 sm:gap-2 bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 h-auto overflow-hidden"
      onClick={openVoiceModal}
    >
      <div className="flex items-center gap-1 sm:gap-2 overflow-hidden flex-wrap">
        <div className="h-6 w-6 sm:h-6 sm:w-6 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center text-white">
          <User className="h-3 w-3 sm:h-3 sm:w-3" />
        </div>
        <span className="truncate text-[10px]:text-[10px] max-w-[100px] sm:max-w-[120px]">{selectedVoice}</span>
      </div>
      {onSettingsClick && (
        <div 
          className="flex items-center justify-center h-6 w-6 sm:h-6 sm:w-6 text-gray-500 hover:text-gray-700 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onSettingsClick();
          }}
        >
          <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
      )}
    </Button>
  );
};

export default VoiceSelector;
