
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { KnowledgeBase, WebPage } from '../../types';
import { useKnowledgeBaseDialog } from '../../hooks/useKnowledgeBaseDialog';
import KnowledgeBaseFormContent from './KnowledgeBaseFormContent';
import KnowledgeBaseSourceModals from '../dialogs/KnowledgeBaseSourceModals';
import SourcesSection from './SourcesSection';

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

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Reset source modals when the main dialog is closed
      resetSourceModals();
    }
    onOpenChange(open);
  };

  // Debug logging for improved visibility
  console.log('KnowledgeBaseDialog - current KB:', currentKb);
  console.log('KnowledgeBaseDialog - creation complete:', creationComplete);

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Add Knowledge Base' : 'Edit Knowledge Base'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <KnowledgeBaseFormContent
              isCreating={isCreating}
              knowledgeBase={currentKb}
              onSave={(data) => handleKnowledgeBaseSave(data, onSave)}
              disabled={isSaving || addingSource}
              onClose={() => onOpenChange(false)}
              creationComplete={creationComplete}
            />

            {(currentKb || creationComplete) && (
              <SourcesSection
                knowledgeBase={currentKb}
                onAddSourceClick={handleAddSourceClick}
                onDeleteClick={(source) => {
                  setSourceToDelete(source);
                  setDeleteSourceDialogOpen(true);
                }}
                onAutoSyncChange={handleAutoSyncChange}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

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
        currentKnowledgeBase={currentKb}
      />
    </>
  );
};

export default KnowledgeBaseDialog;
