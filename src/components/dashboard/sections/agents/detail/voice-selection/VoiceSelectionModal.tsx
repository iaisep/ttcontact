
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useVoiceFiltering } from './useVoiceFiltering';
import VoiceProviderTabs from './VoiceProviderTabs';
import VoiceFilterBar from './VoiceFilterBar';
import VoiceTable from './VoiceTable';
import { Voice } from './types';

interface VoiceSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectVoice: (voice: Voice) => void;
  selectedVoice?: string;
}

const VoiceSelectionModal: React.FC<VoiceSelectionModalProps> = ({
  open,
  onClose,
  onSelectVoice,
  selectedVoice
}) => {
  const {
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
    filteredVoices
  } = useVoiceFiltering();

  const handleSelectVoice = (voice: Voice) => {
    onSelectVoice(voice);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[580px] p-0 overflow-hidden">
        <DialogTitle className="px-6 pt-6 pb-2 text-xl font-semibold">
          Select Voice
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogTitle>
        
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
            onSelectVoice={handleSelectVoice}
          />
        </VoiceProviderTabs>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSelectionModal;
