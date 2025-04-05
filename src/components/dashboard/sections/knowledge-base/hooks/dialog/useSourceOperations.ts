
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
    // Validate currentKb first
    if (!currentKb) {
      toast.error('No knowledge base selected');
      return Promise.reject(new Error('No knowledge base selected'));
    }
    
    try {
      setAddingSource(true);
      
      // Check if we have either a knowledge base ID or a name
      const hasKbId = currentKb && currentKb.id;
      const kbName = currentKb?.name || '';
      
      if (!hasKbId && !kbName) {
        toast.error('Knowledge base ID or name is required');
        throw new Error('Knowledge base ID or name is required');
      }
      
      console.log("Adding URL source with params:", { 
        url, 
        autoSync, 
        selectedPages, 
        kbId: hasKbId ? currentKb?.id : 'creating new KB', 
        kbName 
      });
      
      // Format the data according to the API requirements
      const sourceData = {
        url,
        autoSync,
        webPages: selectedPages.map(page => ({
          url: page.url,
          title: page.title
        })),
        knowledgeBaseName: kbName // Pass the knowledge base name
      };
      
      console.log("Sending data to API:", sourceData);
      
      // We need to handle both cases: 
      // 1. Adding to existing KB (have kbId)
      // 2. Creating a new KB with URLs (only have kbName)
      let updatedKb: KnowledgeBase;
      
      if (hasKbId) {
        // Call the API to add the source to the existing knowledge base
        updatedKb = await onAddSource(currentKb.id, 'url', sourceData);
      } else {
        // For creating a new KB with URLs, we need to create a temporary ID
        // The API will handle the actual creation
        const tempId = `temp_${Date.now()}`;
        updatedKb = await onAddSource(tempId, 'url', sourceData);
      }
      
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
    // Validate currentKb first
    if (!currentKb) {
      toast.error('No knowledge base selected');
      return Promise.reject(new Error('No knowledge base selected'));
    }
    
    try {
      setAddingSource(true);
      console.log("Adding file source:", file.name, "to KB:", currentKb);
      
      // Ensure we have a valid KB ID
      if (!currentKb.id) {
        console.error("Knowledge base has no ID");
        toast.error('Invalid knowledge base ID');
        throw new Error('Invalid knowledge base ID');
      }

      // Add the source to either an existing KB or a temporary one
      const updatedKb = await onAddSource(currentKb.id, 'file', { 
        file,
        knowledgeBaseName: currentKb.name 
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
    // Validate currentKb first
    if (!currentKb) {
      toast.error('No knowledge base selected');
      return Promise.reject(new Error('No knowledge base selected'));
    }
    
    try {
      setAddingSource(true);
      console.log("Adding text source:", { fileName, contentLength: content.length, currentKb });
      
      // Ensure we have a valid KB ID
      if (!currentKb.id) {
        console.error("Knowledge base has no ID");
        toast.error('Invalid knowledge base ID');
        throw new Error('Invalid knowledge base ID');
      }
      
      // Add the source to either an existing KB or a temporary one
      const updatedKb = await onAddSource(currentKb.id, 'text', { 
        fileName, 
        content,
        knowledgeBaseName: currentKb.name
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
