
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VoiceSelectorProps {
  selectedVoice: string;
  openVoiceModal: () => void;
  onSettingsClick?: () => void;
  voiceAvatarUrl?: string;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  openVoiceModal,
  onSettingsClick,
  voiceAvatarUrl
}) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Button 
      variant="outline" 
      className="flex items-center justify-between w-full bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 h-auto"
      onClick={openVoiceModal}
    >
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <div className="h-6 w-6 sm:h-6 sm:w-6 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center text-white overflow-hidden">
          {voiceAvatarUrl ? (
            <Avatar className="h-full w-full">
              <AvatarImage src={voiceAvatarUrl} alt={selectedVoice} />
              <AvatarFallback className="bg-amber-500 text-white">
                {getInitials(selectedVoice)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          )}
        </div>
        <span className="truncate text-[10px] sm:text-xs" style={{ maxWidth: 'calc(100% - 48px)' }}>
          {selectedVoice}
        </span>
      </div>
      
      {onSettingsClick && (
        <div 
          className="flex items-center justify-center h-6 w-6 sm:h-6 sm:w-6 ml-1 sm:ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
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
