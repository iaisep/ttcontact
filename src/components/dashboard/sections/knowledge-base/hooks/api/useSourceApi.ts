
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
    let requestData: any = {
      knowledge_base_id: kbId
    };
    
    if (sourceType === 'url') {
      console.log("Processing URL source data:", sourceData);
      
      // Format URLs according to the API documentation
      if (sourceData.webPages && sourceData.webPages.length > 0) {
        // If specific webPages are selected
        const selectedUrls = sourceData.webPages
          .filter(page => page.selected)
          .map(page => page.url);
          
        console.log("Selected URLs:", selectedUrls);
        
        if (selectedUrls.length > 0) {
          requestData.knowledge_base_urls = selectedUrls;
          requestData.enable_auto_refresh = !!sourceData.autoSync;
        }
      } else if (sourceData.url) {
        // Single URL
        requestData.knowledge_base_urls = [sourceData.url];
        requestData.enable_auto_refresh = !!sourceData.autoSync;
      }
      
      console.log("Final URL request data:", requestData);
      
      // Call the API endpoint with JSON for URL sources
      const response = await fetchWithAuth(`/add-knowledge-base-sources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      return response;
      
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
      const response = await fetchWithAuth(`/add-knowledge-base-sources`, {
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
      autoSync?: boolean,
      webPages?: WebPage[]
    }
  ): KnowledgeBaseSource | null => {
    if (sourceType === 'url') {
      // If we have selected web pages, use them to create multiple sources
      if (sourceData.webPages && sourceData.webPages.length > 0) {
        const selectedPages = sourceData.webPages.filter(p => p.selected);
        if (selectedPages.length > 0) {
          // Return the first selected page as a source
          return {
            id: `src_url_${Date.now()}`,
            type: 'url',
            title: selectedPages[0].title || selectedPages[0].url,
            url: selectedPages[0].url,
            created_at: new Date().toISOString(),
            auto_sync: sourceData.autoSync
          };
        }
      }
      
      // Fallback to single URL
      return {
        id: `src_url_${Date.now()}`,
        type: 'url',
        title: sourceData.url || 'Website',
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
