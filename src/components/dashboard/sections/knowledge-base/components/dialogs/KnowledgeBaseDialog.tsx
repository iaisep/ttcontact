
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';
import AddUrlSourceModal from '../AddUrlSourceModal';
import AddFileSourceModal from '../AddFileSourceModal';
import AddTextSourceModal from '../AddTextSourceModal';
import SourceDeleteDialog from '../SourceDeleteDialog';
import KnowledgeBaseFormContent from './KnowledgeBaseFormContent';
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
  onFetchSitemap: (url: string) => Promise<any[]>;
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
  const [currentSourceType, setCurrentSourceType] = useState<'url' | 'file' | 'text' | null>(null);
  const [sourceToDelete, setSourceToDelete] = useState<KnowledgeBaseSource | null>(null);
  const [deleteSourceDialogOpen, setDeleteSourceDialogOpen] = useState(false);
  const [currentKb, setCurrentKb] = useState<KnowledgeBase | null>(knowledgeBase);
  const [creationComplete, setCreationComplete] = useState(false);

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

  // Reset source modals when main dialog closes
  useEffect(() => {
    if (!open) {
      // Use timeout to ensure state updates don't conflict
      const timeout = setTimeout(() => {
        setCurrentSourceType(null);
        setSourceToDelete(null);
        setDeleteSourceDialogOpen(false);
        setCreationComplete(false);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const handleAddSourceClick = (type: 'url' | 'file' | 'text') => {
    setCurrentSourceType(type);
  };

  const handleAddUrlSource = async (url: string, autoSync: boolean, selectedPages: WebPage[]) => {
    if (!currentKb) return;

    try {
      const updatedKb = await onAddSource(currentKb.id, 'url', {
        url,
        autoSync,
        webPages: selectedPages
      });
      setCurrentKb(updatedKb);
      setCurrentSourceType(null);
    } catch (error) {
      console.error('Failed to add URL source:', error);
    }
  };

  const handleAddFileSource = async (file: File) => {
    if (!currentKb) return;

    try {
      const updatedKb = await onAddSource(currentKb.id, 'file', { file });
      setCurrentKb(updatedKb);
      setCurrentSourceType(null);
    } catch (error) {
      console.error('Failed to add file source:', error);
    }
  };

  const handleAddTextSource = async (fileName: string, content: string) => {
    if (!currentKb) return;

    try {
      const updatedKb = await onAddSource(currentKb.id, 'text', { fileName, content });
      setCurrentKb(updatedKb);
      setCurrentSourceType(null);
    } catch (error) {
      console.error('Failed to add text source:', error);
    }
  };

  const handleDeleteSource = async () => {
    if (!currentKb || !sourceToDelete) return;

    try {
      const updatedKb = await onDeleteSource(currentKb.id, sourceToDelete.id);
      setCurrentKb(updatedKb);
      // Don't set setDeleteSourceDialogOpen(false) here - let the component handle it
    } catch (error) {
      console.error('Failed to delete source:', error);
    }
  };

  const handleAutoSyncChange = (checked: boolean) => {
    if (!currentKb) return;
    
    const updatedKb = {...currentKb, auto_sync: checked};
    setCurrentKb(updatedKb);
  };

  const handleKnowledgeBaseSave = async (data: { name: string }) => {
    try {
      await onSave(data);
      if (isCreating) {
        setCreationComplete(true);
      }
    } catch (error) {
      console.error('Error saving knowledge base:', error);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onOpenChange={(open) => {
          // Only allow closing if we're not in the middle of an operation
          if (!isSaving) {
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
          
          {isCreating && !creationComplete ? (
            <KnowledgeBaseFormContent 
              knowledgeBase={currentKb} 
              onOpenChange={onOpenChange} 
              isSaving={isSaving} 
              onSave={handleKnowledgeBaseSave}
            />
          ) : (
            <>
              <KnowledgeBaseFormContent 
                knowledgeBase={currentKb} 
                onOpenChange={onOpenChange} 
                isSaving={isSaving} 
                onSave={handleKnowledgeBaseSave}
              />
              
              {currentKb && (
                <SourcesSection 
                  knowledgeBase={currentKb}
                  onAddSourceClick={handleAddSourceClick}
                  onDeleteSourceClick={(source) => {
                    setSourceToDelete(source);
                    setDeleteSourceDialogOpen(true);
                  }}
                  onAutoSyncChange={handleAutoSyncChange}
                />
              )}
            </>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              form="knowledge-base-form"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : (isCreating && !creationComplete ? 'Create' : 'Update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Child modals */}
      <AddUrlSourceModal
        open={currentSourceType === 'url'}
        onOpenChange={(open) => !open && setCurrentSourceType(null)}
        onSubmit={handleAddUrlSource}
        onFetchSitemap={onFetchSitemap}
      />

      <AddFileSourceModal
        open={currentSourceType === 'file'}
        onOpenChange={(open) => !open && setCurrentSourceType(null)}
        onSubmit={handleAddFileSource}
      />

      <AddTextSourceModal
        open={currentSourceType === 'text'}
        onOpenChange={(open) => !open && setCurrentSourceType(null)}
        onSubmit={handleAddTextSource}
      />

      {/* Delete source dialog */}
      {deleteSourceDialogOpen && (
        <SourceDeleteDialog
          open={deleteSourceDialogOpen}
          onOpenChange={setDeleteSourceDialogOpen}
          source={sourceToDelete}
          onConfirm={handleDeleteSource}
        />
      )}
    </>
  );
};

export default KnowledgeBaseDialog;
