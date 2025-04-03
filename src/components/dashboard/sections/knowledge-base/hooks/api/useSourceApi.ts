
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
    // Create FormData for API request (allows file uploads)
    const formData = new FormData();
    formData.append('type', sourceType);
    
    if (sourceType === 'url' && sourceData.url) {
      formData.append('url', sourceData.url);
      if (sourceData.autoSync !== undefined) {
        formData.append('auto_sync', String(sourceData.autoSync));
      }
      
      // If webPages are included, add them as selected URLs
      if (sourceData.webPages && sourceData.webPages.length > 0) {
        const selectedUrls = sourceData.webPages
          .filter(page => page.selected)
          .map(page => page.url);
        formData.append('urls', JSON.stringify(selectedUrls));
      }
    } else if (sourceType === 'file' && sourceData.file) {
      formData.append('file', sourceData.file);
    } else if (sourceType === 'text') {
      formData.append('title', sourceData.fileName || 'Untitled');
      formData.append('content', sourceData.content || '');
    }
    
    // Call the API endpoint
    const response = await fetchWithAuth(`/add-knowledge-base-sources/${kbId}`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header when using FormData
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
