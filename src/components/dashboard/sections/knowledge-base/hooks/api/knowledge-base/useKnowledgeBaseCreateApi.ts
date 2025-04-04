
import { useState } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { KnowledgeBase } from '../../../types';

export const useKnowledgeBaseCreateApi = () => {
  const { fetchWithAuth, baseURL } = useApiContext();
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
      
      // Crear el FormData
      const formData = new FormData();
      
      // Asegurarse de que el nombre se establezca correctamente, priorizando el valor del usuario
      // Solo usar el valor por defecto si el nombre está completamente vacío
      if (!name) {
        name = 'New Knowledge Base';
      }
      
      formData.append('knowledge_base_name', name);
      formData.append('knowledge_base_texts', '[]');
      formData.append('knowledge_base_urls', JSON.stringify(urls));
      formData.append('enable_auto_refresh', String(autoSync));
      
      console.log('Request URL:', `${baseURL}/create-knowledge-base`);
      console.log('Form data:', Object.fromEntries(formData.entries()));
      
      const response = await fetchWithAuth('create-knowledge-base', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
        },
        body: formData,
        mode: 'cors'
      });
      
      console.log('Knowledge base creation response:', response);
      
      const responseData = response;
      
      const createdKb: KnowledgeBase = {
        id: responseData.knowledge_base_id || `kb_${Date.now()}`,
        name: name, // Usar el nombre proporcionado por el usuario
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
      
      // Fallback para devolver un knowledge base simulado en caso de error
      const name = typeof nameOrData === 'string' ? nameOrData : (nameOrData.name || 'New Knowledge Base');
      
      const newKb: KnowledgeBase = {
        id: `kb_${Date.now()}`,
        name: name, // Usar el nombre proporcionado por el usuario
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
