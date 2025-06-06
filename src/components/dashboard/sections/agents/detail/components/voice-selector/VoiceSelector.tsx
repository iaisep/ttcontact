import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVoiceSettings } from '../../hooks/useVoiceSettings';
import VoiceSettingsModal from '../VoiceSettingsModal';
import VoiceTooltip from './VoiceTooltip';
import { toast } from 'sonner';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

interface VoiceSelectorProps {
  selectedVoice: string;
  openVoiceModal: () => void;
  onSettingsClick?: () => void;
  voiceAvatarUrl?: string;
  selectedLanguage?: string;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  openVoiceModal,
  onSettingsClick,
  voiceAvatarUrl,
  selectedLanguage = 'en-US'
}) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const [isVoiceSettingsModalOpen, setIsVoiceSettingsModalOpen] = useState(false);
  
  // We'll use the context hook to access the agent's voice settings
  const { 
    voiceModel, 
    voiceSpeed, 
    voiceTemperature, 
    voiceVolume,
    setVoiceModel,
    setVoiceSpeed,
    setVoiceTemperature,
    setVoiceVolume,
    handleSaveVoiceSettings
  } = useVoiceSettings({ 
    initialVoice: selectedVoice,
    updateAgentField: () => {} // This will be used from the hook itself
  });

  // Handle settings click - open the modal instead of using the passed function
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVoiceSettingsModalOpen(true);
  };

  // Handle newly added custom voice
  const handleCustomVoiceAdded = (voice: RetellVoice) => {
    toast.success(`Voice ${voice.voice_name} added successfully`);
    // Any additional logic needed when a voice is added
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
        
        <VoiceTooltip onSettingsClick={handleSettingsClick} />
      </Button>

      {/* Voice Settings Modal with the onVoiceAdded prop and selectedLanguage */}
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
        onSettingsUpdated={handleSaveVoiceSettings}
        onVoiceAdded={handleCustomVoiceAdded}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
};

export default VoiceSelector;
