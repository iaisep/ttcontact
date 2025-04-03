
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../types';
import { useApiContext } from '@/context/ApiContext';

export const useKnowledgeBaseSources = (
  knowledgeBases: KnowledgeBase[],
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { fetchWithAuth } = useApiContext();

  const addSourceToKnowledgeBase = async (
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
    if (isProcessing) return Promise.reject(new Error('Operation in progress'));
    
    try {
      setIsProcessing(true);
      setLoading(true);
      
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
      
      // Find and update the KB in the local state
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) throw new Error('Knowledge base not found');
      
      // For development, create a mock source when API is not available
      let newSource: KnowledgeBaseSource | null = null;
      
      if (response && response.source) {
        // Use the actual API response
        newSource = response.source;
      } else {
        // Fallback mock data for development
        if (sourceType === 'url') {
          newSource = {
            id: `src_url_${Date.now()}`,
            type: 'url',
            title: sourceData.url || '',
            url: sourceData.url,
            created_at: new Date().toISOString(),
            auto_sync: sourceData.autoSync
          };
        } else if (sourceType === 'file' && sourceData.file) {
          newSource = {
            id: `src_file_${Date.now()}`,
            type: 'file',
            title: sourceData.file.name,
            file_name: sourceData.file.name,
            created_at: new Date().toISOString()
          };
        } else if (sourceType === 'text') {
          newSource = {
            id: `src_text_${Date.now()}`,
            type: 'text',
            title: sourceData.fileName || '',
            content: sourceData.content,
            created_at: new Date().toISOString()
          };
        }
      }
      
      if (newSource) {
        const updatedKb = {...kb};
        updatedKb.sources = [...updatedKb.sources, newSource];
        updatedKb.source_count = updatedKb.sources.length;
        
        if (sourceType === 'url' && sourceData.autoSync) {
          updatedKb.auto_sync = true;
        }
        
        setKnowledgeBases(prevKbs => prevKbs.map(item => 
          item.id === kbId ? updatedKb : item
        ));
        
        toast.success('Source added to knowledge base');
        return updatedKb;
      }
      
      throw new Error('Failed to add source');
    } catch (error) {
      console.error('Failed to add source to knowledge base:', error);
      toast.error('Failed to add source to knowledge base');
      throw error;
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const deleteSource = useCallback(async (kbId: string, sourceId: string) => {
    if (isProcessing) return Promise.reject(new Error('Operation in progress'));
    
    try {
      setIsProcessing(true);
      setLoading(true);
      
      // Call the API endpoint
      await fetchWithAuth(`/delete-knowledge-base-source/${kbId}/source/${sourceId}`, {
        method: 'DELETE',
      });
      
      // Update the local state
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) throw new Error('Knowledge base not found');
      
      const updatedKb = {...kb};
      updatedKb.sources = updatedKb.sources.filter(src => src.id !== sourceId);
      updatedKb.source_count = updatedKb.sources.length;
      
      // Use functional updates to ensure we're working with the latest state
      setKnowledgeBases(prevKbs => 
        prevKbs.map(item => item.id === kbId ? updatedKb : item)
      );
      
      toast.success('Source deleted from knowledge base');
      return updatedKb;
    } catch (error) {
      console.error('Failed to delete source:', error);
      toast.error('Failed to delete source');
      throw error;
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  }, [knowledgeBases, setKnowledgeBases, setLoading, isProcessing, fetchWithAuth]);

  return {
    addSourceToKnowledgeBase,
    deleteSource,
    isProcessing
  };
};
