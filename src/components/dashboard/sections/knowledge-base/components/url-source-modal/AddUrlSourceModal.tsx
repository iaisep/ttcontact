
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
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
    sourceUrl,
    setSourceUrl,
    autoSync,
    setAutoSync,
    webPages,
    sitemapDialogOpen,
    setSitemapDialogOpen,
    loading,
    handleReset,
    handleFetchSitemap,
    handleSubmit,
    toggleWebPageSelection,
    selectAllPages,
    deselectAllPages
  } = useUrlSourceModal(onSubmit, onFetchSitemap);

  const closeDialog = () => {
    handleReset();
    onOpenChange(false);
  };

  const submitAndClose = async () => {
    console.log("Submitting URL source:", {
      sourceUrl,
      autoSync,
      webPagesCount: webPages.length,
      selectedCount: webPages.filter(p => p.selected).length
    });
    
    const success = await handleSubmit();
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) handleReset();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        {!sitemapDialogOpen ? (
          <>
            <DialogHeader>
              <DialogTitle>Add Web Pages</DialogTitle>
              <DialogDescription>
                Enter a website URL to extract content from its sitemap.
              </DialogDescription>
            </DialogHeader>
            
            <UrlSourceInputView
              sourceUrl={sourceUrl}
              autoSync={autoSync}
              loading={loading}
              onSourceUrlChange={setSourceUrl}
              onAutoSyncChange={setAutoSync}
              onFetchSitemap={handleFetchSitemap}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={submitAndClose}
                disabled={!sourceUrl}
              >
                Add
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Select Web Pages</DialogTitle>
              <DialogDescription>
                Select which pages from {sourceUrl} you want to include in your knowledge base.
              </DialogDescription>
            </DialogHeader>
            
            <SitemapSelectionView
              webPages={webPages}
              sourceUrl={sourceUrl}
              autoSync={autoSync}
              onAutoSyncChange={setAutoSync}
              onTogglePageSelection={toggleWebPageSelection}
              onSelectAll={selectAllPages}
              onDeselectAll={deselectAllPages}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setSitemapDialogOpen(false)}
              >
                Back
              </Button>
              <Button 
                type="button"
                onClick={submitAndClose}
                disabled={webPages.filter(p => p.selected).length === 0}
              >
                Add Selected Pages
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlSourceModal;
