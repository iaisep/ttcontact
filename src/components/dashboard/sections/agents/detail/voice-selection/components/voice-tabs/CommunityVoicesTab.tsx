
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CommunityVoice } from '../../types';
import { useVoiceModal } from '../voice-modal/VoiceModalContext';

interface CommunityVoicesTabProps {
  isLoading: boolean;
}

const CommunityVoicesTab: React.FC<CommunityVoicesTabProps> = ({
  isLoading
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [voices, setVoices] = useState<CommunityVoice[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  
  const { selectedVoice, setSelectedVoice } = useVoiceModal();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchCommunityVoices(searchQuery);
    } else if (searchQuery === '') {
      setVoices([]);
    }
  }, [searchQuery]);

  const searchCommunityVoices = async (query: string) => {
    if (query.trim() === '') return;
    
    setSearching(true);
    try {
      const response = await fetchWithAuth('/search-community-voice', {
        method: 'POST',
        body: JSON.stringify({
          search_query: query
        })
      });
      
      if (response && Array.isArray(response)) {
        setVoices(response);
      } else if (response && response.voices) {
        setVoices(response.voices);
      } else {
        setVoices([]);
      }
    } catch (error) {
      console.error('Error searching community voices:', error);
      toast.error(t('error_searching_voices') || 'Error searching voices');
      setVoices([]);
    } finally {
      setSearching(false);
    }
  };

  const handleVoiceSelect = (voice: CommunityVoice) => {
    setSelectedVoice(voice);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search-voice">
          {t('voice_name') || 'Voice Name'}
        </Label>
        <div className="relative">
          <Input
            id="search-voice"
            placeholder={t('search_by_voice_name') || 'Search by voice name'}
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={isLoading}
            className="mt-1"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-muted-foreground mt-1">
            {t('explore_the_community_voices') || 'Explore the community voices'}{' '}
            <a href="#" className="text-primary hover:underline">
              {t('here') || 'here'}
            </a>.
          </p>
        )}
      </div>

      {voices.length > 0 && (
        <ScrollArea className="h-[200px] border rounded-md">
          <div className="py-1">
            {voices.map((voice) => (
              <div
                key={voice.id}
                className={`px-4 py-3 cursor-pointer hover:bg-muted transition-colors ${
                  selectedVoice?.id === voice.id ? 'bg-muted' : ''
                }`}
                onClick={() => handleVoiceSelect(voice)}
              >
                <h4 className="font-medium">{voice.name}</h4>
                <p className="text-sm text-muted-foreground">{voice.description}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  {t('id') || 'ID'}: {voice.id}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {searchQuery && voices.length === 0 && !searching && (
        <div className="text-center py-4 text-muted-foreground">
          {t('no_voices_found') || 'No voices found'}
        </div>
      )}
    </div>
  );
};

export default CommunityVoicesTab;
