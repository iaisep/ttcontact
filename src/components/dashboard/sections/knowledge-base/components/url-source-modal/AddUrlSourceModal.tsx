
import React, { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { useUrlSourceModal } from './hooks/useUrlSourceModal';
import UrlInputView from './UrlInputView';
import SitemapSelectionView from './SitemapSelectionView';
import { KnowledgeBase } from '../../types';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface AddUrlSourceModalProps {
  isOpen: boolean;
  onCancel: () => void;
  knowledgeBaseName?: string;
  onSave: (urls: string[], autoSync: boolean, knowledgeBaseName: string) => Promise<void>;
}

const AddUrlSourceModal: React.FC<AddUrlSourceModalProps> = ({
  onCancel,
  knowledgeBaseName = '',
  onSave,
  isOpen
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
      // This will be implemented by the parent component
      return [];
    },
    onSubmit: async (url: string, autoSync: boolean, selectedPages: any, knowledgeBaseName?: string) => {
      // Implement the submission logic
      return {} as KnowledgeBase;
    }
  });

  // Create a custom handler to adapt to the expected prop interface
  const handleSave = async () => {
    // Get the URLs from selected pages
    const urls = webPages
      .filter(page => selectedPageUrls.includes(page.url))
      .map(page => page.url);
    
    await onSave(urls, autoSync, knowledgeBaseName || '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onCancel();
      }
    }}>
      <DialogContent className="max-w-2xl w-full">
        <div className="p-6 border-b">
          <div className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-500" />
            <h2 className="text-lg font-medium">Add Web Pages</h2>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
              <p>Processing your request...</p>
            </div>
          </div>
        ) : (
          <>
            {view === 'url-input' ? (
              <UrlInputView 
                url={url}
                setUrl={setUrl}
                isLoading={isLoading}
                error={error}
                onSubmit={handleUrlSubmit}
                onCancel={onCancel}
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
                currentKnowledgeBase={null}
                knowledgeBaseName={knowledgeBaseName}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlSourceModal;
