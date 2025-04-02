
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useVoices } from './useVoices';
import FilterBar from './FilterBar';
import VoiceGrid from './VoiceGrid';
import ProviderTabs from './ProviderTabs';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import { Voice } from '@/components/dashboard/sections/agents/detail/voice-selection/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VoiceSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectVoice: (voice: Voice) => void;
  selectedVoiceId?: string;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  open,
  onClose,
  onSelectVoice,
  selectedVoiceId,
}) => {
  const {
    isLoading,
    error,
    fetchVoices,
    voices,
    activeProvider,
    setActiveProvider,
    searchQuery,
    setSearchQuery,
    genderFilter,
    setGenderFilter,
    accentFilter,
    setAccentFilter,
    resetFilters
  } = useVoices();

  // Check if active search/filtering is happening
  const isSearchActive = searchQuery !== '' || genderFilter !== 'all' || accentFilter !== 'all';

  // Handle voice selection and close the dialog
  const handleVoiceSelect = (voice: Voice) => {
    onSelectVoice(voice);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Voice</h2>
          <X 
            className="h-4 w-4 cursor-pointer opacity-70 ring-offset-background transition-opacity hover:opacity-100" 
            onClick={onClose}
          />
        </div>

        <ProviderTabs
          activeProvider={activeProvider}
          setActiveProvider={setActiveProvider}
        >
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            accentFilter={accentFilter}
            setAccentFilter={setAccentFilter}
            resetFilters={resetFilters}
          />

          <LoadingState 
            isLoading={isLoading} 
            error={error ? error.toString() : null} 
            onRetry={fetchVoices} 
          />

          {!isLoading && !error && (
            <>
              {voices.length === 0 ? (
                <EmptyState searchActive={isSearchActive} />
              ) : (
                <ScrollArea className="h-[400px] mt-6">
                  <VoiceGrid
                    voices={voices}
                    selectedVoiceId={selectedVoiceId}
                    onSelectVoice={handleVoiceSelect}
                  />
                </ScrollArea>
              )}
            </>
          )}
        </ProviderTabs>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSelector;
