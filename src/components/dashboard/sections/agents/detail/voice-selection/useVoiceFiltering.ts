
import { useState, useCallback } from 'react';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

export const useVoiceFiltering = (initialProvider: string = 'ElevenLabs') => {
  const [activeProvider, setActiveProvider] = useState(initialProvider);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all_genders');
  const [accentFilter, setAccentFilter] = useState<string>('all_accents');
  const [typeFilter, setTypeFilter] = useState<string>('all_types');

  const getFilteredVoices = useCallback((voices: RetellVoice[]) => {
    return voices.filter(voice => {
      // Filter by provider
      if (activeProvider !== 'All') {
        const voiceId = voice.id || '';
        if (activeProvider === 'ElevenLabs' && !voiceId.includes('11labs')) {
          return false;
        } else if (activeProvider === 'PlayHT' && !voiceId.includes('play')) {
          return false;
        } else if (activeProvider === 'OpenAI' && !voiceId.includes('openai')) {
          return false;
        }
      }
      
      // Filter by search term
      if (searchTerm && voice.name && !voice.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by gender
      if (genderFilter !== 'all_genders') {
        const genderMap: Record<string, string> = {
          'male': 'male',
          'female': 'female',
          'neutral': 'neutral',
        };
        
        if (genderMap[genderFilter] && voice.gender !== genderMap[genderFilter]) {
          return false;
        }
      }
      
      // Filter by accent
      if (accentFilter !== 'all_accents') {
        const accentMap: Record<string, string> = {
          'american': 'American',
          'british': 'British',
          'indian': 'Indian',
        };
        
        if (accentMap[accentFilter] && voice.accent !== accentMap[accentFilter]) {
          return false;
        }
      }
      
      // Filter by type
      if (typeFilter !== 'all_types') {
        // Since the API data might not have a direct "type" field,
        // we need to infer the type from the voice_id or other properties
        const standardVoiceType = voice.standard_voice_type || '';
        
        if (typeFilter === 'retail' && !standardVoiceType.includes('retell')) {
          return false;
        } else if (typeFilter === 'provider' && !standardVoiceType.includes('preset')) {
          return false;
        } else if (typeFilter === 'custom' && !(voice.id || '').includes('custom')) {
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
    getFilteredVoices
  };
};
