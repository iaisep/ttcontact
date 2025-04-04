
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
    if (!currentKb) return;

    try {
      setAddingSource(true);
      console.log("Adding URL source with params:", { url, autoSync, selectedPages });
      
      const updatedKb = await onAddSource(currentKb.id, 'url', {
        url,
        autoSync,
        webPages: selectedPages
      });
      
      setCurrentKb(updatedKb);
      setCurrentSourceType(null);
    } catch (error) {
      console.error('Failed to add URL source:', error);
      toast.error('Failed to add URL source');
      throw error;
    } finally {
      setAddingSource(false);
    }
  };

  const handleAddFileSource = async (file: File) => {
    if (!currentKb) return;

    try {
      setAddingSource(true);
      console.log("Adding file source:", file.name);
      
      const updatedKb = await onAddSource(currentKb.id, 'file', { file });
      setCurrentKb(updatedKb);
      setCurrentSourceType(null);
    } catch (error) {
      console.error('Failed to add file source:', error);
      toast.error('Failed to add file source');
      throw error;
    } finally {
      setAddingSource(false);
    }
  };

  const handleAddTextSource = async (fileName: string, content: string) => {
    if (!currentKb) return;

    try {
      setAddingSource(true);
      console.log("Adding text source:", { fileName, contentLength: content.length });
      
      const updatedKb = await onAddSource(currentKb.id, 'text', { fileName, content });
      setCurrentKb(updatedKb);
      setCurrentSourceType(null);
    } catch (error) {
      console.error('Failed to add text source:', error);
      toast.error('Failed to add text source');
      throw error;
    } finally {
      setAddingSource(false);
    }
  };

  const handleDeleteSource = async () => {
    if (!currentKb || !sourceToDelete) return;

    try {
      await onDeleteSource(currentKb.id, sourceToDelete.id);
    } catch (error) {
      console.error('Failed to delete source:', error);
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
      await onSave(data);
      if (isCreating) {
        setCreationComplete(true);
      }
      return true;
    } catch (error) {
      console.error('Error saving knowledge base:', error);
      throw error;
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
