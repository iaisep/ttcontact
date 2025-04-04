
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { WebPage, KnowledgeBase } from '../../types';
import { useUrlSourceModal } from './hooks/useUrlSourceModal';
import UrlSourceInputView from './UrlSourceInputView';
import SitemapSelectionView from './SitemapSelectionView';

interface AddUrlSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string, autoSync: boolean, selectedPages: WebPage[]) => Promise<KnowledgeBase>;
  onFetchSitemap: (url: string) => Promise<WebPage[]>;
  currentKnowledgeBase?: KnowledgeBase | null;
}

const AddUrlSourceModal: React.FC<AddUrlSourceModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  onFetchSitemap,
  currentKnowledgeBase
}) => {
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
    onSubmit,
    currentKnowledgeBase
  });

  const handleCloseModal = () => {
    if (!isLoading) {
      onOpenChange(false);
      setTimeout(() => resetState(), 300);
    }
  };

  // Debug logging for component state
  console.log('AddUrlSourceModal - current URL:', url);
  console.log('AddUrlSourceModal - view state:', view);
  console.log('AddUrlSourceModal - selected pages count:', selectedPageUrls.length);
  console.log('AddUrlSourceModal - knowledge base:', currentKnowledgeBase?.id);

  return (
    <Dialog 
      open={open} 
      onOpenChange={(value) => {
        if (!value && !isLoading) {
          handleCloseModal();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-medium">
            {view === 'url-input' ? 'Add Web Pages' : 'Select Site Pages'}
          </DialogTitle>
          <button
            onClick={handleCloseModal}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="p-6">
          {view === 'url-input' ? (
            <UrlSourceInputView 
              url={url}
              setUrl={setUrl}
              isLoading={isLoading}
              error={error}
              onSubmit={handleUrlSubmit}
              onCancel={handleCloseModal}
            />
          ) : (
            <SitemapSelectionView 
              webPages={webPages}
              selectedPageUrls={selectedPageUrls}
              onSelectionToggle={handleSelectionToggle}
              onToggleAll={handleToggleAll}
              isLoading={isLoading}
              autoSync={autoSync}
              setAutoSync={setAutoSync}
              onCancel={handleCloseModal}
              onConfirm={handleConfirmSelection}
              currentKnowledgeBase={currentKnowledgeBase}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlSourceModal;
