
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
      webPages?: WebPage[],
      knowledgeBaseName?: string
    }
  ) => {
    console.log(`API call: Adding ${sourceType} source to KB ${kbId}:`, sourceData);
    console.log(`Knowledge Base Name: ${sourceData.knowledgeBaseName}`);
    
    // Create FormData object for all types
    const formData = new FormData();
    
    // Determine if we are creating a new knowledge base or adding to an existing one
    const isCreatingNew = !kbId || kbId === 'create_new' || kbId.startsWith('temp_');
    
    // Select the correct endpoint based on whether we're creating a new KB
    // or adding to an existing one
    const endpoint = isCreatingNew
      ? '/create-knowledge-base'  // For new KB, use the create endpoint
      : `/add-knowledge-base-sources/${kbId}`; // For existing KB, use the add sources endpoint
    
    console.log(`Using endpoint ${endpoint} for ${sourceType} source. Creating new KB: ${isCreatingNew}`);
    console.log(`Knowledge Base Name for ${isCreatingNew ? 'new' : 'existing'} KB: ${sourceData.knowledgeBaseName}`);
    
    // If creating a new KB, we need to provide a name
    if (isCreatingNew && sourceData.knowledgeBaseName) {
      formData.append('knowledge_base_name', sourceData.knowledgeBaseName);
      console.log('Adding knowledge_base_name to FormData:', sourceData.knowledgeBaseName);
    } else if (!isCreatingNew) {
      // If adding to existing KB, include KB ID for the add-sources endpoint
      formData.append('knowledge_base_id', kbId);
    }
    
    // Always include these fields as shown in the images
    formData.append('knowledge_base_texts', JSON.stringify([]));
    formData.append('knowledge_base_urls', JSON.stringify([]));
    formData.append('enable_auto_refresh', 'false');
    
    if (sourceType === 'url') {
      // Format according to the API requirements for URLs
      const urls = sourceData.webPages && Array.isArray(sourceData.webPages) 
        ? sourceData.webPages.map(page => page.url) 
        : [sourceData.url];
      
      formData.set('knowledge_base_urls', JSON.stringify(urls));
      formData.set('enable_auto_refresh', String(sourceData.autoSync || false));
      
      console.log('API call data for URL source:', {
        urls,
        autoSync: sourceData.autoSync || false,
        knowledgeBaseName: sourceData.knowledgeBaseName,
        isCreatingNew
      });
    } 
    else if (sourceType === 'file' && sourceData.file) {
      // For file upload, include the file in formData as shown in the first image
      formData.append('knowledge_base_files', sourceData.file);
      
      // Make sure we have a knowledge base name
      if (isCreatingNew && !formData.has('knowledge_base_name')) {
        const kbName = sourceData.knowledgeBaseName || 
                      (sourceData.file.name.split('.')[0]) || 
                      "New Knowledge Base";
        formData.append('knowledge_base_name', kbName);
        console.log('Adding derived knowledge_base_name to FormData:', kbName);
      }
      
      console.log("Uploading file:", sourceData.file.name, "to KB:", isCreatingNew ? "New KB" : kbId);
    } 
    else if (sourceType === 'text') {
      // Format text content according to the API documentation and image
      const textContent = [{
        title: sourceData.fileName || 'Untitled',
        text: sourceData.content || '',
        uuid: 'm' + Math.random().toString(36).substring(2, 15)
      }];
      
      formData.set('knowledge_base_texts', JSON.stringify(textContent));
      
      // Make sure we have a knowledge base name
      if (isCreatingNew && !formData.has('knowledge_base_name')) {
        const kbName = sourceData.knowledgeBaseName || 
                      sourceData.fileName || 
                      "New Knowledge Base";
        formData.append('knowledge_base_name', kbName);
        console.log('Adding derived knowledge_base_name to FormData for text:', kbName);
      }
      
      console.log("Adding text content with title:", sourceData.fileName);
    }
    
    try {
      // Log the FormData for debugging
      console.log('FormData entries:', Object.fromEntries(formData.entries()));
      
      // Call the API endpoint with FormData for all source types
      const response = await fetchWithAuth(endpoint, {
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
    
    // Correct API endpoint format for deleting a source
    const endpoint = `/delete-knowledge-base-source/${kbId}/source/${sourceId}`;
    console.log(`Using delete endpoint: ${endpoint}`);
    
    return await fetchWithAuth(endpoint, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
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
      webPages?: WebPage[],
      knowledgeBaseName?: string
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
