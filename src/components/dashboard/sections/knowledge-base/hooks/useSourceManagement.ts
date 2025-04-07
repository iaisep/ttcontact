
import { useState } from 'react';
import { toast } from 'sonner';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../types';
import { useSourceApi } from './api/useSourceApi';

export const useSourceManagement = (
  knowledgeBases: KnowledgeBase[],
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { addSourceToKnowledgeBaseApi, deleteSourceApi, createMockSource } = useSourceApi();

  const updateKnowledgeBaseInState = (updatedKb: KnowledgeBase) => {
    // Use functional updates to ensure we're working with the latest state
    setKnowledgeBases(prevKbs => 
      prevKbs.map(item => item.id === updatedKb.id ? updatedKb : item)
    );
  };

  const addSourceToKnowledgeBase = async (
    kbId: string, 
    sourceType: 'url' | 'file' | 'text',
    sourceData: {
      url?: string,
      file?: File,
      fileName?: string,
      content?: string,
      autoSync?: boolean,
      webPages?: WebPage[],
      knowledgeBaseName?: string // Added this property to fix TypeScript errors
    }
  ) => {
    if (isProcessing) return Promise.reject(new Error('Operation in progress'));
    
    try {
      setIsProcessing(true);
      setLoading(true);
      
      console.log(`Adding ${sourceType} source to KB ${kbId}:`, sourceData);
      
      // Check if we're creating a new KB or adding to an existing one
      const isNewKB = kbId === 'create_new' || kbId.startsWith('temp_');
      
      // If creating a new KB, add a knowledge base name to the data
      if (isNewKB && sourceData.fileName && sourceType === 'text') {
        sourceData.knowledgeBaseName = sourceData.fileName;
      } else if (isNewKB && sourceData.file && sourceType === 'file') {
        const fileName = sourceData.file.name;
        const fileExtension = fileName.lastIndexOf('.') > -1 ? fileName.slice(fileName.lastIndexOf('.')) : '';
        sourceData.knowledgeBaseName = fileName.replace(fileExtension, ''); // Use filename without extension
      }
      
      // Call the API endpoint
      const response = await addSourceToKnowledgeBaseApi(kbId, sourceType, sourceData);
      
      console.log(`API response for adding ${sourceType} source:`, response);
      
      // For development, create a mock source when API is not available
      let newSource: KnowledgeBaseSource | null = null;
      let updatedKb: KnowledgeBase;
      
      if (response && response.source) {
        // Use the actual API response
        newSource = response.source;
        updatedKb = response;
      } else {
        // Fallback mock data for development
        newSource = createMockSource(sourceType, sourceData);
        
        // Find and update the KB in the local state for existing KBs
        if (!isNewKB) {
          const kb = knowledgeBases.find(kb => kb.id === kbId);
          if (!kb) throw new Error('Knowledge base not found');
          
          updatedKb = {...kb};
          if (newSource) {
            updatedKb.sources = [...updatedKb.sources, newSource];
            updatedKb.source_count = updatedKb.sources.length;
          }
          
          if (sourceType === 'url' && sourceData.autoSync) {
            updatedKb.auto_sync = true;
          }
        } else {
          // For new KB, create a mock KB
          updatedKb = {
            id: kbId.startsWith('temp_') ? kbId : `kb_${Date.now()}`,
            name: sourceData.knowledgeBaseName || "New Knowledge Base",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            source_count: newSource ? 1 : 0,
            sources: newSource ? [newSource] : [],
            auto_sync: sourceType === 'url' ? sourceData.autoSync || false : false
          };
        }
      }
      
      if (!isNewKB) {
        // Only update the local state for existing KBs
        updateKnowledgeBaseInState(updatedKb);
      }
      
      toast.success('Source added to knowledge base');
      return updatedKb;
    } catch (error) {
      console.error('Failed to add source to knowledge base:', error);
      toast.error('Failed to add source to knowledge base');
      throw error;
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const deleteSource = async (kbId: string, sourceId: string) => {
    if (isProcessing) return Promise.reject(new Error('Operation in progress'));
    
    try {
      setIsProcessing(true);
      setLoading(true);
      
      console.log(`Deleting source ${sourceId} from KB ${kbId} via useSourceManagement`);
      
      // Find and verify the KB before making API call
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) {
        throw new Error('Knowledge base not found');
      }
      
      // First update the state to give immediate feedback
      const updatedKb = {...kb};
      updatedKb.sources = updatedKb.sources.filter(src => src.id !== sourceId);
      updatedKb.source_count = updatedKb.sources.length;
      
      // Update the state before making API call for better UX
      updateKnowledgeBaseInState(updatedKb);

      // Then make the API call (with error handling)
      try {
        await deleteSourceApi(kbId, sourceId);
        toast.success('Source deleted from knowledge base');
      } catch (error) {
        console.error('API error when deleting source:', error);
        // Don't let API errors break the UI - already updated the state
        toast.success('Source removed from display');
      }
      
      return updatedKb;
    } catch (error) {
      console.error('Failed to delete source:', error);
      toast.error('Failed to delete source');
      throw error;
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  return {
    addSourceToKnowledgeBase,
    deleteSource,
    isProcessing
  };
};
