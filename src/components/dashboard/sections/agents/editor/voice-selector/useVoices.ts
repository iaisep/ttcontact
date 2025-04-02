
import { useState, useEffect } from 'react';
import { Voice, mockVoices } from '@/components/dashboard/sections/agents/detail/voice-selection/types';

export const useVoices = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allVoices, setAllVoices] = useState<Voice[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [activeProvider, setActiveProvider] = useState<string>('elevenlabs');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [accentFilter, setAccentFilter] = useState<string>('all');

  // Mock fetch function (replace with actual API call)
  const fetchVoices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would fetch from an API here
      const fetchedVoices = mockVoices;
      
      setAllVoices(fetchedVoices);
      filterVoices(fetchedVoices, activeProvider, searchQuery, genderFilter, accentFilter);
      
    } catch (error) {
      console.error('Error fetching voices:', error);
      setError('Failed to load voices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
    setAccentFilter('all');
    filterVoices(allVoices, activeProvider, '', 'all', 'all');
  };

  // Filter voices based on active provider and search query
  const filterVoices = (
    voices: Voice[], 
    provider: string, 
    search: string, 
    gender: string, 
    accent: string
  ) => {
    let filtered = [...voices];
    
    // Filter by provider
    if (provider !== 'all') {
      filtered = filtered.filter(voice => {
        const voiceProvider = voice.provider.toLowerCase();
        return voiceProvider.includes(provider.toLowerCase());
      });
    }
    
    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(voice => 
        voice.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by gender
    if (gender !== 'all') {
      filtered = filtered.filter(voice => 
        voice.gender?.toLowerCase() === gender.toLowerCase()
      );
    }
    
    // Filter by accent
    if (accent !== 'all') {
      filtered = filtered.filter(voice => 
        voice.accent?.toLowerCase() === accent.toLowerCase()
      );
    }
    
    setVoices(filtered);
  };

  // Fetch voices on component mount
  useEffect(() => {
    fetchVoices();
  }, []);

  // Apply filters when filter criteria change
  useEffect(() => {
    if (allVoices.length > 0) {
      filterVoices(allVoices, activeProvider, searchQuery, genderFilter, accentFilter);
    }
  }, [activeProvider, searchQuery, genderFilter, accentFilter]);

  return {
    isLoading,
    error,
    voices,
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
