
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUrlSourceModal } from './hooks/useUrlSourceModal';
import UrlSourceInputView from './UrlSourceInputView';
import SitemapSelectionView from './SitemapSelectionView';
import { WebPage, KnowledgeBase } from '../../types';

interface AddUrlSourceModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (urls: string[], autoSync: boolean, knowledgeBaseName?: string) => Promise<any>;
  knowledgeBaseName?: string;
  currentKnowledgeBase?: KnowledgeBase | null;
}

const AddUrlSourceModal: React.FC<AddUrlSourceModalProps> = ({
  open,
  onCancel,
  onSave,
  knowledgeBaseName,
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
    onFetchSitemap: async (url: string) => {
      // Mock implementation for sitemap fetching
      console.log('Fetching sitemap for URL:', url);
      // Return a simple array with the URL as a page
      return [
        { url, title: url, selected: true }
      ];
    },
    onSubmit: async (url: string, autoSync: boolean, selectedPages: WebPage[], knowledgeBaseName?: string) => {
      // Extract URLs from selected pages
      const urls = selectedPages.map(page => page.url);
      return onSave(urls, autoSync, knowledgeBaseName);
    },
    currentKnowledgeBase,
    knowledgeBaseName
  });

  // Reset the state when the modal closes
  React.useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add URL Source</DialogTitle>
          <DialogDescription>
            Add a website URL to include in your knowledge base
          </DialogDescription>
        </DialogHeader>

        {view === 'url-input' && (
          <UrlSourceInputView 
            url={url}
            setUrl={setUrl}
            autoSync={autoSync}
            setAutoSync={setAutoSync}
            knowledgeBaseName={knowledgeBaseName}
            isNewKnowledgeBase={currentKnowledgeBase?.id?.startsWith('temp_') || false}
            onFetchSitemap={handleUrlSubmit}
            onAddUrl={handleConfirmSelection}
            onCancel={onCancel}
            isLoading={isLoading}
            error={error}
          />
        )}

        {view === 'sitemap-selection' && (
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
