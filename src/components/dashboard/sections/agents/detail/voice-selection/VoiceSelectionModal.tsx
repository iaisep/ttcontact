
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X, Loader2 } from 'lucide-react';
import { useVoiceFiltering } from './useVoiceFiltering';
import { RetellVoice, RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import VoiceSelectionContent from './components/VoiceSelectionContent';

interface VoiceSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectVoice: (voice: RetellVoice) => void;
  selectedVoice?: string;
  agent?: RetellAgent;
  updateAgentField?: (fieldName: string, value: any) => void;
}

const VoiceSelectionModal: React.FC<VoiceSelectionModalProps> = ({
  open,
  onClose,
  onSelectVoice,
  selectedVoice,
  agent,
  updateAgentField
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<RetellVoice[]>([]);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  
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
    getFilteredVoices
  } = useVoiceFiltering();

  // Only fetch voices when the modal is opened and hasn't loaded yet
  useEffect(() => {
    if (open && !hasInitiallyLoaded) {
      fetchVoices();
      setHasInitiallyLoaded(true);
    }
  }, [open, hasInitiallyLoaded]);

  const fetchVoices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth('/list-voices');
      
      if (response && Array.isArray(response)) {
        setVoices(response);
      } else if (response && response.voices && Array.isArray(response.voices)) {
        setVoices(response.voices);
      } else {
        console.error('Unexpected response format:', response);
        setVoices([]);
        setError(t('error_unexpected_response_format') || 'Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
      setError(t('error_loading_voices') || 'Error loading voices');
      toast.error(t('error_loading_voices') || 'Error loading voices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    fetchVoices();
  };

  const filteredVoices = getFilteredVoices(voices);

  const handleSelectVoice = (voice: RetellVoice) => {
    onSelectVoice(voice);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 overflow-hidden rounded-lg">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            {t('select_voice') || 'Select Voice'}
          </DialogTitle>
          <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              {t('loading_voices') || 'Loading voices...'}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-destructive">{error}</p>
            <button 
              onClick={handleTryAgain}
              className="mt-4 text-sm text-primary hover:underline"
            >
              {t('try_again') || 'Try again'}
            </button>
          </div>
        ) : (
          <VoiceSelectionContent
            activeProvider={activeProvider}
            setActiveProvider={setActiveProvider}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            accentFilter={accentFilter}
            setAccentFilter={setAccentFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            filteredVoices={filteredVoices}
            onSelectVoice={handleSelectVoice}
            selectedVoice={selectedVoice}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSelectionModal;
