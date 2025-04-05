
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
    console.log(`API call: Adding ${sourceType} source to KB ${kbId}:`, sourceData);
    
    // Create FormData object for all types
    const formData = new FormData();
    formData.append('knowledge_base_id', kbId);
    
    if (sourceType === 'url') {
      // Format URLs according to the API documentation
      // Empty arrays for file and text content
      formData.append('knowledge_base_texts', '[]');
      
      // Add URL data
      const urls = sourceData.webPages && Array.isArray(sourceData.webPages) 
        ? sourceData.webPages.map(page => page.url) 
        : [sourceData.url];
      
      formData.append('knowledge_base_urls', JSON.stringify(urls));
      formData.append('enable_auto_refresh', String(sourceData.autoSync || false));
      
      console.log('API call data for URL source:', {
        urls,
        autoSync: sourceData.autoSync || false
      });
    } 
    else if (sourceType === 'file' && sourceData.file) {
      // For file upload, include the file in formData
      formData.append('knowledge_base_files', sourceData.file);
      
      // Empty arrays for text and URL content
      formData.append('knowledge_base_texts', '[]');
      formData.append('knowledge_base_urls', '[]');
      
      console.log("Uploading file:", sourceData.file.name, "to KB:", kbId);
    } 
    else if (sourceType === 'text') {
      // Format text content according to the API documentation
      const textContent = [{
        title: sourceData.fileName || 'Untitled',
        text: sourceData.content || '',
        uuid: 'm' + Math.random().toString(36).substring(2, 15)
      }];
      
      formData.append('knowledge_base_texts', JSON.stringify(textContent));
      formData.append('knowledge_base_urls', '[]');
      
      console.log("Adding text content with title:", sourceData.fileName);
    }
    
    try {
      // Call the API endpoint with FormData for all source types
      const response = await fetchWithAuth(`/add-knowledge-base-sources/${kbId}`, {
        method: 'POST',
        // Don't set Content-Type header when using FormData
        // The browser will automatically set the correct Content-Type with boundary
        body: formData,
        mode: 'cors'
      });
      
      console.log(`Added ${sourceType} source response:`, response);
      return response;
    } catch (error) {
      console.error(`API error adding ${sourceType} source:`, error);
      throw error;
    }
  };

  const deleteSourceApi = async (kbId: string, sourceId: string) => {
    console.log(`Deleting source ${sourceId} from KB ${kbId}`);
    
    return await fetchWithAuth(`/kb/${kbId}/sources/${sourceId}`, {
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
      autoSync?: boolean,
      webPages?: WebPage[]
    }
  ): KnowledgeBaseSource | null => {
    if (sourceType === 'url') {
      // If we have web pages, use them to create mock sources
      if (sourceData.webPages && sourceData.webPages.length > 0) {
        // Create a source for each web page for better visibility
        const firstPage = sourceData.webPages[0];
        return {
          id: `src_url_${Date.now()}`,
          type: 'url',
          title: firstPage.title || 'Website',
          url: firstPage.url,
          created_at: new Date().toISOString(),
          auto_sync: sourceData.autoSync
        };
      }
      
      // Fallback to single URL
      return {
        id: `src_url_${Date.now()}`,
        type: 'url',
        title: 'Website',
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
        title: sourceData.fileName || 'Text Content',
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
