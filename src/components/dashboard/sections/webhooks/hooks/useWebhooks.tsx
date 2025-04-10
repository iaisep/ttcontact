import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { Webhook } from '../types';

export const useWebhooks = () => {
  const { fetchWithAuth } = useApiContext();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingWebhookId, setEditingWebhookId] = useState<string | null>(null);
  const [editingWebhookUrl, setEditingWebhookUrl] = useState('');

  const mockWebhooks: Webhook[] = [
    {
      id: '1',
      url: 'https://example.com/webhook',
      events: ['call.started', 'call.ended', 'call.failed'],
      status: 'active',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      last_triggered: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: '2',
      url: 'https://api.myapp.com/retell-webhook',
      events: ['agent.created', 'agent.updated', 'agent.deleted'],
      status: 'active',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      last_triggered: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: '3',
      url: 'https://dev.example.org/hooks/retell',
      events: ['call.transcription.available'],
      status: 'inactive',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
  ];

  useEffect(() => {
    setWebhooks(mockWebhooks);
    setLoading(false);
  }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWebhooks(mockWebhooks);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
      toast.error('Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      setWebhooks(webhooks.filter(webhook => webhook.id !== id));
      toast.success('Webhook deleted successfully');
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      toast.error('Failed to delete webhook');
    }
  };

  const toggleWebhookStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      setWebhooks(webhooks.map(webhook => 
        webhook.id === id 
          ? { ...webhook, status: currentStatus === 'active' ? 'inactive' : 'active' } 
          : webhook
      ));
      
      toast.success(`Webhook ${currentStatus === 'active' ? 'deactivated' : 'activated'}`);
    } catch (error) {
      console.error('Failed to update webhook status:', error);
      toast.error('Failed to update webhook status');
    }
  };

  const testWebhook = async (id: string) => {
    try {
      toast.success('Test event sent to webhook');
    } catch (error) {
      console.error('Failed to test webhook:', error);
      toast.error('Failed to test webhook');
    }
  };
  
  const startEditingWebhook = (webhook: Webhook) => {
    setEditingWebhookId(webhook.id);
    setEditingWebhookUrl(webhook.url);
  };
  
  const saveWebhookUrl = (id: string) => {
    if (!editingWebhookUrl.trim()) {
      toast.error('Webhook URL cannot be empty');
      return;
    }
    
    try {
      setWebhooks(webhooks.map(webhook => 
        webhook.id === id 
          ? { ...webhook, url: editingWebhookUrl } 
          : webhook
      ));
      
      setEditingWebhookId(null);
      toast.success('Webhook URL updated');
    } catch (error) {
      console.error('Failed to update webhook URL:', error);
      toast.error('Failed to update webhook URL');
    }
  };
  
  const cancelEditingWebhook = () => {
    setEditingWebhookId(null);
  };

  const createWebhook = async (url: string, selectedEvents: string[]) => {
    if (!url.trim()) {
      toast.error('Please enter a webhook URL');
      return false;
    }

    if (selectedEvents.length === 0) {
      toast.error('Please select at least one event');
      return false;
    }

    try {
      const mockResponse = {
        id: 'new_' + Math.random().toString(36).substring(2, 9),
        url: url,
        events: selectedEvents,
        status: 'active',
        created_at: new Date().toISOString(),
      };

      setWebhooks([...webhooks, mockResponse as Webhook]);
      toast.success('Webhook created successfully');
      return true;
    } catch (error) {
      console.error('Failed to create webhook:', error);
      toast.error('Failed to create webhook');
      return false;
    }
  };

  const importWebhooks = async (importedWebhooks: Webhook[]) => {
    try {
      setWebhooks([...webhooks, ...importedWebhooks]);
    } catch (error) {
      console.error('Failed to import webhooks:', error);
      toast.error('Failed to import webhooks');
    }
  };

  const filteredWebhooks = webhooks.filter(webhook =>
    webhook.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.events.some(event => event.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedWebhooks = filteredWebhooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  return {
    webhooks,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    editingWebhookId,
    editingWebhookUrl,
    setEditingWebhookUrl,
    filteredWebhooks,
    paginatedWebhooks,
    fetchWebhooks,
    deleteWebhook,
    toggleWebhookStatus,
    testWebhook,
    startEditingWebhook,
    saveWebhookUrl,
    cancelEditingWebhook,
    createWebhook,
    importWebhooks
  };
};
