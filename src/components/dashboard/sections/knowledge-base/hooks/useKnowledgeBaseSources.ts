
import { KnowledgeBase } from '../types';
import { useSourceManagement } from './useSourceManagement';

export const useKnowledgeBaseSources = (
  knowledgeBases: KnowledgeBase[],
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { 
    addSourceToKnowledgeBase, 
    deleteSource, 
    isProcessing 
  } = useSourceManagement(knowledgeBases, setKnowledgeBases, setLoading);

  return {
    addSourceToKnowledgeBase,
    deleteSource,
    isProcessing
  };
};
