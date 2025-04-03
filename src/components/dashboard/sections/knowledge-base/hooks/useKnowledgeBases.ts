import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { KnowledgeBase } from '../types';

export const useKnowledgeBases = () => {
  const { fetchWithAuth } = useApiContext();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    fetchKnowledgeBases();
    fetchAgents();
  }, []);

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
      
      setKnowledgeBases(transformedData);
    } catch (error) {
      console.error('Failed to fetch knowledge bases:', error);
      toast.error('Failed to fetch knowledge bases');
      
      // Fallback to mock data for development
      const mockData: KnowledgeBase[] = [
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
      
      setKnowledgeBases(mockData);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await fetchWithAuth('/list-agents');
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const createKnowledgeBase = async (name: string) => {
    try {
      setLoading(true);
      
      // Call the actual API endpoint
      const response = await fetchWithAuth('/create-knowledge-base', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      
      // Update local state with the new knowledge base
      setKnowledgeBases([...knowledgeBases, response]);
      toast.success('Knowledge base created');
      return response;
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
      
      setKnowledgeBases([...knowledgeBases, newKb]);
      return newKb;
    } finally {
      setLoading(false);
    }
  };

  const updateKnowledgeBase = async (kb: KnowledgeBase) => {
    try {
      setLoading(true);
      
      // Call the actual API endpoint (when available)
      await fetchWithAuth(`/update-knowledge-base/${kb.id}`, {
        method: 'PUT',
        body: JSON.stringify(kb),
      });
      
      // Update local state
      setKnowledgeBases(knowledgeBases.map(item => 
        item.id === kb.id ? kb : item
      ));
      
      toast.success('Knowledge base updated');
      return kb;
    } catch (error) {
      console.error('Failed to update knowledge base:', error);
      toast.error('Failed to update knowledge base');
      
      // Fallback for development
      setKnowledgeBases(knowledgeBases.map(item => 
        item.id === kb.id ? kb : item
      ));
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
      
      // Update local state
      setKnowledgeBases(knowledgeBases.filter(kb => kb.id !== kbId));
      toast.success('Knowledge base deleted');
    } catch (error) {
      console.error('Failed to delete knowledge base:', error);
      toast.error('Failed to delete knowledge base');
      
      // Fallback for development
      setKnowledgeBases(knowledgeBases.filter(kb => kb.id !== kbId));
    } finally {
      setLoading(false);
    }
  };

  // Safe filtering for knowledgebases with potentially undefined name
  const filteredKnowledgeBases = knowledgeBases.filter(kb =>
    kb.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  const paginatedKnowledgeBases = filteredKnowledgeBases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return {
    knowledgeBases,
    setKnowledgeBases,
    loading,
    setLoading,
    currentPage,
    pageSize,
    searchQuery,
    agents,
    filteredKnowledgeBases,
    paginatedKnowledgeBases,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    fetchKnowledgeBases,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase
  };
};
