
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { KnowledgeBase, WebPage } from '../../types';
import { useKnowledgeBaseDialog } from '../../hooks/dialog';
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
  const [knowledgeBaseName, setKnowledgeBaseName] = useState('');

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
      setKnowledgeBaseName(knowledgeBase.name || '');
    } else {
      form.setValue('name', '');
      setKnowledgeBaseName('');
    }
  }, [knowledgeBase, form]);

  // Track form value changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.name !== undefined) {
        setKnowledgeBaseName(value.name);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data: { name: string }) => {
    try {
      console.log('Saving knowledge base with name:', data.name);
      
      // Ensure we have a name, even if empty - we'll handle validation on the API side
      if (!data.name || data.name.trim() === '') {
        data.name = 'New Knowledge Base';
        form.setValue('name', data.name);
        setKnowledgeBaseName(data.name);
      }
      
      const success = await handleKnowledgeBaseSave(data, onSave);
      if (success) {
        form.reset();
      }
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
                  
                  {/* Documents Section */}
                  <div>
                    <h3 className="text-base font-medium mb-2">Documents</h3>
                    
                    <div className="relative">
                      {/* Add Button */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSourceMenu(!showSourceMenu)}
                        className="relative border border-gray-300"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                      
                      {/* Source Selection Menu */}
                      {showSourceMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 w-64">
                          {sourceOptions.map(option => (
                            <div 
                              key={option.id}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                handleAddSourceClick(option.id as 'url' | 'file' | 'text');
                                setShowSourceMenu(false);
                              }}
                            >
                              <div className="flex-shrink-0 p-2 bg-white border rounded-full">
                                {option.icon}
                              </div>
                              <div>
                                <h4 className="font-medium">{option.title}</h4>
                                <p className="text-xs text-gray-500">{option.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* List of added sources */}
                    {currentKb && currentKb.sources.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {currentKb.sources.map(source => (
                          <div 
                            key={source.id}
                            className="flex items-center justify-between border rounded-md p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 p-1 bg-yellow-100 rounded-md">
                                {source.type === 'url' ? (
                                  <Link className="h-5 w-5 text-yellow-600" />
                                ) : source.type === 'file' ? (
                                  <FileText className="h-5 w-5 text-yellow-600" />
                                ) : (
                                  <FileText className="h-5 w-5 text-yellow-600" />
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">{source.title || source.url || source.file_name}</h4>
                                <p className="text-xs text-gray-500">
                                  {source.type === 'url' ? '1 Page' : ''}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSourceToDelete(source);
                                setDeleteSourceDialogOpen(true);
                              }}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Auto-sync option (only show if there are URL sources) */}
                    {currentKb && currentKb.sources.some(s => s.type === 'url') && (
                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox 
                          id="auto-sync"
                          checked={currentKb.auto_sync}
                          onCheckedChange={(checked) => handleAutoSyncChange(checked === true)}
                        />
                        <label htmlFor="auto-sync" className="text-sm cursor-pointer">
                          Auto sync web pages every 24 hours
                        </label>
                      </div>
                    )}
                  </div>
                  
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
                      disabled={isSaving || addingSource}
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
        knowledgeBaseName={knowledgeBaseName}
      />
    </>
  );
};

export default KnowledgeBaseDialog;
