
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
        // Use the provided name, defaulting to "New Knowledge Base" if none is available
        const name = knowledgeBaseName || knowledgeBase?.name || 'New Knowledge Base';
        console.log('Creating new knowledge base with name:', name);
        
        // Make sure the name isn't empty
        if (!name.trim()) {
          throw new Error('Knowledge base name cannot be empty');
        }
        
        const newKnowledgeBase = await createKnowledgeBase({
          name: name.trim(),
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
