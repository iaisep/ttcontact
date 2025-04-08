
import React from 'react';
import AddUrlSourceModal from '../url-source-modal';
import AddFileSourceModal from '../AddFileSourceModal';
import AddTextSourceModal from '../AddTextSourceModal';
import SourceDeleteDialog from '../SourceDeleteDialog';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';

interface KnowledgeBaseSourceModalsProps {
  currentSourceType: 'url' | 'file' | 'text' | null;
  setCurrentSourceType: (type: 'url' | 'file' | 'text' | null) => void;
  sourceToDelete: KnowledgeBaseSource | null;
  deleteSourceDialogOpen: boolean;
  setDeleteSourceDialogOpen: (open: boolean) => void;
  onAddUrlSource: (url: string, autoSync: boolean, selectedPages: WebPage[]) => Promise<KnowledgeBase>;
  onAddFileSource: (file: File) => Promise<KnowledgeBase>;
  onAddTextSource: (fileName: string, content: string) => Promise<KnowledgeBase>;
  onDeleteSource: () => Promise<KnowledgeBase>;
  onFetchSitemap: (url: string) => Promise<any[]>;
  currentKnowledgeBase: KnowledgeBase | null;
  knowledgeBaseName?: string;
  onSourceAdded?: () => void;
  onCloseMainDialog?: () => void;
}

const KnowledgeBaseSourceModals: React.FC<KnowledgeBaseSourceModalsProps> = ({
  currentSourceType,
  setCurrentSourceType,
  sourceToDelete,
  deleteSourceDialogOpen,
  setDeleteSourceDialogOpen,
  onAddUrlSource,
  onAddFileSource,
  onAddTextSource,
  onDeleteSource,
  onFetchSitemap,
  currentKnowledgeBase,
  knowledgeBaseName,
  onSourceAdded,
  onCloseMainDialog
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleCloseSourceModal = () => {
    setCurrentSourceType(null);
  };

  const handleSourceAdded = () => {
    // Call the optional callback to handle source addition
    if (onSourceAdded) {
      onSourceAdded();
    }

    // If we're adding to a new knowledge base, close the main dialog as well
    // This handles the case where we're creating a new KB and adding sources in one go
    if (currentKnowledgeBase?.id?.startsWith('temp_') && onCloseMainDialog) {
      onCloseMainDialog();
    }
  };

  // Create a temporary knowledge base if we don't have one but have a name
  const effectiveKnowledgeBase = currentKnowledgeBase || 
    (knowledgeBaseName ? {
      id: `temp_${Date.now()}`,
      name: knowledgeBaseName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source_count: 0,
      sources: [],
      auto_sync: false
    } : null);

  return (
    <>
      {/* URL Source Modal */}
      <AddUrlSourceModal
        open={currentSourceType === 'url'}
        onClose={() => {
          handleCloseSourceModal();
          handleSourceAdded();
        }}
        onAddSource={(kbId, sourceType, sourceData) => {
          // Make sure knowledgeBaseName is passed through in sourceData
          return onAddUrlSource(
            sourceData.url,
            sourceData.autoSync,
            sourceData.webPages || []
          );
        }}
        onFetchSitemap={onFetchSitemap}
        currentKnowledgeBase={effectiveKnowledgeBase}
        knowledgeBaseName={knowledgeBaseName}
      />

      {/* File Source Modal */}
      <AddFileSourceModal
        open={currentSourceType === 'file'}
        onOpenChange={handleCloseSourceModal}
        onClose={() => {
          handleCloseSourceModal();
          handleSourceAdded();
        }}
        onSubmit={(file) => {
          return onAddFileSource(file);
        }}
        currentKnowledgeBase={effectiveKnowledgeBase}
        knowledgeBaseName={knowledgeBaseName}
      />

      {/* Text Source Modal */}
      <AddTextSourceModal
        open={currentSourceType === 'text'}
        onOpenChange={handleCloseSourceModal}
        onClose={() => {
          handleCloseSourceModal();
          handleSourceAdded();
        }}
        onSubmit={(fileName, content) => {
          return onAddTextSource(fileName, content);
        }}
        currentKnowledgeBase={effectiveKnowledgeBase}
        knowledgeBaseName={knowledgeBaseName}
      />

      {/* Source Delete Dialog */}
      <SourceDeleteDialog
        open={deleteSourceDialogOpen}
        onOpenChange={(open) => {
          // Only allow closing if we're not in the middle of an operation
          if (!isProcessing) {
            setDeleteSourceDialogOpen(open);
          }
        }}
        source={sourceToDelete}
        onConfirm={async () => {
          try {
            setIsProcessing(true);
            
            // Set a timeout for the operation to prevent UI freeze
            const deletePromise = onDeleteSource();
            const timeoutPromise = new Promise<KnowledgeBase>((_, reject) => {
              setTimeout(() => reject(new Error("Delete operation timed out")), 10000);
            });
            
            // Race the promises to ensure we don't freeze
            const result = await Promise.race([deletePromise, timeoutPromise])
              .catch(error => {
                console.error('Error in source deletion:', error);
                // Return a minimal valid KnowledgeBase object as fallback
                return {
                  id: currentKnowledgeBase?.id || '',
                  name: currentKnowledgeBase?.name || '',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  source_count: 0,
                  sources: [],
                  auto_sync: false
                } as KnowledgeBase;
              });
            
            // Notify that source was removed
            handleSourceAdded();
            
            return result;
          } finally {
            // Always ensure we clean up regardless of success/failure
            setIsProcessing(false);
            
            // Close the delete dialog with a short delay
            setTimeout(() => {
              setDeleteSourceDialogOpen(false);
            }, 100);
          }
        }}
      />
    </>
  );
};

export default KnowledgeBaseSourceModals;
