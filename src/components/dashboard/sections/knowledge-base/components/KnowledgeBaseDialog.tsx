
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Plus, 
  Trash2, 
  Globe, 
  File, 
  FileText,
  RefreshCcw 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { KnowledgeBase, KnowledgeBaseSource } from '../types';
import AddUrlSourceModal from './AddUrlSourceModal';
import AddFileSourceModal from './AddFileSourceModal';
import AddTextSourceModal from './AddTextSourceModal';
import SourceDeleteDialog from './SourceDeleteDialog';

interface KnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCreating: boolean;
  knowledgeBase: KnowledgeBase | null;
  onSave: (name: string, kb: KnowledgeBase | null) => Promise<KnowledgeBase>;
  onAddSource: (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => Promise<KnowledgeBase>;
  onDeleteSource: (kbId: string, sourceId: string) => Promise<KnowledgeBase>;
  onFetchSitemap: (url: string) => Promise<any[]>;
}

const KnowledgeBaseDialog: React.FC<KnowledgeBaseDialogProps> = ({
  open,
  onOpenChange,
  isCreating,
  knowledgeBase,
  onSave,
  onAddSource,
  onDeleteSource,
  onFetchSitemap
}) => {
  const [currentSourceType, setCurrentSourceType] = useState<'url' | 'file' | 'text' | null>(null);
  const [sourceToDelete, setSourceToDelete] = useState<KnowledgeBaseSource | null>(null);
  const [deleteSourceDialogOpen, setDeleteSourceDialogOpen] = useState(false);
  const [currentKb, setCurrentKb] = useState<KnowledgeBase | null>(knowledgeBase);

  const form = useForm({
    defaultValues: {
      name: knowledgeBase?.name || '',
    }
  });

  useEffect(() => {
    if (knowledgeBase) {
      form.setValue('name', knowledgeBase.name);
      setCurrentKb(knowledgeBase);
    } else {
      form.setValue('name', '');
      setCurrentKb(null);
    }
  }, [knowledgeBase, form]);

  const handleSave = async (data: { name: string }) => {
    try {
      const savedKb = await onSave(data.name, currentKb);
      setCurrentKb(savedKb);
      if (isCreating) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Failed to save knowledge base:', error);
    }
  };

  const handleReset = () => {
    form.reset();
    setCurrentKb(null);
    setCurrentSourceType(null);
  };

  const handleAddSourceClick = (type: 'url' | 'file' | 'text') => {
    setCurrentSourceType(type);
  };

  const handleAddUrlSource = async (url: string, autoSync: boolean, selectedPages: any[]) => {
    if (!currentKb) return;

    try {
      const updatedKb = await onAddSource(currentKb.id, 'url', {
        url,
        autoSync,
        webPages: selectedPages
      });
      setCurrentKb(updatedKb);
    } catch (error) {
      console.error('Failed to add URL source:', error);
    }
  };

  const handleAddFileSource = async (file: File) => {
    if (!currentKb) return;

    try {
      const updatedKb = await onAddSource(currentKb.id, 'file', { file });
      setCurrentKb(updatedKb);
    } catch (error) {
      console.error('Failed to add file source:', error);
    }
  };

  const handleAddTextSource = async (fileName: string, content: string) => {
    if (!currentKb) return;

    try {
      const updatedKb = await onAddSource(currentKb.id, 'text', { fileName, content });
      setCurrentKb(updatedKb);
    } catch (error) {
      console.error('Failed to add text source:', error);
    }
  };

  const handleDeleteSource = async () => {
    if (!currentKb || !sourceToDelete) return;

    try {
      const updatedKb = await onDeleteSource(currentKb.id, sourceToDelete.id);
      setCurrentKb(updatedKb);
      setDeleteSourceDialogOpen(false);
      setSourceToDelete(null);
    } catch (error) {
      console.error('Failed to delete source:', error);
    }
  };

  const handleAutoSyncChange = (checked: boolean) => {
    if (!currentKb) return;
    
    const updatedKb = {...currentKb, auto_sync: checked};
    setCurrentKb(updatedKb);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onOpenChange={(open) => {
          onOpenChange(open);
          if (!open) handleReset();
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
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Knowledge Base Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!isCreating && currentKb && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Sources</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-1 h-3 w-3" /> Add
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddSourceClick('url')}>
                          <Globe className="mr-2 h-4 w-4" />
                          Add Web Pages
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddSourceClick('file')}>
                          <File className="mr-2 h-4 w-4" />
                          Upload Files
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddSourceClick('text')}>
                          <FileText className="mr-2 h-4 w-4" />
                          Add Text
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="border rounded-md divide-y">
                    {currentKb.sources.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No sources added yet. Click "Add" to add your first source.
                      </div>
                    ) : (
                      currentKb.sources.map((source) => (
                        <div key={source.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            {source.type === 'url' && (
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm">{source.title}</span>
                                {source.auto_sync && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="ml-2">
                                          <RefreshCcw className="h-3 w-3 text-blue-500" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Auto-sync enabled</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            )}
                            {source.type === 'file' && <div className="flex items-center">
                              <File className="h-4 w-4 mr-2 text-amber-500" />
                              <span className="text-sm">{source.title}</span>
                            </div>}
                            {source.type === 'text' && <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-green-500" />
                              <span className="text-sm">{source.title}</span>
                            </div>}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSourceToDelete(source);
                              setDeleteSourceDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {currentKb.sources.some(source => source.type === 'url') && (
                    <div className="flex items-center space-x-2 mt-4">
                      <Switch
                        id="kb-auto-sync"
                        checked={currentKb.auto_sync || false}
                        onCheckedChange={handleAutoSyncChange}
                      />
                      <Label htmlFor="kb-auto-sync" className="text-sm cursor-pointer">
                        Auto sync web pages every 24 hours
                      </Label>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    handleReset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={!form.formState.isDirty && isCreating}
                >
                  {isCreating ? 'Create' : 'Update'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Source Modals */}
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

      {/* Delete Source Dialog */}
      <SourceDeleteDialog
        open={deleteSourceDialogOpen}
        onOpenChange={setDeleteSourceDialogOpen}
        source={sourceToDelete}
        onConfirm={handleDeleteSource}
      />
    </>
  );
};

export default KnowledgeBaseDialog;
