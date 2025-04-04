import { useState } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { KnowledgeBase } from '../../types';

export const useKnowledgeBaseApi = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(false);

  const fetchKnowledgeBases = async () => {
    setLoading(true);
    try {
      // Use the real API endpoint
      const response = await fetchWithAuth('/list-knowledge-bases');
      console.log('Knowledge base response:', response);
      
      // Transform API response to match our KnowledgeBase type if needed
      const transformedData = response.map((kb: any) => ({
        id: kb.knowledge_base_id || kb.id,
        name: kb.knowledge_base_name || kb.name,
        created_at: new Date(kb.user_modified_timestamp).toISOString(),
        updated_at: new Date(kb.user_modified_timestamp).toISOString(),
        source_count: kb.knowledge_base_sources?.length || 0,
        sources: kb.knowledge_base_sources?.map((source: any) => ({
          id: source.source_id,
          type: source.type,
          title: source.filename || source.url || 'Source',
          url: source.url || '',
          file_name: source.filename || '',
          content: source.content || '',
          created_at: new Date().toISOString(),
        })) || [],
        auto_sync: kb.enable_auto_refresh || false
      }));
      
      return transformedData;
    } catch (error) {
      console.error('Failed to fetch knowledge bases:', error);
      toast.error('Failed to fetch knowledge bases');
      
      // Return mock data for development fallback
      return getMockKnowledgeBases();
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await fetchWithAuth('/list-agents');
      return data;
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      return [];
    }
  };

  const getMockKnowledgeBases = (): KnowledgeBase[] => {
    return [
      {
        id: 'kb_123456',
        name: 'Product Documentation',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_count: 3,
        sources: [
          {
            id: 'src_123',
            type: 'url',
            title: 'Product Homepage',
            url: 'https://example.com/products',
            created_at: new Date().toISOString(),
          },
          {
            id: 'src_124',
            type: 'file',
            title: 'User Manual',
            file_name: 'user_manual.pdf',
            created_at: new Date().toISOString(),
          },
          {
            id: 'src_125',
            type: 'text',
            title: 'API Overview',
            content: 'Our API uses REST principles and returns JSON responses.',
            created_at: new Date().toISOString(),
          }
        ],
        auto_sync: false
      },
      {
        id: 'kb_789012',
        name: 'Customer FAQs',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_count: 1,
        sources: [
          {
            id: 'src_789',
            type: 'text',
            title: 'Common Questions',
            content: 'Q: How do I reset my password? A: Visit the login page and click "Forgot Password".',
            created_at: new Date().toISOString(),
          }
        ],
        auto_sync: false
      }
    ];
  };

  const createKnowledgeBase = async (name: string) => {
    try {
      setLoading(true);
      
      // Format the request data according to the API screenshots
      const requestData = {
        knowledge_base_name: name,
        knowledge_base_texts: [],
        knowledge_base_urls: [],
        enable_auto_refresh: false
      };
      
      console.log('Creating knowledge base with data:', requestData);
      
      // Call the actual API endpoint
      const response = await fetchWithAuth('/create-knowledge-base', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
      
      console.log('Knowledge base creation response:', response);
      
      // Map the response to our KnowledgeBase type
      const createdKb: KnowledgeBase = {
        id: response.knowledge_base_id,
        name: response.knowledge_base_name,
        created_at: new Date(response.user_modified_timestamp).toISOString(),
        updated_at: new Date(response.user_modified_timestamp).toISOString(),
        source_count: 0,
        sources: [],
        auto_sync: response.enable_auto_refresh || false
      };
      
      toast.success('Knowledge base created');
      return createdKb;
    } catch (error) {
      console.error('Failed to create knowledge base:', error);
      toast.error('Failed to create knowledge base');
      
      // Fallback for development - create mock KB
      const newKb: KnowledgeBase = {
        id: `kb_${Date.now()}`,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_count: 0,
        sources: [],
        auto_sync: false
      };
      
      return newKb;
    } finally {
      setLoading(false);
    }
  };

  const updateKnowledgeBase = async (kb: KnowledgeBase) => {
    try {
      setLoading(true);
      
      // Format the data for the API
      const updateData = {
        knowledge_base_id: kb.id,
        knowledge_base_name: kb.name,
        enable_auto_refresh: kb.auto_sync
      };
      
      // Call the actual API endpoint (when available)
      await fetchWithAuth(`/update-knowledge-base/${kb.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      toast.success('Knowledge base updated');
      return kb;
    } catch (error) {
      console.error('Failed to update knowledge base:', error);
      toast.error('Failed to update knowledge base');
      
      // Fallback for development
      return kb;
    } finally {
      setLoading(false);
    }
  };

  const deleteKnowledgeBase = async (kbId: string) => {
    try {
      setLoading(true);
      
      // Call the actual API endpoint
      await fetchWithAuth(`/delete-knowledge-base/${kbId}`, {
        method: 'DELETE',
      });
      
      toast.success('Knowledge base deleted');
    } catch (error) {
      console.error('Failed to delete knowledge base:', error);
      toast.error('Failed to delete knowledge base');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    fetchKnowledgeBases,
    fetchAgents,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase
  };
};
