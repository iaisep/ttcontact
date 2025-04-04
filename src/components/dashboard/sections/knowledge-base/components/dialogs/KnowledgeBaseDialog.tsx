
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, Upload, FileText, Plus, Trash } from 'lucide-react';
import { X } from 'lucide-react';
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

  const [showSourceMenu, setShowSourceMenu] = useState(false);

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
        setShowSourceMenu(false);
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
      console.log('Saving knowledge base with name:', data.name);
      // Modify this to handle void return type from onSave
      await handleKnowledgeBaseSave(data, onSave);
      form.reset();
    } catch (error) {
      console.error('Error saving knowledge base:', error);
    }
  };

  // Source menu options
  const sourceOptions = [
    {
      id: 'url',
      icon: <Link className="h-5 w-5 text-gray-600" />,
      title: 'Add Web Pages',
      description: 'Crawl and sync your website'
    },
    {
      id: 'file',
      icon: <Upload className="h-5 w-5 text-gray-600" />,
      title: 'Upload Files',
      description: 'File size should be less than 100MB'
    },
    {
      id: 'text',
      icon: <FileText className="h-5 w-5 text-gray-600" />,
      title: 'Add Text',
      description: 'Add articles manually'
    }
  ];

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
        <DialogContent className="sm:max-w-[550px] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-medium">
              Add Knowledge Base
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          
          <div className="p-6 pt-2">
            <Form {...form}>
              <form id="knowledge-base-form" onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Knowledge Base Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter" 
                            {...field} 
                            disabled={isSaving}
                            className="mt-1"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Using SourcesSection component instead of inline UI */}
                  {currentKb && (
                    <SourcesSection 
                      knowledgeBase={currentKb}
                      onAddSourceClick={handleAddSourceClick}
                      onDeleteSourceClick={setSourceToDelete}
                      onAutoSyncChange={handleAutoSyncChange}
                    />
                  )}
                  
                  {/* Dialog Footer */}
                  <div className="flex justify-end gap-2 mt-6">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={isSaving || addingSource}
                      className="w-20"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      form="knowledge-base-form"
                      disabled={isSaving || addingSource || !form.getValues().name}
                      className="w-20 bg-black text-white hover:bg-black/80"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
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
        currentKnowledgeBase={currentKb}
      />
    </>
  );
};

export default KnowledgeBaseDialog;
