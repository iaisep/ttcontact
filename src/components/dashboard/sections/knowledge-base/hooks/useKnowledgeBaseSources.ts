
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../types';

export const useKnowledgeBaseSources = (
  knowledgeBases: KnowledgeBase[],
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
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
    try {
      setLoading(true);
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) throw new Error('Knowledge base not found');
      
      let newSource: KnowledgeBaseSource | null = null;
      
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
      
      if (newSource) {
        const updatedKb = {...kb};
        updatedKb.sources = [...updatedKb.sources, newSource];
        updatedKb.source_count = updatedKb.sources.length;
        
        if (sourceType === 'url' && sourceData.autoSync) {
          updatedKb.auto_sync = true;
        }
        
        setKnowledgeBases(knowledgeBases.map(item => 
          item.id === kbId ? updatedKb : item
        ));
        
        toast.success('Source added to knowledge base');
        return updatedKb;
      }
      
      throw new Error('Failed to add source');
    } catch (error) {
      toast.error('Failed to add source to knowledge base');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSource = useCallback(async (kbId: string, sourceId: string) => {
    try {
      setLoading(true);
      
      const kb = knowledgeBases.find(kb => kb.id === kbId);
      if (!kb) throw new Error('Knowledge base not found');
      
      const updatedKb = {...kb};
      updatedKb.sources = updatedKb.sources.filter(src => src.id !== sourceId);
      updatedKb.source_count = updatedKb.sources.length;
      
      setKnowledgeBases(prevKbs => 
        prevKbs.map(item => item.id === kbId ? updatedKb : item)
      );
      
      toast.success('Source deleted from knowledge base');
      return updatedKb;
    } catch (error) {
      toast.error('Failed to delete source');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [knowledgeBases, setKnowledgeBases, setLoading]);

  return {
    addSourceToKnowledgeBase,
    deleteSource
  };
};
