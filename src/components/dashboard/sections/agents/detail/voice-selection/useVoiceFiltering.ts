
import { useState, useCallback } from 'react';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

export const useVoiceFiltering = (initialProvider: string = 'ElevenLabs') => {
  const [activeProvider, setActiveProvider] = useState(initialProvider);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all_genders');
  const [accentFilter, setAccentFilter] = useState<string>('all_accents');
  const [typeFilter, setTypeFilter] = useState<string>('all_types');

  const getFilteredVoices = useCallback((voices: RetellVoice[]) => {
    if (!voices || !Array.isArray(voices)) {
      console.warn('Invalid voices data:', voices);
      return [];
    }
    
    return voices.filter(voice => {
      // Filter by provider
      if (activeProvider !== 'All') {
        const voiceId = voice.id || '';
        const provider = voice.provider || '';
        
        if (activeProvider === 'ElevenLabs' && 
           !(voiceId.includes('11labs') || provider.toLowerCase().includes('eleven') || provider.toLowerCase().includes('11labs'))) {
          return false;
        } else if (activeProvider === 'PlayHT' && 
                  !(voiceId.includes('play') || provider.toLowerCase().includes('playht') || provider.toLowerCase().includes('play ht'))) {
          return false;
        } else if (activeProvider === 'OpenAI' && 
                  !(voiceId.includes('openai') || provider.toLowerCase().includes('openai'))) {
          return false;
        }
      }
      
      // Filter by search term
      if (searchTerm && voice.name) {
        const name = voice.name.toLowerCase();
        const term = searchTerm.toLowerCase();
        if (!name.includes(term)) {
          return false;
        }
      }
      
      // Filter by gender
      if (genderFilter !== 'all_genders' && voice.gender) {
        const genderMap: Record<string, string[]> = {
          'male': ['male', 'masculine', 'man', 'men'],
          'female': ['female', 'feminine', 'woman', 'women'],
          'neutral': ['neutral', 'androgynous', 'non-binary'],
        };
        
        const voiceGender = voice.gender.toLowerCase();
        const targetGenders = genderMap[genderFilter] || [];
        
        if (targetGenders.length > 0 && !targetGenders.some(g => voiceGender.includes(g))) {
          return false;
        }
      }
      
      // Filter by accent
      if (accentFilter !== 'all_accents' && voice.accent) {
        const accentMap: Record<string, string[]> = {
          'american': ['american', 'us', 'usa', 'united states'],
          'british': ['british', 'uk', 'england', 'english'],
          'indian': ['indian', 'india'],
          'australian': ['australian', 'australia'],
          'spanish': ['spanish', 'spain'],
          'french': ['french', 'france'],
        };
        
        const voiceAccent = voice.accent.toLowerCase();
        const targetAccents = accentMap[accentFilter] || [];
        
        if (targetAccents.length > 0 && !targetAccents.some(a => voiceAccent.includes(a))) {
          return false;
        }
      }
      
      // Filter by type
      if (typeFilter !== 'all_types') {
        // Since the API data might not have a direct "type" field,
        // we need to infer the type from the voice_id or other properties
        const standardVoiceType = voice.standard_voice_type || '';
        const voiceId = voice.id || '';
        
        if (typeFilter === 'retail' && 
           !(standardVoiceType.includes('retell') || voiceId.includes('retail'))) {
          return false;
        } else if (typeFilter === 'provider' && 
                  !(standardVoiceType.includes('preset') || voiceId.includes('provider'))) {
          return false;
        } else if (typeFilter === 'custom' && 
                  !(voiceId.includes('custom') || (voice.is_custom === true))) {
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
