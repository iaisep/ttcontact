import { useState } from 'react';
import { KnowledgeBase, WebPage } from '../types';
import { useKnowledgeBaseCreateApi } from './api/knowledge-base/useKnowledgeBaseCreateApi';

interface UseSourceOperationsProps {
  onAddSource: (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => Promise<KnowledgeBase>;
}

export const useSourceOperations = ({ onAddSource }: UseSourceOperationsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createKnowledgeBase } = useKnowledgeBaseCreateApi();

  const handleUrlSourceSubmit = async (
    url: string,
    autoSync: boolean,
    selectedPages: WebPage[],
    knowledgeBase: KnowledgeBase | null,
    knowledgeBaseName?: string
  ) => {
    setIsLoading(true);
    try {
      console.log('Handling URL source submit', {
        url,
        autoSync,
        pagesCount: selectedPages.length,
        knowledgeBase,
        knowledgeBaseName
      });

      // Extract URLs from the selected pages
      const urls = selectedPages.map(page => page.url);

      // If the knowledge base exists, add the URL as a source to it
      if (knowledgeBase && knowledgeBase.id && !knowledgeBase.id.startsWith('temp_')) {
        // Existing knowledge base, add URL source
        return await onAddSource(knowledgeBase.id, 'url', {
          url,
          autoSync,
          webPages: selectedPages,
        });
      } else {
        // Create a new knowledge base with the URL source
        // This is the critical part - use the provided name
        const name = knowledgeBaseName || 'New Knowledge Base';
        console.log('Creating new knowledge base with name:', name);
        
        const newKnowledgeBase = await createKnowledgeBase({
          name: name,
          urls: urls,
          autoSync: autoSync
        });

        console.log('URL source added, updated KB:', newKnowledgeBase);
        return newKnowledgeBase;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleUrlSourceSubmit
  };
};
