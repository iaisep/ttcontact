
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WebPage } from '../../types';
import { useUrlSourceModal } from './hooks/useUrlSourceModal';
import UrlSourceInputView from './UrlSourceInputView';
import SitemapSelectionView from './SitemapSelectionView';

interface AddUrlSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string, autoSync: boolean, selectedPages: WebPage[]) => Promise<void>;
  onFetchSitemap: (url: string) => Promise<WebPage[]>;
}

const AddUrlSourceModal: React.FC<AddUrlSourceModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  onFetchSitemap
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
    handleUrlSubmit,
    handleSelectionToggle,
    handleToggleAll,
    handleConfirmSelection,
    resetState
  } = useUrlSourceModal({
    onFetchSitemap,
    onSubmit
  });

  return (
    <Dialog 
      open={open} 
      onOpenChange={(value) => {
        if (!value && !isLoading) {
          onOpenChange(value);
          setTimeout(() => resetState(), 100);
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Web Pages</DialogTitle>
          <DialogDescription>
            Import content from web pages to enhance your knowledge base.
          </DialogDescription>
        </DialogHeader>
        
        {view === 'url-input' ? (
          <UrlSourceInputView 
            url={url}
            setUrl={setUrl}
            isLoading={isLoading}
            onSubmit={handleUrlSubmit}
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
          />
        )}
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              if (view === 'sitemap-selection') {
                resetState();
              } else {
                onOpenChange(false);
              }
            }}
            disabled={isLoading}
          >
            {view === 'sitemap-selection' ? 'Back' : 'Cancel'}
          </Button>
          {view === 'sitemap-selection' && (
            <Button
              type="button"
              onClick={handleConfirmSelection}
              disabled={isLoading || selectedPageUrls.length === 0}
            >
              {isLoading ? 'Adding...' : 'Add Selected'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlSourceModal;
