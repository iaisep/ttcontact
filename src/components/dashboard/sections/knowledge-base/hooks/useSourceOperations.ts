
import { useState } from 'react';
import { toast } from 'sonner';
import { KnowledgeBase, WebPage } from '../types';

interface UseSourceOperationsProps {
  onAddSource: (
    kbId: string, 
    sourceType: 'url' | 'file' | 'text', 
    sourceData: any
  ) => Promise<KnowledgeBase>;
  onDeleteSource?: (
    kbId: string,
    sourceId: string
  ) => Promise<KnowledgeBase>;
  setAddingSource?: (adding: boolean) => void;
  setCurrentSourceType?: (type: 'url' | 'file' | 'text' | null) => void;
}

export const useSourceOperations = ({
  onAddSource,
  onDeleteSource,
  setAddingSource,
  setCurrentSourceType
}: UseSourceOperationsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddUrlSource = async (
    url: string,
    autoSync: boolean,
    selectedPages: WebPage[],
    currentKb: KnowledgeBase | null,
    knowledgeBaseName?: string
  ) => {
    if (!currentKb || !currentKb.id) {
      console.error('No knowledge base ID found for URL source');
      toast.error('Unable to add URL to knowledge base');
      return Promise.reject('No knowledge base ID');
    }

    try {
      if (setAddingSource) setAddingSource(true);
      setIsProcessing(true);
      
      console.log(`Adding URL source to KB ${currentKb.id}: ${url} with ${selectedPages.length} pages`);
      
      const sourceData = {
        url,
        auto_sync: autoSync,
        selected_pages: selectedPages.map(p => p.url),
        knowledge_base_name: knowledgeBaseName
      };
      
      const updatedKb = await onAddSource(currentKb.id, 'url', sourceData);
      
      toast.success('URL source added successfully');
      
      return updatedKb;
    } catch (error) {
      console.error('Error adding URL source:', error);
      toast.error('Failed to add URL source');
      throw error;
    } finally {
      if (setAddingSource) setAddingSource(false);
      setIsProcessing(false);
      if (setCurrentSourceType) setCurrentSourceType(null);
    }
  };

  const handleAddFileSource = async (
    file: File,
    currentKb: KnowledgeBase | null
  ) => {
    if (!currentKb || !currentKb.id) {
      console.error('No knowledge base ID found for file source');
      toast.error('Unable to add file to knowledge base');
      return Promise.reject('No knowledge base ID');
    }

    try {
      if (setAddingSource) setAddingSource(true);
      setIsProcessing(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const updatedKb = await onAddSource(currentKb.id, 'file', formData);
      
      toast.success('File added successfully');
      
      return updatedKb;
    } catch (error) {
      console.error('Error adding file source:', error);
      toast.error('Failed to add file');
      throw error;
    } finally {
      if (setAddingSource) setAddingSource(false);
      setIsProcessing(false);
      if (setCurrentSourceType) setCurrentSourceType(null);
    }
  };

  const handleAddTextSource = async (
    fileName: string,
    content: string,
    currentKb: KnowledgeBase | null
  ) => {
    if (!currentKb || !currentKb.id) {
      console.error('No knowledge base ID found for text source');
      toast.error('Unable to add text to knowledge base');
      return Promise.reject('No knowledge base ID');
    }

    try {
      if (setAddingSource) setAddingSource(true);
      setIsProcessing(true);
      
      const sourceData = {
        filename: fileName,
        content: content
      };
      
      const updatedKb = await onAddSource(currentKb.id, 'text', sourceData);
      
      toast.success('Text added successfully');
      
      return updatedKb;
    } catch (error) {
      console.error('Error adding text source:', error);
      toast.error('Failed to add text');
      throw error;
    } finally {
      if (setAddingSource) setAddingSource(false);
      setIsProcessing(false);
      if (setCurrentSourceType) setCurrentSourceType(null);
    }
  };

  const handleDeleteSource = async (
    currentKb: KnowledgeBase | null, 
    sourceToDelete: any,
    setDeleteSourceDialogOpen?: (open: boolean) => void,
    setSourceToDelete?: (source: any) => void
  ) => {
    if (!onDeleteSource) {
      console.error('Delete source function not provided');
      return Promise.reject('Delete function not available');
    }
    
    if (!currentKb || !currentKb.id || !sourceToDelete) {
      console.error('Missing knowledge base ID or source to delete');
      toast.error('Cannot delete source');
      return Promise.reject('Invalid delete parameters');
    }

    try {
      setIsProcessing(true);
      
      const updatedKb = await onDeleteSource(currentKb.id, sourceToDelete.id);
      
      toast.success('Source deleted successfully');
      
      if (setDeleteSourceDialogOpen) setDeleteSourceDialogOpen(false);
      if (setSourceToDelete) setSourceToDelete(null);
      
      return updatedKb;
    } catch (error) {
      console.error('Error deleting source:', error);
      toast.error('Failed to delete source');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleAddUrlSource,
    handleAddFileSource,
    handleAddTextSource,
    handleDeleteSource,
    isProcessing
  };
};
