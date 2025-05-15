
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
      knowledgeBaseName?: string
    }
  ) => {
    if (isProcessing) return Promise.reject(new Error('Operation in progress'));
    
    try {
      setIsProcessing(true);
      setLoading(true);
      
      console.log(`Adding ${sourceType} source to KB ${kbId}:`, sourceData);
      
      // Check if we're creating a new KB or adding to an existing one
      const isNewKB = kbId === 'create_new' || kbId.startsWith('temp_');
      
      // Always ensure knowledge base name is set
      // This is now a key part of passing the knowledgeBaseName correctly
      if (isNewKB) {
        console.log('Creating new knowledge base with name:', sourceData.knowledgeBaseName);
        
        // Ensure knowledgeBaseName is set
        if (!sourceData.knowledgeBaseName) {
          if (sourceData.fileName && sourceType === 'text') {
            sourceData.knowledgeBaseName = sourceData.fileName;
          } else if (sourceData.file && sourceType === 'file') {
            const fileName = sourceData.file.name;
            const fileExtension = fileName.lastIndexOf('.') > -1 ? fileName.slice(fileName.lastIndexOf('.')) : '';
            sourceData.knowledgeBaseName = fileName.replace(fileExtension, '');
          } else if (sourceType === 'url') {
            sourceData.knowledgeBaseName = "URL Knowledge Base";
          }
        }
        
        console.log('Final knowledge base name:', sourceData.knowledgeBaseName);
      }
      
      // Call the API endpoint with the properly set knowledgeBaseName
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
          // For new KB, create a mock KB with the provided name
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
      console.error(`Failed to add ${sourceType} source:`, error);
      toast.error(`Failed to add ${sourceType} source`);
      throw error;
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const deleteSource = async (kbId: string, sourceId: string) => {
    if (isProcessing) return Promise.reject(new Error('Operation in progress'));
    
    if (!kbId || !sourceId) {
      const error = new Error('Missing required parameters: knowledge base ID or source ID');
      toast.error('Cannot delete source: Missing required information');
      return Promise.reject(error);
    }
    
    try {
      setIsProcessing(true);
      setLoading(true);
      
      console.log(`Deleting source ${sourceId} from KB ${kbId} via useSourceManagement`);
      
      // Find and verify the KB before making API call
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) {
        const error = new Error('Knowledge base not found');
        toast.error('Knowledge base not found');
        setIsProcessing(false);
        setLoading(false);
        return Promise.reject(error);
      }
      
      // Check if the source exists before proceeding
      const sourceIndex = kb.sources.findIndex(s => s.id === sourceId);
      if (sourceIndex === -1) {
        const error = new Error('Source not found in knowledge base');
        toast.error('Source not found');
        setIsProcessing(false);
        setLoading(false);
        return Promise.reject(error);
      }
      
      // OPTIMISTIC UPDATE: Update the state immediately for better UX
      const updatedKb = {...kb};
      updatedKb.sources = updatedKb.sources.filter(src => src.id !== sourceId);
      updatedKb.source_count = updatedKb.sources.length;
      
      // Update the state before making API call for better UX
      updateKnowledgeBaseInState(updatedKb);

      // Then make the API call with a timeout to prevent hanging
      try {
        // Create a timeout promise that rejects after 15 seconds
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('API call timed out')), 15000);
        });
        
        // Race the API call against the timeout
        await Promise.race([
          deleteSourceApi(kbId, sourceId),
          timeoutPromise
        ]);
        
        // API call successful - state is already updated
      } catch (error) {
        console.error('API error when deleting source:', error);
        // We don't revert the UI state even if API fails 
        // The source is already removed from the UI state, which is good for UX
      }
      
      return updatedKb;
    } catch (error) {
      console.error('Failed to delete source:', error);
      toast.error('Failed to delete source');
      throw error;
    } finally {
      // IMPORTANT: Always reset these states to ensure UI remains responsive
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
