
import { useState, useEffect } from 'react';
import { KnowledgeBase, KnowledgeBaseSource } from '../../types';

export const useDialogState = (knowledgeBase: KnowledgeBase | null, isCreating: boolean) => {
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
    setCurrentKb,
    setCreationComplete,
    setAddingSource,
    resetSourceModals
  };
};
