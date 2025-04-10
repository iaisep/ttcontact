
import { useState, useEffect } from 'react';
import { ApiKey } from '../types';
import { toast } from 'sonner';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedApiKeys, setRevealedApiKeys] = useState<{ [key: string]: string | null }>({});

  // Mock data for API keys
  const mockApiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'Production API Key',
      prefix: 'ak_prod_',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      last_used: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: '2',
      name: 'Development API Key',
      prefix: 'ak_dev_',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      last_used: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: '3',
      name: 'Testing API Key',
      prefix: 'ak_test_',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
  ];

  // Load initial data
  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Toggle API key visibility
  const toggleApiKeyVisibility = (apiKeyId: string) => {
    setRevealedApiKeys(prev => ({
      ...prev,
      [apiKeyId]: prev[apiKeyId] ? null : `${apiKeyId}_mock_full_api_key`
    }));
  };

  // Fetch API keys from server (mock)
  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      setApiKeys(mockApiKeys);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  // Create new API key
  const createApiKey = async (name: string) => {
    if (!name.trim()) {
      toast.error('Please enter a name for your API key');
      return null;
    }

    try {
      const prefix = 'ak_' + Math.random().toString(36).substring(2, 8) + '_';
      const newKey = prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const mockResponse = {
        id: 'new_' + Math.random().toString(36).substring(2, 9),
        name: name,
        prefix: prefix,
        created_at: new Date().toISOString(),
        key: newKey,
      };

      setApiKeys([...apiKeys, {
        id: mockResponse.id,
        name: mockResponse.name,
        prefix: mockResponse.prefix,
        created_at: mockResponse.created_at,
      }]);
      
      toast.success('API key created successfully');
      return mockResponse.key;
    } catch (error) {
      console.error('Failed to create API key:', error);
      toast.error('Failed to create API key');
      return null;
    }
  };

  // Delete API key
  const deleteApiKey = async (id: string) => {
    try {
      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  return {
    apiKeys,
    loading,
    revealedApiKeys,
    toggleApiKeyVisibility,
    createApiKey,
    deleteApiKey
  };
}
