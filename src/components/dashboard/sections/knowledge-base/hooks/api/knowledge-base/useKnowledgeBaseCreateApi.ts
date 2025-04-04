
import { useState } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { KnowledgeBase } from '../../../types';

export const useKnowledgeBaseCreateApi = () => {
  const { baseURL } = useApiContext();
  const [loading, setLoading] = useState(false);

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
      
      console.log('Creating knowledge base with form data:', {
        name,
        urls,
        autoSync
      });
      
      // Get the auth token for authorization header
      const authToken = localStorage.getItem('auth_token');
      
      // Create the form data using FormData
      const formData = new FormData();
      formData.append('knowledge_base_name', name);
      formData.append('knowledge_base_texts', '[]');
      formData.append('knowledge_base_urls', JSON.stringify(urls));
      formData.append('enable_auto_refresh', String(autoSync));
      
      // Make the request using fetch
      const response = await fetchWithAuth(`${baseURL}/create-knowledge-base`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': `Bearer ${authToken}`
        },
        body: formData,
        credentials: 'include',
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Knowledge base creation response:', responseData);
      
      const createdKb: KnowledgeBase = {
        id: responseData.knowledge_base_id,
        name: responseData.knowledge_base_name || name,
        created_at: new Date(responseData.user_modified_timestamp || Date.now()).toISOString(),
        updated_at: new Date(responseData.user_modified_timestamp || Date.now()).toISOString(),
        source_count: urls.length,
        sources: urls.map(url => ({
          id: `src_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'url',
          title: url,
          url: url,
          created_at: new Date().toISOString(),
        })),
        auto_sync: responseData.enable_auto_refresh || autoSync
      };
      
      toast.success('Knowledge base created');
      return createdKb;
    } catch (error) {
      console.error('Failed to create knowledge base:', error);
      toast.error('Failed to create knowledge base');
      
      // Fallback to return a mock knowledge base in case of error
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

  return {
    loading,
    setLoading,
    createKnowledgeBase
  };
};
