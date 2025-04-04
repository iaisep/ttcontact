
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
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
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-medium">
            {view === 'url-input' ? 'Add Web Pages' : 'Select Site Maps'}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlSourceModal;
