
import { useState } from 'react';
import { KnowledgeBase, WebPage } from '../types';
import { useKnowledgeBaseApi } from './api/useKnowledgeBaseApi';
import { toast } from 'sonner';

export const useKnowledgeBaseSources = (
  knowledgeBases: KnowledgeBase[],
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { addSourceToKnowledgeBase } = useKnowledgeBaseApi();

  const addSource = async (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => {
    try {
      setIsProcessing(true);
      setLoading(true);

      // Call the API function to add the source
      const updatedKb = await addSourceToKnowledgeBase(kbId, sourceType, sourceData);
      
      // Update the knowledge bases list with the updated knowledge base
      setKnowledgeBases(prevKbs => 
        prevKbs.map(kb => kb.id === kbId ? updatedKb : kb)
      );
      
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
    try {
      setIsProcessing(true);
      setLoading(true);
      
      // Find the knowledge base
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) {
        throw new Error('Knowledge base not found');
      }
      
      // Remove the source from the knowledge base
      const updatedSources = kb.sources.filter(source => source.id !== sourceId);
      
      // Create the updated knowledge base
      const updatedKb = {
        ...kb,
        sources: updatedSources,
        source_count: updatedSources.length
      };
      
      // Update the knowledge bases list
      setKnowledgeBases(prevKbs => 
        prevKbs.map(kb => kb.id === kbId ? updatedKb : kb)
      );
      
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
    addSourceToKnowledgeBase: addSource,
    deleteSource,
    isProcessing
  };
};
