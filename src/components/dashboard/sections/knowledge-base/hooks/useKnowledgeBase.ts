
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../types';

export const useKnowledgeBase = () => {
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
      // In a real implementation, this would be replaced with /list-knowledge-bases
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
    } catch (error) {
      toast.error('Failed to fetch knowledge bases');
      console.error(error);
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
      // In a real implementation, this would be:
      // const response = await fetchWithAuth('/create-knowledge-base', {
      //   method: 'POST',
      //   body: JSON.stringify({ name }),
      // });
      
      // Mock the response
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
      toast.success('Knowledge base created');
      return newKb;
    } catch (error) {
      toast.error('Failed to create knowledge base');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateKnowledgeBase = async (kb: KnowledgeBase) => {
    try {
      setLoading(true);
      // In a real implementation, this would be:
      // const response = await fetchWithAuth(`/update-knowledge-base/${kb.id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ name: kb.name, auto_sync: kb.auto_sync }),
      // });
      
      setKnowledgeBases(knowledgeBases.map(item => 
        item.id === kb.id ? kb : item
      ));
      
      toast.success('Knowledge base updated');
      return kb;
    } catch (error) {
      toast.error('Failed to update knowledge base');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteKnowledgeBase = async (kbId: string) => {
    try {
      setLoading(true);
      // In a real implementation, this would be:
      // await fetchWithAuth(`/delete-knowledge-base/${kbId}`, {
      //   method: 'DELETE',
      // });
      
      setKnowledgeBases(knowledgeBases.filter(kb => kb.id !== kbId));
      toast.success('Knowledge base deleted');
    } catch (error) {
      toast.error('Failed to delete knowledge base');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addSourceToKnowledgeBase = async (
    kbId: string, 
    sourceType: 'url' | 'file' | 'text',
    sourceData: {
      url?: string,
      file?: File,
      fileName?: string,
      content?: string,
      autoSync?: boolean,
      webPages?: WebPage[]
    }
  ) => {
    try {
      setLoading(true);
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) throw new Error('Knowledge base not found');
      
      let newSource: KnowledgeBaseSource | null = null;
      
      if (sourceType === 'url') {
        // In a real implementation, this would call the API
        newSource = {
          id: `src_url_${Date.now()}`,
          type: 'url',
          title: sourceData.url || '',
          url: sourceData.url,
          created_at: new Date().toISOString(),
          auto_sync: sourceData.autoSync
        };
      } else if (sourceType === 'file' && sourceData.file) {
        // In a real implementation, this would upload the file
        newSource = {
          id: `src_file_${Date.now()}`,
          type: 'file',
          title: sourceData.file.name,
          file_name: sourceData.file.name,
          created_at: new Date().toISOString()
        };
      } else if (sourceType === 'text') {
        // In a real implementation, this would call the API
        newSource = {
          id: `src_text_${Date.now()}`,
          type: 'text',
          title: sourceData.fileName || '',
          content: sourceData.content,
          created_at: new Date().toISOString()
        };
      }
      
      if (newSource) {
        const updatedKb = {...kb};
        updatedKb.sources = [...updatedKb.sources, newSource];
        updatedKb.source_count = updatedKb.sources.length;
        
        if (sourceType === 'url' && sourceData.autoSync) {
          updatedKb.auto_sync = true;
        }
        
        setKnowledgeBases(knowledgeBases.map(item => 
          item.id === kbId ? updatedKb : item
        ));
        
        toast.success('Source added to knowledge base');
        return updatedKb;
      }
      
      throw new Error('Failed to add source');
    } catch (error) {
      toast.error('Failed to add source to knowledge base');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSource = async (kbId: string, sourceId: string) => {
    try {
      setLoading(true);
      
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) throw new Error('Knowledge base not found');
      
      // In a real implementation, this would be:
      // await fetchWithAuth(`/delete-knowledge-base-source/${kbId}/source/${sourceId}`, {
      //   method: 'DELETE',
      // });
      
      const updatedKb = {...kb};
      updatedKb.sources = updatedKb.sources.filter(src => src.id !== sourceId);
      updatedKb.source_count = updatedKb.sources.length;
      
      setKnowledgeBases(knowledgeBases.map(item => 
        item.id === kbId ? updatedKb : item
      ));
      
      toast.success('Source deleted from knowledge base');
      return updatedKb;
    } catch (error) {
      toast.error('Failed to delete source');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resyncKnowledgeBase = async (kb: KnowledgeBase) => {
    try {
      setLoading(true);
      // Find URL sources to resync
      const urlSources = kb.sources.filter(src => src.type === 'url');
      
      if (urlSources.length === 0) {
        toast.error('No URL sources to resync');
        return;
      }
      
      // For each URL source, re-fetch sitemap
      for (const source of urlSources) {
        if (source.url) {
          // In a real implementation, this would call the API
          // await fetchWithAuth('/list-sitemap', {
          //   method: 'POST',
          //   body: JSON.stringify({ website_url: source.url }),
          // });
        }
      }
      
      toast.success('Knowledge base resynced');
    } catch (error) {
      toast.error('Failed to resync knowledge base');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSitemap = async (url: string) => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from API
      // const response = await fetchWithAuth('/list-sitemap', {
      //   method: 'POST',
      //   body: JSON.stringify({ website_url: url }),
      // });
      
      // Mock pages
      const mockPages = [
        { url: `${url}/about`, title: 'About Us', selected: false },
        { url: `${url}/products`, title: 'Products', selected: false },
        { url: `${url}/contact`, title: 'Contact', selected: false },
        { url: `${url}/blog`, title: 'Blog', selected: false }
      ];
      
      return mockPages;
    } catch (error) {
      toast.error('Failed to fetch sitemap');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const hasUrlSources = (kb: KnowledgeBase) => {
    return kb.sources.some(source => source.type === 'url');
  };

  const filteredKnowledgeBases = knowledgeBases.filter(kb =>
    kb.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get paginated data
  const paginatedKnowledgeBases = filteredKnowledgeBases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return {
    knowledgeBases,
    loading,
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
    deleteKnowledgeBase,
    addSourceToKnowledgeBase,
    deleteSource,
    resyncKnowledgeBase,
    fetchSitemap,
    hasUrlSources
  };
};
