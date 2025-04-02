import { useState, useEffect, useCallback } from 'react';
import { Voice } from '@/components/dashboard/sections/agents/detail/voice-selection/types';

// Sample data with provider information
const mockVoices: Voice[] = [
  {
    id: 'voice-1',
    name: 'Sarah',
    provider: 'elevenlabs',
    gender: 'female',
    accent: 'american',
    age: 'adult',
    preview_audio_url: 'https://example.com/preview1.mp3',
    description: 'Clear and professional female voice with American accent'
  },
  {
    id: 'voice-2',
    name: 'John',
    provider: 'elevenlabs',
    gender: 'male',
    accent: 'british',
    age: 'adult',
    preview_audio_url: 'https://example.com/preview2.mp3',
    description: 'Deep male voice with British accent'
  },
  {
    id: 'voice-3',
    name: 'Alex',
    provider: 'playht',
    gender: 'neutral',
    accent: 'american',
    age: 'young',
    preview_audio_url: 'https://example.com/preview3.mp3',
    description: 'Neutral voice with American accent'
  },
  {
    id: 'voice-4',
    name: 'Maria',
    provider: 'playht',
    gender: 'female',
    accent: 'spanish',
    age: 'adult',
    preview_audio_url: 'https://example.com/preview4.mp3',
    description: 'Female voice with Spanish accent'
  },
  {
    id: 'voice-5',
    name: 'David',
    provider: 'openai',
    gender: 'male',
    accent: 'australian',
    age: 'adult',
    preview_audio_url: 'https://example.com/preview5.mp3',
    description: 'Male voice with Australian accent'
  },
  {
    id: 'voice-6',
    name: 'Luna',
    provider: 'openai',
    gender: 'female',
    accent: 'indian',
    age: 'young',
    preview_audio_url: 'https://example.com/preview6.mp3',
    description: 'Female voice with Indian accent'
  }
];

export const useVoices = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [allVoices, setAllVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeProvider, setActiveProvider] = useState('elevenlabs');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [accentFilter, setAccentFilter] = useState('all');

  // Fetch voices (mock implementation)
  const fetchVoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store all voices for reset functionality
      setAllVoices(mockVoices);
      
      // Apply initial filtering by provider
      const filteredByProvider = mockVoices.filter(voice => 
        voice.provider === activeProvider
      );
      
      setVoices(filteredByProvider);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch voices'));
    } finally {
      setIsLoading(false);
    }
  }, [activeProvider]);

  // Apply all filters
  const applyFilters = useCallback(() => {
    // Start with provider filter
    let filteredVoices = allVoices.filter(voice => 
      voice.provider === activeProvider
    );
    
    // Apply search filter if there is a query
    if (searchQuery) {
      filteredVoices = filteredVoices.filter(voice =>
        voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (voice.description && voice.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply gender filter if not 'all'
    if (genderFilter !== 'all') {
      filteredVoices = filteredVoices.filter(voice =>
        voice.gender?.toLowerCase() === genderFilter.toLowerCase()
      );
    }
    
    // Apply accent filter if not 'all'
    if (accentFilter !== 'all') {
      filteredVoices = filteredVoices.filter(voice =>
        voice.accent?.toLowerCase() === accentFilter.toLowerCase()
      );
    }
    
    setVoices(filteredVoices);
  }, [allVoices, activeProvider, searchQuery, genderFilter, accentFilter]);

  // Reset all filters but keep the active provider
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setGenderFilter('all');
    setAccentFilter('all');
    
    // Just apply the provider filter
    const filteredByProvider = allVoices.filter(voice => 
      voice.provider === activeProvider
    );
    
    setVoices(filteredByProvider);
  }, [allVoices, activeProvider]);

  // Initial data fetch
  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);

  // Apply filters when any filter changes
  useEffect(() => {
    if (allVoices.length > 0) {
      applyFilters();
    }
  }, [applyFilters, searchQuery, genderFilter, accentFilter, activeProvider]);

  return {
    voices,
    isLoading,
    error,
    fetchVoices,
    activeProvider,
    setActiveProvider,
    searchQuery,
    setSearchQuery,
    genderFilter,
    setGenderFilter,
    accentFilter,
    setAccentFilter,
    resetFilters
  };
};
