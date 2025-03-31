
import React from 'react';
import VoiceProviderTabs from '../VoiceProviderTabs';
import VoiceFilterBar from '../VoiceFilterBar';
import VoiceTable from '../VoiceTable';
import { Voice } from '../types';

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
  filteredVoices: Voice[];
  onSelectVoice: (voice: Voice) => void;
  selectedVoice?: string;
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
  selectedVoice
}) => {
  return (
    <VoiceProviderTabs 
      activeProvider={activeProvider}
      setActiveProvider={setActiveProvider}
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
      />
      
      <VoiceTable 
        voices={filteredVoices}
        onSelectVoice={onSelectVoice}
        selectedVoiceId={selectedVoice}
      />
    </VoiceProviderTabs>
  );
};

export default VoiceSelectionContent;
