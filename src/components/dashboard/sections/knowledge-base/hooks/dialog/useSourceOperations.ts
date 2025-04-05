
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
      
      // Para URL, necesitamos un KB (real o temporal)
      if (!currentKb) {
        console.error("No knowledge base provided for URL source");
        throw new Error('No knowledge base provided');
      }
      
      // Determinamos si es una KB nueva o existente
      const isNewKB = !currentKb.id || currentKb.id.startsWith('temp_');
      const kbId = isNewKB ? 'temp_' + Date.now() : currentKb.id;
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
        knowledgeBaseName: kbName
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
      
      // Para archivos, podemos crear una KB nueva si no hay una
      const isNewKB = !currentKb || !currentKb.id || currentKb.id.startsWith('temp_');
      
      // Si estamos creando una KB nueva, generamos un ID temporal
      const kbId = isNewKB 
        ? 'temp_' + Date.now() 
        : (currentKb?.id || '');
      
      // Para KB nueva, usamos el nombre del archivo como nombre de la KB
      const kbName = isNewKB 
        ? file.name.split('.')[0] || "New Knowledge Base"
        : (currentKb?.name || "Unknown Knowledge Base");
      
      console.log("Adding file source:", { 
        fileName: file.name,
        kbId,
        kbName,
        isNewKB
      });
      
      // Add the source to the KB using the determined ID
      const updatedKb = await onAddSource(kbId, 'file', { 
        file,
        knowledgeBaseName: kbName 
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
      
      // Para texto, podemos crear una KB nueva si no hay una
      const isNewKB = !currentKb || !currentKb.id || currentKb.id.startsWith('temp_');
      
      // Si estamos creando una KB nueva, generamos un ID temporal
      const kbId = isNewKB 
        ? 'temp_' + Date.now() 
        : (currentKb?.id || '');
      
      // Para KB nueva, usamos el nombre del archivo de texto como nombre de la KB
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
      const updatedKb = await onAddSource(kbId, 'text', { 
        fileName, 
        content,
        knowledgeBaseName: kbName
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
