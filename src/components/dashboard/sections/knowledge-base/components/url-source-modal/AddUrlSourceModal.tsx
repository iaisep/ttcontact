
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useUrlSourceModal } from './hooks/useUrlSourceModal';
import { useSourceOperations } from '../../hooks/useSourceOperations';
import UrlInputView from './UrlInputView';
import SitemapSelectionView from './SitemapSelectionView';
import { KnowledgeBase, WebPage } from '../../types';

interface AddUrlSourceModalProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  onAddSource: (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => Promise<KnowledgeBase>;
  onFetchSitemap: (url: string) => Promise<WebPage[]>;
  currentKnowledgeBase?: KnowledgeBase | null;
  knowledgeBaseName?: string;
}

const AddUrlSourceModal: React.FC<AddUrlSourceModalProps> = ({
  open,
  onClose,
  onOpenChange,
  onAddSource,
  onFetchSitemap,
  currentKnowledgeBase,
  knowledgeBaseName
}) => {
  // Use our custom hook for source operations
  const { handleUrlSourceSubmit } = useSourceOperations({
    onAddSource,
  });

  // Use the URL source modal hook for state management and operations
  const {
    url,
    setUrl,
    autoSync,
    setAutoSync,
    isLoading,
    view,
    webPages,
    selectedPageUrls,
    error,
    handleUrlSubmit,
    handleSelectionToggle,
    handleToggleAll,
    handleConfirmSelection,
    resetState
  } = useUrlSourceModal({
    onFetchSitemap,
    onSubmit: async (url, autoSync, selectedPages) => {
      try {
        // Pass the knowledge base name explicitly
        const result = await handleUrlSourceSubmit(
          url, 
          autoSync, 
          selectedPages, 
          currentKnowledgeBase,
          knowledgeBaseName
        );
        // Close the modal immediately after successful submission
        onClose();
        resetState();
        return result;
      } catch (error) {
        console.error('Error submitting URL source:', error);
        throw error;
      }
    },
    currentKnowledgeBase,
    knowledgeBaseName
  });

  // Clean up state when modal is closed
  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  // Handle dialog open state changes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Add URL Source</span>
            <X 
              className="h-4 w-4 cursor-pointer" 
              onClick={onClose} 
            />
          </DialogTitle>
        </DialogHeader>

        {view === 'url-input' ? (
          <UrlInputView 
            url={url} 
            setUrl={setUrl} 
            error={error} 
            isLoading={isLoading} 
            onSubmit={handleUrlSubmit} 
            onCancel={onClose}
            knowledgeBaseName={knowledgeBaseName}
          />
        ) : (
          <SitemapSelectionView 
            url={url}
            autoSync={autoSync}
            setAutoSync={setAutoSync}
            webPages={webPages}
            selectedPageUrls={selectedPageUrls}
            onSelectionToggle={handleSelectionToggle}
            onToggleAll={handleToggleAll}
            onConfirm={handleConfirmSelection}
            onBack={() => resetState()}
            isLoading={isLoading}
            currentKnowledgeBase={currentKnowledgeBase}
            knowledgeBaseName={knowledgeBaseName}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlSourceModal;
