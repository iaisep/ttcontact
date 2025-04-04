
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import SourcesSection from './SourcesSection';
import KnowledgeBaseSourceModals from './KnowledgeBaseSourceModals';

interface KnowledgeBaseFormContentProps {
  isCreating: boolean;
  currentKb: KnowledgeBase | null;
  creationComplete: boolean;
  isSaving: boolean;
  onSave: (data: { name: string }) => Promise<boolean>;
  onAddSourceClick: (type: 'url' | 'file' | 'text') => void;
  onDeleteSourceClick: (source: KnowledgeBaseSource) => void;
  onAutoSyncChange: (checked: boolean) => void;
  currentSourceType: 'url' | 'file' | 'text' | null;
  sourceToDelete: KnowledgeBaseSource | null;
  deleteSourceDialogOpen: boolean;
  setCurrentSourceType: (type: 'url' | 'file' | 'text' | null) => void;
  setSourceToDelete: (source: KnowledgeBaseSource | null) => void;
  setDeleteSourceDialogOpen: (open: boolean) => void;
  onAddUrlSource: (url: string, autoSync: boolean, selectedPages: WebPage[]) => Promise<KnowledgeBase>;
  onAddFileSource: (file: File) => Promise<KnowledgeBase>;
  onAddTextSource: (fileName: string, content: string) => Promise<KnowledgeBase>;
  onDeleteSource: () => Promise<KnowledgeBase>;
  onFetchSitemap: (url: string) => Promise<WebPage[]>;
  onSourceAddSuccess?: () => void;
}

const KnowledgeBaseFormContent: React.FC<KnowledgeBaseFormContentProps> = ({
  isCreating,
  currentKb,
  creationComplete,
  isSaving,
  onSave,
  onAddSourceClick,
  onDeleteSourceClick,
  onAutoSyncChange,
  currentSourceType,
  sourceToDelete,
  deleteSourceDialogOpen,
  setCurrentSourceType,
  setSourceToDelete,
  setDeleteSourceDialogOpen,
  onAddUrlSource,
  onAddFileSource,
  onAddTextSource,
  onDeleteSource,
  onFetchSitemap,
  onSourceAddSuccess
}) => {
  // Set up form handling
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string }>({
    defaultValues: {
      name: currentKb?.name || ''
    }
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold flex items-center justify-between">
          <span>{isCreating ? 'Add Knowledge Base' : 'Edit Knowledge Base'}</span>
          <X className="h-4 w-4 cursor-pointer" onClick={() => setCurrentSourceType(null)} />
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(onSave)} className="space-y-6 py-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="knowledgeBaseName" className="text-base font-medium">
              Knowledge Base Name
            </Label>
            <Input 
              id="knowledgeBaseName"
              placeholder="Customer FAQs"
              className="mt-2"
              disabled={creationComplete || isSaving}
              {...register("name", {
                required: "Knowledge base name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters"
                },
                maxLength: {
                  value: 100,
                  message: "Name cannot exceed 100 characters"
                }
              })}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          
          {/* Sources section */}
          <SourcesSection 
            knowledgeBase={currentKb}
            isCreating={isCreating}
            creationComplete={creationComplete}
            onAddSourceClick={onAddSourceClick}
            onDeleteSourceClick={onDeleteSourceClick}
            onAutoSyncChange={onAutoSyncChange}
            isSaving={isSaving}
          />
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentSourceType(null)}
            disabled={isSaving}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving || (isCreating && creationComplete)}
            className="bg-black text-white hover:bg-black/80"
          >
            {isSaving ? (
              <div className="flex items-center">
                <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Saving...
              </div>
            ) : 'Save'}
          </Button>
        </DialogFooter>
      </form>

      {/* Source modals */}
      <KnowledgeBaseSourceModals 
        currentSourceType={currentSourceType}
        setCurrentSourceType={setCurrentSourceType}
        sourceToDelete={sourceToDelete}
        deleteSourceDialogOpen={deleteSourceDialogOpen}
        setDeleteSourceDialogOpen={setDeleteSourceDialogOpen}
        onAddUrlSource={onAddUrlSource}
        onAddFileSource={onAddFileSource}
        onAddTextSource={onAddTextSource}
        onDeleteSource={onDeleteSource}
        onFetchSitemap={onFetchSitemap}
        currentKnowledgeBase={currentKb}
        knowledgeBaseName={currentKb?.name}
        onSourceAddSuccess={onSourceAddSuccess}
      />
    </>
  );
};

export default KnowledgeBaseFormContent;
