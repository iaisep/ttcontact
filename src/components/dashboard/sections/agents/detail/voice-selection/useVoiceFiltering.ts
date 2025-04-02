
import { useState } from 'react';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

export const useVoiceFiltering = () => {
  const [activeProvider, setActiveProvider] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [accentFilter, setAccentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const normalizeString = (str: string | undefined | null): string => {
    return (str || '').trim().toLowerCase();
  };

  const getFilteredVoices = (voices: RetellVoice[]) => {
    return voices.filter(voice => {
      // Provider filter
      if (activeProvider !== 'all') {
        const provider = normalizeString(voice.provider);
        if (activeProvider === 'elevenlabs' && !provider.includes('eleven')) {
          return false;
        }
        if (activeProvider === 'playht' && !provider.includes('play')) {
          return false;
        }
        if (activeProvider === 'openai' && !provider.includes('openai')) {
          return false;
        }
      }

      // Search filter
      if (searchTerm) {
        const voiceName = normalizeString(voice.voice_name || voice.name);
        const searchLower = searchTerm.toLowerCase();
        
        if (!voiceName.includes(searchLower)) {
          return false;
        }
      }

      // Gender filter
      if (genderFilter !== 'all') {
        const gender = normalizeString(voice.gender);
        if (gender !== genderFilter.toLowerCase()) {
          return false;
        }
      }

      // Accent filter
      if (accentFilter !== 'all') {
        const accent = normalizeString(voice.accent);
        if (accent !== accentFilter.toLowerCase()) {
          return false;
        }
      }

      // Type filter
      if (typeFilter !== 'all') {
        const voiceType = normalizeString(voice.voice_type);
        if (voiceType !== typeFilter.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  };

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
