
import { useState } from 'react';
import { toast } from 'sonner';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';

interface UseSourceOperationsProps {
  onAddSource: (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => Promise<KnowledgeBase>;
  onDeleteSource: (kbId: string, sourceId: string) => Promise<KnowledgeBase>;
  setAddingSource: (adding: boolean) => void;
  setCurrentSourceType: (type: 'url' | 'file' | 'text' | null) => void;
}

export const useSourceOperations = ({
  onAddSource,
  onDeleteSource,
  setAddingSource,
  setCurrentSourceType
}: UseSourceOperationsProps) => {
  const handleAddUrlSource = async (
    url: string, 
    autoSync: boolean, 
    selectedPages: WebPage[],
    currentKb: KnowledgeBase | null
  ) => {
    try {
      setAddingSource(true);
      
      // For URL, we need a KB (real or temporary)
      if (!currentKb) {
        console.error("No knowledge base provided for URL source");
        throw new Error('No knowledge base provided');
      }
      
      // Determine if this is a new KB or existing one
      const isNewKB = !currentKb.id || currentKb.id.startsWith('temp_');
      const kbId = isNewKB ? 'create_new' : currentKb.id;
      const kbName = currentKb.name || '';
      
      console.log("Adding URL source with params:", { 
        url, 
        autoSync, 
        selectedPages, 
        kbId, 
        kbName,
        isNewKB
      });
      
      // Format the data according to the API requirements
      const sourceData = {
        url,
        autoSync,
        webPages: selectedPages.map(page => ({
          url: page.url,
          title: page.title
        })),
        knowledgeBaseName: kbName // Important: Include the KB name for new KBs
      };
      
      console.log("Sending data to API:", sourceData);
      
      // Call API with the data using the appropriate ID
      const updatedKb = await onAddSource(kbId, 'url', sourceData);
      
      console.log("URL source added, updated KB:", updatedKb);
      
      // Close the URL source modal
      setCurrentSourceType(null);
      
      toast.success('URL source added successfully');
      return updatedKb;
    } catch (error) {
      console.error('Failed to add URL source:', error);
      toast.error('Failed to add URL source');
      throw error;
    } finally {
      setAddingSource(false);
    }
  };

  const handleAddFileSource = async (file: File, currentKb: KnowledgeBase | null) => {
    try {
      setAddingSource(true);
      
      // For files, we can create a new KB if there isn't one
      const isNewKB = !currentKb || !currentKb.id || currentKb.id.startsWith('temp_');
      
      // If creating a new KB, generate a temporary ID
      const kbId = isNewKB 
        ? 'create_new' 
        : (currentKb?.id || '');
      
      // For new KB, use the file name as the KB name
      // Extract name without extension for KB name
      const fileName = file.name;
      const fileExtension = fileName.lastIndexOf('.') > -1 ? fileName.slice(fileName.lastIndexOf('.')) : '';
      const kbName = isNewKB 
        ? fileName.replace(fileExtension, '') || "New Knowledge Base"
        : (currentKb?.name || "Unknown Knowledge Base");
      
      console.log("Adding file source:", { 
        fileName: file.name,
        kbId,
        kbName,
        isNewKB
      });
      
      // Add the source to the KB using the determined ID
      // Make sure to include the knowledgeBaseName for new KBs
      const updatedKb = await onAddSource(kbId, 'file', { 
        file,
        knowledgeBaseName: kbName // This is required as shown in the image
      });
      
      setCurrentSourceType(null);
      toast.success('File source added successfully');
      return updatedKb;
    } catch (error) {
      console.error('Failed to add file source:', error);
      toast.error('Failed to add file source');
      throw error;
    } finally {
      setAddingSource(false);
    }
  };

  const handleAddTextSource = async (fileName: string, content: string, currentKb: KnowledgeBase | null) => {
    try {
      setAddingSource(true);
      
      // For text, we can create a new KB if there isn't one
      const isNewKB = !currentKb || !currentKb.id || currentKb.id.startsWith('temp_');
      
      // If creating a new KB, generate a temporary ID
      const kbId = isNewKB 
        ? 'create_new' 
        : (currentKb?.id || '');
      
      // For new KB, use the text file name as the KB name
      const kbName = isNewKB 
        ? fileName || "New Knowledge Base"
        : (currentKb?.name || "Unknown Knowledge Base");
      
      console.log("Adding text source:", { 
        fileName, 
        contentLength: content.length,
        kbId,
        kbName,
        isNewKB
      });
      
      // Add the source to the KB using the determined ID
      // Make sure to include knowledgeBaseName for new KBs
      const updatedKb = await onAddSource(kbId, 'text', { 
        fileName, 
        content,
        knowledgeBaseName: kbName // Important: Include the KB name as shown in the image
      });
      
      setCurrentSourceType(null);
      toast.success('Text source added successfully');
      return updatedKb;
    } catch (error) {
      console.error('Failed to add text source:', error);
      toast.error('Failed to add text source');
      throw error;
    } finally {
      setAddingSource(false);
    }
  };

  const handleDeleteSource = async (
    currentKb: KnowledgeBase | null, 
    sourceToDelete: KnowledgeBaseSource | null,
    setDeleteSourceDialogOpen: (open: boolean) => void,
    setSourceToDelete: (source: KnowledgeBaseSource | null) => void
  ) => {
    if (!currentKb || !sourceToDelete) {
      toast.error('Missing knowledge base or source');
      return Promise.reject(new Error('Missing knowledge base or source'));
    }

    try {
      const updatedKb = await onDeleteSource(currentKb.id, sourceToDelete.id);
      setDeleteSourceDialogOpen(false);
      setSourceToDelete(null);
      toast.success('Source deleted successfully');
      return updatedKb;
    } catch (error) {
      console.error('Failed to delete source:', error);
      toast.error('Failed to delete source');
      throw error;
    }
  };

  return {
    handleAddUrlSource,
    handleAddFileSource,
    handleAddTextSource,
    handleDeleteSource
  };
};
