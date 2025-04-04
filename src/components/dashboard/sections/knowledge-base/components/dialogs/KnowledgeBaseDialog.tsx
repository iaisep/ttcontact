
import React, { useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { KnowledgeBase, WebPage } from '../../types';
import { useKnowledgeBaseDialog } from '../../hooks/useKnowledgeBaseDialog';
import KnowledgeBaseDialogContent from './KnowledgeBaseDialogContent';
import KnowledgeBaseSourceModals from './KnowledgeBaseSourceModals';

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
  isSaving: boolean;
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
  isSaving
}) => {
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
    resetSourceModals,
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

  // Reset source modals when main dialog closes
  useEffect(() => {
    if (!open) {
      // Use timeout to ensure state updates don't conflict
      const timeout = setTimeout(() => {
        resetSourceModals();
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const handleKnowledgeBaseSaveWithSave = async (data: { name: string }) => {
    // Include API parameters matching the format in the screenshots
    const formattedData = {
      knowledge_base_name: data.name,
      knowledge_base_urls: [],
      knowledge_base_texts: [],
      enable_auto_refresh: false
    };
    
    console.log("Creating knowledge base with data:", formattedData);
    
    try {
      await handleKnowledgeBaseSave(data, onSave);
      return true;
    } catch (error) {
      console.error("Error saving knowledge base:", error);
      return false;
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onOpenChange={(open) => {
          // Only allow closing if we're not in the middle of an operation
          if (!isSaving && !addingSource) {
            onOpenChange(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Add Knowledge Base' : 'Edit Knowledge Base'}</DialogTitle>
            <DialogDescription>
              {isCreating && !creationComplete
                ? 'Create a new knowledge base for your AI agents to use during calls.' 
                : 'Update your knowledge base information and sources.'}
            </DialogDescription>
          </DialogHeader>
          
          <KnowledgeBaseDialogContent 
            knowledgeBase={currentKb}
            isCreating={isCreating}
            isSaving={isSaving}
            addingSource={addingSource}
            creationComplete={creationComplete}
            onOpenChange={onOpenChange}
            onSave={onSave}
            onAddSourceClick={handleAddSourceClick}
            onDeleteSourceClick={(source) => {
              setSourceToDelete(source);
              setDeleteSourceDialogOpen(true);
            }}
            onAutoSyncChange={handleAutoSyncChange}
            onKnowledgeBaseSave={handleKnowledgeBaseSaveWithSave}
          />
        </DialogContent>
      </Dialog>

      {/* Child modals */}
      <KnowledgeBaseSourceModals
        currentSourceType={currentSourceType}
        setCurrentSourceType={setCurrentSourceType}
        sourceToDelete={sourceToDelete}
        deleteSourceDialogOpen={deleteSourceDialogOpen}
        setDeleteSourceDialogOpen={setDeleteSourceDialogOpen}
        onAddUrlSource={handleAddUrlSource}
        onAddFileSource={handleAddFileSource}
        onAddTextSource={handleAddTextSource}
        onDeleteSource={handleDeleteSource}
        onFetchSitemap={onFetchSitemap}
      />
    </>
  );
};

export default KnowledgeBaseDialog;
