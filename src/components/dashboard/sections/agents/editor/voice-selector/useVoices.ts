
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { Voice } from '@/components/dashboard/sections/agents/detail/voice-selection/types';

export const useVoices = () => {
  const { fetchWithAuth } = useApiContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Filters state
  const [activeProvider, setActiveProvider] = useState('elevenlabs');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [accentFilter, setAccentFilter] = useState('all');

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
        setError('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
      setError('Error loading voices');
      toast.error('Error loading voices');
    } finally {
      setIsLoading(false);
      setHasInitiallyLoaded(true);
    }
  };

  // Load voices on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded) {
      fetchVoices();
    }
  }, [hasInitiallyLoaded]);

  const resetFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
    setAccentFilter('all');
  };

  // Filter voices based on user selections
  const getFilteredVoices = () => {
    return voices.filter(voice => {
      // Filter by provider
      if (activeProvider === 'elevenlabs' && !voice.id?.includes('eleven')) {
        return false;
      }
      if (activeProvider === 'playht' && !voice.id?.includes('playht')) {
        return false;
      }
      if (activeProvider === 'openai' && !voice.id?.includes('openai')) {
        return false;
      }

      // Filter by search query
      if (searchQuery && !(
        voice.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voice.id?.toLowerCase().includes(searchQuery.toLowerCase())
      )) {
        return false;
      }

      // Filter by gender
      if (genderFilter !== 'all' && voice.gender?.toLowerCase() !== genderFilter.toLowerCase()) {
        return false;
      }

      // Filter by accent
      if (accentFilter !== 'all' && voice.accent?.toLowerCase() !== accentFilter.toLowerCase()) {
        return false;
      }

      return true;
    });
  };

  return {
    isLoading,
    error,
    fetchVoices,
    voices: getFilteredVoices(),
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
