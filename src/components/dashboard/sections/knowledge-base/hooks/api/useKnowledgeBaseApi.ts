import { useState } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { KnowledgeBase, WebPage } from '../../types';

export const useKnowledgeBaseApi = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(false);

  const fetchKnowledgeBases = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/list-knowledge-bases');
      console.log('Knowledge base response:', response);
      
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

  const createKnowledgeBase = async (nameOrData: string | { 
    name: string; 
    urls?: string[]; 
    autoSync?: boolean 
  }) => {
    try {
      setLoading(true);
      
      let name: string;
      let urls: string[] = [];
      let autoSync: boolean = false;
      
      if (typeof nameOrData === 'string') {
        name = nameOrData;
      } else {
        name = nameOrData.name;
        urls = nameOrData.urls || [];
        autoSync = nameOrData.autoSync || false;
      }
      
      const requestData = {
        knowledge_base_name: name,
        knowledge_base_texts: [],
        knowledge_base_urls: urls,
        enable_auto_refresh: autoSync
      };
      
      console.log('Creating knowledge base with data:', requestData);
      
      const response = await fetchWithAuth('/create-knowledge-base', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
      
      console.log('Knowledge base creation response:', response);
      
      const createdKb: KnowledgeBase = {
        id: response.knowledge_base_id,
        name: response.knowledge_base_name || name,
        created_at: new Date(response.user_modified_timestamp || Date.now()).toISOString(),
        updated_at: new Date(response.user_modified_timestamp || Date.now()).toISOString(),
        source_count: urls.length,
        sources: urls.map(url => ({
          id: `src_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'url',
          title: url,
          url: url,
          created_at: new Date().toISOString(),
        })),
        auto_sync: response.enable_auto_refresh || autoSync
      };
      
      toast.success('Knowledge base created');
      return createdKb;
    } catch (error) {
      console.error('Failed to create knowledge base:', error);
      toast.error('Failed to create knowledge base');
      
      const newKb: KnowledgeBase = {
        id: `kb_${Date.now()}`,
        name: typeof nameOrData === 'string' ? nameOrData : nameOrData.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_count: typeof nameOrData === 'string' ? 0 : (nameOrData.urls?.length || 0),
        sources: typeof nameOrData === 'string' ? [] : (nameOrData.urls || []).map(url => ({
          id: `src_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'url',
          title: url,
          url: url,
          created_at: new Date().toISOString(),
        })),
        auto_sync: typeof nameOrData === 'string' ? false : (nameOrData.autoSync || false)
      };
      
      return newKb;
    } finally {
      setLoading(false);
    }
  };

  const addSourceToKnowledgeBase = async (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => {
    try {
      setLoading(true);
      
      let apiEndpoint = '/create-knowledge-base';
      let requestData: any = {};
      
      if (sourceType === 'url') {
        const knowledgeBaseName = sourceData.knowledgeBaseName || `KB with URLs`;
        
        requestData = {
          knowledge_base_id: kbId,
          knowledge_base_name: knowledgeBaseName,
          knowledge_base_texts: [],
          knowledge_base_urls: sourceData.webPages && Array.isArray(sourceData.webPages) 
            ? sourceData.webPages.map((page: WebPage) => page.url) 
            : [sourceData.url],
          enable_auto_refresh: sourceData.autoSync || false
        };
        
        console.log('Adding URL sources with requestData:', requestData);
        
        const response = await fetchWithAuth(apiEndpoint, {
          method: 'POST',
          body: JSON.stringify(requestData),
        });
        
        console.log('Added URL sources response:', response);
      } else if (sourceType === 'file') {
        // Handle file upload
        // Implementation specific to your API
      } else if (sourceType === 'text') {
        // Handle text source
        // Implementation specific to your API
      }
      
      const newSource = {
        id: `src_${Date.now()}`,
        type: sourceType,
        title: sourceType === 'url' 
          ? (sourceData.webPages && sourceData.webPages.length > 0 ? sourceData.webPages[0].title : sourceData.url) 
          : (sourceType === 'file' ? sourceData.file.name : sourceData.fileName),
        url: sourceType === 'url' ? (sourceData.webPages && sourceData.webPages.length > 0 ? sourceData.webPages[0].url : sourceData.url) : undefined,
        file_name: sourceType === 'file' ? sourceData.file.name : 
                  (sourceType === 'text' ? sourceData.fileName : undefined),
        content: sourceType === 'text' ? sourceData.content : undefined,
        created_at: new Date().toISOString(),
        auto_sync: sourceType === 'url' ? sourceData.autoSync : undefined
      };
      
      const updatedKb: KnowledgeBase = {
        id: kbId,
        name: requestData.knowledge_base_name || "Knowledge Base",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_count: 1,
        sources: [newSource],
        auto_sync: sourceType === 'url' ? sourceData.autoSync || false : false
      };
      
      return updatedKb;
    } catch (error) {
      console.error(`Failed to add ${sourceType} source:`, error);
      toast.error(`Failed to add ${sourceType} source`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateKnowledgeBase = async (kb: KnowledgeBase) => {
    try {
      setLoading(true);
      
      const updateData = {
        knowledge_base_id: kb.id,
        knowledge_base_name: kb.name,
        enable_auto_refresh: kb.auto_sync
      };
      
      await fetchWithAuth(`/add-knowledge-base-sources/${kb.id}`, {
        method: 'POST',
        body: JSON.stringify(updateData),
      });
      
      toast.success('Knowledge base updated');
      return kb;
    } catch (error) {
      console.error('Failed to update knowledge base:', error);
      toast.error('Failed to update knowledge base');
      
      return kb;
    } finally {
      setLoading(false);
    }
  };

  const deleteKnowledgeBase = async (kbId: string) => {
    try {
      setLoading(true);
      
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

  const fetchSitemap = async (url: string): Promise<WebPage[]> => {
    try {
      setLoading(true);
      console.log('Fetching sitemap for URL:', url);
      
      const response = await fetchWithAuth('/list-sitemap', {
        method: 'POST',
        body: JSON.stringify({ website_url: url }),
      });
      
      if (response && response.pages) {
        return response.pages.map((page: any) => ({
          url: page.url,
          title: page.title || page.url,
          selected: true
        }));
      }
      
      const mockPages: WebPage[] = [
        {
          url: `${url}/page1`,
          title: 'Page 1',
          selected: true
        },
        {
          url: `${url}/page2`,
          title: 'Page 2',
          selected: true
        },
        {
          url: `${url}/page3`,
          title: 'Page 3',
          selected: true
        }
      ];
      
      return mockPages;
    } catch (error) {
      console.error('Failed to fetch sitemap:', error);
      toast.error('Failed to fetch sitemap');
      throw error;
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
    deleteKnowledgeBase,
    addSourceToKnowledgeBase,
    fetchSitemap
  };
};
