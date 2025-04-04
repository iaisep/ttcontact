
import { useState } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { KnowledgeBase } from '../../../types';

export const useKnowledgeBaseCreateApi = () => {
  const { fetchWithAuth } = useApiContext();
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
      
      const formData = new FormData();
      formData.append('knowledge_base_name', name);
      
      formData.append('knowledge_base_texts', JSON.stringify([]));
      
      formData.append('knowledge_base_urls', JSON.stringify(urls));
      
      formData.append('enable_auto_refresh', String(autoSync));
      
      console.log('Creating knowledge base with FormData:', {
        name,
        urls,
        autoSync
      });
      
      const response = await fetchWithAuth('/create-knowledge-base', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary6LtSoBCD0u4vEY2L'
        },
        body: formData,
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

  return {
    loading,
    setLoading,
    createKnowledgeBase
  };
};
