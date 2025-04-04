
import { useState } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../../types';

export const useSourceApi = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(false);

  const addSourceToKnowledgeBase = async (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => {
    try {
      setLoading(true);
      
      let apiEndpoint = '/create-knowledge-base';
      let formData = new FormData();
      let sourceName = ""; // Default name for the source

      if (sourceType === 'url') {
        const knowledgeBaseName = sourceData.knowledgeBaseName || `KB with URLs`;
        sourceName = knowledgeBaseName; // Store for later use
        
        formData.append('knowledge_base_id', kbId);
        formData.append('knowledge_base_name', knowledgeBaseName);
        
        formData.append('knowledge_base_texts', JSON.stringify([]));
        
        const urls = sourceData.webPages && Array.isArray(sourceData.webPages) 
          ? sourceData.webPages.map((page: WebPage) => page.url) 
          : [sourceData.url];
        
        formData.append('knowledge_base_urls', JSON.stringify(urls));
        
        formData.append('enable_auto_refresh', String(sourceData.autoSync || false));
        
        console.log('Adding URL sources with FormData:', {
          knowledgeBaseName,
          urls,
          autoSync: sourceData.autoSync || false
        });
        
        const response = await fetchWithAuth(apiEndpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary6LtSoBCD0u4vEY2L'
          },
          body: formData,
        });
        
        console.log('Added URL sources response:', response);
      } else if (sourceType === 'file') {
        formData.append('knowledge_base_id', kbId);
        const fileName = sourceData.file?.name || "File Source";
        sourceName = fileName;
        
        if (sourceData.file) {
          formData.append('file', sourceData.file);
        }
        
        formData.append('knowledge_base_texts', JSON.stringify([]));
        formData.append('knowledge_base_urls', JSON.stringify([]));
        
        const response = await fetchWithAuth(apiEndpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary6LtSoBCD0u4vEY2L'
          },
          body: formData,
        });
        
        console.log('Added file source response:', response);
      } else if (sourceType === 'text') {
        formData.append('knowledge_base_id', kbId);
        const fileName = sourceData.fileName || "Text Content";
        sourceName = fileName;
        
        const textContent = [{
          title: fileName,
          text: sourceData.content || ''
        }];
        
        formData.append('knowledge_base_texts', JSON.stringify(textContent));
        formData.append('knowledge_base_urls', JSON.stringify([]));
        
        formData.append('enable_auto_refresh', 'false');
        
        const response = await fetchWithAuth(apiEndpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary6LtSoBCD0u4vEY2L'
          },
          body: formData,
        });
        
        console.log('Added text source response:', response);
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
        name: sourceName || "Knowledge Base",
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

  const deleteSource = async (kbId: string, sourceId: string): Promise<KnowledgeBase> => {
    try {
      setLoading(true);
      
      // API endpoint for deleting a source
      const endpoint = `/kb/${kbId}/sources/${sourceId}`;
      
      console.log(`Deleting source ${sourceId} from KB ${kbId}`);
      
      // Make the API call
      await fetchWithAuth(endpoint, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      });
      
      // For now, return a mock response since we don't have the actual KB data
      const mockResponse: KnowledgeBase = {
        id: kbId,
        name: "Knowledge Base",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_count: 0,
        sources: [], // Removed the source
        auto_sync: false
      };
      
      return mockResponse;
    } catch (error) {
      console.error(`Failed to delete source:`, error);
      toast.error(`Failed to delete source`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    addSourceToKnowledgeBase,
    deleteSource
  };
};
