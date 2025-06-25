
import { useState, useEffect } from 'react';
import { chatwootApi, type ChatwootInbox } from '@/services/chatwootApi';
import { toast } from 'sonner';
import type { Inbox } from './types';

// Transform Chatwoot inbox to our internal format
const transformChatwootInbox = (chatwootInbox: ChatwootInbox): Inbox => {
  let platform = 'Unknown';
  let icon = '📧';
  
  switch (chatwootInbox.channel_type) {
    case 'Channel::WhatsApp':
      platform = 'WhatsApp';
      icon = '💬';
      break;
    case 'Channel::Telegram':
      platform = 'Telegram';
      icon = '✈️';
      break;
    case 'Channel::WebWidget':
      platform = 'Website';
      icon = '🌐';
      break;
    default:
      platform = chatwootInbox.channel_type;
  }

  return {
    id: chatwootInbox.id.toString(),
    name: chatwootInbox.name,
    platform,
    icon,
    status: 'active',
    url: chatwootInbox.website_url,
    phoneNumber: chatwootInbox.phone_number,
    avatarUrl: chatwootInbox.avatar_url,
  };
};

export const useChatwootInboxManager = (onInboxCreated?: (inbox: Inbox) => void) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inboxes, setInboxes] = useState<Inbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load inboxes from Chatwoot API
  const loadInboxes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading inboxes from Chatwoot API...');
      
      const chatwootInboxes = await chatwootApi.getInboxes();
      console.log('Loaded inboxes:', chatwootInboxes);
      
      const transformedInboxes = chatwootInboxes.map(transformChatwootInbox);
      setInboxes(transformedInboxes);
      
      toast.success(`Loaded ${transformedInboxes.length} inboxes`);
    } catch (error) {
      console.error('Error loading inboxes:', error);
      setError(error instanceof Error ? error.message : 'Failed to load inboxes');
      toast.error('Failed to load inboxes from Chatwoot');
    } finally {
      setLoading(false);
    }
  };

  // Create a new WhatsApp inbox
  const createWhatsAppInbox = async (data: {
    name: string;
    phoneNumber: string;
    provider?: string;
    providerConfig?: any;
  }) => {
    try {
      console.log('Creating WhatsApp inbox:', data);
      
      const chatwootInbox = await chatwootApi.createWhatsAppInbox({
        name: data.name,
        phone_number: data.phoneNumber,
        provider: data.provider,
        provider_config: data.providerConfig,
      });
      
      const newInbox = transformChatwootInbox(chatwootInbox);
      setInboxes(prev => [...prev, newInbox]);
      
      if (onInboxCreated) {
        onInboxCreated(newInbox);
      }
      
      toast.success('WhatsApp inbox created successfully');
      return newInbox;
    } catch (error) {
      console.error('Error creating WhatsApp inbox:', error);
      toast.error('Failed to create WhatsApp inbox');
      throw error;
    }
  };

  // Create a new Telegram inbox
  const createTelegramInbox = async (data: {
    name: string;
    botToken: string;
  }) => {
    try {
      console.log('Creating Telegram inbox:', data);
      
      const chatwootInbox = await chatwootApi.createTelegramInbox({
        name: data.name,
        bot_token: data.botToken,
      });
      
      const newInbox = transformChatwootInbox(chatwootInbox);
      setInboxes(prev => [...prev, newInbox]);
      
      if (onInboxCreated) {
        onInboxCreated(newInbox);
      }
      
      toast.success('Telegram inbox created successfully');
      return newInbox;
    } catch (error) {
      console.error('Error creating Telegram inbox:', error);
      toast.error('Failed to create Telegram inbox');
      throw error;
    }
  };

  // Create a new Website inbox
  const createWebsiteInbox = async (data: {
    name: string;
    websiteUrl: string;
    welcomeTitle?: string;
    welcomeTagline?: string;
  }) => {
    try {
      console.log('Creating Website inbox:', data);
      
      const chatwootInbox = await chatwootApi.createWebsiteInbox({
        name: data.name,
        website_url: data.websiteUrl,
        welcome_title: data.welcomeTitle,
        welcome_tagline: data.welcomeTagline,
      });
      
      const newInbox = transformChatwootInbox(chatwootInbox);
      setInboxes(prev => [...prev, newInbox]);
      
      if (onInboxCreated) {
        onInboxCreated(newInbox);
      }
      
      toast.success('Website inbox created successfully');
      return newInbox;
    } catch (error) {
      console.error('Error creating Website inbox:', error);
      toast.error('Failed to create Website inbox');
      throw error;
    }
  };

  // Delete an inbox
  const deleteInbox = async (inboxId: string) => {
    try {
      console.log('Deleting inbox:', inboxId);
      
      await chatwootApi.deleteInbox(parseInt(inboxId));
      setInboxes(prev => prev.filter(inbox => inbox.id !== inboxId));
      
      toast.success('Inbox deleted successfully');
    } catch (error) {
      console.error('Error deleting inbox:', error);
      toast.error('Failed to delete inbox');
      throw error;
    }
  };

  // Update an inbox
  const updateInbox = async (inboxId: string, data: any) => {
    try {
      console.log('Updating inbox:', inboxId, data);
      
      const chatwootInbox = await chatwootApi.updateInbox(parseInt(inboxId), data);
      const updatedInbox = transformChatwootInbox(chatwootInbox);
      
      setInboxes(prev => prev.map(inbox => 
        inbox.id === inboxId ? updatedInbox : inbox
      ));
      
      toast.success('Inbox updated successfully');
      return updatedInbox;
    } catch (error) {
      console.error('Error updating inbox:', error);
      toast.error('Failed to update inbox');
      throw error;
    }
  };

  // Filter inboxes based on search query
  const filteredInboxes = searchQuery.trim() === '' 
    ? inboxes 
    : inboxes.filter(inbox => 
        inbox.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inbox.platform.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Load inboxes on component mount
  useEffect(() => {
    loadInboxes();
  }, []);

  // Expose global functions for forms
  useEffect(() => {
    (window as any).createWhatsAppInbox = createWhatsAppInbox;
    (window as any).createTelegramInbox = createTelegramInbox;
    (window as any).createWebsiteInbox = createWebsiteInbox;
    
    return () => {
      delete (window as any).createWhatsAppInbox;
      delete (window as any).createTelegramInbox;
      delete (window as any).createWebsiteInbox;
    };
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    inboxes,
    filteredInboxes,
    loading,
    error,
    loadInboxes,
    createWhatsAppInbox,
    createTelegramInbox,
    createWebsiteInbox,
    deleteInbox,
    updateInbox,
  };
};
