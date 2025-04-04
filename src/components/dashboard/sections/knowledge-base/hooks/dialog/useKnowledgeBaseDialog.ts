
import { toast } from 'sonner';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';
import { useDialogState } from './useDialogState';
import { useDialogSourceTypes } from './useDialogSourceTypes';
import { useSourceOperations } from './useSourceOperations';

interface UseKnowledgeBaseDialogProps {
  knowledgeBase: KnowledgeBase | null;
  isCreating: boolean;
  onAddSource: (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => Promise<KnowledgeBase>;
  onDeleteSource: (kbId: string, sourceId: string) => Promise<KnowledgeBase>;
}

export const useKnowledgeBaseDialog = ({
  knowledgeBase,
  isCreating,
  onAddSource,
  onDeleteSource
}: UseKnowledgeBaseDialogProps) => {
  // Import the state management hook
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
    setCurrentKb,
    setCreationComplete,
    setAddingSource,
    resetSourceModals
  } = useDialogState(knowledgeBase, isCreating);

  // Import source type management hook
  const { handleAddSourceClick, handleAutoSyncChange } = useDialogSourceTypes();

  // Import source operations hook
  const { 
    handleAddUrlSource: sourceAddUrlSource,
    handleAddFileSource: sourceAddFileSource,
    handleAddTextSource: sourceAddTextSource,
    handleDeleteSource: sourceDeleteSource
  } = useSourceOperations({
    onAddSource,
    onDeleteSource,
    setAddingSource,
    setCurrentSourceType
  });

  // Handler adapters to maintain the original interface
  const handleAddSourceClick = (type: 'url' | 'file' | 'text') => {
    setCurrentSourceType(type);
  };

  const handleAddUrlSource = (url: string, autoSync: boolean, selectedPages: WebPage[]) => {
    return sourceAddUrlSource(url, autoSync, selectedPages, currentKb);
  };

  const handleAddFileSource = (file: File) => {
    return sourceAddFileSource(file, currentKb);
  };

  const handleAddTextSource = (fileName: string, content: string) => {
    return sourceAddTextSource(fileName, content, currentKb);
  };

  const handleDeleteSource = async () => {
    return sourceDeleteSource(currentKb, sourceToDelete, setDeleteSourceDialogOpen, setSourceToDelete);
  };

  const handleAutoSyncChangeWrapper = (checked: boolean) => {
    const updatedKb = handleAutoSyncChange(checked, currentKb, setCurrentKb);
    if (updatedKb) {
      setCurrentKb(updatedKb);
    }
  };

  const handleKnowledgeBaseSave = async (data: { name: string }, onSave: (data: { name: string }) => Promise<void>): Promise<boolean> => {
    try {
      console.log("Saving knowledge base with data:", data);
      
      // Call the API with the provided data
      await onSave(data);
      
      if (isCreating) {
        setCreationComplete(true);
        toast.success('Knowledge base created successfully');
      } else {
        toast.success('Knowledge base updated successfully');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving knowledge base:', error);
      toast.error('Failed to save knowledge base');
      return false;
    }
  };

  return {
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
    handleAutoSyncChange: handleAutoSyncChangeWrapper,
    handleKnowledgeBaseSave
  };
};
