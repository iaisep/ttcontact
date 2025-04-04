
import { useState } from 'react';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../types';
import { toast } from 'sonner';

export const useKnowledgeBaseSources = (
  knowledgeBases: KnowledgeBase[],
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Add a URL source to a knowledge base
  const addSourceToKnowledgeBase = async (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ): Promise<KnowledgeBase> => {
    try {
      setLoading(true);
      console.log(`Adding ${sourceType} source to KB ${kbId}:`, sourceData);
      
      // Find the knowledge base to update
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) {
        throw new Error(`Knowledge base with ID ${kbId} not found`);
      }
      
      // Create the new sources based on the source type
      let newSources: KnowledgeBaseSource[] = [];
      
      if (sourceType === 'url') {
        if (sourceData.webPages && Array.isArray(sourceData.webPages)) {
          // Create a source for each web page
          newSources = sourceData.webPages.map((page: WebPage) => ({
            id: `src_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'url',
            title: page.title || page.url,
            url: page.url,
            created_at: new Date().toISOString(),
            auto_sync: sourceData.autoSync
          }));
        } else {
          // Create a single source for the URL
          newSources = [{
            id: `src_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'url',
            title: new URL(sourceData.url).hostname,
            url: sourceData.url,
            created_at: new Date().toISOString(),
            auto_sync: sourceData.autoSync
          }];
        }
      } else if (sourceType === 'file') {
        newSources = [{
          id: `src_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'file',
          title: sourceData.file.name,
          file_name: sourceData.file.name,
          created_at: new Date().toISOString()
        }];
      } else if (sourceType === 'text') {
        newSources = [{
          id: `src_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'text',
          title: sourceData.fileName,
          content: sourceData.content,
          created_at: new Date().toISOString()
        }];
      }
      
      // Update the knowledge base with the new sources
      const updatedKb = {
        ...kb,
        sources: [...kb.sources, ...newSources],
        source_count: kb.source_count + newSources.length,
        auto_sync: sourceType === 'url' ? sourceData.autoSync : kb.auto_sync
      };
      
      // Update the knowledgeBases state
      setKnowledgeBases(knowledgeBases.map(item => 
        item.id === kbId ? updatedKb : item
      ));
      
      console.log(`Added ${newSources.length} ${sourceType} sources to KB ${kbId}`, updatedKb);
      return updatedKb;
    } catch (error) {
      console.error(`Error adding ${sourceType} source:`, error);
      toast.error(`Failed to add ${sourceType} source`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a source from a knowledge base
  const deleteSource = async (kbId: string, sourceId: string): Promise<KnowledgeBase> => {
    try {
      setLoading(true);
      
      // Find the knowledge base and remove the source
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) {
        throw new Error(`Knowledge base with ID ${kbId} not found`);
      }
      
      const updatedSources = kb.sources.filter(source => source.id !== sourceId);
      
      // Check if any URL sources remain for auto_sync
      const hasUrlSources = updatedSources.some(source => source.type === 'url');
      
      const updatedKb = {
        ...kb,
        sources: updatedSources,
        source_count: updatedSources.length,
        auto_sync: hasUrlSources ? kb.auto_sync : false
      };
      
      // Update the knowledgeBases state
      setKnowledgeBases(knowledgeBases.map(item => 
        item.id === kbId ? updatedKb : item
      ));
      
      return updatedKb;
    } catch (error) {
      console.error('Error deleting source:', error);
      toast.error('Failed to delete source');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    addSourceToKnowledgeBase,
    deleteSource
  };
};
