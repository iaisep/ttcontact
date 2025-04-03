
import { useApiContext } from '@/context/ApiContext';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';

export const useSourceApi = () => {
  const { fetchWithAuth } = useApiContext();

  const addSourceToKnowledgeBaseApi = async (
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
    // Prepare request data based on source type
    let requestData: any = {};
    
    if (sourceType === 'url' && sourceData.url) {
      // Format URLs according to the API documentation
      if (sourceData.webPages && sourceData.webPages.length > 0) {
        // If specific webPages are selected
        requestData.knowledge_base_urls = sourceData.webPages
          .filter(page => page.selected)
          .map(page => page.url);
      } else {
        // Single URL
        requestData.knowledge_base_urls = [sourceData.url];
      }
      
      if (sourceData.autoSync !== undefined) {
        requestData.auto_sync = sourceData.autoSync;
      }
    } else if (sourceType === 'file' && sourceData.file) {
      // Format file data
      const formData = new FormData();
      formData.append('file', sourceData.file);
      formData.append('knowledge_base_id', kbId);
      
      // Special case for file uploads - use FormData
      const response = await fetchWithAuth(`/add-knowledge-base-sources`, {
        method: 'POST',
        body: formData,
      });
      
      return response;
    } else if (sourceType === 'text') {
      // Format text content according to the API documentation
      requestData.knowledge_base_texts = [{
        title: sourceData.fileName || 'Untitled',
        text: sourceData.content || '',
      }];
    }
    
    // Call the API endpoint with JSON for URL and text sources
    const response = await fetchWithAuth(`/add-knowledge-base-sources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        knowledge_base_id: kbId,
        ...requestData
      }),
    });
    
    return response;
  };

  const deleteSourceApi = async (kbId: string, sourceId: string) => {
    return await fetchWithAuth(`/delete-knowledge-base-source/${kbId}/source/${sourceId}`, {
      method: 'DELETE',
    });
  };

  // Helper function to create mock data for development
  const createMockSource = (
    sourceType: 'url' | 'file' | 'text',
    sourceData: {
      url?: string,
      file?: File,
      fileName?: string,
      content?: string,
      autoSync?: boolean
    }
  ): KnowledgeBaseSource | null => {
    if (sourceType === 'url') {
      return {
        id: `src_url_${Date.now()}`,
        type: 'url',
        title: sourceData.url || '',
        url: sourceData.url,
        created_at: new Date().toISOString(),
        auto_sync: sourceData.autoSync
      };
    } else if (sourceType === 'file' && sourceData.file) {
      return {
        id: `src_file_${Date.now()}`,
        type: 'file',
        title: sourceData.file.name,
        file_name: sourceData.file.name,
        created_at: new Date().toISOString()
      };
    } else if (sourceType === 'text') {
      return {
        id: `src_text_${Date.now()}`,
        type: 'text',
        title: sourceData.fileName || '',
        content: sourceData.content,
        created_at: new Date().toISOString()
      };
    }
    return null;
  };

  return {
    addSourceToKnowledgeBaseApi,
    deleteSourceApi,
    createMockSource
  };
};
