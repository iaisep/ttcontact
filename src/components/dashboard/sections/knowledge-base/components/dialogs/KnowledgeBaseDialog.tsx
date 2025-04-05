
import React, { useState, useEffect } from 'react';
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { KnowledgeBase } from '../../types';
import KnowledgeBaseFormContent from './KnowledgeBaseFormContent';
import KnowledgeBaseSourceModals from './KnowledgeBaseSourceModals';
import SourcesSection from './SourcesSection';
import { useKnowledgeBaseDialog } from '../../hooks/dialog/useKnowledgeBaseDialog';

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
  onFetchSitemap: (url: string) => Promise<any[]>;
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

  const [name, setName] = useState('');

  useEffect(() => {
    if (knowledgeBase) {
      setName(knowledgeBase.name);
    } else {
      setName('');
    }
  }, [knowledgeBase, open]);

  const handleClose = () => {
    // Clean up and close the dialog
    resetSourceModals();
    onOpenChange(false);
  };

  const handleSave = async () => {
    try {
      await handleKnowledgeBaseSave({ name }, () => onSave({ name }));
      // Only close if not creating or if we've completed creation
      if (!isCreating || creationComplete) {
        handleClose();
      }
    } catch (error) {
      console.error('Failed to save knowledge base:', error);
      toast.error('Failed to save knowledge base');
    }
  };

  // Handle source addition notification
  const handleSourceAdded = () => {
    // Dispatch a custom event to refresh the knowledge base list
    const refreshEvent = new CustomEvent('refreshKnowledgeBase');
    window.dispatchEvent(refreshEvent);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(value) => {
        if (!isSaving && !addingSource) {
          onOpenChange(value);
          if (!value) {
            resetSourceModals();
          }
        }
      }}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isCreating ? 'Add Knowledge Base' : 'Edit Knowledge Base'}</SheetTitle>
            <SheetDescription>
              {isCreating
                ? 'Create a new knowledge base to store your references.'
                : 'Update your knowledge base settings and sources.'}
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <KnowledgeBaseFormContent
              name={name}
              setName={setName}
              currentKb={currentKb}
              handleAutoSyncChange={handleAutoSyncChange}
            />

            {/* Only show sources section if editing or if we've completed the initial creation */}
            {(!isCreating || creationComplete) && currentKb && (
              <SourcesSection
                sources={currentKb.sources || []}
                onAddSourceClick={handleAddSourceClick}
                onDeleteSource={(source) => {
                  setSourceToDelete(source);
                  setDeleteSourceDialogOpen(true);
                }}
              />
            )}
          </div>

          <SheetFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSaving || addingSource}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSave}
              disabled={!name.trim() || isSaving || addingSource}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

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
        knowledgeBaseName={name}
        onSourceAdded={handleSourceAdded}
        onCloseMainDialog={handleClose}
      />
    </>
  );
};

export default KnowledgeBaseDialog;
