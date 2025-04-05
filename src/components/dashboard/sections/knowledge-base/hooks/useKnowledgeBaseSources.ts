
import { useState } from 'react';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../types';
import { toast } from 'sonner';
import { useSourceApi } from './api/useSourceApi';

export const useKnowledgeBaseSources = (
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
      webPages?: WebPage[]
    }
  ) => {
    if (isProcessing) return Promise.reject(new Error('Operation in progress'));
    
    try {
      setIsProcessing(true);
      setLoading(true);
      
      console.log(`Adding ${sourceType} source to KB ${kbId}:`, sourceData);
      
      // Find and verify the KB in the local state
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) {
        throw new Error('Knowledge base not found');
      }
      
      // Call the API endpoint
      const response = await addSourceToKnowledgeBaseApi(kbId, sourceType, sourceData);
      
      console.log(`API response for adding ${sourceType} source:`, response);
      
      // For development, create a mock source when API is not available
      let newSource: KnowledgeBaseSource | null = null;
      
      if (response && response.source) {
        // Use the actual API response
        newSource = response.source;
      } else {
        // Fallback mock data for development
        newSource = createMockSource(sourceType, sourceData);
      }
      
      if (newSource) {
        const updatedKb = {...kb};
        updatedKb.sources = [...updatedKb.sources, newSource];
        updatedKb.source_count = updatedKb.sources.length;
        
        if (sourceType === 'url' && sourceData.autoSync) {
          updatedKb.auto_sync = true;
        }
        
        updateKnowledgeBaseInState(updatedKb);
        
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

  const deleteSource = async (kbId: string, sourceId: string) => {
    if (isProcessing) return Promise.reject(new Error('Operation in progress'));
    
    try {
      setIsProcessing(true);
      setLoading(true);
      
      console.log(`Attempting to delete source ${sourceId} from KB ${kbId}`);
      
      // Call the API endpoint with the correct format
      await deleteSourceApi(kbId, sourceId);
      
      console.log(`Source deleted successfully`);
      
      // Update the local state
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) throw new Error('Knowledge base not found');
      
      const updatedKb = {...kb};
      updatedKb.sources = updatedKb.sources.filter(src => src.id !== sourceId);
      updatedKb.source_count = updatedKb.sources.length;
      
      updateKnowledgeBaseInState(updatedKb);
      
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
  };

  return {
    addSourceToKnowledgeBase,
    deleteSource,
    isProcessing
  };
};
