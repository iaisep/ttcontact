
import { useState, useMemo } from 'react';
import { Voice, mockVoices } from './types';

export const useVoiceFiltering = (initialProvider: string = 'ElevenLabs') => {
  const [activeProvider, setActiveProvider] = useState(initialProvider);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all_genders');
  const [accentFilter, setAccentFilter] = useState<string>('all_accents');
  const [typeFilter, setTypeFilter] = useState<string>('all_types');

  const filteredVoices = useMemo(() => {
    return mockVoices.filter(voice => {
      // Filter by provider
      if (activeProvider !== 'All' && voice.provider !== activeProvider) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !voice.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [activeProvider, searchTerm]);

  return {
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
  };
};
