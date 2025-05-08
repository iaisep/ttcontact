
import { useState, useEffect } from 'react';
import { ApiKey } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedApiKeys, setRevealedApiKeys] = useState<{ [key: string]: string | null }>({});

  // Fetch API keys from Supabase
  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('No authenticated user found');
      }

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data from Supabase to our ApiKey type
      const formattedKeys = data.map((key): ApiKey => ({
        id: key.id,
        name: key.name,
        prefix: key.key.substring(0, 8), // First 8 characters as prefix
        created_at: key.created_at,
        last_used: key.last_used_at || undefined,
        is_active: key.is_active
      }));
      
      setApiKeys(formattedKeys);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Toggle API key visibility
  const toggleApiKeyVisibility = (apiKeyId: string) => {
    setRevealedApiKeys(prev => ({
      ...prev,
      [apiKeyId]: prev[apiKeyId] ? null : null // We can't reveal the full key after creation
    }));
    
    toast.info("Full API key is only visible once when created", {
      description: "For security reasons, we can't show the full key again"
    });
  };

  // Generate secure API key
  const generateSecureKey = (): string => {
    // Generate a random string of 32 characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomPart = Array(32).fill(0).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    return `ak_${randomPart}`;
  };

  // Create new API key
  const createApiKey = async (name: string) => {
    if (!name.trim()) {
      toast.error('Please enter a name for your API key');
      return null;
    }

    try {
      const newKey = generateSecureKey();
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('No authenticated user found');
      }

      const { data, error } = await supabase
        .from('api_keys')
        .insert([{
          name: name,
          key: newKey,
          user_id: user.user.id
        }])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        // Add the new key to the state
        const formattedKey: ApiKey = {
          id: data[0].id,
          name: data[0].name,
          prefix: newKey.substring(0, 8), // First 8 characters as prefix
          created_at: data[0].created_at,
          is_active: data[0].is_active
        };

        setApiKeys([formattedKey, ...apiKeys]);
        toast.success('API key created successfully');
        return newKey; // Return full key only at creation time
      }
      
      return null;
    } catch (error) {
      console.error('Failed to create API key:', error);
      toast.error('Failed to create API key');
      return null;
    }
  };

  // Delete/revoke API key
  const deleteApiKey = async (id: string) => {
    try {
      // We're not actually deleting, just setting is_active to false (revoking)
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      // Update local state to reflect the change
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, is_active: false } : key
      ));
      
      toast.success('API key revoked successfully');
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      toast.error('Failed to revoke API key');
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
