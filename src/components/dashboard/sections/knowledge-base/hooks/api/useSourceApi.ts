
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
    
    // Prepare request data based on source type
    let requestData: any = {
      knowledge_base_id: kbId
    };
    
    if (sourceType === 'url') {
      // Format URLs according to the API documentation
      const urls = [];
      
      // Extract URLs from the webPages array if available
      if (sourceData.webPages && sourceData.webPages.length > 0) {
        urls.push(...sourceData.webPages.map(page => page.url));
      } else if (sourceData.url) {
        // Otherwise use the main URL
        urls.push(sourceData.url);
      }
      
      // Add URLs to the request
      if (urls.length > 0) {
        requestData.knowledge_base_urls = urls;
        requestData.enable_auto_refresh = !!sourceData.autoSync;
      }
      
      console.log('API call data for URL source:', requestData);
      
      try {
        // Call the API endpoint for URL sources
        const response = await fetchWithAuth(`/kb/add-sources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
        console.log('API response for URL source:', response);
        return response;
      } catch (error) {
        console.error('API error adding URL source:', error);
        throw error;
      }
      
    } else if (sourceType === 'file' && sourceData.file) {
      // Format file data - using FormData
      const formData = new FormData();
      formData.append('file', sourceData.file);
      formData.append('knowledge_base_id', kbId);
      
      console.log("Uploading file:", sourceData.file.name, "to KB:", kbId);
      
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
      
      console.log("Adding text content with title:", sourceData.fileName);
      
      // Call the API endpoint with JSON for text sources
      const response = await fetchWithAuth(`/kb/add-sources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      return response;
    }
    
    throw new Error(`Unsupported source type: ${sourceType}`);
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
