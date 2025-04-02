
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Mic, ChevronDown, Settings } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: string;
  openVoiceModal: () => void;
  onSettingsClick: () => void;
  voiceAvatarUrl?: string;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ 
  selectedVoice, 
  openVoiceModal,
  onSettingsClick,
  voiceAvatarUrl
}) => {
  return (
    <div className="flex items-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center justify-between w-full bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 h-auto"
          >
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 max-w-full">
              <div className="h-6 w-6 sm:h-6 sm:w-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 overflow-hidden">
                {voiceAvatarUrl ? (
                  <img src={voiceAvatarUrl} alt="Voice Avatar" className="h-full w-full object-cover" />
                ) : (
                  <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </div>
              <span className="text-xs sm:text-sm truncate flex-grow min-w-0 text-ellipsis overflow-hidden">
                {selectedVoice}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 sm:ml-2 text-gray-600 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={openVoiceModal}
          >
            Change Voice
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Settings button */}
      <div 
        className="flex items-center justify-center h-6 w-6 sm:h-6 sm:w-6 ml-1 sm:ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0 cursor-pointer"
        onClick={onSettingsClick}
      >
        <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </div>
    </div>
  );
};

export default VoiceSelector;
