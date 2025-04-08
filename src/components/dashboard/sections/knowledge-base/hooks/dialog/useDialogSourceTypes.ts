
import { KnowledgeBase } from '../../types';

export const useDialogSourceTypes = () => {
  const handleAutoSyncChange = (
    checked: boolean, 
    currentKb: KnowledgeBase | null,
    setCurrentKb: (kb: KnowledgeBase | null) => void
  ) => {
    if (!currentKb) return;
    
    const updatedKb = {...currentKb, auto_sync: checked};
    setCurrentKb(updatedKb);
    return updatedKb;
  };

  return {
    handleAutoSyncChange
  };
};
