
import { useState, useEffect } from 'react';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../types';
import { toast } from 'sonner';

interface UseKnowledgeBaseDialogProps {
  knowledgeBase: KnowledgeBase | null;
  isCreating: boolean;
  onAddSource: (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => Promise<KnowledgeBase>;
  onDeleteSource: (kbId: string, sourceId: string) => Promise<KnowledgeBase>;
}

export const useKnowledgeBaseDialog = ({
  knowledgeBase,
  isCreating,
  onAddSource,
  onDeleteSource
}: UseKnowledgeBaseDialogProps) => {
  const [currentSourceType, setCurrentSourceType] = useState<'url' | 'file' | 'text' | null>(null);
  const [sourceToDelete, setSourceToDelete] = useState<KnowledgeBaseSource | null>(null);
  const [deleteSourceDialogOpen, setDeleteSourceDialogOpen] = useState(false);
  const [currentKb, setCurrentKb] = useState<KnowledgeBase | null>(knowledgeBase);
  const [creationComplete, setCreationComplete] = useState(false);
  const [addingSource, setAddingSource] = useState(false);

  useEffect(() => {
    if (knowledgeBase) {
      setCurrentKb(knowledgeBase);
      if (isCreating && knowledgeBase.id) {
        setCreationComplete(true);
      }
    } else {
      setCurrentKb(null);
      setCreationComplete(false);
    }
  }, [knowledgeBase, isCreating]);

  const resetSourceModals = () => {
    setCurrentSourceType(null);
    setSourceToDelete(null);
    setDeleteSourceDialogOpen(false);
  };

  const handleAddSourceClick = (type: 'url' | 'file' | 'text') => {
    setCurrentSourceType(type);
  };

  const handleAddUrlSource = async (url: string, autoSync: boolean, selectedPages: WebPage[]) => {
    try {
      setAddingSource(true);
      
      // Generar una KB temporal si estamos creando una nueva
      let kbToUse = currentKb;
      
      if (!kbToUse && isCreating) {
        // Crear una KB temporal para el proceso de creación
        kbToUse = {
          id: `temp_${Date.now()}`,
          name: "New Knowledge Base from URL",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          source_count: 0,
          sources: [],
          auto_sync: autoSync
        };
        setCurrentKb(kbToUse);
      }
      
      if (!kbToUse) {
        toast.error('No knowledge base selected');
        throw new Error('No knowledge base selected');
      }
      
      console.log("Adding URL source with params:", { 
        url, 
        autoSync, 
        selectedPages, 
        kbId: kbToUse.id,
        isTemp: kbToUse.id.startsWith('temp_')
      });
      
      // Format the data according to the API requirements
      const sourceData = {
        url,
        autoSync,
        webPages: selectedPages,
        knowledgeBaseName: kbToUse.name
      };
      
      // La API decidirá qué endpoint usar basado en el ID
      const updatedKb = await onAddSource(kbToUse.id, 'url', sourceData);
      
      setCurrentKb(updatedKb);
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

  const handleAddFileSource = async (file: File) => {
    try {
      setAddingSource(true);
      
      // Determinar si estamos creando una KB nueva
      let kbToUse = currentKb;
      const isNewKb = !kbToUse || isCreating;
      
      if (isNewKb) {
        // Crear una KB temporal con nombre basado en archivo
        const fileName = file.name.split('.')[0] || "New Knowledge Base";
        kbToUse = {
          id: `temp_${Date.now()}`,
          name: fileName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          source_count: 0,
          sources: [],
          auto_sync: false
        };
        setCurrentKb(kbToUse);
      }
      
      console.log("Adding file source:", { 
        fileName: file.name,
        kbId: kbToUse.id,
        kbName: kbToUse.name,
        isNewKb
      });
      
      // Add the source to the KB - will use create or add endpoint based on ID
      const updatedKb = await onAddSource(kbToUse.id, 'file', { 
        file,
        knowledgeBaseName: kbToUse.name 
      });
      
      setCurrentKb(updatedKb);
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

  const handleAddTextSource = async (fileName: string, content: string) => {
    try {
      setAddingSource(true);
      
      // Determinar si estamos creando una KB nueva
      let kbToUse = currentKb;
      const isNewKb = !kbToUse || isCreating;
      
      if (isNewKb) {
        // Crear una KB temporal con nombre basado en archivo de texto
        kbToUse = {
          id: `temp_${Date.now()}`,
          name: fileName || "New Knowledge Base",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          source_count: 0,
          sources: [],
          auto_sync: false
        };
        setCurrentKb(kbToUse);
      }
      
      console.log("Adding text source:", { 
        fileName, 
        contentLength: content.length,
        kbId: kbToUse.id,
        kbName: kbToUse.name,
        isNewKb
      });
      
      // Add the source to the KB - will use create or add endpoint based on ID
      const updatedKb = await onAddSource(kbToUse.id, 'text', { 
        fileName, 
        content,
        knowledgeBaseName: kbToUse.name
      });
      
      setCurrentKb(updatedKb);
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

  const handleDeleteSource = async () => {
    if (!currentKb || !sourceToDelete) {
      toast.error('Missing knowledge base or source');
      return Promise.reject(new Error('Missing knowledge base or source'));
    }

    try {
      const updatedKb = await onDeleteSource(currentKb.id, sourceToDelete.id);
      setCurrentKb(updatedKb);
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

  const handleAutoSyncChange = (checked: boolean) => {
    if (!currentKb) return;
    
    const updatedKb = {...currentKb, auto_sync: checked};
    setCurrentKb(updatedKb);
  };

  const handleKnowledgeBaseSave = async (data: { name: string }, onSave: (data: { name: string }) => Promise<void>): Promise<boolean> => {
    try {
      console.log("Saving knowledge base with data:", data);
      
      // Call the API with the provided data
      await onSave(data);
      
      if (isCreating) {
        setCreationComplete(true);
        toast.success('Knowledge base created successfully');
      } else {
        toast.success('Knowledge base updated successfully');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving knowledge base:', error);
      toast.error('Failed to save knowledge base');
      return false;
    }
  };

  return {
    currentSourceType,
    sourceToDelete,
    deleteSourceDialogOpen,
    currentKb,
    creationComplete,
    addingSource,
    setCurrentSourceType,
    setSourceToDelete,
    setDeleteSourceDialogOpen,
    resetSourceModals,
    handleAddSourceClick,
    handleAddUrlSource,
    handleAddFileSource,
    handleAddTextSource,
    handleDeleteSource,
    handleAutoSyncChange,
    handleKnowledgeBaseSave
  };
};
