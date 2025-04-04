
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { KnowledgeBase, WebPage } from '../../types';
import { useKnowledgeBaseDialog } from '../../hooks/useKnowledgeBaseDialog';
import KnowledgeBaseSourceModals from './KnowledgeBaseSourceModals';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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

  const form = useForm({
    defaultValues: {
      name: knowledgeBase?.name || '',
    }
  });

  // Reset source modals when main dialog closes
  useEffect(() => {
    if (!open) {
      // Use timeout to ensure state updates don't conflict
      const timeout = setTimeout(() => {
        resetSourceModals();
        form.reset();
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    if (knowledgeBase) {
      form.setValue('name', knowledgeBase.name || '');
    } else {
      form.setValue('name', '');
    }
  }, [knowledgeBase, form]);

  const handleSubmit = async (data: { name: string }) => {
    try {
      // Format the data for the API according to the required format
      const formattedData = {
        knowledge_base_name: data.name,
        knowledge_base_urls: [],
        knowledge_base_texts: [],
        enable_auto_refresh: false
      };
      
      console.log("Creating knowledge base with data:", formattedData);
      
      const success = await handleKnowledgeBaseSave(data, onSave);
      if (success) {
        form.reset();
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
          if (!isSaving && !addingSource) {
            onOpenChange(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Add Knowledge Base' : 'Edit Knowledge Base'}</DialogTitle>
            <DialogDescription>
              {isCreating 
                ? 'Create a new knowledge base for your AI agents to use during calls.' 
                : 'Update your knowledge base information and sources.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form id="knowledge-base-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Knowledge Base Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter a name" 
                        {...field} 
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          
          {currentKb && !isCreating && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Sources</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddSourceClick('url')}
                  disabled={addingSource}
                >
                  Add Source
                </Button>
              </div>
              
              <div className="border rounded-md divide-y">
                {currentKb.sources.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No sources added yet. Click "Add Source" to add your first source.
                  </div>
                ) : (
                  // Sources list would be rendered here
                  <div className="p-4 text-center text-sm">
                    {currentKb.sources.length} source(s) added
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving || addingSource}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              form="knowledge-base-form"
              disabled={isSaving || addingSource}
            >
              {isSaving ? "Saving..." : (isCreating ? 'Create' : 'Update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Source modals */}
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
