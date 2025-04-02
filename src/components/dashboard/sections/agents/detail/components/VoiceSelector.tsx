
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVoiceSettings } from '../hooks/useVoiceSettings';
import VoiceSettingsModal from './VoiceSettingsModal';

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

  const [isVoiceSettingsModalOpen, setIsVoiceSettingsModalOpen] = React.useState(false);
  
  // Default values for voice settings
  const [voiceModel, setVoiceModel] = React.useState('eleven_turbo_v2');
  const [voiceSpeed, setVoiceSpeed] = React.useState(1.0);
  const [voiceTemperature, setVoiceTemperature] = React.useState(1.0);
  const [voiceVolume, setVoiceVolume] = React.useState(1.0);

  // Handle settings click - open the modal instead of using the passed function
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVoiceSettingsModalOpen(true);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center justify-between w-full bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 h-auto"
        onClick={openVoiceModal}
      >
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 max-w-full">
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
          <span className="text-xs sm:text-sm truncate flex-grow min-w-0 text-ellipsis overflow-hidden">
            {selectedVoice}
          </span>
        </div>
        
        <div 
          className="flex items-center justify-center h-6 w-6 sm:h-6 sm:w-6 ml-1 sm:ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
          onClick={handleSettingsClick}
        >
          <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
      </Button>

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        open={isVoiceSettingsModalOpen}
        onClose={() => setIsVoiceSettingsModalOpen(false)}
        voiceModel={voiceModel}
        setVoiceModel={setVoiceModel}
        voiceSpeed={voiceSpeed}
        setVoiceSpeed={setVoiceSpeed}
        voiceTemperature={voiceTemperature}
        setVoiceTemperature={setVoiceTemperature}
        voiceVolume={voiceVolume}
        setVoiceVolume={setVoiceVolume}
        onSettingsUpdated={() => {
          console.log('Voice settings updated');
        }}
      />
    </>
  );
};

export default VoiceSelector;
