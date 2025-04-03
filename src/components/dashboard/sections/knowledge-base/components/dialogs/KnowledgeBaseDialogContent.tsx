
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { KnowledgeBase, KnowledgeBaseSource } from '../../types';
import KnowledgeBaseFormContent from './KnowledgeBaseFormContent';
import SourcesSection from './SourcesSection';

interface KnowledgeBaseDialogContentProps {
  knowledgeBase: KnowledgeBase | null;
  isCreating: boolean;
  isSaving: boolean;
  addingSource: boolean;
  creationComplete: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string }) => Promise<void>;
  onAddSourceClick: (type: 'url' | 'file' | 'text') => void;
  onDeleteSourceClick: (source: KnowledgeBaseSource) => void;
  onAutoSyncChange: (checked: boolean) => void;
  onKnowledgeBaseSave: (data: { name: string }) => Promise<boolean>;
}

const KnowledgeBaseDialogContent: React.FC<KnowledgeBaseDialogContentProps> = ({
  knowledgeBase,
  isCreating,
  isSaving,
  addingSource,
  creationComplete,
  onOpenChange,
  onSave,
  onAddSourceClick,
  onDeleteSourceClick,
  onAutoSyncChange,
  onKnowledgeBaseSave
}) => {
  const handleSave = async (data: { name: string }) => {
    await onKnowledgeBaseSave(data);
  };

  return (
    <>
      <KnowledgeBaseFormContent 
        knowledgeBase={knowledgeBase} 
        onOpenChange={onOpenChange} 
        isSaving={isSaving} 
        onSave={onSave}
      />
      
      {(!isCreating || creationComplete) && knowledgeBase && (
        <SourcesSection 
          knowledgeBase={knowledgeBase}
          onAddSourceClick={onAddSourceClick}
          onDeleteSourceClick={onDeleteSourceClick}
          onAutoSyncChange={onAutoSyncChange}
        />
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
          {isSaving ? "Saving..." : (isCreating && !creationComplete ? 'Create' : 'Update')}
        </Button>
      </DialogFooter>
    </>
  );
};

export default KnowledgeBaseDialogContent;
