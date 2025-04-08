
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
  const [sourcesMarkedForDeletion, setSourcesMarkedForDeletion] = useState<Set<string>>(new Set());
  const [deletingSourceIds, setDeletingSourceIds] = useState<string[]>([]);

  useEffect(() => {
    if (knowledgeBase) {
      setName(knowledgeBase.name);
    } else {
      setName('');
    }
    // Reset sources marked for deletion when dialog opens/closes or KB changes
    setSourcesMarkedForDeletion(new Set());
  }, [knowledgeBase, open]);

  const handleClose = () => {
    // Clean up and close the dialog
    resetSourceModals();
    setSourcesMarkedForDeletion(new Set());
    onOpenChange(false);
    
    // Dispatch a refresh event when we close the dialog
    const refreshEvent = new CustomEvent('refreshKnowledgeBase');
    window.dispatchEvent(refreshEvent);
  };

  const handleSave = async () => {
    try {
      // Set loading state
      const savingToast = toast.loading('Saving knowledge base...');
      
      // First handle name update
      await handleKnowledgeBaseSave({ name }, () => onSave({ name }));
      
      // Then process any sources marked for deletion
      if (sourcesMarkedForDeletion.size > 0 && currentKb) {
        console.log(`Processing ${sourcesMarkedForDeletion.size} sources marked for deletion`);
        setDeletingSourceIds(Array.from(sourcesMarkedForDeletion));
        
        // Process deletions one by one
        for (const sourceId of sourcesMarkedForDeletion) {
          try {
            console.log(`Deleting source ${sourceId} from KB ${currentKb.id}`);
            await onDeleteSource(currentKb.id, sourceId);
          } catch (error) {
            console.error(`Failed to delete source ${sourceId}:`, error);
            // Continue with other deletions even if one fails
          }
        }
        
        // Reset the deletion tracking
        setSourcesMarkedForDeletion(new Set());
        setDeletingSourceIds([]);
      }
      
      toast.dismiss(savingToast);
      toast.success('Knowledge base saved successfully');
      
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

  // Create a temporary knowledge base for the creation flow
  const tempKnowledgeBase = isCreating && !currentKb && name ? {
    id: `temp_${Date.now()}`,
    name: name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    source_count: 0,
    sources: [],
    auto_sync: false
  } : null;
  
  // Use either the current KB or the temp KB for display
  const displayKb = currentKb || tempKnowledgeBase;

  // Filter out sources that are marked for deletion (for display purposes)
  const filteredSources = displayKb?.sources.filter(
    source => !sourcesMarkedForDeletion.has(source.id)
  ) || [];

  return (
    <>
      <Sheet open={open} onOpenChange={(value) => {
        if (!isSaving && !addingSource) {
          onOpenChange(value);
          if (!value) {
            resetSourceModals();
            setSourcesMarkedForDeletion(new Set());
            // Refresh the list when closing the dialog
            const refreshEvent = new CustomEvent('refreshKnowledgeBase');
            window.dispatchEvent(refreshEvent);
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
              currentKb={displayKb}
              handleAutoSyncChange={handleAutoSyncChange}
            />

            {/* Always show the sources section to allow adding sources during creation */}
            <SourcesSection
              sources={displayKb?.sources || []}
              onAddSourceClick={handleAddSourceClick}
              onDeleteSource={(source) => {
                setSourceToDelete(source);
                setDeleteSourceDialogOpen(true);
              }}
              sourcesToDelete={sourcesMarkedForDeletion}
              setSourcesMarkedForDeletion={setSourcesMarkedForDeletion}
            />
            
            {sourcesMarkedForDeletion.size > 0 && (
              <div className="text-sm text-amber-600 dark:text-amber-400">
                {sourcesMarkedForDeletion.size} source(s) marked for deletion. 
                Changes will be applied when you click Save.
              </div>
            )}
          </div>

          <SheetFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSaving || addingSource || deletingSourceIds.length > 0}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSave}
              disabled={!name.trim() || isSaving || addingSource || deletingSourceIds.length > 0}
            >
              {isSaving || deletingSourceIds.length > 0 ? 'Saving...' : 'Save'}
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
        currentKnowledgeBase={displayKb}
        knowledgeBaseName={name}
        onSourceAdded={handleSourceAdded}
        onCloseMainDialog={handleClose}
      />
    </>
  );
};

export default KnowledgeBaseDialog;
