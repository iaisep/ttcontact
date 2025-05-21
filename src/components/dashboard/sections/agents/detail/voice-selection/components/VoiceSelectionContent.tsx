
import React from 'react';
import VoiceProviderTabs from '../VoiceProviderTabs';
import VoiceFilterBar from '../VoiceFilterBar';
import VoiceTable from '../VoiceTable';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

interface VoiceSelectionContentProps {
  activeProvider: string;
  setActiveProvider: (provider: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  genderFilter: string;
  setGenderFilter: (filter: string) => void;
  accentFilter: string;
  setAccentFilter: (filter: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  filteredVoices: RetellVoice[];
  onSelectVoice: (voice: RetellVoice) => void;
  selectedVoice?: string;
  onVoiceAdded?: (voice: RetellVoice) => void;
}

const VoiceSelectionContent: React.FC<VoiceSelectionContentProps> = ({
  activeProvider,
  setActiveProvider,
  searchTerm,
  setSearchTerm,
  genderFilter,
  setGenderFilter,
  accentFilter,
  setAccentFilter,
  typeFilter,
  setTypeFilter,
  filteredVoices,
  onSelectVoice,
  selectedVoice,
  onVoiceAdded
}) => {
  const handleVoiceAdded = () => {
    // This function will be called when a voice is added
    console.log('Voice added in VoiceSelectionContent');
    // If onVoiceAdded prop exists, call it
    if (onVoiceAdded) {
      // Since we don't have a voice object here, we'll need to refresh the list instead
      // onVoiceAdded(voice); 
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <VoiceProviderTabs 
        activeProvider={activeProvider}
        setActiveProvider={setActiveProvider}
        onVoiceAdded={handleVoiceAdded}
      >
        <VoiceFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          accentFilter={accentFilter}
          setAccentFilter={setAccentFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          onVoiceAdded={onVoiceAdded}
        />
        
        <VoiceTable 
          voices={filteredVoices}
          onSelectVoice={onSelectVoice}
          selectedVoiceId={selectedVoice}
        />
      </VoiceProviderTabs>
    </div>
  );
};

export default VoiceSelectionContent;
