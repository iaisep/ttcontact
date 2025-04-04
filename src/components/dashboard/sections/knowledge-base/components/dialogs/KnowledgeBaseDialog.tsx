
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { KnowledgeBase, WebPage } from '../../types';
import KnowledgeBaseFormContent from './KnowledgeBaseFormContent';
import { useKnowledgeBaseDialog } from '../../hooks/dialog';

interface KnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCreating: boolean;
  knowledgeBase: KnowledgeBase | null;
  onSave: (data: { name: string }) => Promise<void>;
  onAddSource: (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => Promise<KnowledgeBase>;
  onDeleteSource: (kbId: string, sourceId: string) => Promise<KnowledgeBase>;
  onFetchSitemap: (url: string) => Promise<WebPage[]>;
  isSaving?: boolean;
}

const KnowledgeBaseDialog: React.FC<KnowledgeBaseDialogProps> = ({
  open,
  onOpenChange,
  isCreating,
  knowledgeBase,
  onSave,
  onAddSource,
  onDeleteSource,
  onFetchSitemap,
  isSaving = false
}) => {
  const [shouldCloseAfterSave, setShouldCloseAfterSave] = useState(false);
  
  // Reset the state when the dialog opens/closes
  useEffect(() => {
    if (!open) {
      setShouldCloseAfterSave(false);
    }
  }, [open]);

  // Use our custom hook for knowledge base dialog management
  const {
    currentSourceType,
    sourceToDelete,
    deleteSourceDialogOpen,
    currentKb,
    creationComplete,
    addingSource,
    setCurrentSourceType,
    setSourceToDelete,
    setDeleteSourceDialogOpen,
    handleAddSourceClick,
    handleAddUrlSource,
    handleAddFileSource,
    handleAddTextSource,
    handleDeleteSource,
    handleAutoSyncChange,
    handleKnowledgeBaseSave
  } = useKnowledgeBaseDialog({
    knowledgeBase,
    isCreating,
    onAddSource,
    onDeleteSource
  });

  // Handler for form submission
  const handleSaveForm = async (data: { name: string }) => {
    try {
      // Save the knowledge base and get the save status
      const saveSuccess = await handleKnowledgeBaseSave(data, onSave);
      
      // If we successfully saved and should close the dialog
      if (saveSuccess && shouldCloseAfterSave) {
        // Give a small delay to allow the toast to be seen
        setTimeout(() => {
          onOpenChange(false);
        }, 500);
      }
      
      return saveSuccess;
    } catch (error) {
      console.error('Error saving knowledge base:', error);
      return false;
    }
  };

  // Handle when a source is successfully added
  const handleSourceAddSuccess = () => {
    // Only close the entire dialog if we're creating a new knowledge base
    if (isCreating) {
      setShouldCloseAfterSave(true);
      setTimeout(() => {
        onOpenChange(false);
      }, 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <KnowledgeBaseFormContent
          isCreating={isCreating}
          currentKb={currentKb}
          creationComplete={creationComplete}
          isSaving={isSaving || addingSource}
          onSave={handleSaveForm}
          onAddSourceClick={handleAddSourceClick}
          onDeleteSourceClick={(source) => {
            setSourceToDelete(source);
            setDeleteSourceDialogOpen(true);
          }}
          onAutoSyncChange={handleAutoSyncChange}
          currentSourceType={currentSourceType}
          sourceToDelete={sourceToDelete}
          deleteSourceDialogOpen={deleteSourceDialogOpen}
          setCurrentSourceType={setCurrentSourceType}
          setSourceToDelete={setSourceToDelete}
          setDeleteSourceDialogOpen={setDeleteSourceDialogOpen}
          onAddUrlSource={handleAddUrlSource}
          onAddFileSource={handleAddFileSource}
          onAddTextSource={handleAddTextSource}
          onDeleteSource={handleDeleteSource}
          onFetchSitemap={onFetchSitemap}
          onSourceAddSuccess={handleSourceAddSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeBaseDialog;
