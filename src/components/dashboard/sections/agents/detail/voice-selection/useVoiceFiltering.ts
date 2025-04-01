
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
      
      // Filter by gender
      if (genderFilter !== 'all_genders') {
        const genderMapping: Record<string, string[]> = {
          'male': ['Male'],
          'female': ['Female'],
          'neutral': ['Neutral'],
        };
        
        const targetGenders = genderMapping[genderFilter] || [];
        if (targetGenders.length && !voice.traits.some(trait => targetGenders.includes(trait))) {
          return false;
        }
      }
      
      // Filter by accent
      if (accentFilter !== 'all_accents') {
        const accentMapping: Record<string, string[]> = {
          'american': ['American'],
          'british': ['British'],
          'indian': ['Indian'],
        };
        
        const targetAccents = accentMapping[accentFilter] || [];
        if (targetAccents.length && !voice.traits.some(trait => targetAccents.includes(trait))) {
          return false;
        }
      }
      
      // Filter by type
      if (typeFilter !== 'all_types') {
        const typeMapping: Record<string, string[]> = {
          'retail': ['Retail'],
          'provider': ['Provider'],
          'custom': ['Custom'],
        };
        
        const targetTypes = typeMapping[typeFilter] || [];
        if (targetTypes.length && !voice.traits.some(trait => targetTypes.includes(trait))) {
          return false;
        }
      }
      
      return true;
    });
  }, [activeProvider, searchTerm, genderFilter, accentFilter, typeFilter]);

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
